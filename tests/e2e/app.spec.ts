import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

const openDemo = async (page: import('@playwright/test').Page) => {
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
};

test('loads with an understandable first screen and no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await expect(page.getByRole('heading', { level: 1, name: 'Test what you can explain.' })).toBeVisible();
  await expect(page.getByText('For self-learners who want to separate recognition from an explanation they can produce.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try it with sample data' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('@claim:demo-sandbox opens a completed mixed-status sample without touching the real map', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('kbm:map:v1', JSON.stringify({ version: 1, topic: 'REAL MARKER', claims: [] })));
  await openDemo(page);
  await expect(page.getByLabel('Demo controls')).toContainText('sample data, nothing is saved to your real map');
  await expect(page.getByRole('list', { name: 'Self-assessed boundary summary' })).toContainText('1Can explain1Recognize only1Blocked');
  await expect(page.getByText('Explain why random assignment balances known and unknown confounders only on average.')).toBeVisible();
  const keys = await page.evaluate(() => ({ real: localStorage.getItem('kbm:map:v1'), demo: localStorage.getItem('demo:kbm:map:v1') }));
  expect(keys.real).toContain('REAL MARKER');
  expect(JSON.parse(keys.demo!).claims.map((claim: { status: string }) => claim.status)).toEqual(['explain', 'recognize', 'blocked']);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.getByRole('button', { name: 'Start for real' }).click();
  expect(await page.evaluate(() => localStorage.getItem('demo:kbm:map:v1'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('kbm:map:v1'))).toContain('REAL MARKER');
});

test('@claim:local-only keeps map work on the product origin', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ serviceWorkers: 'allow' });
  const page = await context.newPage();
  const origins = new Set<string>();
  page.on('request', request => origins.add(new URL(request.url()).origin));
  try {
    await page.goto(baseURL!);
    await expect(page.getByText('There are no accounts, analytics, or trackers.')).toBeVisible();
    await openDemo(page);
    await page.getByRole('button', { name: /^Blocked Random assignment/ }).click();
    await page.getByLabel('Teach it back from memory *').fill('Random assignment removes systematic selection into groups.');
    await page.getByLabel('Counterexample or boundary').fill('Small samples can remain unbalanced by chance.');
    await page.getByLabel('Can explain').check();
    await page.getByLabel('Next question *').fill('Compare random assignment with matching.');
    await page.getByRole('button', { name: 'Save self-assessment' }).click();
    expect([...origins]).toEqual([new URL(baseURL!).origin]);
  } finally { await context.close(); }
});

test('@claim:offline-reload reloads the demo after a first visit', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ serviceWorkers: 'allow' });
  const page = await context.newPage();
  try {
    await page.goto(`${baseURL}/demo`);
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) await new Promise<void>(resolve => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
    });
    await page.reload();
    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1, name: 'Your explanation map' })).toBeVisible();
    await expect(page.getByText('You’re offline. Your map still works and stays on this device.')).toBeVisible();
  } finally { await context.close(); }
});

test('@claim:csv-export exports every completed sample claim', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: 'Export' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download CSV' }).click();
  const csv = await readFile((await (await downloadPromise).path())!, 'utf8');
  expect(csv.trim().split('\n')).toHaveLength(4);
  expect(csv).toContain('"blocked"');
  expect(csv).toContain('Random assignment reduces systematic confounding');
});

test('@claim:json-restore restores a saved counterexample and next question', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: 'Export' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download JSON' }).click();
  const exported = await readFile((await (await downloadPromise).path())!, 'utf8');
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Export' }).click();
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#import-file').setInputFiles({ name: 'map.json', mimeType: 'application/json', buffer: Buffer.from(exported) });
  await page.getByRole('button', { name: /^Can explain A correlation/ }).click();
  await expect(page.getByLabel('Counterexample or boundary')).toHaveValue(/Ice-cream sales/);
  await expect(page.getByLabel('Next question *')).toHaveValue(/Draw a causal graph/);
});

test('@claim:keyboard-dialog opens a claim with Enter and restores focus after Escape', async ({ page }) => {
  await openDemo(page);
  const first = page.getByRole('button', { name: /^Can explain A correlation/ });
  await first.focus();
  await page.keyboard.press('ArrowRight');
  const second = page.getByRole('button', { name: /^Recognize only A confounder/ });
  await expect(second).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Start 90 seconds' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(second).toBeFocused();
});

test('@claim:free-workshop allows twelve claims and shows the clear map limit', async ({ page }) => {
  await page.evaluate(() => {
    const now = new Date().toISOString();
    localStorage.setItem('kbm:map:v1', JSON.stringify({ version: 1, topic: 'Limit', claims: Array.from({ length: 12 }, (_, index) => ({ id: `claim-${index}`, title: `Claim ${index + 1}`, context: '', prerequisiteIds: [], status: 'untested', teachBack: '', counterexample: '', nextProbe: '', createdAt: now, updatedAt: now, rehearsals: [] })) }));
  });
  await page.reload();
  await page.keyboard.press('n');
  await expect(page.getByText('This map holds up to 12 claims.')).toBeVisible();
});

test('@claim:self-assessment-label states that results are not an intelligence score', async ({ page }) => {
  await expect(page.getByText('It records your self-assessment. It does not fact-check claims or measure intelligence.')).toBeVisible();
  await openDemo(page);
  await page.getByRole('button', { name: /^Can explain A correlation/ }).click();
  await expect(page.getByText('This is a self-assessment, not an objective score.')).toBeVisible();
});

test('@claim:prerequisites keeps selected prerequisite links on a saved claim', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: 'Pin a claim' }).click();
  await page.getByLabel('Claim *').fill('An observational study cannot guarantee comparable groups');
  await page.getByLabel('A confounder can affect both measured variables').check();
  await page.getByRole('button', { name: 'Pin this claim' }).click();
  await expect(page.getByRole('button', { name: /An observational study/ })).toContainText('Needs: A confounder can affect both measured variables');
  await page.reload();
  await expect(page.getByRole('button', { name: /An observational study/ })).toContainText('Needs: A confounder can affect both measured variables');
});

test('@claim:teach-back-timer displays and starts the 90-second timer', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: /^Can explain A correlation/ }).click();
  await expect(page.getByRole('timer')).toHaveText('01:30');
  await page.getByRole('button', { name: 'Start 90 seconds' }).click();
  await expect(page.getByRole('button', { name: 'Pause timer' })).toBeVisible();
  await expect.poll(async () => page.getByRole('timer').textContent()).not.toBe('01:30');
});

test('@claim:counterexample-capture saves a boundary with an explain assessment', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: /^Recognize only A confounder/ }).click();
  await page.getByLabel('Teach it back from memory *').fill('Temperature affects both ice-cream purchases and swimming.');
  await page.getByLabel('Counterexample or boundary').fill('A randomized trial breaks the confounding path.');
  await page.getByLabel('Can explain').check();
  await page.getByLabel('Next question *').fill('Draw the path before and after random assignment.');
  await page.getByRole('button', { name: 'Save self-assessment' }).click();
  await page.getByRole('button', { name: /^Can explain A confounder/ }).click();
  await expect(page.getByLabel('Counterexample or boundary')).toHaveValue('A randomized trial breaks the confounding path.');
});

test('@claim:next-question picks a blocked claim before recognize or untested claims', async ({ page }) => {
  await openDemo(page);
  await expect(page.getByRole('heading', { level: 2, name: 'Random assignment reduces systematic confounding' })).toBeVisible();
  await expect(page.getByText('Explain why random assignment balances known and unknown confounders only on average.')).toBeVisible();
});

test('routes, 404, mobile layout, and accessibility work', async ({ page }) => {
  for (const [path, heading] of [['/privacy', 'Privacy'], ['/terms', 'Terms']] as const) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await expect(page.getByText('Boundary Map', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Random assignment reduces systematic confounding' })).toBeVisible();
  await page.goto('/definitely-missing');
  await expect(page.getByRole('heading', { level: 1, name: 'That page is not in this map.' })).toBeVisible();
});
