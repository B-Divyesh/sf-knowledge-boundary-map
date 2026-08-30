# Independent verification 5 — FAIL

**Work order:** `knowledge-boundary-map-verify-5`

**Tested candidate:** `c56f4527370a152af78b1d42e597493ab1059cc7`

**Live URL:** <https://knowledge-boundary-map.sociobot.in>

**Date:** 2026-08-30 UTC

## Decision

**FAIL.** The live static application is byte-for-byte identical to the candidate and the core local-first learning workflow is useful, accessible by axe, private during normal use, responsive, offline-capable, and well within performance budgets. Release acceptance is nevertheless blocked by the required claims gate and the paid service:

1. The exact browser claim command cannot run from a clean installed checkout because `test:e2e` starts `vite preview` without first producing `dist/`. The first required browser claim timed out waiting 60 seconds for its web server after `npm ci`. Per the acceptance contract, any failing claim test is release-blocking.
2. Production billing became unavailable during this verification. Catalog, checkout, and license verification consistently returned HTTP 503, so purchase and restore do not work. The billing claim passed once earlier in the run, then failed on a fresh rerun; this is an observed availability failure, not a stale deployment.
3. Several promises on the landing page, upgrade page, privacy page, and README are absent from `.factory/claims.json`, and the privacy test attaches its request observer only after page load. The required claims inventory therefore does not cover all shipped promises or prove the whole-load privacy assertion.

The first-read gate itself **passes**. A cold visitor sees “Check what you can explain,” the audience “self-learners testing familiar topics,” and the primary “Try it with sample data” action above the fold on desktop and 390 px mobile.

## Release-blocking findings

### High — declared browser claims do not run from a clean installed checkout

The repository was clean at the exact candidate and had no `dist/`. Before installation, the four browser commands listed by `.factory/claims.json` all failed because the local Playwright package was absent; the billing command passed. After the required `npm ci`, with `dist/` still absent, the first exact declared command failed again:

```text
$ npm run test:e2e -- --grep @claim:demo-sandbox
[WebServer] ...
Error: Timed out waiting 60000ms from config.webServer.
```

`playwright.config.ts` runs `npm run preview`, while `package.json` defines that as `vite preview --host 127.0.0.1`. Vite preview does not build the application and cannot start without `dist/`. The README nevertheless says `npm run test:e2e` “starts the production preview automatically.”

After manually running `npm run build`, all four browser claim commands passed individually. That proves the assertions themselves currently work but does not satisfy the clean-clone claim gate or the documented command.

### High — production purchase and restore service returns 503

`npm run test:billing` initially passed and observed the correct `$12 USD` catalog entry plus HTTP 303 hosted-checkout redirect. Starting at `2026-08-30T02:46:56Z`, fresh requests to all relevant production billing paths returned an Azure-generated HTTP 503 page:

```text
GET https://api.sociobot.in/api/v1/products
HTTP/2 503

GET https://api.sociobot.in/api/v1/products/knowledge-boundary-map/checkout
HTTP/2 503

GET https://api.sociobot.in/api/v1/products/knowledge-boundary-map/verify?license=qa-invalid-c56f452
HTTP/2 503
```

Five rounds at five-second intervals returned 503 for catalog, checkout, and verification every time. A final fresh claim rerun at `02:56:08Z` still returned 503 and failed with:

```text
Error: Could not read the public product catalog: HTTP 503.
```

The live “Buy lifetime studio” link therefore led to 503. Restore also failed. Because the 503 response has no product-origin CORS header, Chromium logged a CORS error and `net::ERR_FAILED`; the UI then inaccurately said “That license is not active for this product” instead of reporting service unavailability. No production purchase → return → restore → revocation lifecycle could be accepted.

The pilot billing endpoint remained healthy. Its invalid-token verification allowance was independently measured: requests 1–30 returned 200; request 31 returned 429 with `Retry-After: 4` and `X-RateLimit-After: 4`; a request after five seconds returned 200. Production rate-limit enforcement could not be tested because the first production request already returned 503.

### High — the claims inventory is incomplete and one privacy sandbox starts too late

Shipped claim-like promises without a corresponding `.factory/claims.json` entry include:

- JSON export/import and restorable full-map data.
- Keyboard-navigable map and accessible dialogs.
- The 12-claim free allowance and complete free rehearsal flow.
- “No account or analytics,” no trackers, no third-party fonts, and no runtime CDN scripts.
- Unlimited claims and full rehearsal history with Studio.

Some have ordinary repository coverage, but the claims contract requires each promise to be inventoried and tied to exactly one claim test. The listed price claim also runs a standalone script with no `@claim:studio-price-checkout` tag. In addition, `@claim:local-only` registers `page.on('request')` after `beforeEach` has already loaded and reloaded the page. It therefore cannot detect analytics, trackers, CDN scripts, or other requests made during initial load, despite the privacy language. The independent harness attached before navigation and observed only same-origin requests, so this is a claims-regression defect rather than evidence of current tracking.

## Other defects

### Medium — unknown URLs render the home app with HTTP 200

`/this-route-should-not-exist-qa` returned HTTP 200, the normal home title, and the “Check what you can explain” screen. There is no `404.html`, designed not-found route, or `responseOverrides.404` entry. This fails the required real-404 behavior and can mislead users and crawlers.

### Medium — modal close and browser Back lose keyboard focus

Opening a claim rehearsal correctly focuses “Start 90 seconds,” but closing it cannot restore the invoking claim because the click handler rerenders that claim before opening the dialog. Escape left focus on `<body>`; clicking the close button left focus on the now-closed dialog’s hidden close button. Browser Back from `/privacy` likewise restored the home content and announcement but left focus on `<body>` rather than its `<h1>`. The route also forces scroll to the top on `popstate` rather than restoring history position.

The map remains keyboard-operable, but these behaviors fail the supplied dialog and route-focus requirements and make keyboard users relocate their place.

### Medium — mandatory landing-page sections are absent

The landing page goes directly from the first-screen hero to the footer. It has no on-page live preview/product section, three-step “How it works,” explicit non-goals/privacy section, or paid-tier section. Those sections are mandatory in the supplied site-structure contract. The one-click demo partly mitigates this, and the first-read gate passes.

### Low — metadata and footer are incomplete

- The Open Graph image points to the 1152×768 hero rather than a purpose-made 1200×630 social image.
- No 180 px Apple touch icon is declared or shipped.
- The common footer has no version/build id.

## Required claim results

| Claim | Clean-gate result | Result after explicit build | Evidence |
|---|---|---|---|
| `demo-sandbox` | **Fail** — preview timed out without `dist/` | Pass, 1/1 | Separate `demo:` storage, three samples, Start for real clears demo and opens empty real map |
| `local-only` | Initial pre-install invocation could not load Playwright | Pass, 1/1 | Independent whole-flow log also found zero cross-origin requests; checked-in listener misses initial load |
| `offline-reload` | Initial pre-install invocation could not load Playwright | Pass, 1/1 | Dedicated context, controlled worker, shell assets cached, offline reload succeeds |
| `csv-export` | Initial pre-install invocation could not load Playwright | Pass, 1/1 | Header plus three sample rows |
| `studio-price-checkout` | Passed initially; **failed later** | **Fail at final fresh check** | Production catalog/checkout HTTP 503 |

Because at least one exact claim test failed from the clean installed checkout and the billing claim later failed against production, the candidate cannot pass regardless of other results.

## Clean repository gates

| Check | Result |
|---|---|
| Candidate/worktree | Clean at `c56f4527370a152af78b1d42e597493ab1059cc7` |
| `npm ci` | Pass; 59 packages, 0 reported vulnerabilities |
| `npm audit --audit-level=low` | Pass; 0 vulnerabilities |
| `npm test` | Pass; 8/8 Vitest tests |
| `npm run build` | Pass; `tsc --noEmit` and Vite 7.3.6; `dist/` produced |
| `npm run test:e2e` after build | Pass; 18/18 Playwright 1.58.2 tests |
| Live repository suite | Pass; 18/18 against the public origin |
| `npm run test:response-policy` | Pass; live AVIF is HTTP 200 and `image/avif` |
| Separate lint script | Not configured; strict TypeScript is part of the build |

This is a static PWA, not a library, CLI, or application backend. Consumer-package, CLI, server concurrency, server persistence, health/build endpoint, and sign-in-provider checks are not applicable. Its external billing endpoint was tested as described above.

## Independent end-to-end exercise

A temporary Playwright harness, separate from the checked-in tests, ran against both the local production preview and public origin.

- Entered and reset the three-claim causal-inference demo, then used Start for real and confirmed real storage stayed empty.
- Rejected a whitespace-only claim and confirmed the 160-character title boundary.
- Created five representative energy claims and a prerequisite connection.
- Confirmed required teach-back/status validation, rejected “Can explain” without a boundary, and recovered.
- Started and paused the timer at `01:29`.
- Saved “Can explain,” revisited it as “Recognize only,” and preserved two rehearsal outcomes.
- Used Home/End map navigation, exported five-claim JSON and six-line CSV, and rejected malformed JSON with recovery copy.
- Cancelled named deletion, confirmed deletion, then used Undo and verified the prerequisite connection was restored.
- Confirmed local persistence and the 12-claim free-limit behavior through independent and repository coverage.

The normal workflow produced zero console/page errors and zero cross-origin requests locally and live. The billing restore action produced the expected outage errors described above.

## Accessibility, responsive behavior, and visual review

- The factory `verify-url.sh` passed local and live: HTTP 200, correct title, `lang=en`, one `h1`, `main`, no missing image alt, no unnamed button, and no load errors.
- Independent Axe 4.10.2 scans found **0 serious/critical violations** on populated desktop, dark treatment, and populated 390×844 mobile. Repository scans also cover privacy, terms, and upgrade.
- The skip link, global `N`, roving claim focus, arrows/Home/End/Enter, dialogs, destructive confirmation, and Undo are keyboard-operable, subject to the focus-restoration defect above.
- At 390 px, viewport, body, and document widths were all 390 px. No visible interactive target measured below 44×44 px; the only sub-44 result was the intentional 1×1 visually hidden topic label.
- At 200% root text size, the document remained 390 px wide with one `h1` and one `main`.
- Under reduced motion, claim transition duration was `0.00001s`; no flashing or indefinite animation was observed.
- Desktop and mobile screenshots were visually inspected. The paper-cut workshop identity, status folds, prerequisite path, hierarchy, and phone stacking are coherent and legible.

## Privacy and PWA behavior

The independent request observer was attached before initial navigation and remained active through demo, creation, rehearsal, export, malformed import, delete, Undo, theme, mobile, and reload. All 11 observed requests were same-origin. No analytics, trackers, network fonts, runtime CDNs, or map-data transmission were observed. Local and demo storage namespaces stayed separate.

The live service worker controlled a fresh context at `/sw.js`, used cache `kbm-shell-a45d2f14a902`, and cached the root, demo/legal/upgrade routes, manifest, favicon, both hero formats, and hashed JS/CSS. `registration.update()` left no waiting or installing worker. An offline direct reload of `/privacy` rendered the Privacy page and offline status. The checked-in old-worker update regression also passed in the 18-test suite.

## Deployment identity, headers, and caching

Fresh live files match the candidate build exactly:

| Artifact | SHA-256 |
|---|---|
| `index.html` | `2e851f2615864e57801b346e93d8d67b2c12749e4437b8b8cc56a2f23ee7308f` |
| JavaScript | `75f886b4f2db33c814fb5f3c80e4745822eb1e0c5fa5603a4866b0342076f906` |
| CSS | `133b560149d9e218753e206877214112056dcab8274f22e68fc7ac0f4ba61e67` |
| `sw.js` | `011634ba1e7285974aa0d2f37e3c65d750e1988800f81b316694ec6b15ccb7f3` |
| Manifest | `208773ac396f14e7cdc362323ae5608ee7753d337ff407a2461e7d035d2c1dd4` |
| Favicon | `4e4fae9e73de6a52f5526887148bbc81e82a680503e1ece40711583c3d1f72f3` |
| AVIF hero | `93fa82826312d96d99f0352627eb09dfed882fdcf554f22662af82aa6ffde0ce` |
| WebP hero | `7198592a4befde109c3421b50b4ec659ded4dd3a5bac2ed5c0b01b2725644c42` |

HTML, legal routes, worker, and manifest use `public, must-revalidate, max-age=30`; hashed JS/CSS use one-year immutable caching; hero assets use seven-day caching. AVIF now has the correct `image/avif` type. Responses include HSTS, restrictive CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict-origin referrer policy, and disabled camera/microphone/geolocation.

## Performance and budgets

Lighthouse 13.4.1 simulated-mobile runs used Chromium 145 on `/demo`.

| Metric | Local production | Live |
|---|---:|---:|
| Performance | 100 | 99 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| FCP | 0.95 s | 0.95 s |
| LCP | 1.13 s | 1.00 s |
| Total blocking time | 65 ms | 106 ms |
| CLS | 0 | 0 |

Lab Lighthouse does not provide field INP; real-user INP requires field data. Budgets pass: JavaScript is 36,550 bytes raw / 12,620 gzip, CSS is 15,522 raw / 4,448 gzip, no font files ship, and the AVIF hero is 74,110 bytes.

## Required before release

1. Make every `.factory/claims.json` command self-contained after `npm ci`—for example, build before starting the production preview—and rerun each from a clean checkout.
2. Restore production billing availability and complete checkout, return-token storage, restore, cached-valid offline use, and revocation against production. Confirm the production 429 allowance and `Retry-After` header.
3. Inventory and tag every shipped claim; move the privacy request listener before first navigation.
4. Add a real designed 404 response.
5. Restore focus to the invoking claim after rehearsal close/save and to the page heading on Back/Forward while preserving history scroll.
6. Complete the required landing sections and metadata/footer items.
