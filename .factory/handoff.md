# Handoff — release-blocking QA repair 3

## Status

Repository repair and static deployment are complete for verifier report `726c692e9817b87cdfa5bbe4ef35a43859ed925c`, which tested candidate `6262ed24e7943b46a9cff06995abfdfb716fca5e`.

The three repository-controlled findings are repaired and verified locally and live. Release remains **blocked on external billing registration**: at 2026-08-28 UTC the production checkout endpoint still returns HTTP 404. The repository contract assigns billing registration to the factory, and this worker contains neither the referenced `fleet/new-paid-product.sh` helper nor billing credentials.

## Repairs

### License entitlement boundary

- Cached verdicts now include the exact token they verified. Old unbound verdicts are ignored.
- A returned `?license=` token is stored and stripped from the URL, but it is never given a fabricated positive verdict.
- Offline optimism is allowed only for a cached valid verdict belonging to that same token.
- A different incoming token immediately clears the previous verdict and rerenders locked.
- Online revalidation persists the returned verdict and rerenders immediately. Revocation removes an already-rendered paid claim form and all unlocked labels.
- Restore validates a pasted token before replacing the current token/verdict pair.

Exact regressions in `tests/e2e/app.spec.ts` cover a clean unseen token offline at the 12-claim boundary, rejection of a different token despite another token's cached valid verdict, and background revocation while a paid form is open.

### PWA update path

- The production build derives a deterministic 12-character cache identity from every precached shell file and stamps it into `dist/sw.js`. This build uses `kbm-shell-afe37d60ff41`, replacing pre-repair `kbm-shell-v4`.
- Worker registration bypasses the HTTP cache for update checks; install fetches fresh HTML.
- Navigations are network-first with the cached shell as the offline fallback. Hashed assets remain cache-first.
- Activation deletes prior caches and claims clients.

`tests/e2e/service-worker-update.spec.ts` installs and controls a synthetic byte-equivalent pre-repair `kbm-shell-v4` client, switches the same origin to the real current `dist/`, calls `registration.update()`, proves the old cache is removed and the new cache is active, then reloads the current app offline.

### Focus visibility and keyboard

- The light focus ring is now dark ochre `#765000`: 6.08:1 against canvas and 7.07:1 against paper. Dark saffron measures 7.94:1 against canvas and 6.83:1 against paper.
- The visual thesis records the new token and rationale.
- The skip link now transfers focus to the main task as well as scrolling there.

Browser regression coverage computes WCAG contrast for both themes and exercises the skip link with Tab and Enter.

## Verification evidence

Clean verification on 2026-08-28:

```sh
npm ci
npm audit --audit-level=low
npm test
npm run build
npm run test:e2e
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
```

- Clean install: 59 packages; audit: 0 vulnerabilities.
- Unit: 7/7 Vitest tests passed.
- Type/build: `tsc --noEmit` and Vite 7.3.6 passed; `dist/index.html` is at the artifact root. No separate lint script is configured.
- Browser: 15/15 Playwright 1.58.2 tests passed locally and 15/15 against the live origin.
- Browser coverage includes empty/error states, create/rehearse/persist, malformed imports, storage denial, legal and upgrade routes, desktop, 390×844 mobile, 44px targets, keyboard navigation, skip link, light/dark treatments, license states, service-worker install/update/offline, and zero normal-flow console/page errors.
- Axe 4.10.2: zero serious/critical findings on populated desktop, populated 390px mobile, dark treatment, `/privacy`, `/terms`, and `/upgrade`.
- A 390px check at simulated 200% text measured body/document/viewport widths of 390/390/390 with one `h1` and one `main`.
- Privacy probe: zero cross-origin requests and zero console/page errors through the free example/export flow. No analytics, trackers, network fonts, or CDN scripts are present.
- Factory URL verifier, local and live: HTTP 200, title, `lang=en`, one `h1`, main landmark, no missing image alt, no unlabeled buttons, and no browser errors.
- Local Lighthouse 13.4.1 simulated mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9s, LCP 1.7s, TBT 0ms, CLS 0.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9s, LCP 1.4s, TBT 0ms, CLS 0. Lab Lighthouse does not provide field INP.
- Budgets: JS 34,446 bytes raw / 12,066 gzip; CSS 14,898 raw / 4,353 gzip; fonts 0; AVIF hero 74,110 bytes; complete `dist/` 280,496 bytes.
- This is a static web app, so library/package consumer, CLI, backend concurrency/persistence, and server health checks are not applicable.

## Deployment and identity

- Repair commit deployed: `95201b52fd41a43e4d0878157cd3ac9595f96906`
- Command: `/opt/fleet/lib/deploy-static.sh knowledge-boundary-map dist`
- Azure deployment: `bb216546-a793-4a29-a35f-110a8aee3502`
- Live URL: <https://knowledge-boundary-map.sociobot.in>

Live files matched the local production artifact byte-for-byte:

| Artifact | SHA-256 |
|---|---|
| `index.html` | `b37a492ab6599bce7b4c5504b2c13531318801d7a7acbb7cb7a47d4ca8ab4922` |
| JavaScript | `c3ecb33e38e8a6195cfdbc48b965315d7278da4b0ebb5ccef3b15f615dad0019` |
| CSS | `af2408e631b8423a6f4e0d989410738314b23d3ad1141251cfd2791e42c3acc4` |
| `sw.js` | `1d5019f7705721ecae0987f7d85a6a5627118f95c7959842bf359edec5205eb7` |
| AVIF hero | `93fa82826312d96d99f0352627eb09dfed882fdcf554f22662af82aa6ffde0ce` |
| WebP hero | `7198592a4befde109c3421b50b4ec659ded4dd3a5bac2ed5c0b01b2725644c42` |

Live HTML includes HSTS, restrictive same-origin CSP with billing origins only in `connect-src`/`form-action`, `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict-origin referrer policy, and disabled camera/microphone/geolocation. HTML, routes, worker, and manifest use `public, must-revalidate, max-age=30`; hashed JS/CSS are one-year immutable; hero art is seven-day cached.

## External blocker

Fresh production evidence after deployment:

```text
GET https://api.sociobot.in/api/v1/products/knowledge-boundary-map/checkout
HTTP/2 404
{"error":"enabled factory product","status":404}
```

The public product catalog contains no `knowledge-boundary-map` entry. The verification endpoint itself returns HTTP 200 with `{"expires_at":null,"reason":"invalid","valid":false}` for an invalid token, so the client endpoint and verification integration are correct.

Required factory action: register and enable the production one-time product for slug `knowledge-boundary-map`, price `$12 USD`, and return URL `https://knowledge-boundary-map.sociobot.in`, then verify checkout redirect, purchase return, paste restore, cached-valid offline use, and refund/revocation. No alternate provider or client-side payment code should be added.
