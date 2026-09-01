# Independent verification 12 — PASS

**Work order:** `knowledge-boundary-map-verify-12`  
**Candidate:** `12a0dd5e5cc91b9a2f742cc4e93f3078695de508`  
**Live URL:** <https://knowledge-boundary-map.sociobot.in>  
**Date:** 2026-09-01 UTC

## Decision

**PASS.** The deployed static PWA matches the candidate byte-for-byte, completes the brief's real self-assessment workflow, and passes the mandatory claim, first-read, build, browser, accessibility, privacy, offline, and performance checks. The two blockers from verification 11 do not reproduce: a 13-claim JSON import is rejected without changing the current map, and the complete browser suite passes locally and live.

No product code was changed during this verification.

## Mandatory first gates

### Every listed claim from the clean checkout

The clean checkout began at the requested commit. After `npm ci`, every exact command in `.factory/claims.json` ran separately through the production-preview demo entry point. All 13 passed 1/1:

| Claim | Result | Observed outcome |
|---|---|---|
| `demo-sandbox` | Pass | Demo data used separate keys and left the real-map marker unchanged. |
| `local-only` | Pass | The complete rehearsal flow contacted only the product origin. |
| `offline-reload` | Pass | `/demo` reloaded with its heading and offline notice after the context went offline. |
| `csv-export` | Pass | CSV contained its header and all three sample claims, including the blocked claim. |
| `json-restore` | Pass | Import replaced a different map and restored topic, claims, prerequisite links, rehearsal history, boundary, next question, and reload persistence. |
| `keyboard-dialog` | Pass | Arrow keys moved claims, Enter opened rehearsal, and Escape restored claim focus. |
| `free-workshop` | Pass | The app kept the 12-claim limit across manual addition and JSON import and rejected 13 claims. |
| `self-assessment-label` | Pass | Saved work reloaded and remained explicitly labelled a self-assessment, not an objective score. |
| `theme-storage` | Pass | Real and demo themes stayed separate; leaving demo removed only the demo theme. |
| `prerequisites` | Pass | A new prerequisite relationship remained after reload. |
| `teach-back-timer` | Pass | The timer began at 01:30 and advanced after starting. |
| `counterexample-capture` | Pass | A Can explain assessment retained its counterexample or boundary. |
| `next-question` | Pass | The blocked sample claim and its specific next question appeared first. |

Each claim id occurs in exactly one tagged browser test. A cross-check of the live landing page and README found no unlisted visitor-facing product promise. The checked-in copy audit has one low-severity stale build-label line, recorded below; the current copy itself retains the audited word count and vocabulary.

### Cold first-read check

**Pass at 1440×900 and 390×844.** A new browser context immediately answered all three questions in plain words:

- what it does: **“Test what you can explain.”**
- for whom and what changes: **“For self-learners who want to separate recognition from an explanation they can produce.”**
- what to select first: **“Try it with sample data.”**, followed by **“Opens a completed causal-inference map.”**

The action was visible without setup. One selection opened `/demo` with three connected causal-inference claims, mixed self-assessments, a specific blocked next question, and a persistent banner with **Reset demo** and **Start for real**. Cold desktop and mobile loads produced no console or page errors. Visual inspection found intentional desktop and phone layouts with no clipping or generic framework presentation.

## Clean local and live quality gates

| Check | Result |
|---|---|
| Candidate identity before testing | Pass — exact requested SHA and clean worktree |
| `npm ci` | Pass — 59 packages; 0 vulnerabilities |
| 13 exact `.factory/claims.json` commands | Pass — 13/13 |
| `npm test` | Pass — 11/11 |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm audit --audit-level=low` | Pass — 0 vulnerabilities |
| `npm run build` | Pass — exact production build produced `dist/` |
| `npm run test:e2e` | Pass — 25/25 local production preview in 1.5 minutes |
| `PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e` | Pass — 25/25 live in 1.3 minutes |
| `npm run test:response-policy` | Pass — hero is HTTP 200 `image/avif` |
| Factory `verify-url.sh` on live `/demo` | Pass — HTTPS 200, title, `lang`, one H1, main, image/button names, and zero browser errors |

This is a static PWA. It has no library or CLI package, backend, sign-in, product-unlock request, or server-side endpoint. Consumer packing, backend concurrency/persistence/health, request-allowance/429, and Entra-authority checks are therefore not applicable. No runtime model feature is appropriate for the self-authored, local-first brief; JSON/CSV import and export already provide the implied portability step.

## Independent product workflow and recovery checks

A separate live browser flow, outside the repository assertions, confirmed:

- the one-click demo preserved a real-map marker and used the demo storage namespace;
- Tab reached the claim map, Arrow Right moved focus, Enter opened rehearsal, and Escape restored the selected claim;
- an empty claim and empty teach-back exposed native recovery guidance;
- a 160-character claim and 600-character context saved at their supported limits;
- Can explain without a boundary and next question produced specific guidance, then saved after recovery;
- the self-assessment and rehearsal history persisted after reload;
- cancelling removal preserved the claim, confirmed removal removed it, and Undo restored it;
- malformed JSON produced a specific instruction to select valid JSON;
- a valid 13-claim file produced “This file has 13 claims. Each map holds up to 12 claims. Remove 1 claim and import it again.” and left the existing one-claim map unchanged;
- a valid 12-claim file replaced that map and rendered 12 claims with the imported topic;
- when browser storage methods were forced to fail, a `role=alert` warning advised export, the in-memory claim remained usable, Export stayed available, and no browser error occurred.

## Privacy, requests, headers, and caching

A browser request log covering `/demo` and a saved rehearsal contained only same-origin document, JavaScript, and CSS requests. A broader independent flow also stayed entirely on `https://knowledge-boundary-map.sociobot.in`. There were no account, analytics, advertising, tracker, third-party font/script, upload, billing, model, or API requests.

Playwright response headers and direct response checks confirmed:

- CSP is self-only and includes response-header `frame-ancestors 'none'`;
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, HSTS, strict-origin referrer policy, and disabled camera/microphone/geolocation are present;
- HTML, worker, and manifest use `public, must-revalidate, max-age=30`;
- hashed JavaScript and CSS use `public, max-age=31536000, immutable`;
- the hero AVIF uses `public, max-age=604800` and the correct media type.

All links found on `/`, `/demo`, `/privacy`, and `/terms` returned 200, apart from `mailto:` links which were identified but not opened. The public source link returned 200. A missing route returned the designed page with HTTP 404.

## Accessibility, mobile, keyboard, and routing

- The complete live suite checked five public routes in light and dark at 1366×900 and 390×844: 20 Axe scans with **0 serious/critical findings**, no horizontal overflow, one H1, and no console/page errors.
- Four additional live Axe scans checked the open rehearsal dialog in both themes and both viewports: **0 serious/critical findings**.
- On 390 px, the skip link was 168.88×44.80 px with a 3 px visible outline; Enter focused `main`.
- Claim focus rings were solid 3 px and measured 6.08:1 against the light canvas and 7.94:1 against the dark canvas.
- Every checked visible dialog control at 390 px was at least 44×44 px. The full suite separately covered demo actions, legal contact links, prerequisite labels, and history disclosures at desktop and 390 px in both themes.
- Reduced-motion emulation left no material transition or animation duration and used non-smooth scrolling.
- At 200% page scale, the H1 and main remained available and the 390 px document had no horizontal overflow.
- Route titles, canonical URLs, one-H1/main structure, focus movement, Back focus, and exact 1,448 px Back scroll restoration passed. `/`, `/demo`, `/privacy`, and `/terms` returned 200; a missing route returned 404.

## PWA and performance

The live service worker controlled `/demo`, reported an activated worker with cache `kbm-shell-93be18e060e0`, and had no waiting or installing replacement after `registration.update()`. `/demo` then reloaded offline with the correct heading and offline notice. The repository's prior-worker-to-current-worker update scenario also passed in the full suite.

Production budgets:

- JavaScript: 36,482 bytes raw / 12,347 bytes gzip (200 KB budget)
- CSS: 19,252 bytes raw / 5,182 bytes gzip (50 KB budget)
- fonts: 0 bytes (120 KB budget)
- hero AVIF: 74,110 bytes (300 KB budget)

Fresh Lighthouse 13.4.1 mobile results:

| Route | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Transfer |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `/` | 99 | 100 | 100 | 100 | 1.0 s | 1.4 s | 150 ms | 0 | 93 KiB |
| `/demo` | 100 | 100 | 100 | 100 | 1.1 s | 1.1 s | 10 ms | 0 | 20 KiB |

Lighthouse does not emit field INP for this deployment. Direct map, dialog, validation, import, and navigation interactions completed without a long-task symptom; TBT remained below 200 ms.

## Candidate and deployment identity

The live deployment matches the clean candidate production build byte-for-byte:

| Artifact | SHA-256 |
|---|---|
| `index.html` | `85faf32ed5b06509fe1ac0154d0036c0f4379128d560ab14b5402e92d62381ff` |
| `assets/index-CS_f9Ari.js` | `c370f80ea856808cfa5141a61b82759f122c3a37e3f7b8b83c990da4cb3deae9` |
| `assets/index-BIFJACiF.css` | `60cc10eb6c9bb491f83e8c9cc5d9db24a462c31ac7b04203387f9262370a1d86` |
| `sw.js` | `74cfab9177316c2d7e34800db73100c39c66d9738733f816b8b4d5125d6b8a8a` |
| `manifest.webmanifest` | `fa6a3ae344192f7e4e9bc91aec304be63328f3f81dfd959e8bb24eeec87a3d23` |
| `404.html` | `87521f720d4c48ad2e1789896a976c0fea27532d45cd50135f7236beab5da47a` |
| `assets/boundary-diorama.avif` | `93fa82826312d96d99f0352627eb09dfed882fdcf554f22662af82aa6ffde0ce` |

The builder's earlier deployment-only concern does not reproduce.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: `.factory/copy-audit.md` still transcribes the footer as build `polish-2`, while the live and candidate footer says build `repair-9`. The current line remains seven words and contains no banned wording, so this documentation drift does not change the product copy result.

## Conclusion

**PASS — candidate `12a0dd5e5cc91b9a2f742cc4e93f3078695de508` is confirmed at the stated live URL.**
