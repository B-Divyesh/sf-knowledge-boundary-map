import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('static hosting response policy', () => {
  it('@finding:avif-mime declares the AVIF hero MIME type for Azure Static Web Apps', async () => {
    const config = JSON.parse(await readFile(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8')) as { mimeTypes?: Record<string, string> };
    expect(config.mimeTypes?.['.avif']).toBe('image/avif');
  });

  it('@finding:real-404 uses explicit application rewrites and preserves an HTTP 404 for unknown paths', async () => {
    const config = JSON.parse(await readFile(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8')) as {
      navigationFallback?: unknown;
      routes?: Array<{ route?: string; rewrite?: string }>;
      responseOverrides?: Record<string, { rewrite?: string; statusCode?: number }>;
    };
    expect(config.navigationFallback).toBeUndefined();
    expect(config.routes?.filter((route) => route.rewrite === '/index.html').map((route) => route.route)).toEqual(['/demo', '/privacy', '/terms', '/upgrade']);
    expect(config.responseOverrides?.['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
    await expect(readFile(new URL('../public/404.html', import.meta.url), 'utf8')).resolves.toContain('<h1>That page is not in this map.</h1>');
  });
});
