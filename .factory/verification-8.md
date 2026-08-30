# Independent verification 8 — FAIL

**Work order:** `knowledge-boundary-map-verify-8`  
**Candidate:** `ce1253933ebe0d8c3cf2d4f259104bc796238b06`  
**Live URL:** <https://knowledge-boundary-map.sociobot.in>  
**Date:** 2026-08-30 UTC

## Decision

**FAIL.** The candidate is deployed, matches the tested build, passes every declared claim, and completes the learner workflow. It still misses one non-negotiable accessibility requirement: each clickable rehearsal-history `<summary>` is only **24.8 px high** at 390 px, below the required 44 px touch target.

No product code was changed during verification.

## Mandatory first gates

### Claims

`.factory/claims.json` exists and declares 12 claims. After `npm ci`, I ran every listed command separately from the candidate checkout. All passed:

| Claim | Result | Observable evidence |
|---|---|---|
| `demo-sandbox` | Pass, 1/1 | The causal-inference sample used `demo:` storage, preserved a real-map marker, reset, and discarded demo state on Start for real. |
| `local-only` | Pass, 1/1 | A complete demo rehearsal made requests only to the product origin. |
| `offline-reload` | Pass, 1/1 | A dedicated controlled context reloaded `/demo` offline with its map and offline notice. |
| `csv-export` | Pass, 1/1 | CSV contained its header, all three sample claims, and the blocked claim. |
| `json-restore` | Pass, 1/1 | Export/import restored the counterexample and next question. |
| `keyboard-dialog` | Pass, 1/1 | Arrow navigation, Enter, Escape, and claim-focus restoration worked. |
| `free-workshop` | Pass, 1/1 | Twelve claims were accepted and the next attempt showed the stated limit. |
| `self-assessment-label` | Pass, 1/1 | Landing and rehearsal copy identify self-assessment and reject intelligence scoring. |
| `prerequisites` | Pass, 1/1 | A selected prerequisite persisted after reload. |
| `teach-back-timer` | Pass, 1/1 | The timer began at 01:30 and advanced after starting. |
| `counterexample-capture` | Pass, 1/1 | A Can explain boundary saved and reopened. |
| `next-question` | Pass, 1/1 | The blocked sample and its specific next question were prioritized. |

The repository's full 16-test browser suite also passed locally and against the live URL. The passing claim tests produce stdout rather than traces; first-read and workflow screenshots are under `.factory/qa-artifacts/`.

### Cold first-read and one-click demo

**Pass.** In the first desktop viewport the page says **“Test what you can explain.”** It names **“self-learners who want to separate recognition from an explanation they can produce”** and shows **“Try it with sample data.”** The same viewport states browser-local storage, offline reload, and the 12-claim free limit.

One click opened `/demo`. The resulting first screen already contained three connected causal-inference claims, mixed self-assessment statuses, and a concrete blocked next question. The persistent **“Demo — sample data, nothing is saved to your real map”** banner included Reset demo and Start for real. Evidence: `qa-artifacts/live-first-read-desktop.png`, `live-after-one-click.png`, and `live-mobile-first-read-dark.png`.

## Candidate and deployment identity

The checkout was clean and exactly at the candidate before verification artifacts were created. A fresh production build matched the live deployment byte-for-byte:

| Artifact | SHA-256 |
|---|---|
| `index.html` | `5ff2bfbe22df1dc174c6a8abcaf1a6df60b66b79a8695f94dc452cea3066a7ac` |
| `assets/index-BWw1tdhd.js` | `180c7c7547c935f69709bbe3f61750e74a12aeaa2ac7c7bf2ece8f418e3e376d` |
| `assets/index-BFZs3qqv.css` | `cf07b2d7aff5d075228bfd6957d22f0e031a9130b66bb0a7a3f41bca1d090546` |
| `sw.js` | `f25f04a766c06a00e8b13f5fc67426af9e136e7bb5210cb6fe9e20a3593070cf` |
| `manifest.webmanifest` | `fa6a3ae344192f7e4e9bc91aec304be63328f3f81dfd959e8bb24eeec87a3d23` |
| `assets/boundary-diorama.avif` | `93fa82826312d96d99f0352627eb09dfed882fdcf554f22662af82aa6ffde0ce` |
| `assets/boundary-diorama.webp` | `7198592a4befde109c3421b50b4ec659ded4dd3a5bac2ed5c0b01b2725644c42` |
| `404.html` | `7092f00ede90ebd18603f8b545bf913fc40ef1112f313874db2e1a5c7c8dfa74` |

The previously reported deployment-only concern does not reproduce.

## Clean local verification

| Check | Result |
|---|---|
| `npm ci` | Pass; 59 packages installed, 0 vulnerabilities |
| Every `.factory/claims.json` command separately | Pass; 12/12 |
| `npm audit --audit-level=low` | Pass; 0 vulnerabilities |
| `npm test` | Pass; 10/10 |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass; `dist/` produced |
| `npm run test:e2e` | Pass; 16/16 local |
| `PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e` | Pass; 16/16 live |
| `npm run test:response-policy` | Pass; live AVIF is HTTP 200 `image/avif` |
| `verify-url.sh https://knowledge-boundary-map.sociobot.in/demo …` | Pass; 569 ms, no console errors, correct title/lang/H1/main/alt/button names |

The production build emitted 36.06 kB raw / 12.30 kB gzip JavaScript and 18.96 kB raw / 5.10 kB gzip CSS. The hero AVIF is 74,110 bytes. All are well below the static-product budgets.

## Independent end-to-end exercise

In a fresh live demo context I verified:

- blank teach-back recovery through native required-field validation and focus;
- rejection of Can explain without a counterexample or boundary;
- successful self-assessment save and visible rehearsal history;
- rejection of a whitespace-only claim;
- accepted 160-character claim and 600-character context limits, with extra typed characters prevented;
- prerequisite persistence after reload;
- named removal confirmation and working Undo;
- CSV export with a header and four claim rows;
- malformed JSON recovery with a specific instruction and no map replacement;
- no console errors or page errors.

The fresh claim test separately covered the 12-claim boundary and limit notice. Evidence: `qa-artifacts/live-desktop-flow.png`.

## Privacy and network behavior

The outgoing-request log for the entire independent rehearsal, claim, reload, Undo, export, and malformed-import flow contained one origin only: `https://knowledge-boundary-map.sociobot.in`. There were no analytics, trackers, third-party fonts/scripts, data uploads, or API calls. Demo storage contained only `demo:kbm:map:v1`.

The live responses include same-origin CSP with header-only `frame-ancestors 'none'`, HSTS, `X-Frame-Options: DENY`, `nosniff`, strict-origin referrer policy, and disabled camera/microphone/geolocation. HTML, the service worker, and the manifest revalidate after 30 seconds; hashed JS/CSS are immutable for one year; the hero caches for seven days.

This static product has no server endpoint, paid-unlock request, or sign-in. API allowance/429/Retry-After and Entra authority checks are therefore not applicable. The brief does not benefit from a runtime model call; export/import is already present as the useful adjacent capability.

## Accessibility, mobile, routing, and PWA

- Axe 4.10.2 found 0 serious/critical issues on `/`, `/demo`, `/privacy`, `/terms`, and the designed 404 in light and dark at 1366×900 and 390×844.
- Each valid route had `lang=en`, one H1, one main landmark, correct route title, and no image missing alt text.
- The 390 px layouts had no page-level horizontal overflow.
- First Tab focused the skip link with a visible 3 px focus ring. Arrow/Enter/Escape map behavior and dialog focus restoration passed.
- Reduced motion matched the media query, left no active animation, and reduced the maximum transition to 0.01 ms.
- The repaired demo banner measured 6.96:1 contrast in light mode and 7.62:1 in dark mode. Reset demo and Start for real were each exactly 44 px high at 390 px.
- SPA navigation and browser Back restored URL, title, canonical, H1, and H1 focus. Intended internal links and the source link resolved; the designed missing route correctly returned 404.
- The current service worker controlled `/demo`, used cache `kbm-shell-9b8e3edf5608`, had no waiting worker after `registration.update()`, and reloaded offline with all three sample claims and the offline notice.
- When local storage was forced to throw, the app showed a clear `role=alert` warning and produced no page error.

## Performance and metadata

Lighthouse 13.0.1 mobile on live `/demo`:

- Performance 100
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 0.9 s, LCP 0.9 s, TBT 20 ms, CLS 0, Speed Index 0.9 s
- 20 KiB transferred; no third-party resources

INP is not generated by this no-interaction lab audit; TBT and the direct interaction checks are comfortably inside the responsiveness budget. `robots.txt`, `sitemap.xml`, the manifest, 1200×630 social card, and 180×180 touch icon all returned the expected type and dimensions. The full Lighthouse JSON is `qa-artifacts/lighthouse-live-demo.json`.

## Defects by severity

### Medium — release-blocking: rehearsal-history disclosure is a 24.8 px touch target

At 390×844 in both themes, the interactive `<summary>` labelled **“8/30/2026 · Blocked”** measures **316×24.796875 px**. Its computed style is `display: list-item`, `line-height: 24.8px`, `padding: 0`, and `margin: 0`. It opens when clicked, so it is an operative touch target, but it is 19.2 px short of the required 44 px height.

This violates the attached accessibility and design-principles baseline even though Axe does not report it. Evidence: `qa-artifacts/history-summary-light.png` and `history-summary-dark.png`.

### Low — regression coverage does not check all mobile interactive targets

The checked-in target-size regression checks only the two demo-banner actions. It does not scan the rehearsal dialog or its history disclosure, which allowed this undersized control to pass all 16 browser tests.

## Required repair and retest

1. Give `.history summary` a real interactive height of at least 44 px in both themes and at 390 px, without relying on non-clickable parent padding.
2. Add a browser assertion that opens a claim with rehearsal history and measures the disclosure target at desktop and 390 px.
3. Rerun every claim command, the full local/live browser suite, both-theme Axe sweep, production build, and mobile Lighthouse after deployment.
