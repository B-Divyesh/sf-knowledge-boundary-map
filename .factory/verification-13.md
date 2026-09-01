# Independent verification 13 — PASS

**Work order:** `knowledge-boundary-map-verify-13`  
**Candidate:** `e615c6705759d5f713a29116e87c2dfac1748186`  
**Live URL:** <https://knowledge-boundary-map.sociobot.in>  
**Date:** 2026-09-01 UTC

## Decision

**PASS.** The live static PWA matches the requested candidate byte-for-byte, completes the brief's self-assessment workflow, and passes the mandatory claims, first-read, clean build, browser, accessibility, privacy, offline, and performance gates. The previously reported deployment-only concern does not reproduce.

No product code was changed during verification. `.factory/evidence-13/`, this report, and the handoff are verification-only additions.

## Mandatory first gates

The checkout began clean at the exact requested SHA. After `npm ci`, every command in `.factory/claims.json` was run separately and exactly as listed. All 13 passed. A second grouped run produced the machine-readable result at `.factory/evidence-13/claim-tests.json` (13 passed, 0 failed).

| Claim | Result | Evidence |
|---|---|---|
| `demo-sandbox` | Pass | Separate demo storage preserved the real-map marker; reset and both exits passed. |
| `local-only` | Pass | A complete rehearsal flow requested only the product origin. |
| `offline-reload` | Pass | A dedicated context reloaded `/demo` offline with its map and offline notice. |
| `csv-export` | Pass | Download contained the header and all three sample claims, including the blocked claim. |
| `json-restore` | Pass | Topic, claims, prerequisites, rehearsal history, boundary, and next question returned after import and reload. |
| `keyboard-dialog` | Pass | Arrow keys moved claim focus; Enter opened rehearsal; Escape restored focus. |
| `free-workshop` | Pass | Twelve claims were retained and a thirteen-claim import was rejected without changing the map. |
| `self-assessment-label` | Pass | The saved result persisted and remained labelled as self-assessment, not objective scoring. |
| `theme-storage` | Pass | Real and demo theme keys remained separate; demo exit removed only the demo key. |
| `prerequisites` | Pass | A saved prerequisite relationship remained after reload. |
| `teach-back-timer` | Pass | The timer began at 01:30 and advanced after starting. |
| `counterexample-capture` | Pass | A Can explain result retained its required counterexample or boundary. |
| `next-question` | Pass | The blocked claim and its specific next question appeared first. |

The observable live-flow record is `.factory/evidence-13/live-qa.json`; screenshots are `live-first-read-desktop.png` and `live-demo-mobile-390.png` in the same directory. Cross-checking the landing page, legal pages, and README found no unlisted visitor-facing product claim.

### Cold first-read

**Pass at 1440×900 and 390×844.** In a fresh context, the first screen immediately states:

- what it does: **“Test what you can explain.”**
- for whom and what changes: **“For self-learners who want to separate recognition from an explanation they can produce.”**
- what to select first: **“Try it with sample data”**, followed by **“Opens a completed causal-inference map.”**

That button opens `/demo` in one click with three realistic, connected causal-inference claims, mixed self-assessments, a specific next question, and the persistent **Demo — sample data, nothing is saved to your real map** banner with **Reset demo** and **Start for real**.

## Clean local and live gates

| Check | Result |
|---|---|
| Candidate identity and initial worktree | Pass — exact SHA, clean |
| `npm ci` | Pass — 59 packages, 0 vulnerabilities |
| 13 exact claim commands | Pass — 13/13 |
| `npm test` | Pass — 15/15 |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm audit --audit-level=low` | Pass — 0 vulnerabilities |
| `npm run build` | Pass — `dist/` produced |
| `npm run test:response-policy` | Pass — live hero returned 200 `image/avif` |
| `npm run test:e2e` | Pass — 25/25 local production preview |
| `PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e` | Pass — 25/25 live |
| Factory `verify-url.sh` | Pass — HTTPS 200, title, `lang`, one H1, main, alt/button names, zero errors |

This is a static PWA with no library/CLI package, backend, sign-in, billing unlock call, or server-side endpoint. Consumer-package, concurrency, persistence-boundary, health/build-identity endpoint, request-allowance/429, and Entra-authority checks are not applicable. The brief explicitly excludes automatic truth checking; adding runtime AI would work against the local, user-authored job. JSON/CSV import and export provide the relevant portability feature.

## Independent end-to-end and recovery checks

A separate live Playwright flow outside the repository assertions confirmed:

- one-click demo isolation with a real-map marker left unchanged;
- creation at the supported 160-character claim and 600-character context boundaries;
- native recovery for blank required claim and teach-back fields;
- specific recovery text when Can explain lacks a boundary and next question;
- saved self-assessment and rehearsal history after reload;
- cancel removal, confirmed removal, and Undo recovery;
- malformed JSON guidance;
- rejection of 13 claims without changing the current map;
- keyboard Tab, arrow, Enter, and Escape behavior with a solid 3 px focus ring;
- graceful browser-storage failure with an alert, in-memory work, and Export still available.

At 390 px in dark mode there was no horizontal overflow, all 18 visible targets were at least 44×44 px, and the layout remained clear. At 200% root text size the H1 and all work remained present with zero horizontal overflow. Focus-ring contrast is 6.08:1 or better in light mode and 6.83:1 or better in dark mode.

## Accessibility, routing, and visual review

- The live suite ran Axe across `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` at desktop/mobile and light/dark: no serious or critical findings.
- The independent desktop and 390 px scans also found 0 serious/critical issues and 0 console/page errors.
- Reduced-motion emulation left no material transition, animation duration, or smooth scrolling.
- Route titles, canonical URLs, one-H1/main structure, focus movement, Back behavior, real 404, labels, alt text, and skip-link behavior passed.
- Every discovered internal link returned 200; the public GitHub source link returned 200. `mailto:` links were identified and not opened.
- Visual inspection found an intentional paper-cut workshop identity on desktop and phone, legible hierarchy, visible state labels, and no clipping.

## Privacy, requests, headers, and caching

The independent full flow made nine requests, all to `https://knowledge-boundary-map.sociobot.in`. There were no accounts, analytics, trackers, third-party fonts/scripts, uploads, API calls, billing calls, or model calls.

Live responses include a self-only CSP with response-header `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, HSTS, strict-origin referrer policy, and disabled camera/microphone/geolocation. HTML, the service worker, and manifest use `public, must-revalidate, max-age=30`; hashed JS/CSS use `public, max-age=31536000, immutable`; the hero uses the configured seven-day cache and correct AVIF type. A missing route returns the designed page with HTTP 404.

## PWA and performance

The live service worker controlled `/demo`, was activated with no waiting worker, used cache `kbm-shell-571480d52b1b`, and reloaded the full demo offline with its offline notice. The suite's simulated prior-worker update also passed.

Production budgets:

- JavaScript: 36,482 bytes raw / 12,346 bytes gzip (budget 200 KB)
- CSS: 19,252 bytes raw / 5,182 bytes gzip (budget 50 KB)
- fonts: 0 bytes (budget 120 KB)
- hero AVIF: 74,110 bytes (budget 300 KB)

Fresh Lighthouse 13.0.1 mobile runs (with no runtime error or warning):

| Route | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Transfer |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `/` | 100 | 100 | 100 | 100 | 0.9 s | 1.4 s | 0 ms | 0 | 93 KiB |
| `/demo` | 99 | 100 | 100 | 100 | 1.0 s | 1.1 s | 120 ms | 0 | 20 KiB |

Lighthouse does not provide field INP here. Direct map, dialog, validation, import, and navigation interactions completed without a long-task symptom, and TBT stayed below 200 ms.

## Candidate and deployment identity

The following candidate build artifacts match live byte-for-byte:

| Artifact | SHA-256 |
|---|---|
| `index.html` | `2073423c5b7e9d163f19ba88a70367668141342b795a51df035e40d67191f938` |
| `assets/index-DCXFTcNK.js` | `699db035acd39825457d4b1b4553bdda9c2e4c22bc527651a8711663245323a2` |
| `assets/index-BIFJACiF.css` | `60cc10eb6c9bb491f83e8c9cc5d9db24a462c31ac7b04203387f9262370a1d86` |
| `sw.js` | `6c9772a3abb01d5748ff2d2e67bde429a8091a958f19ade83f2672d5a9d1c59a` |
| `manifest.webmanifest` | `fa6a3ae344192f7e4e9bc91aec304be63328f3f81dfd959e8bb24eeec87a3d23` |
| `404.html` | `758be05fb1717674e3f9e8076aab94cb53143fc379b07e2101ccaa2dd33d3ce8` |
| `assets/boundary-diorama.avif` | `93fa82826312d96d99f0352627eb09dfed882fdcf554f22662af82aa6ffde0ce` |
| `apple-touch-icon.png` | `c1051d6f8d264357ac3eb816999dba861511ada9f3e5128c7737098005d63183` |
| `assets/social-card.webp` | `25509aad47c95b1e694b3222f276539d1a4a3370a6748472c7ab2d634ffeb542` |

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Conclusion

**PASS — candidate `e615c6705759d5f713a29116e87c2dfac1748186` is verified at <https://knowledge-boundary-map.sociobot.in>.**
