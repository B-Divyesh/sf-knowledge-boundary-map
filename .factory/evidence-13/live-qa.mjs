import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const origin = 'https://knowledge-boundary-map.sociobot.in';
const evidence = '.factory/evidence-13';
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const severeAxe = async (page) => (await new AxeBuilder({ page }).analyze())
  .violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''));

const report = {};
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
    serviceWorkers: 'allow',
    acceptDownloads: true,
  });
  const page = await context.newPage();
  const requests = [];
  const errors = [];
  page.on('request', (request) => requests.push({ method: request.method(), url: request.url() }));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

  const response = await page.goto(origin, { waitUntil: 'networkidle' });
  assert(response?.status() === 200, 'cold page did not return 200');
  assert(await page.getByRole('heading', { level: 1, name: 'Test what you can explain.' }).isVisible(), 'plain job headline missing');
  assert(await page.getByText('For self-learners who want to separate recognition from an explanation they can produce.').isVisible(), 'audience and outcome missing');
  const sampleAction = page.getByRole('button', { name: 'Try it with sample data' });
  assert(await sampleAction.isVisible(), 'one-click sample action missing');
  assert(await page.getByText('Opens a completed causal-inference map.').isVisible(), 'sample action consequence missing');
  await page.screenshot({ path: `${evidence}/live-first-read-desktop.png`, fullPage: true });

  await page.evaluate(() => localStorage.setItem('kbm:map:v1', JSON.stringify({ version: 1, topic: 'REAL QA MARKER', claims: [] })));
  await sampleAction.click();
  await page.waitForURL(`${origin}/demo`);
  assert(await page.locator('[data-claim-id]').count() === 3, 'demo does not show three sample claims');
  assert(await page.getByLabel('Demo controls').getByText(/sample data, nothing is saved/).isVisible(), 'demo isolation banner missing');
  const storage = await page.evaluate(() => ({ real: localStorage.getItem('kbm:map:v1'), demo: localStorage.getItem('demo:kbm:map:v1') }));
  assert(storage.real?.includes('REAL QA MARKER'), 'demo modified real storage');
  assert(storage.demo?.includes('Causal inference basics'), 'demo did not use its own storage key');

  const firstClaim = page.locator('[data-claim-id]').first();
  await page.locator('body').click({ position: { x: 1, y: 1 } });
  let reachedClaim = false;
  for (let index = 0; index < 30; index += 1) {
    await page.keyboard.press('Tab');
    if (await firstClaim.evaluate((element) => element === document.activeElement)) {
      reachedClaim = true;
      break;
    }
  }
  assert(reachedClaim, 'Tab did not reach the first claim');
  const focusStyle = await firstClaim.evaluate((element) => {
    const style = getComputedStyle(element);
    return { focusVisible: element.matches(':focus-visible'), outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, outlineColor: style.outlineColor };
  });
  assert(focusStyle.focusVisible && focusStyle.outlineStyle !== 'none' && parseFloat(focusStyle.outlineWidth) >= 3, 'claim keyboard focus is not visibly styled');
  await page.keyboard.press('ArrowRight');
  const secondClaim = page.locator('[data-claim-id]').nth(1);
  assert(await secondClaim.evaluate((element) => element === document.activeElement), 'arrow key did not move claim focus');
  await page.keyboard.press('Enter');
  assert(await page.getByRole('dialog').isVisible(), 'Enter did not open rehearsal');
  await page.keyboard.press('Escape');
  assert(await secondClaim.evaluate((element) => element === document.activeElement), 'Escape did not restore claim focus');

  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.waitForURL(`${origin}/`);
  assert((await page.evaluate(() => localStorage.getItem('kbm:map:v1')))?.includes('REAL QA MARKER'), 'real storage was not restored');
  await page.getByRole('button', { name: 'Pin your first claim' }).click();
  await page.getByRole('button', { name: 'Pin this claim' }).click();
  const titleField = page.getByLabel('Claim *');
  assert(await titleField.evaluate((element) => element.matches(':invalid')), 'blank required claim did not enter invalid state');
  assert((await titleField.evaluate((element) => element.validationMessage)).length > 0, 'blank claim has no recovery message');
  await titleField.fill('A'.repeat(160));
  await page.getByLabel('What should your explanation cover?').fill('B'.repeat(600));
  await page.getByRole('button', { name: 'Pin this claim' }).click();
  assert(await page.locator('[data-claim-id]').count() === 1, 'maximum-length claim did not save');

  await page.locator('[data-claim-id]').click();
  await page.getByLabel('Can explain').check();
  await page.getByRole('button', { name: 'Save self-assessment' }).click();
  const teachBack = page.getByLabel('Teach it back from memory *');
  assert(await teachBack.evaluate((element) => element.matches(':invalid')), 'blank teach-back did not enter invalid state');
  await teachBack.fill('This maximum-length claim remains usable and can be explained from memory.');
  await page.getByRole('button', { name: 'Save self-assessment' }).click();
  const rehearsalErrors = await page.locator('#rehearsal-errors').innerText();
  assert(rehearsalErrors.includes('Add a counterexample or boundary'), 'missing boundary recovery guidance');
  assert(rehearsalErrors.includes('Choose a next question'), 'missing next-question recovery guidance');
  await page.getByLabel('Counterexample or boundary').fill('The title length does not show whether the claim is true.');
  await page.getByLabel('Next question *').fill('Can I show the idea with a concrete example?');
  await page.getByRole('button', { name: 'Save self-assessment' }).click();
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('[data-claim-id]').click();
  assert((await page.getByLabel('Teach it back from memory *').inputValue()).includes('remains usable'), 'rehearsal did not persist');
  assert(await page.locator('.history details').count() === 1, 'rehearsal history did not persist');
  page.once('dialog', (dialog) => dialog.dismiss());
  await page.getByRole('button', { name: 'Remove claim' }).click();
  assert(await page.getByRole('dialog').isVisible(), 'cancelled removal did not preserve the claim');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Remove claim' }).click();
  assert(await page.locator('[data-claim-id]').count() === 0, 'confirmed removal did not remove the claim');
  await page.getByRole('button', { name: 'Undo' }).click();
  assert(await page.locator('[data-claim-id]').count() === 1, 'Undo did not restore the claim');

  await page.getByRole('button', { name: 'Export' }).click();
  await page.locator('#import-file').setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from('{not json') });
  assert((await page.locator('#import-errors').innerText()).includes('not valid JSON'), 'malformed JSON lacks recovery guidance');
  const overLimit = {
    version: 1,
    topic: 'Over limit',
    claims: Array.from({ length: 13 }, (_, index) => ({
      id: `claim-${index}`, title: `Claim ${index}`, context: '', prerequisiteIds: [], status: 'untested', teachBack: '', counterexample: '', nextProbe: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), rehearsals: [],
    })),
  };
  await page.locator('#import-file').setInputFiles({ name: 'over-limit.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(overLimit)) });
  await page.waitForFunction(() => document.querySelector('#import-errors')?.textContent?.includes('This file has 13 claims'));
  assert((await page.locator('#import-errors').innerText()).includes('This file has 13 claims'), '13-claim import was not rejected');
  await page.getByRole('button', { name: 'Close' }).click();
  assert(await page.locator('[data-claim-id]').count() === 1, 'rejected import changed the current map');

  const desktopSevere = await severeAxe(page);
  assert(desktopSevere.length === 0, `desktop axe: ${desktopSevere.map((item) => item.id).join(', ')}`);
  assert(errors.length === 0, `browser errors: ${errors.join(' | ')}`);
  const requestOrigins = [...new Set(requests.map((request) => new URL(request.url).origin))];
  assert(requestOrigins.length === 1 && requestOrigins[0] === origin, `unexpected request origins: ${requestOrigins.join(', ')}`);
  report.desktop = {
    firstRead: 'PASS', demoIsolation: 'PASS', normalFlow: 'PASS', boundaryLengths: { claim: 160, context: 600 },
    invalidClaimRecovery: 'PASS', invalidRehearsalRecovery: 'PASS', invalidImportRecovery: 'PASS', persistence: 'PASS',
    removeCancelUndo: 'PASS', keyboardMapDialog: 'PASS', focusStyle, axeSeriousCritical: 0,
    consolePageErrors: 0, requestOrigins, requestCount: requests.length, responseHeaders: await response.allHeaders(),
  };
  await context.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark', serviceWorkers: 'block' });
  const mobile = await mobileContext.newPage();
  const mobileErrors = [];
  mobile.on('console', (message) => { if (message.type() === 'error') mobileErrors.push(message.text()); });
  mobile.on('pageerror', (error) => mobileErrors.push(error.message));
  await mobile.goto(`${origin}/demo`, { waitUntil: 'networkidle' });
  const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const mobileSevere = await severeAxe(mobile);
  const visibleTargets = await mobile.locator('a,button,input,textarea,summary,[tabindex]').evaluateAll((elements) => elements.filter((element) => {
    const style = getComputedStyle(element); const rect = element.getBoundingClientRect();
    return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
  }).map((element) => {
    const rect = element.getBoundingClientRect();
    return { label: (element.getAttribute('aria-label') || element.textContent || '').trim().slice(0, 80), width: Math.round(rect.width), height: Math.round(rect.height) };
  }));
  const smallTargets = visibleTargets.filter((target) => target.width < 44 || target.height < 44);
  assert(overflow <= 0, `mobile overflow is ${overflow}px`);
  assert(mobileSevere.length === 0, `mobile axe: ${mobileSevere.map((item) => item.id).join(', ')}`);
  assert(smallTargets.length === 0, `mobile targets below 44px: ${JSON.stringify(smallTargets)}`);
  assert(mobileErrors.length === 0, `mobile browser errors: ${mobileErrors.join(' | ')}`);
  await mobile.screenshot({ path: `${evidence}/live-demo-mobile-390.png`, fullPage: true });
  report.mobile390 = { overflowPx: overflow, visibleTargets: visibleTargets.length, targetsBelow44px: smallTargets, axeSeriousCritical: 0, consolePageErrors: 0 };
  await mobileContext.close();

  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reduced = await reducedContext.newPage();
  await reduced.goto(`${origin}/demo`, { waitUntil: 'networkidle' });
  const materialMotion = await reduced.locator('*').evaluateAll((elements) => elements.map((element) => {
    const style = getComputedStyle(element);
    return { transition: style.transitionDuration, animation: style.animationDuration, scrollBehavior: style.scrollBehavior };
  }).filter((item) => item.transition.split(',').some((value) => parseFloat(value) > 0.001) || item.animation.split(',').some((value) => parseFloat(value) > 0.001) || item.scrollBehavior === 'smooth'));
  assert(materialMotion.length === 0, `reduced motion leaves active motion: ${JSON.stringify(materialMotion.slice(0, 5))}`);
  report.reducedMotion = { materialDurationsOrSmoothScroll: materialMotion.length };
  await reducedContext.close();

  const storageContext = await browser.newContext();
  await storageContext.addInitScript(() => {
    for (const method of ['getItem', 'setItem', 'removeItem']) {
      Object.defineProperty(Storage.prototype, method, { configurable: true, value() { throw new DOMException('Blocked for QA', 'SecurityError'); } });
    }
  });
  const storagePage = await storageContext.newPage();
  const storageErrors = [];
  storagePage.on('console', (message) => { if (message.type() === 'error') storageErrors.push(message.text()); });
  storagePage.on('pageerror', (error) => storageErrors.push(error.message));
  await storagePage.goto(origin, { waitUntil: 'networkidle' });
  assert(await storagePage.getByRole('alert').getByText('This browser cannot save your changes. Export a copy before leaving.').isVisible(), 'storage failure warning missing');
  await storagePage.getByRole('button', { name: 'Pin your first claim' }).click();
  await storagePage.getByLabel('Claim *').fill('In-memory recovery claim');
  await storagePage.getByRole('button', { name: 'Pin this claim' }).click();
  assert(await storagePage.locator('[data-claim-id]').count() === 1, 'app is unusable when storage fails');
  assert(await storagePage.getByRole('button', { name: 'Export' }).isVisible(), 'export recovery is unavailable when storage fails');
  assert(storageErrors.length === 0, `storage-failure browser errors: ${storageErrors.join(' | ')}`);
  report.storageFailure = { warning: 'PASS', inMemoryUse: 'PASS', exportRecovery: 'PASS', consolePageErrors: 0 };
  await storageContext.close();

  const offlineContext = await browser.newContext({ serviceWorkers: 'allow' });
  const offline = await offlineContext.newPage();
  await offline.goto(`${origin}/demo`, { waitUntil: 'networkidle' });
  await offline.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
  });
  await offline.reload({ waitUntil: 'networkidle' });
  const worker = await offline.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    return { controller: Boolean(navigator.serviceWorker.controller), activeState: registration.active?.state, waiting: Boolean(registration.waiting), caches: await caches.keys() };
  });
  await offlineContext.setOffline(true);
  await offline.reload({ waitUntil: 'domcontentloaded' });
  assert(await offline.getByRole('heading', { level: 1, name: 'Your explanation map' }).isVisible(), 'offline demo shell did not reload');
  assert(await offline.getByText('You’re offline. Your map still works and stays on this device.').isVisible(), 'offline notice missing');
  report.pwa = { ...worker, offlineReload: 'PASS' };
  await offlineContext.close();

  await writeFile(`${evidence}/live-qa.json`, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
