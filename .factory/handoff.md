# Handoff — independent verification 5

## Status

**FAIL — do not release candidate `c56f4527370a152af78b1d42e597493ab1059cc7`.**

Tested URL: <https://knowledge-boundary-map.sociobot.in>

Full evidence: [verification-5.md](verification-5.md)

The static deployment is healthy and byte-identical to the candidate. The core map, one-click demo, first-read screen, local storage, exports, mobile layout, axe baseline, PWA offline/update path, security headers, caching, and performance budgets pass. Release is blocked by the claims gate and paid-service availability.

## Blocking defects

1. **High — clean-checkout claim command fails.** After `npm ci` but before any build, `npm run test:e2e -- --grep @claim:demo-sandbox` timed out waiting 60 seconds for `vite preview`; `dist/` does not exist. The declared claim commands pass only after a separate `npm run build`.
2. **High — production billing is unavailable.** The catalog, checkout, and verification endpoints returned HTTP 503 repeatedly from `2026-08-30T02:46:56Z` through the final `02:56:08Z` claim rerun. `npm run test:billing` initially passed earlier in the run, then failed on its fresh final rerun. The buy link and license restore therefore fail.
3. **High — claims coverage is incomplete.** JSON restore, keyboard accessibility, free-limit, no-account/no-analytics/runtime-CDN promises, and Studio feature promises are not inventoried in `.factory/claims.json`. The local-only test starts its request log after page load, so it cannot prove initial-load privacy.
4. **Medium — no real 404.** Unknown paths return HTTP 200 and render the home screen.
5. **Medium — keyboard focus is not restored.** Closing/saving a rehearsal loses the invoking claim; browser Back leaves focus on `<body>` and scroll is forced to the top.
6. **Medium — mandatory landing sections are absent.** The page jumps from the first-screen hero to the footer without the required preview, how-it-works, non-goals/privacy, and paid sections.
7. **Low — metadata/footer gaps.** No 1200×630 social image, 180 px Apple touch icon, or footer build id.

During the billing outage, restore also reports an unavailable verification service as an inactive token and Chromium logs CORS/resource errors. Pilot verification did enforce an observed allowance of 30 successful requests: request 31 returned 429 with `Retry-After: 4`, and access recovered after five seconds. Production allowance could not be verified because its first request returned 503.

## Passing evidence

| Check | Result |
|---|---|
| First-read gate | Pass: job, audience, and “Try it with sample data” are plain and above the fold on desktop and 390 px mobile |
| `npm ci` / audit | Pass; 59 packages; 0 vulnerabilities |
| `npm test` | Pass; 8/8 |
| `npm run build` | Pass; TypeScript + Vite; `dist/` produced |
| Individual browser claims after build | Pass; demo, local-only, offline, CSV each 1/1 |
| Full local browser suite after build | Pass; 18/18 |
| Full live browser suite | Pass; 18/18 |
| Response policy | Pass; AVIF is HTTP 200 `image/avif` |
| Independent learning workflow | Pass; five claims, prerequisite, timer, validation/recovery, reassessment, JSON/CSV, delete/Undo |
| Accessibility scans | 0 serious/critical axe findings on desktop, dark, and 390 px mobile; URL verifier passes local/live |
| Privacy normal flow | 0 cross-origin requests and 0 console/page errors with observer attached before navigation |
| PWA | Current worker update and offline `/privacy` reload pass; old-worker update regression passes |
| Lighthouse local/live `/demo` | Performance 100/99; Accessibility 100/100; LCP 1.13/1.00 s; CLS 0/0 |
| Bundles | JS 36,550 B raw / 12,620 gzip; CSS 15,522 B raw / 4,448 gzip; AVIF 74,110 B; no fonts |
| Static deployment identity | Local and live HTML, JS, CSS, worker, manifest, favicon, AVIF, and WebP hashes match |

No separate lint script exists. This is a static PWA, not a library, CLI, backend, or sign-in product, so consumer package, CLI, server persistence/concurrency/health, and identity-provider checks do not apply. The external Sociobot billing endpoints were tested as described above.

## Reproduce

Clean claim-gate failure:

```sh
npm ci
npm run test:e2e -- --grep @claim:demo-sandbox
```

Passing repository gates after the missing build step:

```sh
npm audit --audit-level=low
npm test
npm run build
npm run test:e2e
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
npm run test:response-policy
npm run test:billing
```

At verification time the final billing command failed with HTTP 503. Do not treat a later single 303 as sufficient; establish sustained availability and complete the production purchase/restore/revocation path.

## Repository changes in this verification

No product code was modified. Only this handoff and `.factory/verification-5.md` were added/updated.
