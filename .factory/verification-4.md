# Independent verification 4 — FAIL

**Work order:** `knowledge-boundary-map-verify-4`

**Tested candidate:** `d5ff211821714eaae47914df52e7d23436808e17`

**Live URL:** <https://knowledge-boundary-map.sociobot.in>

**Date:** 2026-08-28 UTC

## Decision

**FAIL.** The deployed static application is byte-identical to the clean candidate build, and the complete free learning workflow, accessibility baseline, privacy promise, responsive behavior, PWA update/offline path, security policy, and performance budgets pass. Release acceptance is still blocked by one fresh high-severity production defect: the advertised `$12 USD` one-time checkout returns HTTP 404, so a new customer cannot buy Studio and the successful purchase/return/restore/revocation lifecycle cannot be completed end to end.

The earlier builder's deployment-only warning is independently confirmed. No repository-controlled release blocker was reproduced. One additional low-severity response-hygiene issue was observed for the AVIF MIME type.

## Defects

### High — production checkout is unavailable

At `2026-08-28T06:40:18Z`, a fresh request to the exact checkout URL linked by `/upgrade` returned 404 rather than a hosted-checkout redirect:

```text
GET https://api.sociobot.in/api/v1/products/knowledge-boundary-map/checkout
HTTP/2 404
{"error":"enabled factory product","status":404}
```

The public product catalog contains no `knowledge-boundary-map` entry. The verification service itself is healthy: a request with origin `https://knowledge-boundary-map.sociobot.in` and an invalid token returned HTTP 200, `Access-Control-Allow-Origin` for the product origin, `Cache-Control: no-store`, and:

```json
{"expires_at":null,"reason":"invalid","valid":false}
```

The UI correctly rejects an empty restore token and turns that invalid response into an actionable “not active for this product” error. Repository browser regressions also pass for token-bound cached verdicts, unseen offline tokens, and immediate background revocation. However, no valid production token can be purchased, so successful return-token storage, real-device restore, and refund/revocation cannot be accepted against production.

Required factory action: register and enable the production one-time product for slug `knowledge-boundary-map`, price `$12 USD`, with return URL `https://knowledge-boundary-map.sociobot.in`, then complete one real purchase and revocation lifecycle. No client or alternate payment-provider change is indicated.

### Low — AVIF is served with a generic MIME type

`/assets/boundary-diorama.avif` returns `Content-Type: application/octet-stream`; it should be `image/avif`. Chromium 145 selected and decoded the image successfully, visual checks passed, the WebP fallback returns `image/webp`, and Lighthouse Best Practices remains 100, so this is not a current functional blocker. Add an `.avif` MIME mapping in the static host configuration for correct content negotiation and downstream tooling behavior.

## Clean repository gates

The workspace started clean on `main` at the exact candidate (`git status --short` empty before installation). Dependency/build output was regenerated from that checkout. No product code was changed.

| Check | Result |
|---|---|
| `npm ci` | Pass; 59 packages installed |
| `npm audit --audit-level=low` | Pass; 0 vulnerabilities |
| `npm test` | Pass; 7/7 Vitest tests |
| `npm run build` | Pass; `tsc --noEmit` and Vite 7.3.6; `dist/` produced |
| `npm run test:e2e` | Pass; 15/15 Playwright 1.58.2 tests against the local production preview |
| Live repository suite | Pass; 15/15 with `PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in` |
| Separate lint command | Not configured; strict TypeScript checking is part of the exact build |
| Dependency budget | Pass; no runtime dependencies |

This artifact is a static PWA, not a library, CLI, or backend. Consumer-package installation, CLI execution, server concurrency, server persistence, and health/build endpoints are therefore not applicable.

## Independent product exercise

A separate temporary Playwright harness (not committed) ran against both the local production preview and the live origin. It did not rely on the checked-in assertions.

- Rejected a whitespace-only claim with recovery copy and confirmed the 160-character input maximum.
- Created five representative claims and rendered and persisted a prerequisite connection.
- Started and paused the 90-second timer at `01:29`.
- Rejected an “explain” assessment without a counterexample/boundary and next probe, then recovered and saved it.
- Revisited that previously confident claim and changed it to “recognize only.”
- Recorded a separate blocked claim with a specific next probe.
- Reloaded and confirmed five claims, two rehearsals on the revisited claim, current assessments, and the prerequisite remained in local storage.
- Used Home, End, ArrowRight, and Enter within the map; the expected claim received focus and Enter opened its rehearsal.
- Cancelled a named removal, confirmed removal, then used Undo to restore the claim and its connections.
- Downloaded JSON containing all five claims and an 809-byte CSV containing the current status; export remained available at the free limit.
- Rejected malformed JSON with recovery guidance, then confirmed a valid replacement import.
- Accepted the twelfth free claim and blocked the thirteenth without exposing a paid claim form.
- Confirmed storage-denial recovery through the repository browser suite.
- Confirmed self-assessments are explicitly labelled and the product does not claim to measure intelligence or fact-check claims.

Normal-flow console errors and page errors were zero locally and live. The factory `verify-url.sh` passed both origins with HTTP 200, the expected title, `lang=en`, one `h1`, a main landmark, no missing image alt text, no unlabeled buttons, and no browser errors.

## Accessibility, responsive behavior, and visual review

- Axe 4.10.2 found **0 serious/critical violations** on populated desktop, populated 390×844 mobile, dark treatment, `/privacy`, `/terms`, and `/upgrade` surfaces. The repository and independent scans agree.
- Keyboard-only navigation covered the skip link, dialogs, global `N`, map roving focus, rehearsal controls, destructive confirmation, and Undo without a trap.
- The light focus outline measures 6.08:1 against canvas and 7.07:1 against paper. Dark focus measures 7.94:1 against canvas and 6.83:1 against paper.
- At 390 px, viewport/body/document widths were all 390 px. Visible page and dialog controls met 44×44 px; prerequisite rows measured 298×65.59 px. The horizontally scrollable status ledger remained keyboard-operable.
- Simulated 200% root text retained one `h1`, one `main`, all primary content, and a 390 px document width.
- With `prefers-reduced-motion: reduce`, claim transition duration computed to `1e-05s`; no flashing or indefinite animation was present.
- Desktop and mobile screenshots were visually inspected. The product-specific paper workshop, state folds, prerequisite path, clear primary action, readable hierarchy, and intentional phone stacking are intact; no content was obscured by fixed chrome.

## Privacy and outbound requests

The complete free five-claim/rehearsal/export/import flow made **zero cross-origin requests** on both origins. Claims, topic, rehearsals, theme, and entitlement cache remain in local storage; exports are initiated locally. Source inspection and browser observation found no analytics, trackers, advertising, telemetry beacons, runtime CDN scripts, or network fonts.

The only application fetch capable of crossing origin is the disclosed license verification request to `api.sociobot.in`; the map is not included. The live invalid-restore exercise sent only the test token. `/privacy` and `/terms` accurately document local storage, exports, billing verification, generated artwork, merchant responsibilities, and data-loss boundaries.

## PWA update and offline behavior

- The production worker contains cache identity `kbm-shell-afe37d60ff41` locally and live.
- A fresh worker installation cached the shell and hashed assets. Offline reload of a deep `/privacy` navigation rendered the current application and its visible offline state.
- The checked-in old-to-current test first controlled a client with the byte-equivalent pre-repair `kbm-shell-v4` worker, updated from the same origin, verified the old cache was deleted and the current cache installed, then loaded the current app offline. It passed locally and as part of the live suite.
- Worker update checks bypass the HTTP cache; navigation is network-first with the cached shell as fallback.

## Deployment identity

Fresh live downloads match the clean candidate build byte-for-byte:

| Artifact | SHA-256 |
|---|---|
| `index.html` | `b37a492ab6599bce7b4c5504b2c13531318801d7a7acbb7cb7a47d4ca8ab4922` |
| JavaScript | `c3ecb33e38e8a6195cfdbc48b965315d7278da4b0ebb5ccef3b15f615dad0019` |
| CSS | `af2408e631b8423a6f4e0d989410738314b23d3ad1141251cfd2791e42c3acc4` |
| `sw.js` | `1d5019f7705721ecae0987f7d85a6a5627118f95c7959842bf359edec5205eb7` |
| Manifest | `208773ac396f14e7cdc362323ae5608ee7753d337ff407a2461e7d035d2c1dd4` |
| Favicon | `4e4fae9e73de6a52f5526887148bbc81e82a680503e1ece40711583c3d1f72f3` |
| AVIF hero | `93fa82826312d96d99f0352627eb09dfed882fdcf554f22662af82aa6ffde0ce` |
| WebP hero | `7198592a4befde109c3421b50b4ec659ded4dd3a5bac2ed5c0b01b2725644c42` |

This proves the live failure is not a stale static deployment.

## Response policy and caching

Live HTML includes HSTS, a restrictive CSP (`default-src`, scripts, styles, fonts, images, workers, and objects restricted to self as appropriate; billing hosts only in `connect-src`/`form-action`; `frame-ancestors 'none'`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and disabled camera/microphone/geolocation.

Caching is appropriate: HTML, legal routes, worker, and manifest use `public, must-revalidate, max-age=30`; hashed JS/CSS use one-year immutable caching; hero artwork uses seven-day caching. The AVIF MIME exception is recorded above.

## Performance and bundle budgets

Lighthouse 13.4.1 simulated-mobile runs used Chromium 145.

| Metric | Local production | Live |
|---|---:|---:|
| Performance | 100 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| FCP | 0.9 s | 0.9 s |
| LCP | 1.4 s | 1.4 s |
| Total blocking time | 0 ms | 0 ms |
| CLS | 0 | 0 |
| Speed Index | 0.9 s | 0.9 s |
| Initial transfer | 91 KiB | 90 KiB |

Lab Lighthouse does not report field INP; production INP requires real-user field data. Static budgets pass: JavaScript 34,446 bytes raw / 12,058 gzip, CSS 14,898 raw / 4,344 gzip, fonts 0 bytes, AVIF hero 74,110 bytes, and complete `dist/` 280,496 bytes.

## Release condition

Do not approve the release until the production billing product is enabled and one real checkout → return token → restore → cached-valid offline use → refund/revocation lifecycle passes. Correct the AVIF MIME mapping in the next static deployment; it does not need to block the billing re-verification.
