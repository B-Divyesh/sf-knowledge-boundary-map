import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const origin = 'https://knowledge-boundary-map.sociobot.in';
const evidence = '.factory/evidence-3';
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const browser = await chromium.launch({ headless: true });
const report = { origin, checkedAt: new Date().toISOString() };

try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: 'light',
    serviceWorkers: 'allow',
  });
  const page = await context.newPage();
  const errors = [];
  const requestOrigins = new Set();
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => requestOrigins.add(new URL(request.url()).origin));

  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  assert(await page.getByRole('heading', { level: 1, name: 'Test what you can explain.' }).isVisible(), 'cold headline is missing');
  assert(await page.getByText('For self-learners who want to separate recognition from an explanation they can produce.').isVisible(), 'cold audience sentence is missing');
  assert(await page.getByRole('button', { name: 'Try it with sample data' }).isVisible(), 'cold sample action is missing');
  assert(await page.getByText('Opens a completed causal-inference map.').isVisible(), 'sample outcome is missing');
  for (const fact of ['Private: stored in this browser.', 'Offline: reloads after your first visit.', 'Free: up to 12 claims per map.']) {
    assert(await page.getByText(fact).isVisible(), `first-screen fact is missing: ${fact}`);
  }
  assert((await page.getByText('Built by Param Factory · build polish-3').count()) === 1, 'polish-3 build label is missing');
  await page.screenshot({ path: `${evidence}/live-home-mobile-390.png`, fullPage: true });

  await page.evaluate(() => localStorage.setItem('kbm:map:v1', JSON.stringify({ version: 1, topic: 'REAL LIVE MARKER', claims: [] })));
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await page.waitForURL(`${origin}/demo`);
  assert(await page.getByLabel('Demo controls').isVisible(), 'demo banner is missing');
  assert(await page.getByRole('button', { name: 'Reset demo' }).isVisible(), 'Reset demo is missing');
  assert(await page.getByRole('button', { name: 'Start for real' }).isVisible(), 'Start for real is missing');
  assert(await page.locator('[data-claim-id]').count() === 3, 'completed demo does not have three claims');
  const summary = await page.getByLabel('Self-assessed boundary summary').innerText();
  for (const status of ['Can explain', 'Recognize only', 'Blocked']) assert(summary.includes(status), `demo summary is missing ${status}`);
  const question = page.getByText('Explain why random assignment balances known and unknown confounders only on average.');
  assert(await question.isVisible(), 'demo next question is missing');
  assert((await question.boundingBox())?.y < 844, 'demo next question is not in the first mobile viewport');
  const beforeReset = await page.locator('[data-claim-id]').first().getAttribute('data-claim-id');
  const stored = await page.evaluate(() => ({ real: localStorage.getItem('kbm:map:v1'), demo: localStorage.getItem('demo:kbm:map:v1') }));
  assert(stored.real?.includes('REAL LIVE MARKER'), 'demo changed the real map');
  assert(stored.demo?.includes('Causal inference basics'), 'demo did not use its own browser key');
  await page.waitForTimeout(6100);
  await page.screenshot({ path: `${evidence}/live-demo-first-screen-mobile-390.png` });

  await page.getByRole('button', { name: 'Reset demo' }).click();
  const afterReset = await page.locator('[data-claim-id]').first().getAttribute('data-claim-id');
  assert(beforeReset !== afterReset, 'Reset demo did not replace the sample');
  await page.getByRole('link', { name: 'Knowledge Boundary Map home' }).click();
  await page.waitForURL(`${origin}/`);
  assert(await page.getByRole('heading', { level: 1, name: 'Test what you can explain.' }).evaluate((element) => element === document.activeElement), 'product-name exit did not focus the landing heading');
  const afterExit = await page.evaluate(() => ({ real: localStorage.getItem('kbm:map:v1'), demoMap: localStorage.getItem('demo:kbm:map:v1'), demoTheme: localStorage.getItem('demo:kbm:theme') }));
  assert(afterExit.real?.includes('REAL LIVE MARKER'), 'product-name exit did not preserve the real map');
  assert(afterExit.demoMap === null && afterExit.demoTheme === null, 'product-name exit did not discard demo changes');

  await page.goto(`${origin}/?demo=1`, { waitUntil: 'networkidle' });
  assert(await page.getByLabel('Demo controls').isVisible(), '?demo=1 did not enter demo mode');
  assert(await page.locator('[data-claim-id]').count() === 3, '?demo=1 did not open the sample');
  assert([...requestOrigins].every((requestOrigin) => requestOrigin === origin), `unexpected request origin: ${[...requestOrigins].join(', ')}`);
  assert(errors.length === 0, `cold/demo browser errors: ${errors.join(' | ')}`);
  report.coldDemo = { errors: errors.length, requestOrigins: [...requestOrigins], realDemoIsolation: 'PASS', reset: 'PASS', productNameExit: 'PASS', queryEntry: 'PASS' };
  await context.close();

  const routes = [
    { path: '/', status: 200, title: 'Knowledge Boundary Map — test what you can explain', h1: 'Test what you can explain.' },
    { path: '/demo', status: 200, title: 'Demo — Knowledge Boundary Map', h1: 'Your explanation map' },
    { path: '/privacy', status: 200, title: 'Privacy — Knowledge Boundary Map', h1: 'Privacy' },
    { path: '/terms', status: 200, title: 'Terms — Knowledge Boundary Map', h1: 'Terms' },
    { path: '/missing-polish-3', status: 404, title: 'Page not found — Knowledge Boundary Map', h1: 'Page not found.' },
  ];
  const matrix = [];
  for (const theme of ['light', 'dark']) {
    for (const viewport of [{ width: 390, height: 844 }, { width: 1366, height: 900 }]) {
      const matrixContext = await browser.newContext({ viewport, colorScheme: theme });
      await matrixContext.addInitScript((savedTheme) => {
        localStorage.setItem('kbm:theme', savedTheme);
        localStorage.setItem('demo:kbm:theme', savedTheme);
      }, theme);
      const matrixPage = await matrixContext.newPage();
      for (const route of routes) {
        const routeErrors = [];
        const consoleListener = (message) => {
          if (message.type() === 'error') routeErrors.push(message.text());
        };
        matrixPage.on('console', consoleListener);
        const response = await matrixPage.goto(`${origin}${route.path}`, { waitUntil: 'networkidle' });
        assert(response?.status() === route.status, `${route.path} returned ${response?.status()} instead of ${route.status}`);
        assert((await matrixPage.title()) === route.title, `${route.path} has the wrong title`);
        assert(await matrixPage.getByRole('heading', { level: 1, name: route.h1 }).isVisible(), `${route.path} has the wrong h1`);
        assert(await matrixPage.locator('main').count() === 1, `${route.path} has no single main landmark`);
        assert(await matrixPage.locator('h1').count() === 1, `${route.path} does not have exactly one h1`);
        const axe = await new AxeBuilder({ page: matrixPage }).analyze();
        const severe = axe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
        const overflow = await matrixPage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        const unexpectedErrors = route.status === 404
          ? routeErrors.filter((message) => !/Failed to load resource:.*status of 404/i.test(message))
          : routeErrors;
        assert(severe.length === 0, `${route.path} has serious/critical Axe findings: ${severe.map((item) => item.id).join(', ')}`);
        assert(overflow <= 0, `${route.path} overflows by ${overflow}px at ${viewport.width}px`);
        assert(unexpectedErrors.length === 0, `${route.path} browser errors: ${unexpectedErrors.join(' | ')}`);
        matrix.push({ theme, width: viewport.width, path: route.path, status: route.status, axeSeriousCritical: severe.length, overflowPx: overflow, errors: unexpectedErrors.length });
        matrixPage.off('console', consoleListener);
        if (theme === 'dark' && viewport.width === 390 && route.status === 404) {
          await matrixPage.screenshot({ path: `${evidence}/live-404-mobile-dark.png`, fullPage: true });
        }
      }
      await matrixContext.close();
    }
  }
  report.routeMatrix = matrix;

  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(`${origin}/demo`, { waitUntil: 'networkidle' });
  const moving = await reducedPage.locator('*').evaluateAll((elements) => elements.filter((element) => {
    const style = getComputedStyle(element);
    return style.transitionDuration.split(',').some((value) => parseFloat(value) > 0.001)
      || style.animationDuration.split(',').some((value) => parseFloat(value) > 0.001);
  }).length);
  assert(moving === 0, `${moving} elements retain material motion when reduced motion is requested`);
  report.reducedMotion = { elementsWithMaterialDuration: moving };
  await reducedContext.close();

  writeFileSync(`${evidence}/live-qa.json`, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
