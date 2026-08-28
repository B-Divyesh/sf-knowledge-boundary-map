import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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
  await page.getByRole('button', { name: 'Try a three-claim example' }).click();
  await page.getByRole('button', { name: /Random assignment/ }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('button', { name: /^Not rehearsed A confounder/ })).toBeFocused();
  expect(errors).toEqual([]);
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

  await expect(page.getByRole('heading', { level: 1, name: 'Find the edge of what you can explain.' })).toBeVisible();
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

test('mobile status ledger is keyboard-scrollable and passes axe', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Try a three-claim example' }).click();

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
  await page.getByRole('button', { name: 'Try a three-claim example' }).click();
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
  await page.getByRole('button', { name: 'Try a three-claim example' }).click();
  await page.getByRole('button', { name: 'Export' }).click();
  await page.locator('#import-file').setInputFiles({
    name: 'not-json.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{ nope'),
  });
  await expect(page.getByRole('alert').filter({ hasText: 'This file is not valid JSON.' })).toContainText('Choose a Knowledge Boundary Map JSON export and try again.');
});

test('updated service worker runs the real application offline', async ({ context, page }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
    }
  });
  await page.reload();

  const cacheEntries = await page.evaluate(async () => {
    const cache = await caches.open('kbm-shell-v4');
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
  await expect(page.getByRole('heading', { level: 1, name: 'Find the edge of what you can explain.' })).toBeVisible();
  await expect(page.getByText('You’re offline. Your map still works and stays on this device.')).toBeVisible();
});
