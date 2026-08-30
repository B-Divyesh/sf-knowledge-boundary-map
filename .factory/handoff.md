# Handoff — repair 5

## Status

**PASS — deployed to <https://knowledge-boundary-map.sociobot.in> on 2026-08-30 UTC.**

Repair commits:

- `02563bcd1ebd0cb78e5ae80b8068437ebeb0dee9` — product and regression repairs
- `f14123c690de2ebd998b0f35f7971bd03a5d094b` — corrected the footer target regression assertion

The static artifact remains Vite + TypeScript with `dist/` as its deployment output. It was deployed directly to Azure Static Web Apps with `swa deploy ./dist --env production`; Azure confirmed the production deployment at `https://wonderful-smoke-0524f170f.7.azurestaticapps.net` and the custom domain serves the same build.

## Repaired findings

1. Browser claim commands are now self-contained after `npm ci`: the Playwright web server runs `npm run build && npm run preview`. With `dist/` deliberately moved away, the exact `@claim:demo-sandbox` command built and passed (1/1).
2. The production billing entry points recovered and the app now distinguishes an unavailable verification service from an inactive license. Restore keeps the free map available and tells the user to retry rather than claiming their token is invalid.
3. `.factory/claims.json` now inventories demo isolation, whole-load local-only privacy, offline reload, CSV export, JSON restore, keyboard/dialog behavior, free allowance, self-assessment wording, Studio features, and Studio price/checkout. Each has one tagged Playwright command. The local-only observer is attached before first navigation.
4. Static Web Apps now uses explicit rewrites for real application routes and a `responseOverrides.404` rewrite to the designed `404.html`. The production unknown-route response is HTTP 404, not the home page.
5. Rehearsal close/save restores focus to the relevant claim. Back/Forward stores scroll positions and focuses the destination heading without forcing the page to the top.
6. The landing page now has the required working preview, three-step explanation, privacy/non-goals, and exact paid-tier sections. The footer includes Param Factory and build identity.
7. Added a 1200×630 social card, declared 180px Apple touch icon, Twitter image metadata, and provenance for derivatives in the visual thesis.

## Verification

Run locally with Node 20+:

```sh
npm ci
npm run lint
npm test
npm run build
npm run test:e2e
npm run test:response-policy
npm run test:billing
```

Completed evidence:

| Check | Result |
|---|---|
| `npm ci` / `npm audit --audit-level=low` | Pass; 0 vulnerabilities |
| `npm run lint` | Pass; strict TypeScript |
| `npm test` | Pass; 9/9 Vitest tests |
| `npm run build` | Pass; emits `dist/` |
| Clean `@claim:demo-sandbox` with no `dist/` | Pass; 1/1, proving preview builds its artifact |
| All ten exact commands in `.factory/claims.json` | Pass; each tagged browser claim ran from the production-preview command |
| Full local browser suite | Pass; 26/26 Playwright tests |
| Full live browser suite | Pass; 26/26 against `https://knowledge-boundary-map.sociobot.in` |
| Keyboard, dialog focus, Back/Forward, desktop and 390px | Pass; covered in browser regressions |
| Axe Playwright integration | Pass; 0 serious/critical findings for populated desktop, dark, 390px mobile, privacy, terms, and upgrade screens |
| `verify-url.sh` local `/demo` | Pass; title, `lang=en`, one h1, main, image alts, button names, and 0 console errors; 524ms load |
| `verify-url.sh` live `/demo` | Pass; the same semantic checks and 0 console errors; 620ms load |
| Offline/update path | Pass; dedicated context reloads offline and old-worker update regression passes |
| Privacy | Pass; observer attached before navigation saw only the app origin through a demo rehearsal |
| Production 404 | Pass; `/this-route-should-not-exist-qa` returns HTTP 404 with the designed page and restrictive CSP |
| `npm run test:response-policy` | Pass; live AVIF returns HTTP 200 `image/avif` |
| Production billing | Pass; catalog reports this slug at 1200 USD cents and checkout returns HTTP 303 |
| Production verification allowance | Pass; 30 invalid-token requests returned 200, request 31 returned 429 with `Retry-After: 3`, and a request after five seconds returned 200 |
| Lighthouse 13.4 live `/demo` | Performance 100; Accessibility 100; Best Practices 100; SEO 100; LCP 1.05s; CLS 0 |

Final bundle measurements: JavaScript 40,224 bytes raw / 13,630 gzip; CSS 18,554 bytes raw / 5,010 gzip; LCP AVIF 74,110 bytes. No font files or runtime CDN scripts ship.

## Privacy and billing notes

Map data stays local. Demo storage remains under the separate `demo:` namespace. License verification sends only the token to `api.sociobot.in`; the code tests return-token, cached-valid, unavailable, and revoked behavior without a real customer purchase. Production checkout and catalog availability were verified live. A real production purchase was not created because no production test purchaser or payment method is part of this work order.

## Known gaps / next steps

No repository-controlled release gaps remain. The only external dependency is the Sociobot billing service; it was healthy and rate-limit recovery was verified during this handoff. Continue to monitor it operationally outside this static product repository.
