import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const origin = 'https://knowledge-boundary-map.sociobot.in';
const evidence = '.factory/evidence-4';
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const browser = await chromium.launch({ headless: true });
const report = { origin, checkedAt: new Date().toISOString() };

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
    serviceWorkers: 'allow',
  });
  const page = await context.newPage();
  const requests = [];
  const errors = [];
  page.on('request', (request) => requests.push(request.url()));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  const routeExpectations = [
    ['/', 200, 'Knowledge Boundary Map — test what you can explain', 'Test what you can explain.'],
    ['/demo', 200, 'Demo — Knowledge Boundary Map', 'Your explanation map'],
    ['/privacy', 200, 'Privacy — Knowledge Boundary Map', 'Privacy'],
    ['/terms', 200, 'Terms — Knowledge Boundary Map', 'Terms'],
    ['/definitely-missing-polish-4', 404, 'Page not found — Knowledge Boundary Map', 'Page not found.'],
  ];
  const routes = [];
  for (const [path, status, title, heading] of routeExpectations) {
    const response = await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
    assert(response?.status() === status, `${path} returned ${response?.status()}, expected ${status}`);
    assert(await page.title() === title, `${path} title did not match`);
    assert(await page.locator('main h1').count() === 1, `${path} did not have exactly one h1`);
    assert(await page.getByRole('heading', { level: 1, name: heading }).isVisible(), `${path} heading missing`);
    assert(Boolean(await page.locator('link[rel="canonical"]').getAttribute('href')), `${path} canonical missing`);
    assert(Boolean(await page.locator('meta[name="description"]').getAttribute('content')), `${path} description missing`);
    routes.push({ path, status, title, heading, result: 'PASS' });
  }

  await page.goto(origin, { waitUntil: 'networkidle' });
  assert(await page.getByText('After reading, watching, or taking notes').isVisible(), 'first-screen context missing');
  assert(await page.getByText('For self-learners who want to separate recognition from an explanation they can produce.').isVisible(), 'audience sentence missing');
  assert(await page.getByRole('button', { name: 'Try it with sample data' }).isVisible(), 'sample action missing');
  assert(await page.getByText('Opens a completed causal-inference map.').isVisible(), 'sample outcome missing');
  assert(await page.getByText('Built by Param Factory · build polish-4').isVisible(), 'polish-4 build label missing');
  await page.screenshot({ path: `${evidence}/live-home-cold-desktop.png`, fullPage: true });

  await page.evaluate(() => {
    localStorage.setItem('kbm:map:v1', JSON.stringify({ version: 1, topic: 'REAL ROUND 4 MARKER', claims: [] }));
  });
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await page.waitForURL(`${origin}/demo`);
  assert(await page.getByLabel('Demo controls').isVisible(), 'demo banner missing');
  assert((await page.getByRole('list', { name: 'Self-assessed boundary summary' }).innerText()).replace(/\s/g, '').includes('1Canexplain1Recognizeonly1Blocked'), 'mixed demo statuses missing');
  assert(await page.getByText('Explain why random assignment balances known and unknown confounders only on average.').isVisible(), 'specific next question missing');
  const beforeReset = await page.locator('[data-claim-id]').first().getAttribute('data-claim-id');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  const afterReset = await page.locator('[data-claim-id]').first().getAttribute('data-claim-id');
  assert(beforeReset !== afterReset, 'Reset demo did not replace sample ids');
  const isolated = await page.evaluate(() => ({
    real: localStorage.getItem('kbm:map:v1'),
    demo: localStorage.getItem('demo:kbm:map:v1'),
  }));
  assert(isolated.real?.includes('REAL ROUND 4 MARKER'), 'demo changed the real map');
  assert(isolated.demo?.includes('Causal inference basics'), 'demo storage was not seeded');
  await page.getByRole('link', { name: 'Knowledge Boundary Map home' }).click();
  await page.waitForURL(`${origin}/`);
  assert(await page.getByRole('heading', { level: 1, name: 'Test what you can explain.' }).evaluate((element) => element === document.activeElement), 'demo exit did not focus the home heading');
  const afterExit = await page.evaluate(() => ({
    real: localStorage.getItem('kbm:map:v1'),
    demo: localStorage.getItem('demo:kbm:map:v1'),
  }));
  assert(afterExit.real?.includes('REAL ROUND 4 MARKER') && afterExit.demo === null, 'demo exit did not preserve real data and clear demo data');

  await page.goto(`${origin}/?demo=1`, { waitUntil: 'networkidle' });
  assert(await page.getByLabel('Demo controls').isVisible(), '?demo=1 did not enter demo mode');
  assert(await page.locator('[data-claim-id]').count() === 3, '?demo=1 did not show the completed sample');

  await page.goto(`${origin}/terms`, { waitUntil: 'networkidle' });
  const termsText = await page.locator('main').innerText();
  assert(!termsText.includes('No purchase is offered in this release.'), 'F-4-1 sentence remains live');
  assert(!/\b(?:buy|purchase|checkout|price|studio)\b/i.test(termsText), 'Terms exposes purchase wording');
  await page.screenshot({ path: `${evidence}/live-terms-desktop.png`, fullPage: true });

  const unexpectedRequests = requests.filter((url) => {
    const parsed = new URL(url);
    return parsed.origin !== origin || /checkout|billing|api\/v1\/products/i.test(parsed.href);
  });
  assert(unexpectedRequests.length === 0, `unexpected live requests: ${unexpectedRequests.join(', ')}`);
  const unexpectedErrors = errors.filter((error) => !/Failed to load resource: the server responded with a status of 404/.test(error));
  assert(unexpectedErrors.length === 0, `normal-route browser errors: ${unexpectedErrors.join(' | ')}`);
  report.desktop = {
    firstScreen: 'PASS',
    directDemoQuery: 'PASS',
    demoResetAndIsolation: 'PASS',
    demoExit: 'PASS',
    termsF41: 'PASS',
    routes,
    requestOrigins: [...new Set(requests.map((url) => new URL(url).origin))],
    checkoutOrBillingRequests: 0,
    consolePageErrors: 0,
    expectedMissingRouteResourceErrors: errors.length - unexpectedErrors.length,
  };
  await context.close();

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: 'dark',
    serviceWorkers: 'block',
  });
  const mobile = await mobileContext.newPage();
  await mobile.goto(`${origin}/demo`, { waitUntil: 'networkidle' });
  const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const severe = (await new AxeBuilder({ page: mobile }).analyze()).violations
    .filter((item) => ['serious', 'critical'].includes(item.impact ?? ''));
  const smallTargets = await mobile.locator('a,button,input,textarea,summary,[tabindex]').evaluateAll((elements) => elements
    .filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
    })
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return { label: (element.getAttribute('aria-label') || element.textContent || '').trim().slice(0, 80), width: rect.width, height: rect.height };
    })
    .filter((target) => target.width < 44 || target.height < 44));
  assert(overflow <= 0, `mobile horizontal overflow: ${overflow}px`);
  assert(severe.length === 0, `mobile Axe findings: ${severe.map((item) => item.id).join(', ')}`);
  assert(smallTargets.length === 0, `mobile targets below 44px: ${JSON.stringify(smallTargets)}`);
  await mobile.screenshot({ path: `${evidence}/live-demo-mobile-390-dark.png`, fullPage: true });
  const missingResponse = await mobile.goto(`${origin}/definitely-missing-polish-4`, { waitUntil: 'networkidle' });
  assert(missingResponse?.status() === 404, 'missing route did not return HTTP 404');
  assert(await mobile.getByRole('heading', { level: 1, name: 'Page not found.' }).isVisible(), 'designed 404 heading missing');
  const darkThemeAction = mobile.getByRole('button', { name: 'Use dark theme' });
  if (await darkThemeAction.isVisible()) await darkThemeAction.click();
  await mobile.screenshot({ path: `${evidence}/live-404-mobile-390-dark.png`, fullPage: true });
  report.mobile = { overflowPx: overflow, axeSeriousCritical: 0, targetsBelow44px: 0, designed404: 'PASS' };
  await mobileContext.close();

  await writeFile(`${evidence}/live-qa.json`, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
