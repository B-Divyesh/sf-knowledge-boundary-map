# Independent verification 11 — FAIL

**Work order:** `knowledge-boundary-map-verify-11`

**Candidate:** `add7292b8cbb99003191be98520690e6694959a4`

**Live URL:** <https://knowledge-boundary-map.sociobot.in>

**Date:** 2026-09-01 UTC

## Decision

**FAIL.** The live deployment matches the candidate and the core product works, but two release-blocking findings remain:

1. A valid-format JSON import can create 13 claims, while the product promises that each map holds up to 12.
2. The required `npm run test:e2e` command fails consistently because the accessibility/mobile matrix exceeds its 30-second test limit.

No product code was changed during this verification.

## Blocking findings

### High — F-11-1: JSON import does not enforce the stated 12-claim limit

- **Promise:** The first screen, README, terms, and `.factory/claims.json` state that each map holds up to 12 claims.
- **Fresh live check:** Starting from an empty real map, importing a structurally valid 13-claim JSON file succeeded. The map rendered all 13 cards and displayed **“13 of 12 free claims.”**
- **Observed evidence:** `{"importedClaims":13,"renderedClaims":13,"summary":"Claim map\n13 of 12 free claims","claimPromiseKept":false}`.
- **Code path:** `sanitizeMap()` returns every imported claim in `src/model.ts`; the import handler assigns that map in `src/main.ts` without applying `FREE_CLAIM_LIMIT`.
- **Coverage gap:** `@claim:free-workshop` starts with 12 claims and confirms that the add control does not create a thirteenth. It does not check the supported JSON import path.
- **Release impact:** A user-visible quantitative claim is false for a supported workflow, and its declared claim check does not cover that workflow.
- **Required correction:** Reject an over-limit import with clear recovery guidance, or define and present an explicit import policy that keeps the public limit true. Extend `@claim:free-workshop` to cover import at 12 and 13 claims.

### High — F-11-2: the required full browser suite fails consistently

- **Command:** `npm run test:e2e`
- **Fresh result, run 1:** FAIL — 21 passed; `tests/e2e/app.spec.ts:397` timed out after 30,000 ms.
- **Fresh result, run 2:** FAIL — 21 passed; the same matrix timed out after 30,000 ms.
- **Isolated result:** `npm run test:e2e -- --grep "all public pages pass"` passed in 35.9 seconds locally. The same matrix against the live URL passed in 31.5 seconds.
- **Cause shown by evidence:** The matrix checks five routes across two viewports and two themes in one test. Its normal duration is longer than the default per-test limit, especially while the suite runs two workers.
- **Release impact:** The repository's documented all-browser-check command is not reliable and the required local quality gate does not pass.
- **Required correction:** Split the matrix into smaller tests or set a justified timeout for that matrix, then confirm the unmodified `npm run test:e2e` command passes repeatedly.

## Mandatory first gates

### Claims from the clean checkout

`.factory/claims.json` exists and declares 13 checks. After `npm ci`, every exact command in the manifest ran separately through the production-preview demo entry point. All 13 returned successfully:

| Claim | Result |
|---|---|
| `demo-sandbox` | Pass |
| `local-only` | Pass |
| `offline-reload` | Pass |
| `csv-export` | Pass |
| `json-restore` | Pass |
| `keyboard-dialog` | Pass |
| `free-workshop` | Pass, but incomplete for JSON import; see F-11-1 |
| `self-assessment-label` | Pass |
| `theme-storage` | Pass |
| `prerequisites` | Pass |
| `teach-back-timer` | Pass |
| `counterexample-capture` | Pass |
| `next-question` | Pass |

Each claim id appears in exactly one tagged test. F-11-1 was found by checking the same promise through the documented import workflow.

### Cold first-read check

**Pass.** A fresh 1440×900 browser context showed, without scrolling:

- what it does: **“Test what you can explain.”**
- for whom and what changes: **“For self-learners who want to separate recognition from an explanation they can produce.”**
- what to select first: **“Try it with sample data.”**
- immediate result: **“Opens a completed causal-inference map.”**

One selection opened `/demo` with three connected claims, mixed self-assessments, and a specific blocked next question. The persistent banner provided **Reset demo** and **Start for real** and stated that sample changes are not saved to the real map.

Evidence: `.factory/evidence-11/live-cold-desktop.png`, `.factory/evidence-11/live-demo-mobile-390.png`.

## Clean local checks

| Check | Result |
|---|---|
| Candidate identity before testing | Pass — exact HEAD `add7292b8cbb99003191be98520690e6694959a4` |
| `npm ci` | Pass — 59 packages, 0 vulnerabilities |
| 13 exact claims-manifest commands | Pass — 13/13 |
| `npm test` | Pass — 10/10 |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm audit --audit-level=low` | Pass — 0 vulnerabilities |
| `npm run build` | Pass — production `dist/` created |
| `npm run test:e2e` first run | **Fail — 21/22; matrix timeout** |
| `npm run test:e2e` second run | **Fail — 21/22; same matrix timeout** |
| Matrix by itself | Pass — 1/1 in 35.9 seconds |
| `npm run test:response-policy` | Pass — live hero is HTTP 200 `image/avif` |

The product build is valid; the complete browser command is not. This independently repeats the same result twice.

## Live product workflow and recovery

A separate Playwright scenario against the live site confirmed:

- the demo uses `demo:` storage and preserves an existing real-map marker;
- the demo begins with three connected, completed causal-inference claims;
- Tab reaches the claim map, arrow keys move between claims, Enter opens rehearsal, and Escape restores focus;
- the keyboard focus ring is solid, 3 px, and visible (`rgb(118, 80, 0)` in light mode);
- a 160-character claim and 600-character context save successfully;
- empty required claim and teach-back fields expose browser validation guidance;
- missing boundary and next-question fields provide specific visible recovery guidance;
- a completed self-assessment and history persist after reload;
- cancelling removal preserves the claim, confirmed removal removes it, and Undo restores it;
- malformed JSON is rejected with a specific instruction to choose a valid export;
- blocked browser storage shows a `role=alert` warning that advises exporting before leaving;
- no console errors or page errors occurred.

F-11-1 records the separate over-limit import result.

## Privacy, requests, and response policy

The full live demo and real-map workflow made nine requests. Every request used only `https://knowledge-boundary-map.sociobot.in`. No analytics, account, third-party font/script, model, billing, or other API request appeared.

Live responses confirmed:

- CSP restricted resources to self and sent `frame-ancestors 'none'` as a response header;
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, HSTS, strict-origin referrer policy, and disabled camera/microphone/geolocation;
- HTML and the service worker use `public, must-revalidate, max-age=30`;
- hashed JavaScript and CSS use `public, max-age=31536000, immutable`;
- the hero AVIF uses `public, max-age=604800` and the correct `image/avif` type;
- `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown path returns the designed 404 with status 404.

This is a static PWA. It has no server-side product endpoint, product-unlock call, sign-in, library package, or CLI. Request allowance/429, identity authority, server concurrency, backend persistence, health identity, and consumer-package checks do not apply.

## Accessibility, mobile, motion, and routing

- The live Axe matrix covered `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` at 1366×900 and 390×844, in light and dark themes: zero serious or critical findings.
- The independent live desktop flow and 390px demo check also found zero serious or critical Axe findings.
- At 390px, document overflow was 0 px and all 18 visible interactive targets measured at least 44×44 px.
- At 200% root text size, `/`, `/demo`, `/privacy`, and `/terms` retained one H1 and one main landmark with 0 px horizontal overflow.
- Reduced-motion emulation left zero elements with material transition or animation durations.
- The supplied `verify-url.sh` passed: title, `lang=en`, one H1, main landmark, alt/button names, and zero console errors.
- History navigation, route-specific titles/canonical metadata, heading focus, the skip link, and the designed 404 passed repository checks.

Evidence: `.factory/evidence-11/verify-url/`, `.factory/evidence-11/live-demo-text-200.png`.

## PWA and offline behavior

- The live `@claim:offline-reload` check passed in its own browser context.
- The controlled old-service-worker-to-current-worker update check passed.
- The current demo reloaded offline and displayed the offline status message.
- The service worker cache version follows the current build and removes the old test cache.

## Performance and bundle budgets

Fresh Lighthouse 12.8.2 mobile results for the live home page:

| Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Transfer |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 99 | 100 | 100 | 100 | 0.99 s | 1.44 s | 113 ms | 0 | 95,113 bytes |

An observed primary demo-selection interaction had a maximum Event Timing duration of 48 ms, with zero long tasks. Lighthouse did not provide field INP for this fresh run.

| Asset | Measured | Budget | Result |
|---|---:|---:|---|
| Initial JavaScript | 12,243 bytes gzip | 200 KB | Pass |
| CSS | 5,182 bytes gzip | 50 KB | Pass |
| Fonts | 0 bytes | 120 KB | Pass |
| Hero AVIF | 74,110 bytes | 300 KB | Pass |

Evidence: `.factory/evidence-11/lighthouse-live.json`.

## Candidate and deployment identity

The live deployment matches the local production build byte-for-byte:

| Artifact | SHA-256 |
|---|---|
| `index.html` | `bb35128463703b236e2877c4051b004f5d53b7f7fd88e48d5b25bbc2da23d098` |
| `assets/index-D5hjpTM0.js` | `f9849c500dafd264a1dde34b82a020fd7396e10620094a773abd39420a62fd99` |
| `assets/index-BIFJACiF.css` | `60cc10eb6c9bb491f83e8c9cc5d9db24a462c31ac7b04203387f9262370a1d86` |
| `assets/boundary-diorama.avif` | `93fa82826312d96d99f0352627eb09dfed882fdcf554f22662af82aa6ffde0ce` |
| `sw.js` | `eed5683ed484b67a3153535a6ec253bce21774eb22e3d7a0d5dd8568cbe59d4f` |
| `manifest.webmanifest` | `fa6a3ae344192f7e4e9bc91aec304be63328f3f81dfd959e8bb24eeec87a3d23` |
| `404.html` | `a99957bada7d0b5115698448bc5be10935d3882de6fcbf430a82347228a5ddad` |

The earlier deployment-only concern does not reproduce. The live files are the candidate files.

## Other acceptance checks

- The documented paper-cut visual system, palette, typography, spacing, light/dark treatments, motion policy, and original-asset provenance are present in `.factory/design.md` and match the rendered product.
- README, MIT license, privacy page, terms page, demo documentation, copy audit, sitemap, robots file, social metadata, favicon, and touch icon are present.
- No additional model feature is needed for the brief. Import/export is present and core rehearsal works without any optional service.
- No unlisted material product promise was found after comparing the landing page, privacy page, terms, README, demo documentation, and claims inventory. F-11-1 is a false registered promise, not a missing inventory entry.

## Defects by severity

- Critical: none.
- High: F-11-1 and F-11-2.
- Medium: none.
- Low: none found in the checked acceptance scope.

## Conclusion

**FAIL — candidate `add7292b8cbb99003191be98520690e6694959a4` is deployed exactly, but it is not ready for release until the 12-claim import boundary is enforced and the default full browser suite passes reliably.**
