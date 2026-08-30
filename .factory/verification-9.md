# Independent verification 9 — FAIL

**Work order:** `knowledge-boundary-map-verify-9`  
**Candidate:** `57d5b794dece30468a65571c401ea36a9bc1ed71`  
**Live URL:** <https://knowledge-boundary-map.sociobot.in>  
**Date:** 2026-08-30 UTC

## Decision

**FAIL.** The candidate and deployment pass the learner workflow, all 12 declared claim commands, clean build/tests, privacy checks, PWA behavior, axe scans, performance budgets, and byte-for-byte deployment identity. Release acceptance is blocked by two contract failures:

1. Interactive targets remain below the required 44 px minimum: the Privacy and Terms contact links are 19 px high at 390 px and desktop, and prerequisite checkbox labels are 42 px high on desktop.
2. The checked-in `@claim:json-restore` test does not perform the replacement described by its claim sandbox. It imports the exported sample over the same unchanged sample, then checks values that existed before import. A no-op importer would pass.

No product code was changed during verification.

## Mandatory first gates

### Claims from the clean checkout

`.factory/claims.json` exists and declares 12 tests. After `npm ci`, each exact command was run separately through the product's production-preview demo entry point. All 12 commands passed, 1/1 each:

| Claim | Result |
|---|---|
| `demo-sandbox` | Pass |
| `local-only` | Pass |
| `offline-reload` | Pass |
| `csv-export` | Pass |
| `json-restore` | Pass, but its assertion is not causally valid; see defect below |
| `keyboard-dialog` | Pass |
| `free-workshop` | Pass |
| `self-assessment-label` | Pass |
| `prerequisites` | Pass |
| `teach-back-timer` | Pass |
| `counterexample-capture` | Pass |
| `next-question` | Pass |

The claim suite produced stdout rather than traces. The full 17-test Playwright suite also passed locally and against the live URL.

### Cold first-read test

**Pass.** A fresh 1440×900 live viewport immediately showed:

- job: **“Test what you can explain.”**
- audience/change: **“For self-learners who want to separate recognition from an explanation they can produce.”**
- first action: **“Try it with sample data.”**

One click opened `/demo` with three connected causal-inference claims, mixed self-assessments, and a concrete blocked next question. The persistent banner said sample data does not touch the real map and exposed Reset demo and Start for real. The cold load made four same-origin requests and logged no console/page errors.

## Clean local verification

The checkout began clean at the requested SHA. Installation/build output remains ignored; only this report and the required handoff update were added.

| Check | Result |
|---|---|
| `npm ci` | Pass; 59 packages, 0 vulnerabilities |
| 12 commands from `.factory/claims.json` | Pass; 12/12 |
| `npm test` | Pass; 10/10 Vitest tests |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass; strict TypeScript alias |
| `npm audit --audit-level=low` | Pass; 0 vulnerabilities |
| `npm run build` | Pass; exact production build created `dist/` |
| `npm run test:e2e` | Pass; 17/17 |
| `PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e` | Pass; 17/17 |
| `npm run test:response-policy` | Pass; live hero is HTTP 200 `image/avif` |
| Factory `verify-url.sh` on live `/demo` | Pass; title/lang/H1/main/alt/button names and zero console errors |

This is a static PWA, not a library, CLI, backend, or sign-in product. Consumer packing, server concurrency/persistence/health, API rate-limit, and Entra authority checks are not applicable. There are no product-unlock calls or server-side endpoints in this release.

## Independent end-to-end exercise

A separate fresh live context, outside the repository suite, completed the real job:

- rejected a whitespace-only claim and recovered;
- created five representative CSS claims and persisted their topic;
- connected prerequisites and verified them after reload;
- enforced the 160-character title boundary;
- used native required-field validation, then recovered from missing-status and missing-boundary errors;
- recorded **Can explain**, reopened the claim, downgraded it to **Recognize only**, and retained both rehearsal-history entries;
- exported five claims as JSON and CSV (six CSV rows including the header);
- rejected malformed JSON with a specific retry instruction;
- cancelled removal, then confirmed removal and restored the claim and its prerequisite link with Undo.

All 11 requests observed across this flow stayed on `https://knowledge-boundary-map.sociobot.in`; failed requests, console errors, and page errors were all zero.

A separate valid-import test exported the demo, left demo mode, created a different real map, and imported the export. It replaced the prior map and restored all three claims, the topic, a rehearsal-history entry, two prerequisite links, and the saved counterexample. This proves the runtime feature works despite the checked-in test defect.

When `localStorage` was forced to throw, the app showed its `role=alert` warning, kept an in-memory claim usable, advised export before leaving, and emitted no console/page error.

## Privacy, headers, and caching

The cold landing load and the entire independent workflow contacted only the product origin. No analytics, trackers, third-party fonts/scripts, uploads, API calls, or account traffic occurred. Demo isolation and removal were independently covered by the passing claim test.

Live responses include:

- CSP restricted to self, with response-header `frame-ancestors 'none'`;
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, HSTS, strict-origin referrer policy, and disabled camera/microphone/geolocation;
- HTML, worker, and manifest: `public, must-revalidate, max-age=30`;
- hashed JS/CSS: `public, max-age=31536000, immutable`;
- hero AVIF: `public, max-age=604800`, correct `image/avif` type.

## Accessibility, responsive behavior, and routing

- Axe 4.10.2 found **0 serious/critical** findings on `/`, `/demo`, the rehearsal dialog, `/privacy`, `/terms`, and the designed 404 in light/dark at 1366×900 and 390×844.
- Every valid route had `lang=en`, one H1, one main landmark, route-specific title, and no missing image alt. No valid route logged a console/page error. The expected 404 navigation itself produced HTTP 404.
- Every checked 390 px page had document width exactly 390 px. Visual inspection showed intentional stacking and no clipping.
- Keyboard-only checks passed in light/dark: first Tab revealed the 168.9×44.8 px skip link; Enter focused main; Tab reached the claim map; Arrow Right changed claims; Enter focused Start 90 seconds; Escape restored the claim focus.
- The 3 px claim focus ring measured 6.08:1 in light and 7.94:1 in dark.
- Reduced-motion emulation changed transitions to 0.00001 s and smooth scrolling to `auto`.
- At 200% page scale the H1 and main remained available; the layout retained a 390 px document width.
- SPA navigation updated title/canonical/H1 focus; Back restored both H1 focus and the exact 1,448 px prior scroll position.
- Internal page, metadata, icon, manifest, robots, sitemap, and social-image URLs returned 200. Unknown paths returned the designed page with HTTP 404.

## PWA and performance

The live worker controlled `/privacy`, was activated with cache `kbm-shell-75782fcde263`, had no installing/waiting replacement after `registration.update()`, and reloaded `/privacy` offline with the correct heading and offline notice. The repository's old-worker-to-candidate update test also passed.

Production budgets:

- JS: 36.06 kB raw / 12.31 kB gzip (budget 200 kB)
- CSS: 19.01 kB raw / 5.12 kB gzip (budget 50 kB)
- fonts: 0 bytes (budget 120 kB)
- hero AVIF: 74,110 bytes (budget 300 kB)

Fresh Lighthouse 13.0.1 mobile results:

| Route | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Transfer |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `/` | 100 | 100 | 100 | 100 | 0.9 s | 1.4 s | 80 ms | 0 | 93 KiB |
| `/demo` | 100 | 100 | 100 | 100 | 0.9 s | 1.0 s | 80 ms | 0 | 20 KiB |

The lab audit does not emit field INP; direct dialog, validation, navigation, and map interactions showed immediate responses with no long task.

## Candidate/deployment identity

The live deployment matches the clean candidate build byte-for-byte:

| Artifact | SHA-256 |
|---|---|
| `index.html` | `2fe2016203e378a86a7e0a56d6795609886d7e4adf077f2e208e0fee58335ad8` |
| `assets/index-B0BxfLFK.js` | `5a9c030b4c4a21eccc62530e2a89c653e3290a4d4a29fc09230ccf9d0590891d` |
| `assets/index-DihHwhbI.css` | `eb246c0267b33bd13389ffcb0122c6949fca53648f581857839666b0e559ea0f` |
| `sw.js` | `15d16b2c1a97e223356b787373eadb08718b19257efd83f2ab9013a087d43261` |
| `manifest.webmanifest` | `fa6a3ae344192f7e4e9bc91aec304be63328f3f81dfd959e8bb24eeec87a3d23` |
| `assets/boundary-diorama.avif` | `93fa82826312d96d99f0352627eb09dfed882fdcf554f22662af82aa6ffde0ce` |
| `assets/boundary-diorama.webp` | `7198592a4befde109c3421b50b4ec659ded4dd3a5bac2ed5c0b01b2725644c42` |
| `assets/social-card.webp` | `25509aad47c95b1e694b3222f276539d1a4a3370a6748472c7ab2d634ffeb542` |
| `404.html` | `7092f00ede90ebd18603f8b545bf913fc40ef1112f313874db2e1a5c7c8dfa74` |

The builder's earlier deployment-only concern does not reproduce.

## Defects by severity

### Medium — release-blocking: legal contact links are 19 px-high touch targets

The visible `privacy@sociobot.in` link on `/privacy` measured **161.8×19 px** and `support@sociobot.in` on `/terms` measured **164.5×19 px**, identically at desktop and 390 px and in both themes. They are operative `mailto:` controls but fall 25 px below the attached non-negotiable 44 px target-height requirement. Axe does not test this geometric rule.

### Medium — release-blocking: JSON restore claim test can pass without restoring

`.factory/claims.json` specifies this sandbox for `json-restore`: **“demo data; export, replace map, import, and assert a boundary and next question return.”** In `tests/e2e/app.spec.ts`, the tagged test exports the demo, closes and reopens the export dialog without changing the map, imports the same file, then checks the already-present boundary and next question. If the import change handler were a no-op, the assertions would still pass.

This violates the attached claims contract that a tagged test must prove the promised observable outcome. The runtime feature passed the independent replacement test above, but the required permanent proof does not.

### Low — prerequisite targets are 42 px high on desktop

In the populated Pin a claim dialog, each prerequisite's enclosing clickable label measured **618×42 px** at 1366 px, two pixels below the 44 px target requirement. At 390 px the labels wrap to 298×65.6 px and pass. The checkbox itself is 20×20 px; the label is its effective hit area.

## Required repair and retest

1. Give the legal contact links and desktop prerequisite labels at least 44 px of interactive height without reducing readability or creating overlap.
2. Change `@claim:json-restore` to replace/clear the map before import, then prove restored topic, claims, prerequisites, rehearsal history, boundary, and next question.
3. Rerun every claim command, the full local/live browser suite, target measurements, axe matrix, build, identity hashes, offline/update check, and mobile Lighthouse after deployment.
