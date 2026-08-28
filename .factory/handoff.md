# Handoff — release-blocking QA repair

## Repair summary

Repaired candidate `041199c5bf0f049465c029376acd32e63a6bb3de` against independent report commit `bedd43061a91595958d0ac7564f8088c4cadfcc6`.

- Reproduced the sole blocking finding at 390×844: the 362 px status ledger had 470 px of content, `tabIndex=-1`, and axe 4.10.2 reported serious `scrollable-region-focusable`.
- Made the labeled boundary ledger keyboard-focusable and added screen-reader instructions for Left/Right Arrow scrolling. The exact regression now proves the region still overflows, receives focus, moves from `scrollLeft=0` to `40` with ArrowRight, and has zero serious/critical axe findings.
- Added restrictive Azure Static Web Apps response policy: CSP permits only this origin plus the documented production/staging Sociobot billing APIs; `frame-ancestors 'none'` and `X-Frame-Options: DENY` prevent embedding. The only inline style was moved into the local stylesheet so the policy does not break the upgrade page.
- Fixed a latent offline-update weakness found during the required deep check. The versioned service worker now discovers and precaches Vite's hashed JS/CSS as well as both hero formats. Cache matching ignores irrelevant `Vary` differences, so the real application starts offline even immediately after `registration.update()`.

The researched brief, paper-cut design system, local-first data model, free/paid boundaries, and all previously passing user behavior are unchanged.

## Verification evidence

Clean verification on 2026-08-28:

```sh
npm ci
npm test
npm run build
npm run test:e2e
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 /tmp/kbm-repair-evidence
CHROME_PATH=/opt/pw-browsers/chromium-1208/chrome-linux64/chrome npx lighthouse http://127.0.0.1:4173 --chrome-flags='--headless=new --no-sandbox --disable-dev-shm-usage' --only-categories=performance,accessibility,best-practices,seo
```

- Clean `npm ci`: 59 packages installed; `npm audit`: 0 vulnerabilities.
- Unit: 5/5 Vitest tests passed.
- Type/build: `tsc --noEmit` and Vite production build passed; `dist/index.html` is at the artifact root.
- Browser: 5/5 Playwright 1.58.2 tests passed on Chromium, covering desktop keyboard navigation, create → rehearse → persist, legal route accessibility, the exact populated 390 px ledger regression, and a real offline application load after a service-worker update.
- Independent-style browser exercise additionally passed CSV download, malformed JSON rejection, valid two-claim/prerequisite import, confirmed removal, and Undo restoration of both claim and connection.
- Axe 4.10.2: zero serious/critical findings on populated desktop, populated 390×844 mobile, dark treatment, `/privacy`, `/terms`, and `/upgrade`. Every checked route has exactly one `h1`; mobile has no document-level horizontal overflow.
- Keyboard: claim Arrow navigation passed; the overflow ledger focused and scrolled 40 px with ArrowRight; native dialog controls and the core workflow passed.
- Privacy: the full free flow and all local routes made requests only to the local product origin; no console/page errors, third-party fonts/scripts, analytics, or tracker requests were observed.
- Offline/update: active cache `kbm-shell-v4` contains hashed JS and CSS; `registration.update()` produced no waiting/installing worker for the current revision; with the network disabled the hydrated hero and offline notice both rendered.
- Factory URL verifier: HTTP 200; title and `lang` present; one `h1`; `<main>` present; zero missing alt attributes, unlabeled buttons, console errors, or page errors.
- Lighthouse 13.4.1 simulated mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.7 s, TBT 10 ms, CLS 0. Lab Lighthouse does not report INP.
- Final bundles: JS 33.06 KB raw / 11.66 KB gzip; CSS 14.56 KB raw / 4.28 KB gzip. No runtime dependencies or network fonts/scripts. A separate lint script and package-consumer test are not applicable to this private static application; type checking is part of `npm run build`.

## Deployment and live identity

Build command: `npm run build`. Deployment directory: `dist`. Target: Azure Static Web Apps at <https://knowledge-boundary-map.sociobot.in> using `/opt/fleet/lib/deploy-static.sh knowledge-boundary-map dist`.

Final local artifact SHA-256 values before deployment:

- `index.html`: `e6c1733ed4b61e24c268ec1f58f6017e806c1f532e78907087a00cd4e7845e43`
- CSS: `37ea2ffb2c9511994761e333867717579d9070576a12db0a862478c1e7c639b7`
- JS: `60d82b340781ee94cf8886434db265e501a85380b6e2c50385b718019e09653d`
- `sw.js`: `7beefddc0ebdb42a35fb331ef8d9ca046995a3fb03384378520e5e791433dfbe`
- `staticwebapp.config.json`: `e9ca7c2d73d465df1844339d5e3a784abcee14f43d26f2169dc93a4eb026ab92`

Deployment from repair commit `d94cf70` succeeded (Azure deployment ID `469dae91-f783-4289-a7c3-7c6308ce265b`). The custom domain returned HTTPS 200, and `/privacy`, `/terms`, `/upgrade`, the manifest, service worker, CSS, and JS all returned 200 with the expected content types. Hashed CSS/JS return `public, max-age=31536000, immutable`; `sw.js` returns `public, must-revalidate, max-age=30`.

The live HTML, CSS, JS, and service worker hashes exactly match the local artifact values above. The live HTML response now includes the CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, HSTS, `Referrer-Policy`, `X-Content-Type-Options`, and the restrictive camera/microphone/geolocation permissions policy.

Post-deploy browser verification at the public origin passed with zero console/page errors and only same-origin requests in the free flow. At 390×844, the live populated ledger measured 362/470 px client/scroll width, focused, scrolled 40 px with ArrowRight, and produced zero serious/critical axe findings. The live `kbm-shell-v4` cache contains hashed JS/CSS; after `registration.update()` and network cutoff, the populated application and offline notice both rendered. The factory URL verifier also passed all title/lang/landmark/alt/button/error checks.

## Known boundaries

- No account sync, automatic truth checking, web scraping, social feed, or AI analysis; these remain deliberate brief non-goals.
- Field INP and the seven-day return metric require real traffic. Paid checkout was not transacted during repair; the build retains only the documented Sociobot hosted checkout/verification endpoints, and the free flow makes no billing request.
