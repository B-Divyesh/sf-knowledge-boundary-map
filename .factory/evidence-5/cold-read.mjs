import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = 'https://knowledge-boundary-map.sociobot.in';
const output = '.factory/evidence-5';
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const report = {};

try {
  for (const setup of [
    { name: 'mobile-390', viewport: { width: 390, height: 844 } },
    { name: 'desktop', viewport: { width: 1440, height: 900 } },
  ]) {
    const context = await browser.newContext({
      viewport: setup.viewport,
      colorScheme: 'light',
      serviceWorkers: 'block',
    });
    const page = await context.newPage();
    const requests = [];
    const errors = [];
    page.on('request', (request) => requests.push(request.url()));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(origin, { waitUntil: 'networkidle' });
    const visibleText = await page.locator('body').evaluate((body) => {
      const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
      const lines = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const element = node.parentElement;
        if (!element || !node.textContent?.trim()) continue;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        if (rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth && style.visibility !== 'hidden' && style.display !== 'none') {
          lines.push(node.textContent.trim());
        }
      }
      return [...new Set(lines)];
    });
    const controls = await page.locator('a,button,input,textarea,select').evaluateAll((elements) => elements
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          name: (element.getAttribute('aria-label') || element.textContent || element.getAttribute('placeholder') || '').trim(),
          tag: element.tagName.toLowerCase(),
          href: element instanceof HTMLAnchorElement ? element.href : null,
          top: Math.round(rect.top),
          bottom: Math.round(rect.bottom),
          visibleInViewport: rect.bottom > 0 && rect.top < innerHeight,
        };
      }));
    await page.screenshot({ path: `${output}/live-cold-${setup.name}.png` });
    report[setup.name] = {
      status: response?.status(),
      title: await page.title(),
      url: page.url(),
      viewport: setup.viewport,
      scrollY: await page.evaluate(() => scrollY),
      visibleText,
      controls,
      requestOrigins: [...new Set(requests.map((request) => new URL(request).origin))],
      errors,
    };
    await context.close();
  }
} finally {
  await browser.close();
}

await writeFile(`${output}/cold-read.json`, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
