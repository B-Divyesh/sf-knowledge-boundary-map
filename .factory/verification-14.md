# Independent verification 14 — PASS

**Work order:** `knowledge-boundary-map-verify-14`
**Candidate:** `ec985d133db89b2e1d44b43fd15ae636aeb4b0c2`
**Live URL:** <https://knowledge-boundary-map.sociobot.in>
**Date:** 2026-09-02 UTC

## Decision

**PASS.** The deployed static PWA is byte-for-byte the requested candidate, completes the brief's real self-assessment workflow, and passes the claims, first-read, clean build, browser, accessibility, privacy, offline, recovery, and performance gates. The prior review's blocking unlisted no-purchase promise is absent from the candidate and live `/terms` page.

No product code was changed. `.factory/evidence-14/`, this report, and the handoff are verification-only changes.

The disposable checkout initially pointed at supplied base SHA `79285a407e97012a7800c7877347b4f896ec171a`. I fetched and detached at the requested candidate before the authoritative run below. Every mandatory claim command was restarted there.

## Mandatory first gates

After `npm ci`, all 13 commands in `.factory/claims.json` were run separately and exactly as declared. All passed. The command record is `.factory/evidence-14/claim-tests.json`.

| Claim | Result | Observable evidence |
|---|---|---|
| `demo-sandbox` | Pass | Demo opened with three realistic claims; reset and both exits kept the real-map marker isolated. |
| `local-only` | Pass | The rehearsal flow requested only the product origin. |
| `offline-reload` | Pass | A dedicated context reloaded `/demo` offline with its map and notice. |
| `csv-export` | Pass | CSV contained its header and all three sample claims, including the blocked claim. |
| `json-restore` | Pass | Topic, claims, prerequisites, history, boundary, and next question returned after import and reload. |
| `keyboard-dialog` | Pass | Arrow/Enter navigation opened rehearsal; Escape restored claim focus. |
| `free-workshop` | Pass | Twelve claims loaded; a thirteenth was rejected without changing the map. |
| `self-assessment-label` | Pass | The result persisted and remained labelled as self-assessment, not objective scoring. |
| `theme-storage` | Pass | Real and demo theme keys remained separate; exiting demo removed only the demo key. |
| `prerequisites` | Pass | A saved prerequisite relation remained after reload. |
| `teach-back-timer` | Pass | The timer began at 01:30 and advanced. |
| `counterexample-capture` | Pass | A Can explain result retained its required boundary. |
| `next-question` | Pass | The blocked claim and its specific next question appeared first. |

Cross-checking the landing page, app, README, privacy page, and terms page found no unlisted visitor-facing operational claim. Candidate regression test `@finding:F-4-1` confirms the prior sentence “No purchase is offered in this release” is gone.

### Cold first-read

**Pass at 1440×900 and 390×844.** The first screen immediately says:

- what it does: **“Test what you can explain.”**
- who it is for: **“For self-learners who want to separate recognition from an explanation they can produce.”**
- what to do first: **“Try it with sample data,”** followed by **“Opens a completed causal-inference map.”**

The primary action is above the fold at both sizes. One click opens `/demo` with three connected claims, mixed self-assessments, a specific next question, and the persistent **Demo — sample data, nothing is saved to your real map** controls. Screenshots are in `.factory/evidence-14/`.

## Clean repository and browser gates

| Check | Result |
|---|---|
| Candidate identity | Pass — exact requested SHA |
| `npm ci` | Pass — 59 packages, 0 vulnerabilities |
| 13 exact claim commands | Pass — 13/13 |
| `npm test` | Pass — 16/16 |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm audit --audit-level=low` | Pass — 0 vulnerabilities |
| `npm run build` | Pass — `dist/` produced |
| `npm run test:response-policy` | Pass — live hero returned 200 `image/avif` |
| `npm run test:e2e` | Pass — 26/26 local production preview |
| `PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e` | Pass — 26/26 live |
| Factory `verify-url.sh` | Pass — HTTPS 200, title, `lang`, one H1, main, alt/button names, zero errors |
| Independent live flow | Pass — `.factory/evidence-14/live-qa.json` |

This is a static PWA, not a library/CLI or backend. Consumer-package, backend concurrency, health endpoint, persistence-boundary, API allowance/429, and Entra sign-in checks do not apply. It has no server-side product or billing endpoint. The brief excludes automatic truth checking; runtime AI would undermine this local, user-authored workflow. JSON and CSV provide the relevant portability path.

## Independent end-to-end and recovery evidence

The independent live script additionally confirmed:

- creation and persistence at the supported 160-character title and 600-character context boundaries;
- persistence of a 5,000-character teach-back, 2,000-character boundary, and 1,000-character next question;
- rejection of a blank required claim;
- specific recovery guidance when Can explain lacked a boundary and next question;
- malformed JSON rejection without replacing the map;
- cancel removal, confirmed removal, and Undo restoration;
- reload persistence and a designed 3 px focus ring;
- keyboard Enter/Escape operation and focus restoration;
- blocked-storage warning with in-memory work and Export still available;
- complete function and no horizontal overflow at 200% root text size.

## Accessibility, layout, routing, and visual review

- Independent Axe scans of `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` found 0 serious/critical issues. The repository matrix also passed desktop/mobile and light/dark.
- At 390 px in dark mode, there was no horizontal overflow. All 17 visible interactive targets were at least 44×44 px.
- The first Tab exposed the skip link; Enter focused `#main`. Dialog focus, names, roles, states, labels, and live errors passed.
- Reduced motion produced `0.01ms` animation/transition timing and `scroll-behavior: auto`.
- Every discovered HTTP link returned 200. Both `mailto:` links were treated as non-HTTP actions. Robots, sitemap, manifest, icons, and social card returned 200 with correct types.
- Unknown URLs returned the designed page with HTTP 404. Titles, canonicals, one-H1/main structure, Back navigation, and focus movement passed.
- Visual inspection found a distinct paper-cut explanation-workshop identity with legible light/dark hierarchy and no clipping.
- There were 0 console errors and 0 uncaught page errors.

## Privacy, headers, and caching

The independent full workflow made 30 logged browser requests, all to `https://knowledge-boundary-map.sociobot.in`. It made no analytics, tracker, font, account, upload, billing, API, or model request.

The live HTML response includes a self-only CSP with response-header `frame-ancestors 'none'`, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and disabled camera/microphone/geolocation. HTML and the service worker use `public, must-revalidate, max-age=30`; hashed JS/CSS use `public, max-age=31536000, immutable`. An unknown route returned HTTP 404 with a body matching candidate `dist/404.html`.

## PWA and performance

The live service worker controlled `/demo`, used cache `kbm-shell-7782b3058487`, and reloaded the demo offline with its notice. The production suite's simulated prior-worker check updated an old controlled client, deleted the old cache, loaded this build, and still reloaded offline.

- JavaScript: 36,442 bytes raw / 12,324 bytes gzip (budget 200 KB)
- CSS: 18,942 bytes raw / 5,107 bytes gzip (budget 50 KB)
- fonts: 0 bytes (budget 120 KB)
- hero AVIF: 74,110 bytes (budget 300 KB)

Fresh Lighthouse 13.4.1 mobile runs:

| Route | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Transfer |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `/` | 99 | 100 | 100 | 100 | 1.0 s | 1.5 s | 100 ms | 0 | 93 KiB |
| `/demo` | 99 | 100 | 100 | 100 | 0.9 s | 1.0 s | 130 ms | 0 | 20 KiB |

Lighthouse has no lab INP value. The interactive workflow completed without long-task symptoms, and TBT stayed below 200 ms. Full reports are in `.factory/evidence-14/`.

## Candidate and deployment identity

All 16 public build artifacts matched live byte-for-byte, including HTML, hashed JS/CSS, hero formats, metadata assets, 404 assets, manifest, sitemap, and service worker. The full list is `.factory/evidence-14/deployment-artifact-hashes.txt`.

| Artifact | SHA-256 |
|---|---|
| `index.html` | `7e27f1330c76f539beea2621c37569dcbb74b01925c3f054d387a9be687ced8f` |
| `assets/index-TFzw1x8X.js` | `c21d9f84437f4fdab358d10b6f513a330c114ab94972e123e85f74c7d1666a51` |
| `assets/index-B4EWOLRp.css` | `b8f41a29a876620867d5e1b7f90c6f19a82204f4c62b01cbdd6346cc6034740d` |
| `sw.js` | `f2d5183144d930c354940e069f435195fae8527cce9e40389d409dc948ca50bb` |

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Conclusion

**PASS — candidate `ec985d133db89b2e1d44b43fd15ae636aeb4b0c2` is verified at <https://knowledge-boundary-map.sociobot.in>.**
