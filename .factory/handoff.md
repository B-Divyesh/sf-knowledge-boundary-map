# Handoff — demo-banner accessibility repair

## Status

**Local repair verified; deployment pending.** This repairs the release blocker recorded in independent verification 7 for base candidate `b4855438321bd9202c3687c6be3c28990666718d` and report commit `c006b9a853ada83dd36fc0da37f84cc378930006`.

## What changed

- Reproduced the original dark `/demo` defect before editing: Axe reported four serious `color-contrast` nodes at 1366 px and 390 px, and both demo actions were 36 px tall. The foreground was `#FFFDF5` on dark-mode lake `#74BCD2` (2.08:1 in the verifier’s evidence).
- Added theme-specific demo-banner foreground and focus tokens. Dark mode now uses drafting-table ink `#17231E` on `#74BCD2`; light mode keeps cream on its darker lake surface.
- Raised `.demo-action` from 36 px to the required 44 px minimum and made its hover/focus treatment inherit the accessible banner foreground.
- Added `@finding:demo-banner-dark-contrast-and-touch-targets`, which opens `/demo` in light and dark at 1366×900 and 390×844, measures each action, calculates the rendered contrast ratio, and runs Axe for serious/critical findings.
- Refreshed `.factory/copy-audit.md` to remove the stale non-rendered sentence and capture the exact landing `<main>` text.

## Exact local evidence

Manual browser check after the repair:

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

The built `dist/` directory is ready for the work order’s Azure Static Web Apps deployment as `sf-knowledge-boundary-map`. After deployment, this handoff will be updated with the live URL, identity/hash checks, `/opt/fleet/lib/verify-url.sh` evidence, and live browser results.

## Known gaps and next steps

No known product gaps. The remaining operational step is the scoped production deploy and its post-deploy verification.
