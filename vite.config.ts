import { defineConfig } from 'vitest/config';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

function versionServiceWorker() {
  return {
    name: 'version-service-worker',
    apply: 'build' as const,
    async closeBundle() {
      const indexPath = new URL('./dist/index.html', import.meta.url);
      const workerPath = new URL('./dist/sw.js', import.meta.url);
      const markup = await readFile(indexPath, 'utf8');
      const assets = [...markup.matchAll(/(?:href|src)="(\/assets\/index-[^"]+)"/g)].map((match) => match[1]).sort();
      if (!assets.length) throw new Error('Could not derive the service-worker version from built assets.');
      const worker = await readFile(workerPath, 'utf8');
      if (!worker.includes('__KBM_BUILD_ID__')) throw new Error('Service-worker build placeholder is missing.');
      const shellFiles = [
        'index.html', 'sw.js', 'manifest.webmanifest', 'favicon.svg',
        'assets/boundary-diorama.avif', 'assets/boundary-diorama.webp',
        ...assets.map((asset) => asset.slice(1)),
      ];
      const buildHash = createHash('sha256');
      for (const file of shellFiles) {
        buildHash.update(file);
        buildHash.update(await readFile(new URL(`./dist/${file}`, import.meta.url)));
      }
      const buildId = buildHash.digest('hex').slice(0, 12);
      await writeFile(workerPath, worker.replaceAll('__KBM_BUILD_ID__', buildId));
    },
  };
}

export default defineConfig({
  plugins: [versionServiceWorker()],
  test: {
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: true,
  },
});
