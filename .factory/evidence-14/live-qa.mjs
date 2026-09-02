import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base = 'https://knowledge-boundary-map.sociobot.in';
const browser = await chromium.launch({ headless: true });
const report = { base, requests: [], consoleErrors: [], pageErrors: [], checks: {} };
const context = await browser.newContext({ viewport: { width: 1366, height: 900 }, serviceWorkers: 'allow' });
const page = await context.newPage();
page.on('request', (request) => report.requests.push(request.url()));
page.on('console', (message) => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
page.on('pageerror', (error) => report.pageErrors.push(error.message));

const response = await page.goto(base, { waitUntil: 'networkidle' });
assert.equal(response?.status(), 200);
report.homeHeaders = await response.allHeaders();
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });

const firstRead = {
  title: await page.title(),
  h1: await page.locator('h1').allTextContents(),
  audience: await page.getByText('For self-learners who want to separate recognition from an explanation they can produce.').isVisible(),
  demoAction: await page.getByRole('button', { name: 'Try it with sample data' }).isVisible(),
  demoOutcome: await page.getByText('Opens a completed causal-inference map.').isVisible(),
};
assert.deepEqual(firstRead.h1, ['Test what you can explain.']);
assert(firstRead.audience && firstRead.demoAction && firstRead.demoOutcome);
report.checks.firstRead = firstRead;

await page.keyboard.press('Tab');
assert.equal(await page.evaluate(() => document.activeElement?.textContent?.trim()), 'Skip to your map');
await page.keyboard.press('Enter');
assert.equal(await page.evaluate(() => document.activeElement?.id), 'main');
report.checks.skipLink = 'Tab exposed the skip link; Enter focused #main';

await page.getByRole('button', { name: 'Pin your first claim' }).click();
await page.getByRole('button', { name: 'Pin this claim' }).click();
assert.equal(await page.getByLabel('Claim *').evaluate((element) => element.validity.valueMissing), true);
const title = 'B'.repeat(160);
const contextText = 'C'.repeat(600);
await page.getByLabel('Claim *').fill(title);
await page.getByLabel('What should your explanation cover?').fill(contextText);
await page.getByRole('button', { name: 'Pin this claim' }).click();
assert.equal(await page.locator('[data-claim-id]').count(), 1);
report.checks.boundaryCreate = { title: title.length, context: contextText.length, blankRejected: true };

const claim = page.locator('[data-claim-id]').first();
await claim.focus();
await page.keyboard.press('Home');
const focusStyle = await claim.evaluate((element) => {
  const style = getComputedStyle(element);
  return { outlineColor: style.outlineColor, outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
});
assert.notEqual(focusStyle.outlineStyle, 'none');
await page.keyboard.press('Enter');
assert.equal(await page.getByRole('button', { name: 'Start 90 seconds' }).evaluate((element) => element === document.activeElement), true);
await page.keyboard.press('Escape');
await page.waitForTimeout(50);
assert.equal(await claim.evaluate((element) => element === document.activeElement), true);
await page.keyboard.press('Enter');
await page.getByLabel('Teach it back from memory *').fill('T'.repeat(5000));
await page.getByLabel('Can explain').check();
await page.getByRole('button', { name: 'Save self-assessment' }).click();
const recoveryText = await page.locator('#rehearsal-errors').innerText();
assert.match(recoveryText, /counterexample or boundary/i);
assert.match(recoveryText, /next question/i);
await page.getByLabel('Counterexample or boundary').fill('E'.repeat(2000));
await page.getByLabel('Next question *').fill('Q'.repeat(1000));
await page.getByRole('button', { name: 'Save self-assessment' }).click();
await page.reload({ waitUntil: 'networkidle' });
await page.locator('[data-claim-id]').first().click();
assert.equal((await page.getByLabel('Teach it back from memory *').inputValue()).length, 5000);
assert.equal((await page.getByLabel('Counterexample or boundary').inputValue()).length, 2000);
assert.equal((await page.getByLabel('Next question *').inputValue()).length, 1000);
assert.equal(await page.getByLabel('Can explain').isChecked(), true);
report.checks.rehearsalRecovery = { recoveryText, persistedAfterReload: true, focusStyle };

page.once('dialog', (dialog) => dialog.dismiss());
await page.getByRole('button', { name: 'Remove claim' }).click();
assert.equal(await page.locator('[data-claim-id]').count(), 1);
page.once('dialog', (dialog) => dialog.accept());
await page.getByRole('button', { name: 'Remove claim' }).click();
assert.equal(await page.locator('[data-claim-id]').count(), 0);
await page.getByRole('button', { name: 'Undo' }).click();
assert.equal(await page.locator('[data-claim-id]').count(), 1);
report.checks.removeRecovery = 'cancel preserved claim; confirmed removal; Undo restored it';

await page.getByRole('button', { name: 'Export' }).click();
await page.locator('#import-file').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{broken') });
const importError = await page.locator('#import-errors').innerText();
assert.match(importError, /not valid JSON/i);
assert.equal(await page.locator('[data-claim-id]').count(), 1);
report.checks.invalidImport = importError.trim();

await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
assert.equal(await page.locator('[data-claim-id]').count(), 3);
assert(await page.getByLabel('Demo controls').innerText().then((text) => text.includes('nothing is saved to your real map')));
await page.screenshot({ path: '.factory/evidence-14/live-demo-desktop.png', fullPage: true });
await page.emulateMedia({ reducedMotion: 'reduce' });
const reducedMotion = await page.locator('.claim-paper').first().evaluate((element) => ({
  animationDuration: getComputedStyle(element).animationDuration,
  transitionDuration: getComputedStyle(element).transitionDuration,
  scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
}));
assert(reducedMotion.transitionDuration.split(',').every((duration) => Number.parseFloat(duration) <= 0.001));
report.checks.reducedMotion = reducedMotion;

const routeResults = [];
for (const path of ['/', '/demo', '/privacy', '/terms', '/404.html']) {
  await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
  const axe = await new AxeBuilder({ page }).analyze();
  const serious = axe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
  assert.equal(serious.length, 0, `${path}: ${serious.map((item) => item.id).join(', ')}`);
  routeResults.push({ path, title: await page.title(), h1: await page.locator('main h1').count(), seriousCritical: serious.length });
}
report.checks.desktopAxe = routeResults;

await context.close();

const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
const mobile = await mobileContext.newPage();
const mobileErrors = [];
mobile.on('console', (message) => { if (message.type() === 'error') mobileErrors.push(message.text()); });
mobile.on('pageerror', (error) => mobileErrors.push(error.message));
await mobile.goto(`${base}/demo`, { waitUntil: 'networkidle' });
await mobile.screenshot({ path: '.factory/evidence-14/live-demo-mobile-390-dark.png', fullPage: true });
const mobileAxe = await new AxeBuilder({ page: mobile }).analyze();
const mobileSerious = mobileAxe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
assert.equal(mobileSerious.length, 0);
const mobileLayout = await mobile.evaluate(() => {
  const targets = [...document.querySelectorAll('a,button,input,textarea,label[for],summary')].filter((element) => {
    const box = element.getBoundingClientRect();
    return !element.classList.contains('visually-hidden') && box.width > 0 && box.height > 0;
  }).map((element) => {
    const box = element.getBoundingClientRect();
    return { name: element.getAttribute('aria-label') || element.textContent?.trim().slice(0, 60) || element.tagName, width: box.width, height: box.height };
  });
  return { overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, targets, undersized: targets.filter((target) => target.width < 44 || target.height < 44) };
});
assert.equal(mobileLayout.overflow, 0);
assert.equal(mobileLayout.undersized.length, 0);
await mobile.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
const zoom = await mobile.evaluate(() => ({ overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, h1Visible: !!document.querySelector('h1')?.getClientRects().length }));
assert.equal(zoom.overflow, 0);
assert.equal(zoom.h1Visible, true);
assert.deepEqual(mobileErrors, []);
report.checks.mobile = { axeSeriousCritical: mobileSerious.length, targetCount: mobileLayout.targets.length, minWidth: Math.min(...mobileLayout.targets.map((target) => target.width)), minHeight: Math.min(...mobileLayout.targets.map((target) => target.height)), overflow: mobileLayout.overflow, zoom200: zoom };
await mobileContext.close();

const offlineContext = await browser.newContext({ serviceWorkers: 'allow' });
const offlinePage = await offlineContext.newPage();
await offlinePage.goto(`${base}/demo`);
await offlinePage.evaluate(async () => {
  await navigator.serviceWorker.ready;
  if (!navigator.serviceWorker.controller) await new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
});
await offlinePage.reload();
const sw = await offlinePage.evaluate(async () => ({ controller: !!navigator.serviceWorker.controller, caches: await caches.keys() }));
await offlineContext.setOffline(true);
await offlinePage.reload({ waitUntil: 'domcontentloaded' });
assert.equal(await offlinePage.getByRole('heading', { name: 'Your explanation map' }).isVisible(), true);
assert.equal(await offlinePage.getByText('You’re offline. Your map still works and stays on this device.').isVisible(), true);
report.checks.offline = sw;
await offlineContext.close();

const blockedContext = await browser.newContext({ viewport: { width: 1366, height: 900 } });
await blockedContext.addInitScript(() => {
  const original = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key, value) {
    if (String(key).includes('kbm:map')) throw new DOMException('Blocked for QA', 'QuotaExceededError');
    return original.call(this, key, value);
  };
});
const blockedPage = await blockedContext.newPage();
await blockedPage.goto(base);
await blockedPage.getByRole('button', { name: 'Pin your first claim' }).click();
await blockedPage.getByLabel('Claim *').fill('Storage failure recovery claim');
await blockedPage.getByRole('button', { name: 'Pin this claim' }).click();
assert.equal(await blockedPage.getByRole('alert').filter({ hasText: 'cannot save' }).isVisible(), true);
assert.equal(await blockedPage.getByRole('button', { name: 'Export' }).isVisible(), true);
report.checks.storageFailure = 'warning shown; in-memory claim remained available; Export remained available';
await blockedContext.close();

const origins = [...new Set(report.requests.map((url) => new URL(url).origin))];
assert.deepEqual(origins, [base]);
report.requestSummary = { count: report.requests.length, origins };
assert.deepEqual(report.consoleErrors, []);
assert.deepEqual(report.pageErrors, []);
await writeFile('.factory/evidence-14/live-qa.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
