import { defineConfig } from '@playwright/test';

const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: { baseURL: externalBaseURL ?? 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  webServer: externalBaseURL ? undefined : { command: 'npm run preview', url: 'http://127.0.0.1:4173', reuseExistingServer: true },
});
