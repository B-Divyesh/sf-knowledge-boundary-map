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

test('supports legal routes and has no serious accessibility violations', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('works at a 390px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pin your first claim' })).toBeVisible();
});
