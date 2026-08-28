# Independent verification 2 — FAIL

**Work order:** `knowledge-boundary-map-verify-2`  
**Tested candidate:** `f92a710a7747227c5fe0939250a03255a44a8b88`  
**Live URL:** <https://knowledge-boundary-map.sociobot.in>  
**Date:** 2026-08-28 UTC

## Decision

**FAIL.** The static deployment is healthy and byte-for-byte matches the candidate, and the normal free workflow is strong. Release acceptance is nevertheless blocked by two high-severity failures: the advertised $12 purchase cannot be made because the production checkout endpoint returns 404, and the app crashes during initialization when browser storage is unavailable. Invalid imported rehearsal records also cause a runtime error, and several mobile controls miss the explicit 44 × 44 px target requirement.

The builder's earlier report described a successful static deployment. Fresh evidence confirms that static deployment, but not an end-to-end paid deployment: the current production checkout is still unavailable.

## Defects

### High — production purchase CTA leads to a 404

The `/upgrade` page advertises “$12 USD one time” and links “Buy lifetime studio” to the contractually correct URL:

`https://api.sociobot.in/api/v1/products/knowledge-boundary-map/checkout`

A fresh GET to that endpoint returned HTTP 404 with:

```json
{"error":"enabled factory product","status":404}
```

This blocks every new purchase; there is no hosted checkout redirect or recovery path. The verification endpoint itself is live: an invalid test token returned HTTP 200, CORS for the product origin, `Cache-Control: no-store`, and `{ "valid": false, "reason": "invalid" }`. Browser restore correctly showed the invalid-token error, and a returned `?license=` token was stored, stripped from the URL, checked once, and left locked when invalid. The defect is therefore the production product/checkout registration, not the client URL.

### High — storage denial prevents the application from starting

With `window.localStorage` made to throw a realistic `SecurityError`, both the local production artifact and live site raised:

```text
Cannot access 'R' before initialization
```

Only the static fallback heading “Knowledge Boundary Map” / “Opening your private map…” remained. The real hero, claim controls, export, and intended “Local storage is unavailable” alert never rendered. The initialization order calls `safeGet()` before `storageAvailable` is initialized, so its catch path throws. This is a complete failure for browsers or embedded/privacy contexts that deny storage, despite the product having an explicit storage-unavailable state.

### Medium — malformed rehearsal data is accepted, persisted, then crashes claim opening

Import accepted and saved a version-1 map whose claim was valid but whose `rehearsals` entry contained wrong field types (`teachBack: 7`, `counterexample: {}`, and `nextProbe: []`). Clicking that claim then raised:

```text
e.replace is not a function
```

No rehearsal dialog opened (`#rehearsal-dialog[open]` count 0). `sanitizeMap()` checks only that rehearsal entries are objects, rather than validating/sanitizing their fields. The user can recover by importing a clean file, but the accepted map remains partially unusable until then.

### Medium — mobile touch targets below the required 44 × 44 px

At 390 × 844, measured visible targets on the live empty state included:

| Target | Rendered size |
|---|---:|
| Home brand mark | 30 × 30 px |
| Privacy | 50.7 × 21.7 px |
| Terms | 41.2 × 21.7 px |
| Source | 48.1 × 21.7 px |
| Artwork details | 46.7 × 16 px |

The supplied accessibility/design contract requires touch/click targets of at least 44 × 44 CSS px. This was not reported by axe, which otherwise found no serious/critical issues.

### Low — malformed JSON error exposes parser jargon without recovery guidance

Uploading `{ nope` remains inside the import dialog and is recoverable, but displays the engine message `Expected property name or '}' in JSON at position 2 (line 1 column 3)`. It does not use the product's plain language or tell the learner to choose a valid exported JSON file, contrary to the stated error-language principle.

## Clean local verification

The worktree started clean at the exact candidate. `git clean -fdx` removed only ignored `graphify-out/`; install and checks then ran from the lockfile.

| Check | Result |
|---|---|
| `npm ci` | Pass; 59 packages installed, 0 vulnerabilities |
| `npm audit --audit-level=low` | Pass; 0 vulnerabilities |
| `npm test` | Pass; 5/5 Vitest tests |
| `npm run build` | Pass; `tsc --noEmit` and Vite 7.3.6 production build |
| `npm run test:e2e` | Pass; 5/5 Playwright 1.58.2 tests |
| Separate type command | Type checking is included in `npm run build` |
| Separate lint command | Not defined in `package.json` |
| Production artifact | `dist/` produced; 274,318 bytes including source map |

This is a static web app, not a library, CLI, or backend, so consumer package/API, backend concurrency, persistence-server, and health/build-identity checks are not applicable.

## Independent product exercise

The same independent Playwright coverage was run against the local production preview and the public origin. The full happy-path probe passed on both:

- Empty state, skip link, one `h1`, `lang=en`, main landmark, labelled imagery and controls.
- Keyboard `N` shortcut, whitespace-only claim rejection and recovery, 160-character input boundary, two claims with a prerequisite, roving Arrow navigation, and Enter to rehearse.
- Required-field/status validation, missing-counterexample error and recovery, timer start/pause, “Can explain” save, persistence after reload, and clearly labelled self-assessment language.
- JSON and CSV downloads, malformed JSON staying recoverable, named delete confirmation, cancel, removal, and Undo restoration.
- Free claim boundary at exactly 12 while export remains available.
- Desktop plus 390 × 844 mobile, dark treatment, reduced-motion media emulation, no document-level horizontal overflow, and keyboard scrolling of the overflowing status ledger.
- `/privacy`, `/terms`, and `/upgrade`; zero serious/critical axe 4.10.2 findings on populated desktop, dark, mobile, and legal/upgrade routes.
- Zero console/page errors during the normal flow and no external browser requests in the free flow. No analytics, trackers, CDN scripts, or network fonts were observed.

The two crash probes above failed identically on local and live. They are additional invalid/environment cases not covered by the repository's passing test suite.

## PWA and offline behavior

- The production service worker registered and controlled the app using `kbm-shell-v4`.
- `registration.update()` completed for the current worker.
- A network-off reload rendered the hydrated application and the offline notice.
- The cache includes the hashed JS/CSS shell assets. Update/offline behavior therefore passed.

## Deployment identity, headers, caching, and privacy

Live and freshly built candidate bytes matched exactly:

| Artifact | SHA-256 |
|---|---|
| `index.html` | `e6c1733ed4b61e24c268ec1f58f6017e806c1f532e78907087a00cd4e7845e43` |
| `sw.js` | `7beefddc0ebdb42a35fb331ef8d9ca046995a3fb03384378520e5e791433dfbe` |
| JS | `60d82b340781ee94cf8886434db265e501a85380b6e2c50385b718019e09653d` |
| CSS | `37ea2ffb2c9511994761e333867717579d9070576a12db0a862478c1e7c639b7` |
| AVIF hero | `93fa82826312d96d99f0352627eb09dfed882fdcf554f22662af82aa6ffde0ce` |

The live HTML, legal routes, manifest, service worker, JS, CSS, and hero all returned 200. HTML, manifest, and service worker use `public, must-revalidate, max-age=30`; hashed JS/CSS use `public, max-age=31536000, immutable`; the hero uses a seven-day cache. Responses include HSTS, restrictive CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict-origin referrer policy, and disabled camera/microphone/geolocation. Normal local data remained in localStorage and was not transmitted.

## Budgets and Lighthouse

| Metric | Local production | Live |
|---|---:|---:|
| Lighthouse Performance | 96 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| FCP | 0.9 s | 0.9 s |
| LCP | 1.4 s | 1.4 s |
| Total blocking time | 230 ms | 50 ms |
| CLS | 0 | 0 |

Fresh Lighthouse 13.4.1 simulated-mobile runs produced those values. Lab Lighthouse did not report INP; field INP needs traffic. Final JS is 33,060 bytes raw / 11,633 gzip, CSS is 14,561 raw / 4,290 gzip, there are no font files, and the mobile AVIF hero is 74,110 bytes. All explicit static budgets pass.

## Required remediation

1. Register/enable the production billing product so the documented checkout URL redirects to hosted checkout, then test a real purchase/return/restore cycle.
2. Initialize the storage availability flag before any guarded storage access and verify the no-storage fallback end to end.
3. Validate every imported rehearsal field and reject the whole file with actionable copy, or sanitize it into a safe record.
4. Expand the mobile brand/footer hit areas to 44 × 44 px without relying on visual glyph size.
5. Rerun the clean gates and the failing local/live probes before release approval.
