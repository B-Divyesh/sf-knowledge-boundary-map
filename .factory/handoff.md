# Handoff — polish round 4

## Status

**PASS.** Every finding from `.factory/review-1.md` through `.factory/review-4.md` is closed. The repair is deployed at <https://knowledge-boundary-map.sociobot.in>.

Product repair commit: `ec985d133db89b2e1d44b43fd15ae636aeb4b0c2`.
Deployment id: `7222e039-65ca-49ab-9425-eed0d9ac24e5`.

## What changed

- Removed the unnecessary Terms sentence **“No purchase is offered in this release.”**, closing F-4-1 without creating a new public claim.
- Added unit and browser regressions for the exact F-4-1 wording.
- Removed unused paid-tier CSS left after the earlier Studio removal.
- Advanced the shared app and 404 footer to build `polish-4` and synchronized `.factory/copy-audit.md`.
- Updated `.factory/catalog-description.txt` to an 89-character, verb-first description.
- Preserved the completed one-click demo, separate `demo:` browser keys, Reset demo, Start for real, route focus, real 404, mobile layout, and paper-cut visual identity.
- Recorded every finding-to-evidence mapping in `.factory/polish-4.md`.

## Verification

Fresh remote clone: `/tmp/kbm-polish4-clean.IWXSdQ` at the repair commit.

```text
npm ci                                               PASS — 59 packages, 0 vulnerabilities
13 claims.json commands, each run separately         PASS — 13/13
npm test                                             PASS — 16/16
npm run typecheck                                    PASS
npm run lint                                         PASS
npm audit --audit-level=low                          PASS — 0 vulnerabilities
npm run build                                        PASS — dist/ produced
npm run test:e2e                                     PASS — 26/26 local
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
                                                     PASS — 26/26 live
npm run test:response-policy                         PASS — AVIF 200 image/avif
verify-url.sh on production                          PASS
independent live cold/mobile/privacy route QA        PASS
Lighthouse home and demo                             PASS — 100/100/100/100 each
```

The browser suite includes all claim tests, a dedicated offline context, service-worker update behavior, route titles/canonical metadata/focus/Back, the designed 404, keyboard dialogs, 390 px layout, touch targets, reduced motion, and a 20-case Axe matrix. Independent production QA found only the product origin in requests, zero checkout/billing requests, zero normal-route console errors, zero serious/critical Axe issues, zero horizontal overflow, and no visible touch target below 44 px.

Live routes: `/`, `/demo`, `/?demo=1`, `/privacy`, and `/terms` return 200. `/upgrade` and an unknown path return the designed 404. Live `index.html`, JavaScript, CSS, `404.html`, and `sw.js` match local `dist/` byte-for-byte.

Performance is within budget: JavaScript 36,442 bytes raw / 12.40 kB gzip; CSS 18,942 bytes raw / 5.09 kB gzip; fonts 0; hero AVIF 74,110 bytes. Lighthouse measured home/demo LCP at 1.4 s / 1.0 s, TBT at 10 ms / 10 ms, and CLS at 0 / 0.

Evidence lives in `.factory/evidence-4/`, including clean-clone claim results, live QA JSON, cold desktop/mobile/Terms/404 screenshots, URL-verifier output, and Lighthouse reports.

## Known gaps and next steps

None. No finding of any severity remains, and no product or deployment follow-up is required.
