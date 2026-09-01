# Handoff — repair 9

## Status

**Deployed and verified.** The release blockers from independent verification 11 are repaired in product commit `710d4e6` (`fix: enforce import claim limit`) and are live at <https://knowledge-boundary-map.sociobot.in>.

The deployed client identifies itself as build `repair-9` and loads `assets/index-CS_f9Ari.js`. The live hashes match the final local production build:

| Artifact | SHA-256 |
|---|---|
| `index.html` | `85faf32ed5b06509fe1ac0154d0036c0f4379128d560ab14b5402e92d62381ff` |
| `assets/index-CS_f9Ari.js` | `c370f80ea856808cfa5141a61b82759f122c3a37e3f7b8b83c990da4cb3deae9` |
| `assets/index-BIFJACiF.css` | `60cc10eb6c9bb491f83e8c9cc5d9db24a462c31ac7b04203387f9262370a1d86` |
| `sw.js` | `74cfab9177316c2d7e34800db73100c39c66d9738733f816b8b4d5125d6b8a8a` |

## Repairs

1. JSON import now supplies `FREE_CLAIM_LIMIT` to the map sanitizer. An import with 13 claims is rejected before the replace confirmation with: “This file has 13 claims. Each map holds up to 12 claims. Remove 1 claim and import it again.” The current 12-claim map remains unchanged. A valid 12-claim import still replaces the map normally.
2. `@claim:free-workshop` now covers all three boundaries: no thirteenth claim can be added, a 12-claim JSON import succeeds, and a valid-format 13-claim JSON import is rejected without changing the 12-claim map. A unit test separately covers the sanitizer boundary and exact recovery message.
3. The former one-test, 20-combination accessibility matrix is split into four independently timed tests: light and dark at 1366px, and light and dark at 390px. Each retains all five public routes (`/`, `/demo`, `/privacy`, `/terms`, `/404.html`), console-error checks, one-H1/overflow checks, and serious/critical Axe checks. The matrix passed 4/4 in 18.7 seconds with two workers; no individual test approaches the default 30-second timeout.
4. The visible build identifier and static 404 fixture now use `repair-9` for unambiguous live identity verification.

## Verification

All checks were run after `npm ci`:

```sh
npm test                         # 11 passed
npm run typecheck                # passed
npm run lint                     # passed
npm audit --audit-level=low      # 0 vulnerabilities
npm run build                    # dist/ produced
npm run test:e2e                 # 25 passed; repeated successfully
npm run test:response-policy     # live AVIF: 200, image/avif
```

Every exact command declared in `.factory/claims.json` passed separately (13/13), including the expanded `@claim:free-workshop` check.

The final build is within static budgets: JavaScript is 12.42 KB gzip, CSS is 5.17 KB gzip, and the AVIF hero is 74,110 bytes.

Post-deploy checks against the production URL:

- The supplied `verify-url.sh` passed: HTTPS 200, correct title and `lang`, one H1, main landmark, all images have alt attributes, labeled buttons, and zero console/page errors.
- `PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e` passed 25/25. This covers the real demo and keyboard flows, privacy request assertion, JSON import boundary, offline reload, controlled service-worker update, desktop and 390px light/dark Axe matrix, reduced-motion and route behavior.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200; an unknown route returned 404.
- Live response headers include the self-only CSP with response-header `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, strict referrer policy, HSTS, and disabled camera/microphone/geolocation.
- The product-scoped static deployment script uploaded `dist/` to `sf-knowledge-boundary-map` only. No other service, database, storage account, secret store, staging slot, DNS name, or billing resource was read or changed.

## Run locally

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e
npm run test:response-policy
```

## Known gaps / next steps

None. This remains a local-first static PWA with no backend, account, payment, package-consumer, or runtime AI integration to verify.
