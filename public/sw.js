const CACHE = 'kbm-shell-__KBM_BUILD_ID__';
const SHELL = ['/demo', '/privacy', '/terms', '/upgrade', '/manifest.webmanifest', '/favicon.svg', '/assets/boundary-diorama.avif', '/assets/boundary-diorama.webp'];

async function cacheShell() {
  const cache = await caches.open(CACHE);
  const home = await fetch('/', { cache: 'reload' });
  if (!home.ok) throw new Error('Could not cache the application shell.');
  const markup = await home.clone().text();
  const buildAssets = [...markup.matchAll(/(?:href|src)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);
  await cache.put('/', home);
  await cache.addAll([...SHELL, ...buildAssets]);
}

self.addEventListener('install', (event) => {
  event.waitUntil(cacheShell().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then((response) => {
      if (response.ok) caches.open(CACHE).then((cache) => cache.put('/', response.clone()));
      return response;
    }).catch(() => caches.match(event.request, { ignoreVary: true }).then((cached) => cached || caches.match('/'))));
    return;
  }
  event.respondWith(caches.match(event.request, { ignoreVary: true }).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok) caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
    return response;
  })));
});
