import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('loads without console or page errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await page.getByRole('button', { name: /Random assignment/ }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('button', { name: /^Not rehearsed A confounder/ })).toBeFocused();
  expect(errors).toEqual([]);
});

test('skip link moves keyboard focus to the main task', async ({ page }) => {
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to your map' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('starts the complete free experience when local storage is denied', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() { throw new DOMException('Access is denied', 'SecurityError'); },
    });
  });
  await page.reload();

  await expect(page.getByRole('heading', { level: 1, name: 'Check what you can explain.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pin your first claim' })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('Local storage is unavailable');
  expect(errors).toEqual([]);
});

test('creates, rehearses, and persists a claim', async ({ page }) => {
  await page.getByRole('button', { name: 'Pin your first claim' }).click();
  await page.getByLabel('Claim *').fill('Mass is conserved in a closed chemical reaction');
  await page.getByRole('button', { name: 'Pin this claim' }).click();
  await page.getByRole('button', { name: /Mass is conserved/ }).click();
  await page.getByLabel('Teach it back from memory *').fill('Atoms are rearranged rather than created or destroyed.');
  await page.getByLabel('Counterexample or boundary').fill('An open system can exchange matter with its environment.');
  await page.getByLabel('Can explain').check();
  await page.getByLabel('Next probe *').fill('Balance an unfamiliar combustion equation.');
  await page.getByRole('button', { name: 'Save self-assessment' }).click();
  await expect(page.getByText('Can explain', { exact: true }).first()).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  await page.reload();
  await expect(page.getByRole('button', { name: /Mass is conserved/ })).toBeVisible();
});

test('@claim:demo-sandbox loads sample data in a separate namespace and discards it when starting for real', async ({ page }) => {
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByLabel('Demo controls')).toContainText('sample data, nothing is saved to your real map');
  await expect(page.getByRole('button', { name: /^Not rehearsed A correlation does not by itself show causation/ })).toBeVisible();
  const sandbox = await page.evaluate(() => ({ real: localStorage.getItem('kbm:map:v1'), demo: localStorage.getItem('demo:kbm:map:v1') }));
  expect(sandbox.real).toBeNull();
  expect(JSON.parse(sandbox.demo!).claims).toHaveLength(3);

  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Check what you can explain.' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('demo:kbm:map:v1'))).toBeNull();
});

test('@claim:local-only keeps normal learning activity on the current origin', async ({ page }) => {
  const origins = new Set<string>();
  page.on('request', (request) => origins.add(new URL(request.url()).origin));

  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await page.getByRole('button', { name: /^Not rehearsed A correlation does not by itself show causation/ }).click();
  await page.getByLabel('Teach it back from memory *').fill('Correlation can reflect a third variable or a shared trend.');
  await page.getByLabel('Recognize only').check();
  await page.getByLabel('Next probe *').fill('Draw a causal graph with a confounder.');
  await page.getByRole('button', { name: 'Save self-assessment' }).click();

  expect([...origins]).toEqual([]);
});

test('@claim:csv-export downloads all sample claims as a CSV file', async ({ page }) => {
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await page.getByRole('button', { name: 'Export' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download CSV' }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).not.toBeNull();
  const csv = await readFile(path!, 'utf8');
  expect(csv.split('\n')[0]).toBe('"Claim","Status","Prerequisites","Teach-back","Counterexample","Next probe","Last rehearsed"');
  expect(csv.trim().split('\n')).toHaveLength(4);
  expect(csv).toContain('A correlation does not by itself show causation');
  expect(csv).toContain('A confounder can affect both measured variables');
  expect(csv).toContain('Random assignment reduces systematic confounding');
});

test('supports legal and upgrade routes in both themes without serious accessibility violations', async ({ page }) => {
  for (const [path, heading] of [['/privacy', 'Privacy'], ['/terms', 'Terms'], ['/upgrade', 'Keep a larger workshop.']] as const) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  }

  await page.getByRole('button', { name: 'Use dark theme' }).click();
  expect(await page.locator('html').getAttribute('data-theme')).toBe('dark');
  const darkResults = await new AxeBuilder({ page }).analyze();
  expect(darkResults.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  await expect(page.getByRole('link', { name: 'Buy lifetime studio' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/knowledge-boundary-map/checkout');
});

test('light and dark keyboard focus indicators exceed 3 to 1 adjacent contrast', async ({ page }) => {
  const contrast = (foreground: string, background: string) => {
    const channels = (color: string) => (color.startsWith('#')
      ? color.slice(1).match(/.{2}/g)!.map((value) => Number.parseInt(value, 16))
      : color.match(/[\d.]+/g)!.slice(0, 3).map(Number)).map((value) => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    const luminance = (color: string) => {
      const [red, green, blue] = channels(color);
      return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    };
    const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    return (values[0] + 0.05) / (values[1] + 0.05);
  };

  for (const theme of ['light', 'dark'] as const) {
    await page.evaluate((nextTheme) => {
      document.documentElement.dataset.theme = nextTheme;
      localStorage.setItem('kbm:theme', nextTheme);
    }, theme);
    await page.reload();
    const colors = await page.getByRole('button', { name: 'Pin your first claim' }).evaluate((button) => {
      button.focus();
      const root = getComputedStyle(document.documentElement);
      return {
        outline: getComputedStyle(button).outlineColor,
        canvas: root.getPropertyValue('--canvas').trim(),
        paper: root.getPropertyValue('--paper').trim(),
      };
    });
    expect(contrast(colors.outline, colors.canvas), `${theme} focus against canvas`).toBeGreaterThanOrEqual(3);
    expect(contrast(colors.outline, colors.paper), `${theme} focus against paper`).toBeGreaterThanOrEqual(3);
  }
});

test('mobile status ledger is keyboard-scrollable and passes axe', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Try it with sample data' }).click();

  const ledger = page.getByRole('list', { name: 'Self-assessed boundary summary' });
  const dimensions = await ledger.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeGreaterThan(dimensions.clientWidth);

  await ledger.focus();
  await expect(ledger).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => ledger.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('mobile brand and footer links provide 44 by 44 pixel touch targets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const targets = page.locator('.brand, .site-footer a');
  await expect(targets).toHaveCount(5);
  for (const target of await targets.all()) {
    const box = await target.boundingBox();
    expect(box, await target.getAttribute('aria-label') ?? await target.textContent() ?? 'target').not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

test('rejects damaged rehearsal imports and explains how to recover', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await page.getByRole('button', { name: 'Export' }).click();

  await page.locator('#import-file').setInputFiles({
    name: 'damaged-map.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({
      version: 1,
      topic: 'Damaged import',
      claims: [{
        id: 'damaged',
        title: 'A valid claim',
        rehearsals: [{
          at: new Date().toISOString(),
          status: 'explain',
          teachBack: 7,
          counterexample: {},
          nextProbe: [],
        }],
      }],
    })),
  });

  await expect(page.getByRole('alert').filter({ hasText: 'Rehearsal 1 for “A valid claim” is damaged.' })).toContainText('Choose an unedited Knowledge Boundary Map JSON export and try again.');
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: /^Not rehearsed A correlation does not by itself show causation/ }).click();
  await expect(page.locator('#rehearsal-dialog')).toHaveAttribute('open', '');
  expect(errors).toEqual([]);
});

test('turns malformed JSON parser errors into actionable import guidance', async ({ page }) => {
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await page.getByRole('button', { name: 'Export' }).click();
  await page.locator('#import-file').setInputFiles({
    name: 'not-json.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{ nope'),
  });
  await expect(page.getByRole('alert').filter({ hasText: 'This file is not valid JSON.' })).toContainText('Choose a Knowledge Boundary Map JSON export and try again.');
});

test('@claim:offline-reload updated service worker runs the real application offline', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ serviceWorkers: 'allow' });
  const page = await context.newPage();
  try {
    await page.goto(baseURL!);
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) {
        await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
      }
    });
    await page.reload();

    const cacheEntries = await page.evaluate(async () => {
      const cacheName = (await caches.keys()).find((name) => name.startsWith('kbm-shell-'))!;
      const cache = await caches.open(cacheName);
      return (await cache.keys()).map((request) => request.url);
    });
    expect(cacheEntries.some((url) => /\/assets\/index-[^/]+\.js$/.test(url))).toBe(true);
    expect(cacheEntries.some((url) => /\/assets\/index-[^/]+\.css$/.test(url))).toBe(true);

    const updateState = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
      return { installing: Boolean(registration.installing), waiting: Boolean(registration.waiting) };
    });
    expect(updateState).toEqual({ installing: false, waiting: false });

    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1, name: 'Check what you can explain.' })).toBeVisible();
    await expect(page.getByText('You’re offline. Your map still works and stays on this device.')).toBeVisible();
  } finally {
    await context.close();
  }
});

test('an unseen offline return token never unlocks paid controls', async ({ context, page }) => {
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
  });
  await page.evaluate(() => {
    localStorage.setItem('kbm:map:v1', JSON.stringify({
      version: 1,
      topic: 'Limit test',
      claims: Array.from({ length: 12 }, (_, index) => ({ id: `claim-${index}`, title: `Claim ${index + 1}` })),
    }));
  });
  await context.setOffline(true);
  await page.goto('/?license=offline-unverified-regression', { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('link', { name: 'Lifetime studio' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license_verdict:knowledge-boundary-map'))).toBeNull();
  await page.keyboard.press('n');
  await expect(page.getByText('Your free workshop holds 12 claims.')).toBeVisible();
  await expect(page.locator('#claim-form')).toHaveCount(0);

  await page.route('https://api.sociobot.in/api/v1/products/knowledge-boundary-map/verify?license=offline-unverified-regression', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ valid: false, reason: 'invalid', expires_at: null }),
  }));
  await context.setOffline(false);
  await expect(page.getByText('Your saved license is no longer active.')).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('sb_license_verdict:knowledge-boundary-map')!))).toMatchObject({
    token: 'offline-unverified-regression',
    valid: false,
  });
});

test('a cached valid verdict cannot unlock a different return token', async ({ context, page }) => {
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
    localStorage.setItem('sb_license:knowledge-boundary-map', 'previous-token');
    localStorage.setItem('sb_license_verdict:knowledge-boundary-map', JSON.stringify({ token: 'previous-token', valid: true, checkedAt: Date.now() }));
  });
  await context.setOffline(true);
  await page.goto('/?license=different-token', { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('link', { name: 'Lifetime studio' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license_verdict:knowledge-boundary-map'))).toBeNull();
});

test('background revocation immediately removes paid controls rendered from a cached valid verdict', async ({ context, page }) => {
  const token = 'cached-valid-regression';
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
  });
  await page.evaluate((license) => {
    localStorage.setItem('kbm:map:v1', JSON.stringify({
      version: 1,
      topic: 'Limit test',
      claims: Array.from({ length: 12 }, (_, index) => ({ id: `claim-${index}`, title: `Claim ${index + 1}` })),
    }));
    localStorage.setItem('sb_license:knowledge-boundary-map', license);
    localStorage.setItem('sb_license_verdict:knowledge-boundary-map', JSON.stringify({ token: license, valid: true, checkedAt: 0 }));
  }, token);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('link', { name: 'Studio unlocked' })).toBeVisible();
  await page.keyboard.press('n');
  await expect(page.locator('#claim-form')).toHaveCount(1);

  await page.route(`https://api.sociobot.in/api/v1/products/knowledge-boundary-map/verify?license=${token}`, (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ valid: false, reason: 'revoked', expires_at: null }),
  }));
  await context.setOffline(false);

  await expect(page.getByRole('link', { name: 'Lifetime studio' })).toBeVisible();
  await expect(page.getByText('Your saved license is no longer active.')).toBeVisible();
  await expect(page.locator('#claim-form')).toHaveCount(0);
});
