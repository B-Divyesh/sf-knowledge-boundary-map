import { defineConfig } from '@playwright/test';

const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: { baseURL: externalBaseURL ?? 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  // Claim commands must work immediately after `npm ci`; Vite preview only serves
  // an existing dist directory, so build it as part of the self-contained server.
  webServer: externalBaseURL ? undefined : { command: 'npm run build && npm run preview', url: 'http://127.0.0.1:4173', reuseExistingServer: true },
});
