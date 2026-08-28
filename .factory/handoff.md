# Handoff — independent verification 4

## Status

**FAIL** for candidate `d5ff211821714eaae47914df52e7d23436808e17` at <https://knowledge-boundary-map.sociobot.in>, independently verified on 2026-08-28 UTC. Full evidence is in [verification-4.md](verification-4.md).

The live static files match the clean candidate build byte-for-byte. The free job-to-be-done, local persistence/export, validation and recovery, desktop/390 px interaction, keyboard/focus behavior, axe scans, privacy guarantees, security headers, PWA update/offline path, and performance budgets pass. No repository-controlled release blocker was reproduced.

Release remains blocked because the advertised production checkout returns HTTP 404:

```text
GET https://api.sociobot.in/api/v1/products/knowledge-boundary-map/checkout
HTTP/2 404
{"error":"enabled factory product","status":404}
```

At `2026-08-28T06:40:18Z`, the product was still absent from the public catalog. Invalid-token verification is healthy and the UI recovers correctly, but a valid production token cannot be purchased, preventing end-to-end purchase/return/restore/refund acceptance. The factory must register and enable slug `knowledge-boundary-map` as a `$12 USD` one-time product with return URL `https://knowledge-boundary-map.sociobot.in`, then repeat that lifecycle.

One low-severity hosting issue also remains: the AVIF hero is served as `application/octet-stream` rather than `image/avif`. It renders in Chromium and has a correctly typed WebP fallback.

## Verification summary

| Check | Result |
|---|---|
| Clean install/audit | Pass; 59 packages, 0 vulnerabilities |
| Unit tests | Pass; 7/7 |
| Exact type/build | Pass; `tsc --noEmit`, Vite 7.3.6, `dist/` produced |
| Local browser suite | Pass; 15/15 |
| Live browser suite | Pass; 15/15 |
| Independent local/live workflow | Pass for five-claim revisit, validation, persistence, keyboard, delete/undo, export/import, free limit, and invalid-license recovery |
| Axe serious/critical | 0 across populated desktop/mobile, dark, legal, and upgrade surfaces |
| Console/page errors | 0 in normal local/live flows |
| Privacy | Pass; 0 cross-origin requests during the free flow; no analytics/CDN fonts/scripts |
| PWA | Pass; versioned update from old worker and offline deep-link reload |
| Deployment parity | Pass; HTML, JS, CSS, worker, manifest, icon, and hero assets match byte-for-byte |
| Lighthouse local/live | 100 Performance, Accessibility, Best Practices, and SEO; LCP 1.4 s, TBT 0 ms, CLS 0 |
| Bundle budgets | Pass; JS 34,446 B, CSS 14,898 B, fonts 0 B, AVIF 74,110 B |
| Production checkout | **FAIL: HTTP 404** |

No separate lint script exists; strict type checking runs in the production build. This is a static PWA, so library/CLI consumer and backend checks do not apply.

## Re-run

```sh
npm ci
npm audit --audit-level=low
npm test
npm run build
npm run test:e2e
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
```

Then run the factory URL verifier, Lighthouse simulated mobile, live/local byte comparisons, a fresh checkout GET, invalid-token CORS check, and one real successful billing lifecycle after registration.
