# Independent verification 10 — PASS

**Work order:** `knowledge-boundary-map-verify-10`  
**Candidate:** `c4508eeac46de270ebb6a8562e958a6cde36c79c`  
**Live URL:** <https://knowledge-boundary-map.sociobot.in>  
**Date:** 2026-09-01 UTC

## Decision

**PASS.** The exact live candidate meets the researched brief and release contract. The two blockers from independent verification 9 are repaired:

1. Every previously undersized legal and prerequisite target is at least 44 px in both themes at desktop and 390 px.
2. The JSON claim test now replaces the sample with a different map before import and proves full restoration after reload.

No product-code defect was found. No product code was modified during this verification.

## Mandatory first gates

### Claims from the clean checkout

`.factory/claims.json` exists and declares 12 tests. An immediate invocation before dependency installation could not resolve `@playwright/test`; no test was discovered or executed. After the required clean `npm ci`, every exact manifest command ran separately through the production-preview demo entry point and passed 1/1:

| Claim | Result |
|---|---|
| `demo-sandbox` | Pass |
| `local-only` | Pass |
| `offline-reload` | Pass |
| `csv-export` | Pass |
| `json-restore` | Pass |
| `keyboard-dialog` | Pass |
| `free-workshop` | Pass |
| `self-assessment-label` | Pass |
| `prerequisites` | Pass |
| `teach-back-timer` | Pass |
| `counterexample-capture` | Pass |
| `next-question` | Pass |

The JSON test exports the three-claim demo, installs a different one-claim map, verifies that replacement is visible, imports through the real file control, and checks the restored topic, three claims, two prerequisite links, rehearsal history, boundary, next question, removal of the replacement, and reload persistence. This is a meaningful test of restoration rather than a no-op import.

### Cold first-read test

**Pass.** A fresh 1440×900 browser context showed, without scrolling:

- job: **“Test what you can explain.”**
- audience and change: **“For self-learners who want to separate recognition from an explanation they can produce.”**
- first action: **“Try it with sample data.”**

One click opened `/demo` with three connected causal-inference claims, mixed self-assessments, and a specific blocked next question. The persistent demo banner exposed **Reset demo** and **Start for real** and stated that sample data is not saved to the real map. The cold load made four same-origin requests and produced no console or page error.

## Clean local and live verification

| Check | Result |
|---|---|
| `npm ci` | Pass — 59 packages, 0 vulnerabilities |
| 12 exact `.factory/claims.json` commands after install | Pass — 12/12 |
| `npm test` | Pass — 10/10 |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm audit --audit-level=low` | Pass — 0 vulnerabilities |
| `npm run build` | Pass — exact production build in `dist/` |
| `npm run test:e2e` | Pass — 18/18 local production preview |
| `PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e` | Pass — 18/18 live |
| `npm run test:response-policy` | Pass — live hero is HTTP 200 `image/avif` |
| `/opt/fleet/lib/verify-url.sh .../demo` | Pass — title, lang, one H1, main, alt/button names, no errors |

This is a static PWA. It has no library or CLI package, backend, sign-in, product-unlock request, or server-side endpoint. Consumer packing, server concurrency/persistence/health, request allowance/429, and Entra authority checks do not apply.

## Repaired 44 px targets

Fresh measurements against the live candidate:

| Target | 1366 px light/dark | 390 px light/dark |
|---|---:|---:|
| `privacy@sociobot.in` | 161.77×44 px | 161.77×44 px |
| `support@sociobot.in` | 164.48×44 px | 164.48×44 px |
| each of three prerequisite labels | 618×44 px | 298×65.59 px |

A supplementary scan of all visible links, buttons, text controls, disclosures, and effective checkbox-label targets on `/`, `/demo` with the claim dialog open, `/privacy`, and `/terms` found zero targets below 44×44 at 1366 px or 390 px.

## Independent workflow and recovery checks

A separate live browser scenario, outside the repository suite:

- exported the completed demo as JSON;
- replaced it with a visibly different one-claim map;
- imported the export and reloaded;
- confirmed the topic, all three claims, two prerequisite links, one rehearsal-history entry, saved counterexample, and next question returned;
- confirmed the replacement claim disappeared;
- rejected malformed JSON with a specific instruction to choose a valid export;
- rejected a whitespace-only claim, then accepted a 160-character boundary-value title;
- rejected **Can explain** without a boundary and next question, then saved after both were supplied;
- reopened the claim and confirmed the rehearsal history persisted.

When browser storage reads and writes were forced to throw, the live app displayed its `role=alert` warning, kept an in-memory claim usable, advised export before leaving, and emitted no console or page error.

## Privacy, headers, and caching

The cold load and independent workflow contacted only `https://knowledge-boundary-map.sociobot.in`. There were no analytics, trackers, third-party font/script, upload, account, AI, billing, or API requests. Console errors, page errors, and failed product requests were zero.

Live responses confirmed:

- CSP restricted to self with response-header `frame-ancestors 'none'`;
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, HSTS, strict-origin referrer policy, and disabled camera/microphone/geolocation;
- HTML, worker, and manifest use `public, must-revalidate, max-age=30`;
- hashed JS/CSS use `public, max-age=31536000, immutable`;
- the hero AVIF uses `public, max-age=604800` and `image/avif`.

Every live internal link returned 200 except the intentional missing-page link, which returned 404. The public source link returned 200. Mail links were present and were not opened.

## Accessibility, responsive behavior, and routing

- 24 fresh Axe 4.10.2 scans covered `/`, `/demo`, `/privacy`, `/terms`, the designed 404, and the rehearsal dialog in light/dark at 1366×900 and 390×844: **0 serious/critical findings**.
- Every scanned route had no horizontal overflow. All valid routes had `lang=en`, one H1, one main landmark, a route-specific title, and the correct canonical URL.
- On 390 px, the first Tab exposed a 168.88×44.80 px skip link with a 3 px visible outline. Enter focused `main`; Arrow Right moved between map claims; Enter opened rehearsal with timer focus; Escape restored claim focus.
- The focus-ring contrast is 6.08:1 in light mode and 7.94:1 in dark mode.
- Reduced-motion emulation changed transitions to `0.00001s` and smooth scrolling to `auto`.
- At 200% page scale, the H1 and main remained available and document width remained 390 px.
- `/`, `/demo`, `/privacy`, `/terms`, robots, sitemap, manifest, social image, favicon, and touch icon returned 200. The designed missing page returned HTTP 404.

## PWA and performance

The live service worker controlled `/demo`, was activated with cache `kbm-shell-06881d5c0efe`, and had no installing or waiting replacement after `registration.update()`. `/demo` then reloaded offline with the correct heading and offline notice. The repository's old-worker-to-current-worker upgrade test also passed.

Production sizes:

- JavaScript: 36.06 kB raw / 12.30 kB gzip (200 kB budget)
- CSS: 19.12 kB raw / 5.14 kB gzip (50 kB budget)
- fonts: 0 bytes (120 kB budget)
- hero AVIF: 74,110 bytes (300 kB budget)

Fresh Lighthouse 13.4.1 mobile results:

| Route | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Transfer |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `/` | 99 | 100 | 100 | 100 | 0.9 s | 1.4 s | 110 ms | 0 | 93 KiB |
| `/demo` | 98 | 100 | 100 | 100 | 0.9 s | 1.0 s | 160 ms | 0 | 20 KiB |

Lighthouse did not provide field INP for this new deployment. Direct map, dialog, validation, and import interactions completed without a long-task symptom; TBT remained below 200 ms.

## Candidate/deployment identity

The live deployment matches the clean candidate build byte-for-byte:

| Artifact | SHA-256 |
|---|---|
| `index.html` | `6f7c7726ee822699ca47d12c5abddae0166203c50fcc6a3fd74f01526f6ba57d` |
| `assets/index-C1Kuk91a.js` | `9f6650e7489fad9b0036e025c151f33336bae7c0bd930e30ee01bf3bb9b5fe48` |
| `assets/index-Bzg06tKa.css` | `db27b8fcfae409f7fdcb6fbf4425959cc18a3859362ed964031b9f91b153066c` |
| `sw.js` | `488594b7385c4028f240337f4edc07eef57de1786bc851204aec7bbf1effc6ae` |
| `manifest.webmanifest` | `fa6a3ae344192f7e4e9bc91aec304be63328f3f81dfd959e8bb24eeec87a3d23` |
| `404.html` | `7092f00ede90ebd18603f8b545bf913fc40ef1112f313874db2e1a5c7c8dfa74` |

The builder's earlier deployment-only concern does not reproduce.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none found in the checked acceptance scope.

## Conclusion

**PASS — candidate `c4508eeac46de270ebb6a8562e958a6cde36c79c` is confirmed at the stated live URL.**
