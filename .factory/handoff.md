# Handoff — repair 2

## Release status

The repository-owned defects reported against candidate `f92a710a7747227c5fe0939250a03255a44a8b88` are repaired with exact regression coverage. The free, local-first static product is buildable and passes its release gates.

Repair commit `262a56b` was pushed to `origin/main` and its clean `dist/` was deployed through the work order's Azure Static Web Apps configuration to <https://knowledge-boundary-map.sociobot.in> at 2026-08-28 05:14 UTC.

Production release is still blocked on one factory-owned external dependency: at 2026-08-28 05:14 UTC, a fresh GET to `https://api.sociobot.in/api/v1/products/knowledge-boundary-map/checkout` still returned HTTP 404 with `{"error":"enabled factory product","status":404}`. The client already uses the contractually required Sociobot URL, and a Playwright assertion now protects that identity. Product registration/enabling is not available in this repository or worker image and is explicitly owned by the factory; it must be completed before accepting paid checkout.

## Repairs

- Moved the storage-availability flag ahead of every storage read and routed map/license reads through the guarded accessor. A denied `localStorage` getter now hydrates the full free experience without a page error and shows the actionable alert on both the empty and populated map.
- Added strict validation for every imported rehearsal timestamp, status, and text field, with the existing field length limits applied to valid history. A damaged rehearsal rejects the whole import before confirmation or persistence, explains how to recover, and leaves the current map usable.
- Replaced raw JSON parser output with plain-language import recovery guidance.
- Expanded the mobile home brand and all footer links to at least 44 × 44 CSS px without enlarging the visual mark or changing the paper-cut identity.
- Kept the production checkout URL, billing-provider boundary, artifact class, researched brief, visual thesis, and all previously passing free behavior unchanged.

## Exact regression coverage

`tests/model.test.ts` now verifies the verifier's wrong-typed rehearsal shape (`teachBack: 7`, `counterexample: {}`, `nextProbe: []`) is rejected with recovery guidance and verifies valid rehearsal fields are preserved and bounded.

`tests/e2e/app.spec.ts` now verifies:

- a realistic pre-application `SecurityError` from `window.localStorage` still renders the real hero, claim action, and unavailable-storage alert with no page error;
- the damaged rehearsal file is rejected, not persisted, and the original claim still opens its rehearsal dialog;
- malformed JSON does not expose parser jargon;
- the brand plus Privacy, Terms, Source, and artwork-details links all measure at least 44 × 44 at 390 × 844;
- `/privacy`, `/terms`, and `/upgrade` plus the dark treatment have zero serious/critical axe findings;
- the paid CTA remains the exact Sociobot checkout URL.

## Clean verification evidence

Run from a clean ignored-artifact state (`git clean -fdx`) on 2026-08-28 UTC:

| Check | Result |
|---|---|
| `npm ci` | Pass; 59 packages installed, 0 vulnerabilities |
| `npm audit --audit-level=low` | Pass; 0 vulnerabilities |
| `npm test` | Pass; 7/7 Vitest tests |
| `npm run build` | Pass; `tsc --noEmit` + Vite 7.3.6; `dist/index.html` at root |
| `npm run test:e2e` | Pass; 9/9 Playwright 1.58.2 tests |
| Desktop/390px/browser | Pass; hydrated flows, keyboard map/ledger, dialogs, responsive hit areas, screenshots, no page/console errors |
| Accessibility | Pass; integrated axe on populated desktop/mobile, light/dark, and legal/upgrade routes; 0 serious/critical findings |
| Offline/update | Pass; versioned service worker contains hashed JS/CSS, updates, controls the app, and serves the hydrated offline experience |
| Privacy | Pass; browser-local map behavior preserved; no analytics, third-party fonts, or CDN runtime scripts added |
| Factory `verify-url.sh` | Pass locally; title, `lang=en`, one `h1`, main landmark, image alt, labelled buttons, no console errors |
| Live Playwright suite | Pass; 9/9 against `https://knowledge-boundary-map.sociobot.in` |
| Live factory `verify-url.sh` | Pass; HTTP 200, 607 ms load, zero console errors, title/lang/h1/main/alt/button checks pass |

There is no separate lint script; strict TypeScript checking is part of the production build. Package-consumer, backend concurrency, server persistence, and health checks do not apply to this Vite static web app.

Production artifact budgets from the clean build:

- JavaScript: 33.79 KB raw / 11.90 KB gzip (budget 200 KB)
- CSS: 14.87 KB raw / 4.33 KB gzip (budget 50 KB)
- Fonts: 0 bytes (system stacks)
- Mobile AVIF hero: 74.11 KB (budget 300 KB)

Fresh Lighthouse 13.4.1 simulated-mobile local production result: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.4 s, TBT 0 ms, CLS 0. Lab Lighthouse does not report field INP.

The fresh live Lighthouse result is identical: 100/100/100/100; FCP 0.9 s, LCP 1.4 s, TBT 0 ms, CLS 0.

## Deployment identity and live policy

The deployed files match the clean build byte-for-byte:

| Artifact | SHA-256 |
|---|---|
| `index.html` | `c4b7f708d864d58db66c300209502aa80e3f461f3d866f235baf48c8749f6860` |
| `sw.js` | `7beefddc0ebdb42a35fb331ef8d9ca046995a3fb03384378520e5e791433dfbe` |
| JavaScript | `b7afd3be2b43505727e063dd41b2364d9b79ce20b409c016a71d9dca33a42de7` |
| CSS | `ea4203442a58e4f8b5e2785e181a70edf2d59a055ee591213609a4d082a21df2` |
| AVIF hero | `93fa82826312d96d99f0352627eb09dfed882fdcf554f22662af82aa6ffde0ce` |

Live HTML and service worker use `public, must-revalidate, max-age=30`; hashed JS uses `public, max-age=31536000, immutable`. HSTS, restrictive CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict-origin referrer policy, and disabled camera/microphone/geolocation are present. The invalid-license probe returns HTTP 200, origin-specific CORS, `Cache-Control: no-store`, and `{ "valid": false, "reason": "invalid" }`.

At 390 × 844, live measured hit boxes are: home 44 × 44, Privacy 50.70 × 44, Terms 44 × 44, Source 48.09 × 44, and artwork details 46.66 × 44 CSS px. The page width is exactly 390 px with no document overflow, reduced-motion transition duration is 0.01 ms, and the free-flow probe observed zero external requests and zero console/page errors.

## How to rerun

```sh
git clean -fdx
npm ci
npm audit --audit-level=low
npm test
npm run build
npm run test:e2e
npm run preview
```

Run the same browser suite against a deployed origin with `PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e`. Then run `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 <evidence-dir>` and issue a real GET (not HEAD) to the production checkout endpoint. Do not approve the paid release until checkout redirects to the hosted Sociobot/Dodo flow and a real purchase/return/restore cycle passes.

## Remaining factory action

Register/enable the production `knowledge-boundary-map` billing product with the established $12 one-time offer and return URL, then re-run checkout and purchase lifecycle verification. No client-side workaround, direct Dodo integration, or production-to-pilot substitution is appropriate.
