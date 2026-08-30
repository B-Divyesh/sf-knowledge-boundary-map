import { createServer, type ServerResponse } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { expect, test } from '@playwright/test';

const oldWorker = `
const CACHE = 'kbm-shell-v4';
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(['/', '/old.js'])).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  if (event.request.method === 'GET' && new URL(event.request.url).origin === self.location.origin) {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).catch(() => caches.match('/'))));
  }
});`;

const oldIndex = '<!doctype html><html lang="en"><head><title>Old shell</title></head><body><main><h1>Old shell</h1></main><script src="/old.js"></script></body></html>';

function send(response: ServerResponse, status: number, body: string | Buffer, contentType: string) {
  response.writeHead(status, { 'Content-Type': contentType, 'Cache-Control': 'no-store', 'Service-Worker-Allowed': '/' });
  response.end(body);
}

test('a controlled pre-repair client updates to this build and keeps it offline', async ({ browser }) => {
  let current = false;
  const distRoot = join(process.cwd(), 'dist');
  const server = createServer(async (request, response) => {
    try {
      const path = new URL(request.url!, 'http://127.0.0.1').pathname;
      if (!current) {
        if (path === '/sw.js') return send(response, 200, oldWorker, 'text/javascript');
        if (path === '/old.js') return send(response, 200, "document.documentElement.dataset.shell='old'", 'text/javascript');
        return send(response, 200, oldIndex, 'text/html');
      }
      const requested = path === '/' || ['/demo', '/privacy', '/terms'].includes(path) ? 'index.html' : normalize(path).replace(/^[/\\]+/, '');
      if (requested.startsWith('..')) return send(response, 404, 'Not found', 'text/plain');
      const body = await readFile(join(distRoot, requested));
      const contentType = ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.avif': 'image/avif', '.webp': 'image/webp' } as Record<string, string>)[extname(requested)] ?? 'application/octet-stream';
      send(response, 200, body, contentType);
    } catch {
      send(response, 404, 'Not found', 'text/plain');
    }
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Test server did not start.');
  const origin = `http://127.0.0.1:${address.port}`;
  const context = await browser.newContext({ serviceWorkers: 'allow' });
  const page = await context.newPage();

  try {
    await page.goto(origin);
    await page.evaluate(async () => {
      await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
    });
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Old shell' })).toBeVisible();

    current = true;
    await page.evaluate(async () => {
      const changed = new Promise<void>((resolve) => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
      await changed;
    });
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Test what you can explain.' })).toBeVisible();
    const cachesAfterUpdate = await page.evaluate(() => caches.keys());
    expect(cachesAfterUpdate).not.toContain('kbm-shell-v4');
    expect(cachesAfterUpdate.some((name) => /^kbm-shell-[a-f0-9]{12}$/.test(name))).toBe(true);

    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Test what you can explain.' })).toBeVisible();
    await expect(page.getByText('You’re offline. Your map still works and stays on this device.')).toBeVisible();
  } finally {
    await context.close();
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
