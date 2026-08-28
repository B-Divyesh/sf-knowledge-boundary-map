# Independent verification 3 — FAIL

**Work order:** `knowledge-boundary-map-verify-3`

**Tested candidate:** `6262ed24e7943b46a9cff06995abfdfb716fca5e`

**Live URL:** <https://knowledge-boundary-map.sociobot.in>

**Date:** 2026-08-28 UTC

## Decision

**FAIL.** A fresh client receives a byte-identical copy of the candidate and the core local-first learning workflow, clean build, accessibility scans, privacy checks, current-shell offline reload, and performance budgets pass. Release acceptance is nevertheless prevented by three independently reproduced high-severity defects: production checkout still returns 404; a new, unverified license token is treated as valid while offline and leaves paid controls actionable after an invalid response; and an existing PWA client remains pinned to the pre-repair application because the candidate service worker is byte-identical to the previous one. The light-theme focus ring also misses the explicit 3:1 contrast requirement.

The builder's deployment-only warning remains current, but it is not the only failure found in this run.

## Defects

### High — production checkout still returns 404

At 2026-08-28 05:43:43 UTC, a fresh GET to the advertised and contractually correct endpoint returned HTTP 404 rather than a hosted-checkout redirect:

```text
GET https://api.sociobot.in/api/v1/products/knowledge-boundary-map/checkout
HTTP/2 404
{"error":"enabled factory product","status":404}
```

The live `/upgrade` page advertises “$12 USD one time” and points “Buy lifetime studio” to that exact URL. No new buyer can complete the advertised purchase, so the purchase/return lifecycle could not be accepted. The verification endpoint is available: an invalid token returned HTTP 200, origin-specific CORS, `Cache-Control: no-store`, and `{"expires_at":null,"reason":"invalid","valid":false}`. This confirms the remaining checkout issue is product registration/enabling outside the static client.

### High — a previously unseen token receives paid state without a cached valid verdict

The paid-unlock contract permits optimistic offline use only **from a cached verdict**. In a clean live browser with no license or verdict stored, the following sequence reproduced:

1. Cache the current shell, create exactly 12 free claims, and take the browser offline.
2. Open `/?license=offline-unverified-6262ed24`.
3. The app strips the token from the URL and stores both the token and `{"valid":true,"checkedAt":0}` even though verification cannot run.
4. Reload offline. The UI says `Studio unlocked` and `12 claims · Studio unlocked`; pressing `N` exposes the new-claim form beyond the free limit.
5. Restore connectivity. The real API changes the saved verdict to `{"valid":false,"reason":"invalid",...}`, but the rendered navigation still says `Studio unlocked`, and the already-rendered paid claim form remains available (`#claim-form` count 1).

The same offline paid-state result occurred against the local production artifact and the live deployment. A normal online invalid return does eventually render locked after routing, and the restore form correctly reports an invalid token on the production origin. The failure is the synthesized positive verdict and missing rerender after background invalidation. It conflicts with the required cached-verdict boundary and the terms statement that an invalid license is automatically locked.

### High — existing PWA clients do not update from the pre-repair shell

The current service worker uses cache-first navigation with cache `kbm-shell-v4`. Its SHA-256 is `7beefddc0ebdb42a35fb331ef8d9ca046995a3fb03384378520e5e791433dfbe`, exactly the same as the pre-repair build recorded in verification 2, although the application asset changed:

| Build | Application script |
|---|---|
| Pre-repair shell | `/assets/index-BuJAejdt.js` |
| Candidate shell | `/assets/index-B8U9cBFE.js` |

An old-to-current transition test first installed and controlled the pre-repair production artifact, then served the candidate from the same origin and called `registration.update()`. There was no installing or waiting worker. Both an online reload and a subsequent offline reload continued to execute `/assets/index-BuJAejdt.js`; the old `kbm-shell-v4` entries remained. A fresh browser does receive the candidate, but a previously controlled browser cannot discover this revision through the service-worker update mechanism. That is especially significant here because the older cached application contains defects the repair intended to replace.

Current-build install and offline reload do pass; this defect is specifically the required update path across releases.

### Medium — light-theme focus outline contrast is below 3:1

The designed focus indicator is present and 3 px wide, but its light-theme saffron `#E2AA3B` outline has only **1.76:1** contrast against the surrounding canvas `#F4EBD9` and **2.05:1** against paper `#FFFDF5`. The supplied accessibility contract requires a visible focus ring with at least 3:1 contrast. The outline is offset by 3 px, so its immediate background around primary controls is the low-contrast canvas. Dark-theme token contrast passes.

Axe does not evaluate this dynamic focus-color relationship; its serious/critical result remains zero.

## Clean local verification

The checkout began clean at the exact candidate. Two pre-existing untracked QA helpers were preserved outside the repository, then `git clean -fdx` removed only ignored build/dependency/test output. No product code was modified.

| Check | Result |
|---|---|
| `npm ci` | Pass; 59 packages installed, 0 vulnerabilities |
| `npm audit --audit-level=low` | Pass; 0 vulnerabilities |
| `npm test` | Pass; 7/7 Vitest tests |
| `npm run build` | Pass; `tsc --noEmit` and Vite 7.3.6 exact production build |
| `npm run test:e2e` | Pass; 9/9 Playwright 1.58.2 tests against local production preview |
| Live repository suite | Pass; 9/9 with `PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in` |
| Separate lint command | Not defined in `package.json` |
| Production artifact | `dist/` produced; 277,417 bytes including source map and static assets |

This is a static PWA, not a library, CLI, or backend. Package-consumer, CLI, server concurrency, server persistence, and health/build-identity checks are not applicable.

## Independent end-to-end product exercise

Independent Playwright checks, separate from the repository suite, ran against both local production and live origins.

- Created claims from the empty state, rejected a whitespace-only claim and recovered, and confirmed the 160-character input boundary truncates additional input.
- Created five representative claims, connected a prerequisite, rehearsed `Can explain`, revisited that assessment as `Recognize only`, recorded `Blocked` with a next probe, and confirmed the map and latest free history persisted.
- Verified missing teach-back/status, missing boundary for `Can explain`, and missing next-probe errors; paused the 90-second timer; then recovered and saved.
- Verified keyboard `N`, Home/End and Arrow claim navigation, Enter rehearsal, named delete confirmation, cancel, removal, and Undo with prerequisite restoration.
- Downloaded JSON and CSV, rejected malformed JSON with actionable copy, rejected wrong-typed rehearsal fields without replacing the map, and confirmed export remains available at the 12-claim free boundary.
- Confirmed the repaired storage-denial path renders the full free experience with an actionable warning and no page error.
- Confirmed clear self-assessment language and no claim that the app objectively measures intelligence.

Normal-flow console errors and page errors were both zero. The factory `verify-url.sh` passed locally and live: HTTP 200, correct title, `lang=en`, one `h1`, one main landmark, no missing image alt, no unlabelled buttons, and no browser errors.

## Accessibility, responsive layout, and visual review

- Integrated axe 4.10.2 and an independent axe run found **0 serious/critical** findings on populated desktop, 390 × 844 mobile, dark treatment, and `/privacy`, `/terms`, and `/upgrade`.
- At 390 px the body and document widths were exactly 390 px. The keyboard-scrollable status ledger worked, and visible brand/footer targets measured at least 44 × 44 px (home 44 × 44; Privacy 50.70 × 44; Terms 44 × 44; Source 48.09 × 44; artwork details 46.66 × 44).
- Body text computes to 16 px. Simulated 200% root text size retained the `h1` and primary action with no horizontal document overflow at 390 px.
- Reduced-motion emulation changed claim transition duration to `0.01ms`/`1e-05s`.
- Keyboard focus was visible and the skip link worked, subject to the light-theme contrast defect above.
- Desktop and mobile visual review confirmed the product-specific paper-cut treatment, legible hierarchy, responsive stacking, loaded original hero art, and no content hidden by fixed chrome.

## Privacy, outbound requests, and response policy

The complete free flow made zero cross-origin browser requests. No analytics, trackers, third-party fonts, CDN scripts, or map-data transmissions were observed. Claims and rehearsals remained in local storage; only explicit license checks contacted `api.sociobot.in`.

Live HTML returned HSTS, restrictive CSP (`frame-ancestors 'none'`; scripts/fonts/images/default restricted to self; billing origins allowed only where needed), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and disabled camera/microphone/geolocation. Legal routes accurately disclose local storage, generated artwork, billing verification, exports, and merchant responsibilities.

Caching observed:

- HTML, `sw.js`, and manifest: `public, must-revalidate, max-age=30`
- Hashed JS/CSS: `public, max-age=31536000, immutable`
- Hero asset: `public, max-age=604800`

Those response headers are sound; the PWA defect results from unchanged worker bytes/cache identity plus cache-first behavior, not CDN cache policy.

## Deployment identity

A fresh live fetch matched the clean candidate build byte-for-byte:

| Artifact | SHA-256 |
|---|---|
| `index.html` | `c4b7f708d864d58db66c300209502aa80e3f461f3d866f235baf48c8749f6860` |
| `sw.js` | `7beefddc0ebdb42a35fb331ef8d9ca046995a3fb03384378520e5e791433dfbe` |
| JavaScript | `b7afd3be2b43505727e063dd41b2364d9b79ce20b409c016a71d9dca33a42de7` |
| CSS | `ea4203442a58e4f8b5e2785e181a70edf2d59a055ee591213609a4d082a21df2` |
| AVIF hero | `93fa82826312d96d99f0352627eb09dfed882fdcf554f22662af82aa6ffde0ce` |
| WebP hero | `7198592a4befde109c3421b50b4ec659ded4dd3a5bac2ed5c0b01b2725644c42` |
| Manifest | `208773ac396f14e7cdc362323ae5608ee7753d337ff407a2461e7d035d2c1dd4` |

This confirms fresh-client deployment parity while the PWA transition test documents why existing controlled clients can still receive the old shell.

## Budgets and Lighthouse

| Metric | Local production | Live |
|---|---:|---:|
| Lighthouse Performance | 98 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| FCP | 1.0 s | 0.9 s |
| LCP | 1.4 s | 1.4 s |
| Total blocking time | 170 ms | 0 ms |
| CLS | 0 | 0 |
| Initial transfer | 92 KiB | 92 KiB |

Fresh Lighthouse 13.4.1 simulated-mobile runs produced these values. Lab Lighthouse does not report field INP; production INP needs real-user field data. JavaScript is 33,791 bytes raw / 11.90 KB gzip, CSS is 14,868 bytes raw / 4.33 KB gzip, fonts are 0 bytes, and the AVIF hero is 74,110 bytes. All explicit static budgets pass.

## Required remediation and re-verification

1. Register/enable production checkout and complete a real purchase, return-token, restore, refund/revocation, and offline-cached-valid lifecycle.
2. Never synthesize a positive verdict for a new token. Bind cached verdicts to the token they verified, allow offline optimism only from an existing valid cache, and rerender immediately whenever background verification changes entitlement.
3. Make every deployment produce discoverably new service-worker bytes/cache identity or use an update strategy that refreshes the shell. Re-test an actual pre-repair controlled client through online update and offline reload.
4. Change the light focus treatment so its full indicator has at least 3:1 contrast against adjacent canvas and paper, then remeasure representative controls in both themes.
5. Re-run all clean gates and independent local/live checks before release approval.
