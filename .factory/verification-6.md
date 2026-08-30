# Independent verification 6 — PASS

**Work order:** `knowledge-boundary-map-verify-6`  
**Candidate:** `8925e175e33203db0b566c7824ec403c2248631d`  
**Live URL:** <https://knowledge-boundary-map.sociobot.in>  
**Date:** 2026-08-30 UTC

## Decision

**PASS.** The requested candidate is clean, builds from scratch, and its live deployment matches the produced static artifact. The real learner workflow is usable without an account: create claims and prerequisites, rehearse from memory, record an explicitly self-assessed status and next probe, revisit the map, and export or restore it. The required one-click demo is isolated from real storage.

## Mandatory first gates

### Claims from the clean checkout

I began with the exact commands declared in `.factory/claims.json`, after `npm ci`, with the Playwright configuration building and serving the production preview itself. Every command passed; the shell was chained with `&&`, so later commands only ran after the preceding command succeeded. The final Playwright result was `status: passed` with no failed tests.

| Claim | Exact command result | Observable evidence |
|---|---|---|
| `demo-sandbox` | Pass, 1/1 | `/demo` seeded three causal-inference claims under `demo:kbm:map:v1`; real namespace stayed empty and Start for real discarded demo data. |
| `local-only` | Pass, 1/1 | Request observer attached before navigation saw only the application origin through demo rehearsal. |
| `offline-reload` | Pass, 1/1 | Controlled service worker reloaded the app offline. |
| `csv-export` | Pass, 1/1 | CSV header and all three sample rows downloaded. |
| `json-restore` | Pass, 1/1 | Rehearsed claim, result, and next probe returned after JSON restore. |
| `keyboard-dialog` | Pass, 1/1 | Arrow/Enter opened a rehearsal; Escape returned focus to the invoking claim. |
| `free-workshop` | Pass, 1/1 | Twelfth claim is usable; thirteenth produces the free-limit notice. |
| `self-assessment-label` | Pass, 1/1 | Landing and rehearsal explicitly say this is self-assessment, not intelligence measurement. |
| `studio-features` | Pass, 1/1 | Cached valid Studio verdict exposes a thirteenth claim form and complete history. |
| `studio-price-checkout` | Pass, 1/1 | Public catalog reported 1,200 USD cents and checkout returned a hosted redirect. |

### Cold first-read test — PASS

Fresh live desktop and 390 px mobile loads rendered one `h1`, **“Check what you can explain.”** The immediate sentence says: **“For self-learners testing what feels familiar. Pin a claim, teach it back, and choose your next question.”** It identifies the job, intended learner, and change in plain language. The first primary action is the visible **“Try it with sample data”** button; clicking it opens `/demo` directly into a populated causal-inference map. This meets the plain-words and one-click-demo gate.

## Clean local verification

The worktree was clean at the requested SHA before installation. No product code was changed during this verification.

| Check | Result |
|---|---|
| `npm ci` | Pass; 59 packages installed, 0 audit vulnerabilities |
| `npm audit --audit-level=low` | Pass; 0 vulnerabilities |
| `npm test` | Pass; 9 Vitest tests |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass (strict TypeScript) |
| `npm run build` | Pass; exact production command generated `dist/` |
| `npm run test:billing` | Pass; catalog record at $12 USD and checkout HTTP 303 |
| `npm run test:response-policy` | Pass; deployed AVIF returned HTTP 200 `image/avif` |
| `npm run test:e2e` | Pass; 26 Playwright tests |
| `PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e` | Pass; 26/26 against production |

The production bundle is comfortably within static-product budgets: JavaScript 40,217 bytes raw / 13,630 gzip and CSS 18,554 bytes raw / 5,010 gzip. The AVIF LCP image is 74,110 bytes; no font files or runtime CDN scripts ship. A fresh Lighthouse 13.0.1 mobile audit of live `/demo` scored Performance 100, Accessibility 100, Best Practices 100, and SEO 100 (FCP 1.2 s, LCP 1.2 s, TBT 0 ms, CLS 0).

## Independent product exercise

In a fresh production browser context, I independently:

- created five chemistry claims after the whitespace-only claim validation returned “Write a claim before pinning it”; 
- rehearsed a claim, confirmed “Can explain” is rejected until a counterexample/boundary is provided, then saved the self-assessment;
- downloaded both `knowledge-boundary-map-2026-08-30.json` and `.csv`;
- imported malformed JSON and received the recovery instruction “Choose a Knowledge Boundary Map JSON export and try again”;
- deleted a claim through named confirmation, then used Undo (count changed 5 → 4 → 5);
- observed no console or page errors throughout.

The checked-in browser suite separately covers prerequisites, field boundaries, persistent storage, malformed typed rehearsals, the 12-claim limit, Studio history, focus restoration, route Back/Forward, real 404 behavior, and service-worker update from an old client.

## Accessibility, responsive, privacy, and PWA checks

- `/opt/fleet/lib/verify-url.sh https://knowledge-boundary-map.sociobot.in/demo` passed: HTTP 200; Demo title; `lang=en`; one `h1`; `main`; all images have alt attributes; zero unnamed buttons and zero console errors (722 ms load).
- Independent Axe 4.10.2 Playwright scan on the live landing screen found **0 serious/critical** issues. The repository suite also scans populated/dark/mobile, Privacy, Terms, and upgrade states.
- Keyboard test on live demo passed: roving Arrow navigation moved to the next claim, Enter opened the dialog with focus on Start 90 seconds, and Escape returned focus to the claim. Visible focus contrast is covered in the suite for both themes.
- At 390×844, document width equalled viewport width (390 px), the primary demo target was 245.7×48.8 px, and visual inspection showed intentional stacking with no clipping. At 200% text size, width remained 390 px and `h1`/`main` stayed visible. Reduced-motion transition duration was `0.00001s` and no errors occurred.
- A request log installed before the first live navigation and retained through demo rehearsal saw only `https://knowledge-boundary-map.sociobot.in`; no analytics, trackers, third-party fonts, runtime CDN scripts, or map data requests were observed. The only optional external request is billing verification after an explicit license action, as the privacy notice states.
- Live PWA check: `/privacy` was controlled by `/sw.js`, `registration.update()` left no waiting/installing worker, cache `kbm-shell-0846b49847f3` was present, and the page reloaded offline with its Privacy heading and the offline notice. The old-worker-to-current update path also passes in the 26-test suite.

## Billing allowance

The public license-verification endpoint was tested with a unique invalid token. Requests 1–30 returned HTTP 200 with the normal invalid verdict. Requests 31–35 returned **HTTP 429** with `Retry-After: 4` (and `X-RateLimit-After: 4`). After five seconds, a fresh invalid-token request returned HTTP 200. Observed allowance: **30 verification requests per client before a four-second retry window**.

Checkout catalog and redirect work in production. A real paid purchase was not created because this work order provides no production purchaser or payment authority; return-token, cached-valid, invalid, unavailable, and revocation behavior are covered by the repository browser tests without charging a customer.

## Deployment identity, headers, and caching

Fresh live artifact hashes exactly matched the clean candidate build:

| Artifact | SHA-256 |
|---|---|
| `index.html` | `ee022f9594af9ef7e2c6116e59da62098461bfb32a45ad8ae2f5008e21904347` |
| `assets/index-Df1cpw5H.js` | `c13487b199b8f552416f97cacf5b86b8f7ac0c42ecc224829bee52e318fc6088` |
| `assets/index-C8uZKbkP.css` | `7f4b90e4d2196ae02ae6d561713061bdfdaf83cf43bd90e10d4a1819eb797bef` |
| `sw.js` | `64b338acbe105beb5e605b9e9255041e27a79dfc109b61b9ce046bfd819301dd` |
| `manifest.webmanifest` | `208773ac396f14e7cdc362323ae5608ee7753d337ff407a2461e7d035d2c1dd4` |
| `assets/boundary-diorama.avif` | `93fa82826312d96d99f0352627eb09dfed882fdcf554f22662af82aa6ffde0ce` |

Live responses have restrictive CSP including response-header `frame-ancestors 'none'`, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and disabled camera/microphone/geolocation. HTML/worker/manifest use 30-second revalidation; hashed JS/CSS use one-year immutable caching; hero imagery uses seven-day caching. `/no-such-qa` returns the designed 404 with HTTP 404.

## Defects

No release-blocking, high, medium, or low defects found for this candidate.

