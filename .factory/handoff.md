# Handoff — release repair 5

## Status

**Released.** The repair is deployed to <https://knowledge-boundary-map.sociobot.in> from `b66d27f` (`fix: restore checkout and response policy`). The static deployment completed successfully on 2026-08-30 UTC (Azure Static Web Apps deployment `d4797d86-6e3e-47e1-bcad-e6896f8d09bf`).

This repair started from the verifier’s report in [verification-4.md](verification-4.md) for candidate `d5ff211821714eaae47914df52e7d23436808e17`. The report’s original production checkout failure was reproduced before repair:

```text
GET https://api.sociobot.in/api/v1/products/knowledge-boundary-map/checkout
HTTP 404
{"error":"enabled factory product","status":404}
```

The factory product is now registered and enabled in the production catalog as **Knowledge Boundary Map Studio**, a `$12 USD` one-time purchase, with return URL `https://knowledge-boundary-map.sociobot.in/`. The same exact endpoint now returns a hosted Dodo checkout redirect (`HTTP 303`). `scripts/verify-billing.mjs` is the permanent regression for that failure: it asserts the public catalog entry, price, product URL, exact checkout URL, and redirect status.

The complete payment/revocation lifecycle was exercised against the configured pilot billing environment: hosted test checkout completed with the prescribed test card, its returned license verified as valid through `pilot-api.sociobot.in`, and a test refund succeeded. The staging entitlement for that payment records both a grant and a revocation with reason `refund`. Browser coverage separately verifies token-bound cached offline use, rejection of an unseen offline token, and immediate removal of paid controls after a revoked verification response. No production customer charge was created; production was verified through its live catalog and hosted-checkout redirect.

The verifier’s AVIF response-policy finding is fixed by the Azure Static Web Apps `.avif` MIME mapping. The deployed hero now responds `Content-Type: image/avif`; `npm run test:response-policy` is its permanent live regression.

## Product and documentation changes

- Added a direct `/demo` / `?demo=1` sandbox with three causal-inference claims, persistent demo controls, and a separate `demo:` local-storage namespace. **Start for real** clears only demo data and opens an empty real map.
- Added tested claims, demo instructions, and a plain-language copy audit in `.factory/claims.json`, `.factory/demo.md`, and `.factory/copy-audit.md`.
- Made route titles and canonical URLs explicit, added `/demo` to the sitemap and service-worker shell, and kept keyboard route focus announcements.
- Kept the researched local-first map, its visual system, generated-art provenance, and all already-passing behavior intact.

## Verification evidence

| Check | Result |
|---|---|
| Clean install and audit | `npm ci`; 59 packages; `npm audit --audit-level=low` reports 0 vulnerabilities |
| Unit/type/build | `npm test` — 8/8 passed; `npm run build` — `tsc --noEmit` and Vite passed, producing `dist/` |
| Initial payload | 36.55 kB JS (12.67 kB gzip), 15.52 kB CSS (4.44 kB gzip); no external fonts/scripts |
| Local browser suite | `npm run test:e2e` — 18/18 passed, including desktop, 390 px, keyboard, axe, import recovery, demo, offline and worker update |
| Live browser suite | `PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e` — 18/18 passed |
| Accessibility | Axe serious/critical violations: 0 on populated, mobile, dark, legal, and upgrade screens; URL verifier reports title, `lang`, one `h1`, `main`, and no missing image alt text or unlabeled buttons |
| Visual/mobile review | Reviewed the built `/demo` UI at 1440 px and 390 px; 390 px scroll width equals viewport width (390 px) |
| Privacy | `@claim:local-only` records no outgoing requests during the complete normal demo/rehearsal flow; no analytics or runtime CDN assets |
| PWA/offline/update | Dedicated browser context caches the actual shell, reloads offline, and the old controlled worker updates to the new version; all covered in the 18-test suite |
| Billing regression | `npm run test:billing` — catalog contains this `$12 USD` product and checkout returns 303 to hosted Dodo checkout |
| Response policy | `npm run test:response-policy` — deployed AVIF is HTTP 200, `image/avif` |
| Production headers | Live response has HSTS, CSP with `frame-ancestors 'none'`, `nosniff`, strict referrer policy, and disabled camera/microphone/geolocation |
| Local Lighthouse `/demo` | Performance 99, Accessibility 100; LCP 1.2 s; CLS 0 |
| Live Lighthouse `/demo` | Performance 100, Accessibility 100; LCP 0.9 s; TBT 20 ms; CLS 0 |

The factory URL verifier on the deployed origin reported zero console/page errors and this semantic evidence:

```json
{"title":"Knowledge Boundary Map — check what you can explain","lang":"en","h1":1,"main":true,"imgsMissingAlt":0,"buttonsUnlabeled":0}
```

No separate lint script exists in this Vite/TypeScript product; strict TypeScript runs as part of `npm run build`. It is a static web app, not a publishable package or CLI, so package-consumer checks do not apply.

## Re-run

```sh
npm ci
npm audit --audit-level=low
npm test
npm run build
npm run test:e2e
npm run test:billing
npm run test:response-policy
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
```

Demo: open `/demo` or `/?demo=1`. Deploy the built `dist/` directory with `/opt/fleet/lib/deploy-static.sh knowledge-boundary-map /work/repo/dist`.

## Known gaps

None in the released static product. Production checkout registration and the AVIF header are both live. The paid lifecycle was safely exercised in pilot test mode; a real production charge was intentionally not made during release verification.
