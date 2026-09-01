# Handoff — polish round 2

## Status

**PASS.** Every finding in `.factory/review-1.md` and `.factory/review-2.md` is closed. The repaired static site is deployed at <https://knowledge-boundary-map.sociobot.in>. No known acceptance gap remains.

The repair keeps the paper-cut explanation-map identity. It fixes demo exit and theme isolation, makes all remaining labels literal, strengthens partial claim tests, registers the theme privacy promise, completes route and metadata coverage, and removes the last storage jargon.

## What changed

- The demo home wordmark opens `/`, discards demo map and theme data, restores the real theme and map, and focuses the landing h1.
- Direct `/?demo=1` and `/demo` entry show the completed causal-inference sample, banner, reset, and safe exit.
- `free-workshop` now claims only the tested 12-claim limit.
- The self-assessment test proves saved status, explanation, next question, reload, and history.
- New `theme-storage` claim proves separate real/demo choices and demo cleanup.
- First-screen outcome text, task labels, Source on GitHub, 404 wording, legal copy, and README wording are plain and consistent.
- The standalone 404 now meets dark-theme contrast.
- Route tests cover titles, metadata, real URLs, browser history, heading focus, legal links, and 404 behavior.

The complete finding-to-change-to-evidence map is in `.factory/polish-2.md`.

## Verification

From clean clone `/tmp/kbm-polish-2-clean.JH4EhW`:

```text
npm ci                                      PASS — 59 packages, 0 vulnerabilities
npm test                                    PASS — 10/10
npm run lint                                PASS
npm run build                               PASS — dist/index.html produced
13 claims.json commands, run separately     PASS — 13/13
npm run test:e2e                            PASS — 22/22
npm run test:response-policy                PASS
```

Post-deploy:

```text
verify-url.sh live home                     PASS — no console errors; title/lang/h1/main/alt/buttons pass
PLAYWRIGHT_BASE_URL=<live> npm run test:e2e PASS — 22/22
Axe page/viewport/theme matrix              PASS — 20/20, zero serious or critical issues
Live Lighthouse home                       100 performance / 100 accessibility / 100 best practices / 100 SEO
Live Lighthouse demo                       100 performance / 100 accessibility / 100 best practices / 100 SEO
Live route/status crawl                     PASS — product routes 200; unknown route 404
Live security headers                       PASS
Live/local JS and CSS hashes                MATCH
```

Performance remains well inside the static product budgets: initial JS is 12.30 kB gzip, CSS is 5.17 kB gzip, and the hero AVIF is 74.11 kB. Live LCP was 1.4 s on home and 1.1 s on demo; CLS was 0 on both.

Evidence is under `.factory/qa-artifacts/` with the `polish-2-` prefix. Key files include the first-screen mobile/desktop images, demo mobile image, dark 404 image, local/live Lighthouse JSON, and local/live URL-verifier reports.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:e2e
npm run test:response-policy
```

To verify the deployed build:

```sh
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
```

## Deployment

Build output is `dist/`. The production upload targeted only the existing `sf-knowledge-boundary-map` Static Web App. No shared service, database, vault, DNS record, or unrelated resource was read or changed.

## Known gaps and next steps

None within the product brief or review scope. There is no backend, account, payment, runtime model, or sync surface in this release.
