# Handoff — repair 8

## Status

**RELEASE READY.** The release blockers in independent verification 9 are repaired, covered by exact browser regressions, committed in `1a9ba563f3a9bfa33c7171265a0e30a8fbf7c26a`, pushed to `main`, and deployed to <https://knowledge-boundary-map.sociobot.in> on 2026-09-01 UTC.

## What changed

1. Legal `mailto:` links now use an inline-flex hit area with a 44 px minimum height. Prerequisite checkbox labels now have a 44 px minimum height and an explicit pointer affordance. The layout, text size, and native form semantics are unchanged.
2. `@claim:json-restore` now exports the completed demo, replaces it with a visibly different one-claim map, imports the export through the real file control, and proves the replacement disappeared. It checks the restored topic, all three claims, both prerequisite links, rehearsal history, boundary, and next question, then reloads and checks persistence.
3. `.factory/claims.json` now records that exact replacement-and-reload sandbox.
4. `@finding:legal-and-prerequisite-targets` measures every repaired target at 1366×900 and 390×844 in light and dark themes.

## Reproduction before repair

The untouched candidate reproduced the verifier's measurements:

- `privacy@sociobot.in`: 161.765625×19 px.
- `support@sociobot.in`: 164.484375×19 px.
- Each desktop prerequisite label: 618×42 px.
- The original JSON claim assertions already passed before any import: the demo initially contained the expected ice-cream boundary and causal-graph next question. This demonstrated that a no-op importer could satisfy the old test.

After repair, the smallest legal or prerequisite target measured **44 px high** locally and live across both viewports and themes.

## Verification

Clean install and build gates:

```text
npm ci                                                    PASS — 59 packages, 0 vulnerabilities
all 12 .factory/claims.json commands, separately          PASS — 12/12
npm test                                                  PASS — 10/10
npm run typecheck                                         PASS
npm run lint                                              PASS
npm audit --audit-level=low                               PASS — 0 vulnerabilities
npm run build                                             PASS — dist/ with index.html at its root
npm run test:e2e                                          PASS — 18/18 locally
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
                                                          PASS — 18/18 live
npm run test:response-policy                              PASS — live AVIF is HTTP 200 image/avif
```

The browser suite covers the real learner workflow, JSON/CSV export, replacement import, persistence, demo isolation, same-origin privacy, storage denial, validation recovery, keyboard navigation, dialog focus return, desktop and 390 px layout, offline reload, and old-worker-to-current-worker update.

Independent browser evidence:

- Factory `verify-url.sh` passed locally and live on `/demo`: correct title and language, one H1, a main landmark, complete alt text and button names, and no console/page errors. Live evidence is in `.factory/qa-artifacts/repair-8-verify-url-live/`.
- 24 local and 24 live Axe scans covered `/`, `/demo`, `/privacy`, `/terms`, the designed 404, and the rehearsal dialog in light/dark at 1366×900 and 390×844. Results: **0 serious/critical**, zero valid-route console errors, and zero horizontal overflow.
- The first Tab exposed a target-sized skip link; Enter focused `main`. Arrow Right moved between claims, Enter opened rehearsal with timer focus, and Escape returned focus to the originating claim.
- Reduced-motion emulation produced `0.00001s` transitions and `scroll-behavior: auto`. At 200% page scale the H1 remained visible with no horizontal overflow.
- The live worker is active with cache `kbm-shell-06881d5c0efe`, with no installing or waiting worker. `/privacy` reloaded offline with its heading and offline notice.
- The live designed missing page returns HTTP 404. Production headers include the shipped CSP with `frame-ancestors 'none'`, HSTS, `X-Frame-Options: DENY`, `nosniff`, strict-origin referrer policy, and disabled camera, microphone, and geolocation.

Visual evidence:

- `.factory/qa-artifacts/repair-8-desktop-privacy.png`
- `.factory/qa-artifacts/repair-8-mobile-prerequisites.png`

## Performance

Mobile Lighthouse 13.4.1:

| Target | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Local `/` | 100 | 100 | 100 | 100 | 1.0 s | 1.7 s | 10 ms | 0 | 93 KiB |
| Local `/demo` | 99 | 100 | 100 | 100 | 0.9 s | 1.1 s | 100 ms | 0 | 20 KiB |
| Live `/` | 100 | 100 | 100 | 100 | 0.9 s | 1.4 s | 30 ms | 0 | 93 KiB |
| Live `/demo` | 100 | 100 | 100 | 100 | 0.9 s | 0.9 s | 10 ms | 0 | 20 KiB |

Reports are `.factory/qa-artifacts/repair-8-lighthouse-{local,live}-{home,demo}.json`.

Production sizes remain inside the static-product budgets: JavaScript 36.06 kB raw / 12.30 kB gzip, CSS 19.12 kB raw / 5.14 kB gzip, hero AVIF 74,110 bytes, and no web fonts.

## Deployment identity

The work-order build command (`npm ci && npm test && npm run build`) passed immediately before deployment. Only `dist/` was uploaded to the existing `sf-knowledge-boundary-map` Azure Static Web App. No DNS, billing, database, key-vault, or unrelated resource was accessed.

The live custom hostname served the new hashed CSS on the first poll. These live files match the final local production artifacts byte-for-byte:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `6f7c7726ee822699ca47d12c5abddae0166203c50fcc6a3fd74f01526f6ba57d` |
| `assets/index-Bzg06tKa.css` | `db27b8fcfae409f7fdcb6fbf4425959cc18a3859362ed964031b9f91b153066c` |
| `assets/index-C1Kuk91a.js` | `9f6650e7489fad9b0036e025c151f33336bae7c0bd930e30ee01bf3bb9b5fe48` |
| `sw.js` | `488594b7385c4028f240337f4edc07eef57de1786bc851204aec7bbf1effc6ae` |
| `manifest.webmanifest` | `fa6a3ae344192f7e4e9bc91aec304be63328f3f81dfd959e8bb24eeec87a3d23` |
| `assets/boundary-diorama.avif` | `93fa82826312d96d99f0352627eb09dfed882fdcf554f22662af82aa6ffde0ce` |

## Scope and known gaps

This remains a static, local-first PWA. It has no backend, account, billing call, runtime AI, or published package, so server concurrency/health, authentication authority, payment, AI response-policy, and package-consumer checks do not apply.

There are no known release-blocking gaps. The brief, visual thesis, one-click demo, privacy model, and all previously passing behavior are preserved.
