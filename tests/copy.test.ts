import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const readProjectFile = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

describe('polish copy findings', () => {
  it('@finding:F-3-1 names the visible product-name control instead of using design jargon', async () => {
    const [readme, demoGuide] = await Promise.all([
      readProjectFile('README.md'),
      readProjectFile('.factory/demo.md'),
    ]);

    expect(readme).toContain('Select **Start for real** or the product name to discard those changes.');
    expect(demoGuide).toContain('Selecting the product name also discards the sample before opening `/`.');
    expect(`${readme}\n${demoGuide}`).not.toMatch(/home wordmark/i);
  });

  it('@finding:F-3-2 documents the visual design and image source in plain words', async () => {
    const readme = await readProjectFile('README.md');

    expect(readme).toContain('The visual design and source of its generated image are documented in `.factory/design.md`.');
    expect(readme).not.toMatch(/visual system|generated-image provenance/i);
  });

  it('@finding:F-3-3 keeps the copy audit aligned with the released footer and README', async () => {
    const [audit, source, notFound, readme] = await Promise.all([
      readProjectFile('.factory/copy-audit.md'),
      readProjectFile('src/main.ts'),
      readProjectFile('public/404.html'),
      readProjectFile('README.md'),
    ]);
    const buildId = source.match(/const BUILD_ID = .* \|\| '([^']+)'/)?.[1];

    expect(buildId).toBe('polish-4');
    expect(notFound).toContain(`build ${buildId}`);
    expect(audit).toContain(`build ${buildId}`);
    expect(audit).toContain('Select Start for real or the product name to discard those changes.');
    expect(audit).toContain('The visual design and source of its generated image are documented in `.factory/design.md`.');
    expect(readme).not.toMatch(/home wordmark|generated-image provenance/i);
  });

  it('@finding:F-4-1 removes the unnecessary no-purchase promise from public terms', async () => {
    const [source, claims] = await Promise.all([
      readProjectFile('src/main.ts'),
      readProjectFile('.factory/claims.json'),
    ]);

    expect(source).not.toContain('No purchase is offered in this release.');
    expect(claims).not.toContain('no-purchase');
  });

  it('keeps the catalog description verb-first and within 120 characters', async () => {
    const description = (await readProjectFile('.factory/catalog-description.txt')).trim();

    expect(description.length).toBeLessThanOrEqual(120);
    expect(description).toMatch(/^Map\b/);
  });
});
