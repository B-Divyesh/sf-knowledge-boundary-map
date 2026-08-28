# Handoff — Knowledge Boundary Map v1

## Shipped

- Local-first claim map with optional topic naming, prerequisite connections, visible dependency paths, status ledger, and a screen-reader text alternative.
- 90-second teach-back workflow that captures an explanation, counterexample/boundary, self-assessed state (`can explain`, `recognize only`, or `blocked`), and an actionable next probe.
- Self-assessment guardrails: an explanation and next probe are required; a boundary is additionally required before `can explain`. The product never claims to verify truth or intelligence.
- Keyboard operation: full native control traversal, arrow-key movement across map nodes, Enter to rehearse, and `N` to add a claim. Dialogs use native focus containment.
- Local persistence, JSON import/export, CSV export, confirmed deletion with connection-aware undo, storage failure notice, responsive empty state, offline notice, and installable/offline shell.
- Paper-cut diorama visual system in `.factory/design.md`, with original generated artwork and prompt provenance in `assets/src/`. Optimized hero assets are 74 KB AVIF and 82 KB WebP.
- Light/dark treatments, responsive 390px layout, reduced-motion behavior, designed focus states, semantic landmarks, and legal/privacy pages.
- $12 one-time Studio offer: free tier includes 12 claims and all core rehearsal/export/accessibility functions; Studio adds unlimited claims and full history. Checkout and daily-cached license verification use the Sociobot API. Return tokens are stored at `sb_license:knowledge-boundary-map` and removed from the URL. Restore-by-token is included.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

Production output: `dist/` with `dist/index.html` at its root.

Verified locally on 2026-08-28:

- `npm test`: 5/5 unit tests passed.
- `npm run test:e2e`: 4/4 Chromium tests passed, including create → rehearse → persist, map keyboard navigation, 390×844 rendering, no console/page errors, and axe serious/critical checks.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200; title and `lang` present; exactly one `h1`; main landmark present; no missing image alt; no unlabeled buttons; no console errors.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100. FCP 0.9 s, LCP 1.7 s, TBT 0 ms, CLS 0. Lab Lighthouse does not report INP; TBT and interaction tests are the available proxies.
- Production bundles: 32.83 KB JS (11.59 KB gzip), 14.53 KB CSS (4.27 KB gzip); no runtime dependencies and no network fonts/scripts. `npm audit`: 0 vulnerabilities.

## Deployment notes

- Exact build command: `npm run build`; deploy directory: `dist`.
- Production billing defaults to `https://api.sociobot.in`. Set `VITE_BILLING_API_BASE=https://pilot-api.sociobot.in` for staging/test checkout.
- The factory still needs to register the `knowledge-boundary-map` product/price and return URL in its billing system. No provider or product ID is hardcoded here.
- Azure Static Web Apps should honor `staticwebapp.config.json` for SPA fallbacks, security headers, and asset caching.

## Intentional boundaries / next steps

- No account sync, automatic truth checking, web scraping, social feed, or AI analysis—these are brief non-goals and preserve privacy.
- The browser is the source of truth. Users should export backups before clearing site data. A future version could add encrypted user-controlled sync without changing this default.
- Lighthouse was measured against the local production preview; field INP and seven-day return behavior require deployed traffic.
