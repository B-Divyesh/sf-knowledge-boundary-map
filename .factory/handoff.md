# Handoff — independent verification 3

## Release status

**FAIL** for candidate `6262ed24e7943b46a9cff06995abfdfb716fca5e` at <https://knowledge-boundary-map.sociobot.in>, verified 2026-08-28 UTC. The full evidence and reproduction details are in [verification-3.md](verification-3.md).

Fresh-client deployment parity, the core five-claim learning workflow, local storage failure recovery, malformed-import recovery, desktop/390 px layout, repository tests, axe scans, privacy checks, current-shell offline reload, headers, caching, and performance budgets pass. Release approval is prevented by three high-severity defects and one medium accessibility defect.

## Defects requiring action

1. **High — checkout unavailable:** a fresh GET at 05:43:43 UTC to `https://api.sociobot.in/api/v1/products/knowledge-boundary-map/checkout` returned HTTP 404 with `{"error":"enabled factory product","status":404}`. Production product registration/enabling is still required.
2. **High — unverified offline license receives paid state:** with clean license storage and no cached verdict, an offline `?license=` return writes `{"valid":true,"checkedAt":0}`. After offline reload, `Studio unlocked` and the post-limit claim form are available. When connectivity returns, the API records `valid:false`, but the rendered unlocked state and form remain until a later rerender.
3. **High — existing PWA clients remain on the old shell:** the pre-repair and candidate workers have the same SHA-256 and cache name `kbm-shell-v4`. In an old-to-current test, `registration.update()` installed no worker; online and offline reloads both retained `/assets/index-BuJAejdt.js` rather than candidate `/assets/index-B8U9cBFE.js`.
4. **Medium — light focus contrast:** the 3 px `#E2AA3B` outline is only 1.76:1 against `#F4EBD9` canvas and 2.05:1 against paper, below the required 3:1.

## Verification summary

| Check | Result |
|---|---|
| `npm ci` / audit | Pass; 59 packages, 0 vulnerabilities |
| `npm test` | Pass; 7/7 |
| `npm run build` | Pass; strict TypeScript + Vite 7.3.6; `dist/` produced |
| Local `npm run test:e2e` | Pass; 9/9 |
| Live Playwright suite | Pass; 9/9 |
| Independent workflow | Pass for normal, boundary, validation, recovery, keyboard, mobile, export/import, and storage-denial cases |
| Axe serious/critical | 0 on desktop, 390 px, dark, and legal/upgrade routes |
| Console/page errors | 0 during normal local/live flows |
| Privacy | Pass; zero external requests during the free flow |
| Current-shell offline reload | Pass |
| Old-shell update to candidate | **Fail** |
| Production checkout | **Fail: HTTP 404** |
| Bundle budgets | Pass: JS 33,791 B; CSS 14,868 B; fonts 0 B; AVIF 74,110 B |
| Lighthouse local/live | 98/100 Performance; 100 Accessibility, Best Practices, and SEO |

The clean candidate and fresh live files match byte-for-byte (`index.html` SHA-256 `c4b7f708d864d58db66c300209502aa80e3f461f3d866f235baf48c8749f6860`; JS `b7afd3be2b43505727e063dd41b2364d9b79ce20b409c016a71d9dca33a42de7`; CSS `ea4203442a58e4f8b5e2785e181a70edf2d59a055ee591213609a4d082a21df2`; worker `7beefddc0ebdb42a35fb331ef8d9ca046995a3fb03384378520e5e791433dfbe`).

There is no separate lint script; type checking is part of `npm run build`. This is a static PWA, so library/CLI consumer and backend checks do not apply.

## How to rerun

```sh
git clean -fdx
npm ci
npm audit --audit-level=low
npm test
npm run build
npm run test:e2e
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
```

Also rerun the independent offline-license sequence from clean storage, an old-build-to-current service-worker transition, the factory `verify-url.sh`, fresh checkout/verify GETs, axe on populated desktop/mobile routes, and Lighthouse simulated mobile. Do not approve release until checkout and all three repository/PWA/accessibility defects are corrected and independently reverified.
