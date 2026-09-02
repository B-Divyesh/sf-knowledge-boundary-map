import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = 'https://knowledge-boundary-map.sociobot.in';
const output = '.factory/evidence-5';
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = { checkedAt: new Date().toISOString(), origin, routes: [], matrix: [], links: [], demo: {} };

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', serviceWorkers: 'allow' });
  const page = await context.newPage();
  const requests = [];
  const errors = [];
  page.on('request', (request) => requests.push(request.url()));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  const expected = [
    ['/', 200, 'Knowledge Boundary Map — test what you can explain', 'Test what you can explain.'],
    ['/demo', 200, 'Demo — Knowledge Boundary Map', 'Your explanation map'],
    ['/privacy', 200, 'Privacy — Knowledge Boundary Map', 'Privacy'],
    ['/terms', 200, 'Terms — Knowledge Boundary Map', 'Terms'],
    ['/missing-review-5', 404, 'Page not found — Knowledge Boundary Map', 'Page not found.'],
  ];

  for (const [path, status, title, heading] of expected) {
    const response = await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
    assert(response?.status() === status, `${path}: expected ${status}, got ${response?.status()}`);
    assert(await page.title() === title, `${path}: title mismatch`);
    assert(await page.locator('html').getAttribute('lang') === 'en', `${path}: language missing`);
    assert(await page.locator('main h1').count() === 1, `${path}: h1 count`);
    assert(await page.getByRole('heading', { level: 1, name: heading }).isVisible(), `${path}: expected h1 missing`);
    assert(await page.locator('header').count() === 1 && await page.locator('main').count() === 1 && await page.locator('footer').count() === 1, `${path}: landmarks missing`);
    assert(Boolean(await page.locator('meta[name="description"]').getAttribute('content')), `${path}: description missing`);
    assert(Boolean(await page.locator('link[rel="canonical"]').getAttribute('href')), `${path}: canonical missing`);
    assert(Boolean(await page.locator('meta[property="og:title"]').getAttribute('content')), `${path}: OG title missing`);
    assert(Boolean(await page.locator('meta[property="og:image"]').getAttribute('content')), `${path}: OG image missing`);
    assert(Boolean(await page.locator('link[rel="icon"]').getAttribute('href')), `${path}: favicon missing`);
    assert(await page.getByRole('link', { name: 'Knowledge Boundary Map home' }).isVisible(), `${path}: home link missing`);
    assert(await page.getByRole('link', { name: 'Privacy', exact: true }).count() >= 1, `${path}: Privacy missing`);
    assert(await page.getByRole('link', { name: 'Terms', exact: true }).count() >= 1, `${path}: Terms missing`);
    report.routes.push({ path, status, title, heading, result: 'PASS' });
  }

  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('kbm:map:v1', JSON.stringify({ version: 1, topic: 'REVIEW 5 REAL MARKER', claims: [] }));
    localStorage.setItem('kbm:theme', 'dark');
  });
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await page.waitForURL(`${origin}/demo`);
  assert(await page.getByLabel('Demo controls').isVisible(), 'demo banner missing');
  assert(await page.getByText('Demo — sample data, nothing is saved to your real map.').isVisible(), 'demo isolation wording missing');
  assert(await page.locator('[data-claim-id]').count() === 3, 'demo does not show three claims');
  const ledger = (await page.getByRole('list', { name: 'Self-assessed boundary summary' }).innerText()).replace(/\s/g, '');
  assert(ledger.includes('1Canexplain1Recognizeonly1Blocked'), 'demo mixed statuses missing');
  assert(await page.getByText('Explain why random assignment balances known and unknown confounders only on average.').isVisible(), 'demo next question missing');
  await page.screenshot({ path: `${output}/live-demo-desktop.png`, fullPage: false });
  const beforeReset = await page.locator('[data-claim-id]').first().getAttribute('data-claim-id');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  const afterReset = await page.locator('[data-claim-id]').first().getAttribute('data-claim-id');
  assert(beforeReset !== afterReset, 'Reset demo did not replace sample ids');
  const duringDemo = await page.evaluate(() => ({
    realMap: localStorage.getItem('kbm:map:v1'),
    demoMap: localStorage.getItem('demo:kbm:map:v1'),
    realTheme: localStorage.getItem('kbm:theme'),
  }));
  assert(duringDemo.realMap?.includes('REVIEW 5 REAL MARKER'), 'demo changed real map');
  assert(duringDemo.demoMap?.includes('Causal inference basics'), 'demo map not isolated');
  assert(duringDemo.realTheme === 'dark', 'demo changed real theme');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.waitForURL(origin + '/');
  const afterExit = await page.evaluate(() => ({
    realMap: localStorage.getItem('kbm:map:v1'),
    demoMap: localStorage.getItem('demo:kbm:map:v1'),
    demoTheme: localStorage.getItem('demo:kbm:theme'),
  }));
  assert(afterExit.realMap?.includes('REVIEW 5 REAL MARKER'), 'demo exit changed real data');
  assert(afterExit.demoMap === null && afterExit.demoTheme === null, 'demo exit retained demo data');
  assert(await page.locator('main h1').evaluate((element) => element === document.activeElement), 'demo exit did not focus h1');
  report.demo = { completedSample: 'PASS', reset: 'PASS', mapIsolation: 'PASS', themeIsolation: 'PASS', exitCleanup: 'PASS', exitFocus: 'PASS' };

  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await page.waitForURL(`${origin}/privacy`);
  assert(await page.locator('main h1').evaluate((element) => element === document.activeElement), 'route navigation did not focus privacy h1');
  await page.goBack({ waitUntil: 'networkidle' });
  assert(page.url() === `${origin}/`, 'Back did not return home');
  assert(await page.getByRole('heading', { level: 1, name: 'Test what you can explain.' }).isVisible(), 'Back did not restore home');
  report.history = 'PASS';

  const discovered = new Set();
  for (const path of ['/', '/demo', '/privacy', '/terms', '/missing-review-5']) {
    await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
    for (const href of await page.locator('a[href]').evaluateAll((anchors) => anchors.map((anchor) => anchor.href))) discovered.add(href);
  }
  for (const href of [...discovered].sort()) {
    if (href.startsWith('mailto:') || href.includes('#main')) {
      report.links.push({ href, status: 'allowed' });
      continue;
    }
    const response = await fetch(href, { redirect: 'follow' });
    assert(response.ok, `dead link ${href}: ${response.status}`);
    report.links.push({ href, status: response.status });
  }

  const unexpectedRequests = requests.filter((url) => new URL(url).origin !== origin);
  assert(unexpectedRequests.length === 0, `third-party runtime requests: ${unexpectedRequests.join(', ')}`);
  const unexpectedErrors = errors.filter((error) => !/Failed to load resource: the server responded with a status of 404/.test(error));
  assert(unexpectedErrors.length === 0, `console errors: ${unexpectedErrors.join(' | ')}`);
  report.requests = { origins: [...new Set(requests.map((url) => new URL(url).origin))], unexpected: 0 };
  report.consoleErrors = 0;
  await context.close();

  for (const viewport of [{ name: 'mobile', width: 390, height: 844 }, { name: 'desktop', width: 1366, height: 900 }]) {
    for (const colorScheme of ['light', 'dark']) {
      for (const path of ['/', '/demo', '/privacy', '/terms', '/missing-review-5']) {
        const matrixContext = await browser.newContext({ viewport, colorScheme, serviceWorkers: 'block', reducedMotion: 'reduce' });
        const matrixPage = await matrixContext.newPage();
        const response = await matrixPage.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
        const violations = (await new AxeBuilder({ page: matrixPage }).analyze()).violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''));
        const overflow = await matrixPage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        const smallTargets = await matrixPage.locator('a,button,input,textarea,summary,[tabindex]').evaluateAll((elements) => elements.filter((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && (rect.width < 44 || rect.height < 44);
        }).map((element) => ({ label: element.getAttribute('aria-label') || element.textContent?.trim(), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height })));
        assert(violations.length === 0, `${viewport.name}/${colorScheme}${path}: Axe ${violations.map((item) => item.id)}`);
        assert(overflow <= 0, `${viewport.name}/${colorScheme}${path}: ${overflow}px overflow`);
        assert(smallTargets.length === 0, `${viewport.name}/${colorScheme}${path}: small targets ${JSON.stringify(smallTargets)}`);
        report.matrix.push({ viewport: viewport.name, colorScheme, path, status: response?.status(), axeSeriousCritical: 0, overflowPx: overflow, targetsBelow44: 0 });
        if (viewport.name === 'mobile' && colorScheme === 'dark' && path === '/demo') await matrixPage.screenshot({ path: `${output}/live-demo-mobile-390-dark.png`, fullPage: false });
        if (viewport.name === 'mobile' && colorScheme === 'dark' && path === '/missing-review-5') await matrixPage.screenshot({ path: `${output}/live-404-mobile-390-dark.png`, fullPage: false });
        await matrixContext.close();
      }
    }
  }
} finally {
  await browser.close();
}

await writeFile(`${output}/live-audit.json`, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ routes: report.routes.length, links: report.links.length, matrix: report.matrix.length, demo: report.demo, requests: report.requests }, null, 2));
