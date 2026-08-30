import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('static hosting response policy', () => {
  it('@finding:avif-mime declares the AVIF hero MIME type for Azure Static Web Apps', async () => {
    const config = JSON.parse(await readFile(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8')) as { mimeTypes?: Record<string, string> };
    expect(config.mimeTypes?.['.avif']).toBe('image/avif');
  });
});
