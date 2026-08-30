# Handoff — demo-banner accessibility repair

## Status

**PASS — deployed and live verified.** This repairs the release blocker recorded in independent verification 7 for base candidate `b4855438321bd9202c3687c6be3c28990666718d` and report commit `c006b9a853ada83dd36fc0da37f84cc378930006`.

## What changed

- Reproduced the original dark `/demo` defect before editing: Axe reported four serious `color-contrast` nodes at 1366 px and 390 px, and both demo actions were 36 px tall. The foreground was `#FFFDF5` on dark-mode lake `#74BCD2` (2.08:1 in the verifier’s evidence).
- Added theme-specific demo-banner foreground and focus tokens. Dark mode now uses drafting-table ink `#17231E` on `#74BCD2`; light mode keeps cream on its darker lake surface.
- Raised `.demo-action` from 36 px to the required 44 px minimum and made its hover/focus treatment inherit the accessible banner foreground.
- Added `@finding:demo-banner-dark-contrast-and-touch-targets`, which opens `/demo` in light and dark at 1366×900 and 390×844, measures each action, calculates the rendered contrast ratio, and runs Axe for serious/critical findings.
- Refreshed `.factory/copy-audit.md` to remove the stale non-rendered sentence and capture the exact landing `<main>` text.

## Exact repair evidence

The final deployed `/demo` was checked directly in Chromium after the byte-for-byte identity comparison:

| Theme | Viewport | Rendered banner contrast | Reset / Start height | Serious/critical Axe findings |
|---|---:|---:|---:|---:|
| Light | 1366×900 | 6.96:1 | 44 px / 44 px | 0 |
| Light | 390×844 | 6.96:1 | 44 px / 44 px | 0 |
| Dark | 1366×900 | 7.62:1 | 44 px / 44 px | 0 |
| Dark | 390×844 | 7.62:1 | 44 px / 44 px | 0 |

Completed from a clean `npm ci` install:

```text
npm ci                                           PASS — 59 packages, 0 vulnerabilities
npm audit --audit-level=low                      PASS — 0 vulnerabilities
npm test                                         PASS — 10 tests
npm run typecheck                                PASS
npm run lint                                     PASS
npm run build                                    PASS — dist/ with index.html
npm run test:e2e -- --grep @claim:               PASS — 12 claims
npm run test:e2e -- --grep @finding:demo-banner-dark-contrast-and-touch-targets
                                                  PASS — 1 regression test
npm run test:e2e                                 PASS — 16 tests
npm run test:response-policy                     PASS — live AVIF 200, image/avif
```

The browser suite exercises the desktop and 390 px layouts, Arrow/Enter/Escape dialog workflow, separate demo storage, same-origin privacy request recording, offline reload, and controlled service-worker update. Axe is exercised in the new four-case demo regression as well as the legal routes. This static web product has no package consumer or server API to verify.

The production build emitted 36.06 kB raw / 12.30 kB gzip JavaScript and 18.96 kB raw / 5.10 kB gzip CSS. The hero AVIF is 74,110 bytes.

## Deployment and post-deploy verification

Deployed `dist/` to the scoped Azure Static Web App `sf-knowledge-boundary-map` with `/opt/fleet/lib/deploy-static.sh knowledge-boundary-map dist`.

- Deployment id: `5bf109b4-67e4-4feb-bd15-574b2e14539f`; Azure reported success and <https://knowledge-boundary-map.sociobot.in> returned HTTPS 200.
- Live identity: local and live SHA-256 values matched for `index.html`, `assets/index-BWw1tdhd.js`, `assets/index-BFZs3qqv.css`, `sw.js`, and `manifest.webmanifest`.
- `/opt/fleet/lib/verify-url.sh https://knowledge-boundary-map.sociobot.in/demo …` passed: 763 ms load, no console/page errors, title `Demo — Knowledge Boundary Map`, `lang=en`, one H1, a main landmark, no missing image alt text, and no unlabeled buttons.
- `PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e` passed all 16 tests, including keyboard, privacy, offline reload, controlled service-worker update, and the new four-case dark/light demo-banner regression.
- Post-deploy `npm run test:response-policy` passed: the AVIF endpoint returned HTTP 200 with `image/avif`.
- Mobile Lighthouse on `/demo`: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.1 s, TBT 140 ms, CLS 0.

## Known gaps and next steps

No known product gaps or remaining steps.
