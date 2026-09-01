import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const origin = 'https://knowledge-boundary-map.sociobot.in';
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const browser = await chromium.launch({ headless: true });
try {
  const requests = [];
  const errors = [];
  const context = await browser.newContext({
    viewport: { width: 1366, height: 900 },
    colorScheme: 'light',
    serviceWorkers: 'allow',
    acceptDownloads: true,
  });
  const page = await context.newPage();
  page.on('request', request => requests.push({ method: request.method(), url: request.url() }));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));

  await page.goto(origin, { waitUntil: 'networkidle' });
  assert(await page.getByRole('heading', { level: 1, name: 'Test what you can explain.' }).isVisible(), 'cold headline missing');
  assert(await page.getByText('For self-learners who want to separate recognition from an explanation they can produce.').isVisible(), 'cold audience/outcome missing');
  const demoAction = page.getByRole('button', { name: 'Try it with sample data' });
  assert(await demoAction.isVisible(), 'sample action missing');
  assert(await page.getByText('Opens a completed causal-inference map.').isVisible(), 'sample action consequence missing');

  await page.evaluate(() => localStorage.setItem('kbm:map:v1', JSON.stringify({ version: 1, topic: 'REAL QA MARKER', claims: [] })));
  await demoAction.click();
  await page.waitForURL(origin + '/demo');
  assert(await page.getByLabel('Demo controls').getByText(/sample data, nothing is saved/).isVisible(), 'demo banner missing');
  assert(await page.locator('[data-claim-id]').count() === 3, 'demo does not start with three sample claims');
  assert((await page.getByLabel('Self-assessed boundary summary').innerText()).includes('Blocked'), 'mixed demo status missing');
  const demoStorage = await page.evaluate(() => ({ real: localStorage.getItem('kbm:map:v1'), demo: localStorage.getItem('demo:kbm:map:v1') }));
  assert(demoStorage.real?.includes('REAL QA MARKER'), 'demo changed real storage');
  assert(demoStorage.demo?.includes('Causal inference basics'), 'demo storage was not isolated');

  await page.locator('body').click({ position: { x: 1, y: 1 } });
  let reachedClaim = false;
  for (let i = 0; i < 30; i += 1) {
    await page.keyboard.press('Tab');
    if (await page.evaluate(() => document.activeElement?.hasAttribute('data-claim-id'))) {
      reachedClaim = true;
      break;
    }
  }
  assert(reachedClaim, 'Tab did not reach the claim map');
  const first = page.locator('[data-claim-id]').first();
  assert(await first.evaluate(element => element === document.activeElement), 'first roving claim was not the keyboard target');
  const focusStyle = await first.evaluate(element => {
    const style = getComputedStyle(element);
    return {
      focusVisible: element.matches(':focus-visible'),
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      outlineColor: style.outlineColor,
    };
  });
  assert(focusStyle.focusVisible && focusStyle.outlineStyle !== 'none' && parseFloat(focusStyle.outlineWidth) >= 3, 'focus ring is not visibly styled for keyboard focus');
  await page.keyboard.press('ArrowRight');
  const second = page.locator('[data-claim-id]').nth(1);
  assert(await second.evaluate(element => element === document.activeElement), 'arrow navigation did not move focus');
  await page.keyboard.press('Enter');
  assert(await page.getByRole('dialog').isVisible(), 'Enter did not open rehearsal');
  await page.keyboard.press('Escape');
  assert(await second.evaluate(element => element === document.activeElement), 'Escape did not restore claim focus');

  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.waitForURL(origin + '/');
  assert((await page.evaluate(() => localStorage.getItem('kbm:map:v1')))?.includes('REAL QA MARKER'), 'real map was not restored');
  await page.getByRole('button', { name: 'Pin your first claim' }).click();
  await page.getByRole('button', { name: 'Pin this claim' }).click();
  const claimField = page.getByLabel('Claim *');
  assert(await claimField.evaluate(element => element.matches(':invalid')), 'empty required claim did not enter invalid state');
  assert((await claimField.evaluate(element => element.validationMessage)).length > 0, 'empty required claim has no browser recovery message');

  const title = 'A'.repeat(160);
  const contextText = 'B'.repeat(600);
  await claimField.fill(title);
  await page.getByLabel('What should your explanation cover?').fill(contextText);
  await page.getByRole('button', { name: 'Pin this claim' }).click();
  assert(await page.locator('[data-claim-id]').count() === 1, 'boundary-length claim was not saved');
  await page.locator('[data-claim-id]').click();
  await page.getByLabel('Can explain').check();
  await page.getByRole('button', { name: 'Save self-assessment' }).click();
  const teachBackField = page.getByLabel('Teach it back from memory *');
  assert(await teachBackField.evaluate(element => element.matches(':invalid')), 'empty teach-back did not enter invalid state');
  assert((await teachBackField.evaluate(element => element.validationMessage)).length > 0, 'empty teach-back has no browser recovery message');
  await teachBackField.fill('This claim represents the maximum supported title length and remains usable.');
  await page.getByRole('button', { name: 'Save self-assessment' }).click();
  const rehearsalErrors = await page.locator('#rehearsal-errors').innerText();
  for (const phrase of ['Add a counterexample', 'Choose a next question']) {
    assert(rehearsalErrors.includes(phrase), `missing recovery guidance: ${phrase}`);
  }
  await page.getByLabel('Counterexample or boundary').fill('It does not assess whether the statement is factually true.');
  await page.getByLabel('Next question *').fill('Can I state the same idea with a concrete example?');
  await page.getByRole('button', { name: 'Save self-assessment' }).click();
  assert((await page.getByLabel('Self-assessed boundary summary').innerText()).includes('1\nCan explain'), 'saved status was not reflected');

  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('[data-claim-id]').click();
  assert((await page.getByLabel('Teach it back from memory *').inputValue()).includes('maximum supported'), 'teach-back did not persist');
  assert(await page.locator('.history details').count() === 1, 'rehearsal history did not persist');
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: 'Remove claim' }).click();
  assert(await page.getByRole('dialog').isVisible(), 'cancelled removal did not preserve the claim dialog');
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Remove claim' }).click();
  assert(await page.locator('[data-claim-id]').count() === 0, 'confirmed removal did not remove claim');
  await page.getByRole('button', { name: 'Undo' }).click();
  assert(await page.locator('[data-claim-id]').count() === 1, 'undo did not restore removed claim');

  await page.getByRole('button', { name: 'Export' }).click();
  await page.locator('#import-file').setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from('{not json') });
  assert((await page.locator('#import-errors').innerText()).includes('not valid JSON'), 'invalid import did not provide recovery guidance');

  const axe = await new AxeBuilder({ page }).analyze();
  const severe = axe.violations.filter(violation => ['serious', 'critical'].includes(violation.impact ?? ''));
  assert(severe.length === 0, `desktop axe findings: ${severe.map(violation => violation.id).join(',')}`);
  assert(errors.length === 0, `browser errors: ${errors.join(' | ')}`);
  const origins = [...new Set(requests.map(request => new URL(request.url).origin))];
  assert(origins.length === 1 && origins[0] === origin, `unexpected request origin: ${origins.join(',')}`);
  console.log(JSON.stringify({ desktop: { normalFlow: 'PASS', boundaryLengths: { claim: 160, context: 600 }, invalidClaimRecovery: 'PASS', invalidRehearsalRecovery: 'PASS', invalidImportRecovery: 'PASS', persistence: 'PASS', removeCancelUndo: 'PASS', keyboardMapDialog: 'PASS', focusStyle, axeSeriousCritical: severe.length, consolePageErrors: errors.length, requestOrigins: origins, requestCount: requests.length } }, null, 2));
  await context.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark', serviceWorkers: 'block' });
  const mobile = await mobileContext.newPage();
  await mobile.goto(origin + '/demo', { waitUntil: 'networkidle' });
  const mobileAxe = await new AxeBuilder({ page: mobile }).analyze();
  const mobileSevere = mobileAxe.violations.filter(violation => ['serious', 'critical'].includes(violation.impact ?? ''));
  const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const controls = await mobile.locator('a,button,input,textarea,summary,[tabindex]').evaluateAll(elements => elements.filter(element => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
  }).map(element => {
    const rect = element.getBoundingClientRect();
    return { label: (element.getAttribute('aria-label') || element.textContent || element.getAttribute('name') || '').trim().slice(0, 80), width: Math.round(rect.width), height: Math.round(rect.height) };
  }));
  const smallControls = controls.filter(control => control.width < 44 || control.height < 44);
  await mobile.screenshot({ path: '.factory/evidence-11/live-demo-mobile-390.png', fullPage: true });
  assert(overflow <= 0, `mobile horizontal overflow ${overflow}px`);
  assert(mobileSevere.length === 0, `mobile axe findings: ${mobileSevere.map(violation => violation.id).join(',')}`);
  assert(smallControls.length === 0, `mobile controls below 44px: ${JSON.stringify(smallControls)}`);
  console.log(JSON.stringify({ mobile390: { overflowPx: overflow, axeSeriousCritical: mobileSevere.length, visibleControls: controls.length, smallControls, screenshot: '.factory/evidence-11/live-demo-mobile-390.png' } }, null, 2));
  await mobileContext.close();

  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reduced = await reducedContext.newPage();
  await reduced.goto(origin + '/demo', { waitUntil: 'networkidle' });
  const motion = await reduced.locator('*').evaluateAll(elements => elements.map(element => {
    const style = getComputedStyle(element);
    return { tag: element.tagName, transition: style.transitionDuration, animation: style.animationDuration };
  }).filter(item => item.transition.split(',').some(value => parseFloat(value) > 0.001) || item.animation.split(',').some(value => parseFloat(value) > 0.001)).slice(0, 20));
  assert(motion.length === 0, `reduced motion leaves material durations: ${JSON.stringify(motion)}`);
  console.log(JSON.stringify({ reducedMotion: { materialDurations: motion.length } }, null, 2));
  await reducedContext.close();
} finally {
  await browser.close();
}
