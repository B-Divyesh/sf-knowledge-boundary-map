# Independent verification 7 — FAIL

**Work order:** `knowledge-boundary-map-verify-7`
**Candidate:** `b4855438321bd9202c3687c6be3c28990666718d`
**Live URL:** <https://knowledge-boundary-map.sociobot.in>
**Date:** 2026-08-30 UTC

## Decision

**FAIL.** The candidate is deployed and its main learner workflow works, but the mandatory accessibility baseline is not met. The persistent demo banner has an Axe serious color-contrast failure in dark mode, on desktop and at 390 px. Its two demo controls are also 36 px high rather than the required 44 px.

No product code was changed during verification.

## Mandatory first gates

### Claims

`.factory/claims.json` exists and declares 12 claims. After the clean lockfile install, I ran every listed `test` command separately against the production demo entry point. All passed:

| Claim | Result | Observed behavior |
|---|---|---|
| `demo-sandbox` | Pass, 1/1 | Three completed causal-inference claims used `demo:` storage; real storage survived; leaving demo removed demo data. |
| `local-only` | Pass, 1/1 | The full demo rehearsal request log contained only the product origin. |
| `offline-reload` | Pass, 1/1 | A controlled demo reloaded offline with its map and offline notice. |
| `csv-export` | Pass, 1/1 | CSV contained the header, all three sample rows, and the blocked claim. |
| `json-restore` | Pass, 1/1 | Export/import restored the boundary and next question. |
| `keyboard-dialog` | Pass, 1/1 | Arrow navigation, Enter, Escape, and focus restoration worked. |
| `free-workshop` | Pass, 1/1 | Twelve claims were accepted and the next attempt showed the stated limit. |
| `self-assessment-label` | Pass, 1/1 | Landing and rehearsal copy identify self-assessment and reject intelligence scoring. |
| `prerequisites` | Pass, 1/1 | A selected prerequisite persisted after reload. |
| `teach-back-timer` | Pass, 1/1 | The timer began at 01:30 and advanced after starting. |
| `counterexample-capture` | Pass, 1/1 | A can-explain boundary saved and reopened. |
| `next-question` | Pass, 1/1 | The blocked sample and its specific next question were prioritized. |

An initial literal invocation before dependency installation could not load `@playwright/test`; this was setup state, not an executed claim result. `npm ci` then installed the locked dependencies, and every exact claim command above passed.

### Cold first-read and demo

**Pass.** On cold desktop and 390 px loads, the first screen says **“Test what you can explain.”** and **“For self-learners who want to separate recognition from an explanation they can produce.”** It identifies the task and audience in plain words. The primary action is **“Try it with sample data.”** The same screen states browser-local storage, offline reload, and the free 12-claim limit.

One click opened `/demo` with three realistic causal-inference claims, mixed self-assessment statuses, a specific next question, and the persistent **“Demo — sample data, nothing is saved to your real map”** banner with Reset and Start for real.

## Clean local verification

The checkout was clean and exactly at the candidate before installation.

| Check | Result |
|---|---|
| `npm ci` | Pass; 59 packages, 0 vulnerabilities |
| `npm audit --audit-level=low` | Pass; 0 vulnerabilities |
| `npm test` | Pass; 10 tests |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass; `dist/` produced |
| Every `.factory/claims.json` command | Pass; 12/12 individually |
| `npm run test:e2e` | Pass; 15/15 locally |
| `PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e` | Pass; 15/15 live |
| `npm run test:response-policy` | Pass; live AVIF is HTTP 200 `image/avif` |
| `/opt/fleet/lib/verify-url.sh .../demo` | Pass; one H1, `lang=en`, main, alt/names present, zero console errors |

The exact build emitted 36.06 kB raw / 12.31 kB gzip JavaScript and 18.77 kB raw / 5.07 kB gzip CSS. The hero AVIF is 74,110 bytes. These are below the 200 kB JS, 50 kB CSS, and 300 kB hero budgets.

## Deployment identity

The previous deployment-only concern is resolved. Fresh live files match the candidate build byte-for-byte:

| Artifact | SHA-256 |
|---|---|
| `index.html` | `e57c25deca4194b53e9a5db012da04b2027191d2420247f399689a3d0395b85b` |
| `assets/index-B0ATfRFh.js` | `e53f2a386db2472eb05d29b1271b59fa1d6927fe521ca2d3cbd162f2ad44bdd0` |
| `assets/index-C6TeE5Hf.css` | `db3fb3a9b4811378c887243a94af9fe7c75f868af0962b1a7f2119e60412df67` |
| `sw.js` | `b0ce77e9a7cbdd8a50e5c30583b9b2991613ef2c52f079d94978d9037565ce36` |
| `manifest.webmanifest` | `fa6a3ae344192f7e4e9bc91aec304be63328f3f81dfd959e8bb24eeec87a3d23` |
| `assets/boundary-diorama.avif` | `93fa82826312d96d99f0352627eb09dfed882fdcf554f22662af82aa6ffde0ce` |
| `assets/boundary-diorama.webp` | `7198592a4befde109c3421b50b4ec659ded4dd3a5bac2ed5c0b01b2725644c42` |
| `404.html` | `7092f00ede90ebd18603f8b545bf913fc40ef1112f313874db2e1a5c7c8dfa74` |

## Independent product exercise

In a fresh live browser context I:

- recovered from a whitespace-only claim with “Write a claim before pinning it”;
- saved maximum accepted 160-character claim and 600-character context values without truncation;
- observed native required-field feedback for a blank teach-back;
- confirmed “Can explain” cannot save without a counterexample or boundary;
- saved and reopened a rehearsal history;
- created a dependent claim and confirmed its prerequisite after reload;
- removed a claim through named confirmation, then restored it with Undo;
- exported a two-claim JSON map;
- imported malformed JSON and received a specific recovery instruction without replacing the saved map;
- seeded 12 claims and completed a rehearsal on the twelfth claim;
- observed no console errors or page errors.

All recorded runtime requests through this flow were same-origin assets from `knowledge-boundary-map.sociobot.in`; there were no analytics, trackers, third-party fonts/scripts, data APIs, or map uploads.

## Accessibility, responsive behavior, and PWA

- Light landing Axe: 0 serious/critical findings.
- Dark `/demo` Axe at 1366×900 and 390×844: one serious `color-contrast` rule affecting four nodes; see Defects.
- Keyboard: the first Tab reaches the skip link with a 3 px visible focus outline. Roving arrows, Enter, Escape, and dialog focus return passed.
- Mobile `/demo`: 390 px layout width equals the viewport; no horizontal overflow at the required viewport.
- Reduced motion: 0 running animations; longest transition is 0.01 ms.
- Live service worker is active at `/sw.js`, cache `kbm-shell-5f21623f39ea` is current, `registration.update()` leaves no waiting worker, and `/demo` reloads offline.
- The storage-unavailable path renders a `role=alert` warning and no page error.
- `/privacy`, `/terms`, and browser Back update route title, canonical URL, H1, and focus correctly.
- All rendered internal links and the source link returned HTTP 200. The designed missing route returned HTTP 404.

## Performance, headers, and caching

Lighthouse 13.0.1 mobile on live `/demo`:

- Performance 96
- Accessibility 100 in the default light scheme (the independent dark-mode Axe scan above finds the missed issue)
- Best Practices 100
- SEO 100
- FCP 1.01 s, LCP 1.07 s, TBT 219 ms, CLS 0
- 20.7 kB transferred, no third-party resources

Live HTML, worker, and manifest use 30-second revalidation. Hashed JS/CSS use one-year immutable caching; the hero uses seven-day caching. Responses include restrictive same-origin CSP with header-only `frame-ancestors 'none'`, HSTS, `X-Frame-Options: DENY`, `nosniff`, strict-origin referrer policy, and disabled camera/microphone/geolocation.

This is a static, unsigned product with no server-side product endpoint or paid-unlock call, so API rate-limit and Entra sign-in checks are not applicable. The brief does not need an AI step; the local rehearsal workflow is the useful core.

## Defects

### High — release-blocking: dark demo banner fails text contrast

In dark mode, `.demo-banner` uses `--lake: #74bcd2` while its text and controls remain `#fffdf5`. Axe 4.10.2 reports **2.08:1** against the required **4.5:1** for:

- `.demo-banner > span:nth-child(1)`;
- its `<strong>Demo</strong>` text;
- `#reset-demo`;
- `#start-real`.

This reproduces on desktop and 390 px mobile. It violates the explicit “fix all serious/critical Axe findings” acceptance gate and the design file’s claim that all body combinations meet WCAG AA.

### Medium: demo actions miss the 44 px target minimum

At 390 px, **Reset demo** measures 115.4×36 px and **Start for real** measures 124.8×36 px. `.demo-action` explicitly sets `min-height: 36px`. Both controls violate the 44×44 px touch-target baseline.

### Medium: checked-in accessibility coverage misses the primary demo state

The only Axe calls in `tests/e2e/app.spec.ts` scan `/privacy` and `/terms` in the default theme. The suite visits mobile `/demo` afterward but does not run Axe there and never scans dark mode. That gap allowed the serious contrast regression while all 15 repository E2E tests passed.

### Low: copy audit is stale

`.factory/copy-audit.md` says it is an exact landing-page extraction but includes “Pin a claim, teach it back, and choose your next question,” which is no longer rendered on the landing page. Refresh the audit when repairing the release.

## Required repair before release

1. Give the dark demo banner text and controls a verified ≥4.5:1 foreground/background pair.
2. Make both demo controls at least 44 px high.
3. Add Axe coverage for `/demo` in light and dark themes at desktop and 390 px, plus an explicit demo-control target-size assertion.
4. Rerun all claim commands, full local/live E2E, build, and Lighthouse after deployment.
