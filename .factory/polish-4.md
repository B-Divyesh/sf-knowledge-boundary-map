# Polish round 4 — cumulative zero-finding closure

Repaired from review commit `08edfc18e52adc872148f709ba9cbe8231e6022c`. Product repair commit: `ec985d133db89b2e1d44b43fd15ae636aeb4b0c2`. Deployed to <https://knowledge-boundary-map.sociobot.in> on 2026-09-01 UTC with deployment id `7222e039-65ca-49ab-9425-eed0d9ac24e5`.

## Review 4 finding

| Finding | Change made | Evidence |
|---|---|---|
| F-4-1 | Removed **“No purchase is offered in this release.”** from Terms. No `no-purchase` claim was added because the public promise no longer exists. Removed the remaining unused paid-tier CSS and kept only the declared free-limit, timer, and export statements. | Unit: `@finding:F-4-1 removes the unnecessary no-purchase promise from public terms`. Browser: `@finding:F-4-1 terms contains no unlisted no-purchase promise`. Live: <https://knowledge-boundary-map.sociobot.in/terms>. Screenshot: `.factory/evidence-4/live-terms-desktop.png`. Independent live request capture found zero checkout or billing requests in `.factory/evidence-4/live-qa.json`. |

## Review 1 findings rechecked

| Finding | Change retained and rechecked | Evidence |
|---|---|---|
| F-1-1 | The isolated sample opens already used: one Can explain, one Recognize only, and one Blocked claim, with explanations, history, boundaries, prerequisites, and a specific next question. | `@claim:demo-sandbox`; `@claim:next-question`; live <https://knowledge-boundary-map.sociobot.in/demo>; `.factory/evidence-4/live-demo-mobile-390-dark.png`. |
| F-1-2 | Price, checkout, Studio, license code, and billing calls remain absent. Round 4 also removed the unnecessary no-purchase sentence and dead paid-tier CSS. `/upgrade` remains a designed 404. | `@claim:local-only`; `@finding:F-4-1`; live QA reports one request origin and zero checkout/billing requests; <https://knowledge-boundary-map.sociobot.in/upgrade> returns 404. |
| F-1-3 | The current public capabilities map to 13 narrow claims, each with exactly one tagged observable browser test. | `.factory/claims.json`; `.factory/evidence-4/claim-tests.json` records 13/13 separate clean-clone commands; source tag-count audit found one test per id. |
| F-1-4 | First-screen context remains **“After reading, watching, or taking notes”** and does not repeat the audience. | `loads with an understandable first screen and no console errors`; live `/`; `.factory/evidence-4/live-home-cold-desktop.png`. |
| F-1-5 | README prose remains within the 22-word sentence cap. | `tests/copy.test.ts`; `.factory/copy-audit.md`; `npm test` 16/16. |
| F-1-6 | Visitor-facing copy consistently uses **next question**; `nextProbe` remains an internal field name only. | `@claim:next-question`; copy audit; live `/demo`. |
| F-1-7 | The preview heading remains **“Preview a claim map.”** | First-screen browser test; live `/`; cold screenshot. |
| F-1-8 | The privacy heading remains **“Your map stays in this browser.”** | `@claim:local-only`; live `/` and `/privacy`. |
| F-1-9 | The unavailable Studio offer and naming remain absent. | Source scan; live route text; independent request capture. |
| F-1-10 | README describes a private practice map stored in the browser. | `@finding:F-3-2`; `.factory/copy-audit.md`; README. |
| F-1-11 | Copy plainly states that there are no accounts, analytics, or trackers and no fonts or scripts from other sites. | `@claim:local-only`; live QA request origin is product-only. |
| F-1-12 | Demo separation is explained as browser keys beginning with `demo:`; the public wording does not say “namespace.” | `@claim:demo-sandbox`; `.factory/demo.md`; terminology audit. |
| F-1-13 | Offline wording says the app reloads after the first visit. | `@claim:offline-reload`; service-worker update test; local and live 26-test suites. |
| F-1-14 | README names `dist/` as the deployable output, and the clean build produced `dist/index.html`. | Clean-clone `npm run build`; build output recorded below. |
| F-1-15 | README explains route handling and security headers in plain words. | `@finding:real-404`; release-config tests; live header check. |
| F-1-16 | Obsolete license-storage wording remains absent. | Source and live-copy scan; no license request in live QA. |
| F-1-17 | The removed upgrade headline and offer remain absent. | Live <https://knowledge-boundary-map.sociobot.in/upgrade> returns the designed HTTP 404. |
| F-1-18 | **Boundary Map** remains visible in the 390 px header with 44 px controls. | Mobile accessibility matrix; `.factory/evidence-4/live-demo-mobile-390-dark.png`. |
| F-1-19 | The standalone 404 retains its own metadata, theme control, shared legal/source links, build id, and home action. | `@finding:404-metadata`; live 404 route check in `.factory/evidence-4/live-qa.json`; `.factory/evidence-4/live-404-mobile-390-dark.png`. |

## Review 2 findings rechecked

| Finding | Change retained and rechecked | Evidence |
|---|---|---|
| F-2-1 | Selecting the demo product name opens `/`, removes only demo keys, preserves real data, restores the real theme, and focuses the home h1. | `@finding:demo-home-exit`; `@claim:demo-sandbox`; independent live demo exit in `live-qa.json`. |
| F-2-2 | `free-workshop` states only the 12-claim limit. Its tagged test renders/restores 12 claims and rejects 13 without changing the map. | `@claim:free-workshop`; clean-clone claim result. |
| F-2-3 | The self-assessment test changes status and text, saves, reloads, reopens, and verifies history and non-scoring labels. | `@claim:self-assessment-label`; clean-clone claim result. |
| F-2-4 | Real and demo theme choices use separate browser keys; leaving demo removes only the demo choice. | `@claim:theme-storage`; `/privacy`; `.factory/demo.md`. |
| F-2-5 / F-1-12 | Public copy consistently uses literal browser-key wording, not “namespace.” | Copy regression tests; README; `.factory/demo.md`; source scan. |
| F-2-6 | **“Opens a completed causal-inference map.”** remains directly beneath the sample action. | First-screen browser test; live `/`; cold screenshot. |
| F-2-7 | Task labels remain **Practice map**, **New claim**, **Map files**, and **Page not found.** | Live 26-test suite; demo and 404 screenshots. |
| F-2-8 | Repository links remain labelled **Source on GitHub**. | Route test; `@finding:404-metadata`; live `/terms` and missing-route checks. |

## Review 3 findings rechecked

| Finding | Change retained and rechecked | Evidence |
|---|---|---|
| F-3-1 | README and demo documentation call the visible exit control **the product name**, not “home wordmark.” | `@finding:F-3-1 names the visible product-name control instead of using design jargon`. |
| F-3-2 | README uses **visual design** and **source of its generated image**, not specialist provenance wording. | `@finding:F-3-2 documents the visual design and image source in plain words`. |
| F-3-3 | Copy audit and both product footers now identify build `polish-4`. | `@finding:F-3-3 keeps the copy audit aligned with the released footer and README`; live home, demo, Terms, and 404 screenshots. |

## Clean-clone and live verification

- Fresh remote clone: `/tmp/kbm-polish4-clean.IWXSdQ` at `ec985d133db89b2e1d44b43fd15ae636aeb4b0c2`.
- Install: `npm ci` added 59 packages with 0 vulnerabilities; `npm audit --audit-level=low` found 0 vulnerabilities.
- Claims: every command in `.factory/claims.json` ran separately; 13 passed and 0 failed. Machine-readable record: `.factory/evidence-4/claim-tests.json`.
- Unit/config/copy: `npm test` passed 16/16. `npm run typecheck`, `npm run lint`, and `npm run build` passed.
- Browser: `npm run test:e2e` passed 26/26 from the clean clone; the same suite passed 26/26 against production.
- Accessibility/mobile: the suite's 20-case route × viewport × theme Axe matrix found no serious/critical issue. Independent 390 px dark-mode QA found 0 px overflow, 0 serious/critical Axe issues, and no visible target below 44 px.
- Privacy: cold landing, all public routes, direct `?demo=1`, demo reset, and demo exit contacted only `https://knowledge-boundary-map.sociobot.in`; no checkout or billing request occurred.
- Offline: `@claim:offline-reload` passed in its own browser context. The prior-worker update test also passed.
- Routing: `/`, `/demo`, `/?demo=1`, `/privacy`, and `/terms` returned 200. `/upgrade` and a new unknown path returned the designed 404. Titles, descriptions, canonical URLs, one h1, route focus, legal links, and Back behavior passed.
- URL verifier: `.factory/evidence-4/verify-url/verify.json` records HTTPS 200, title, `lang`, one h1, main, alt text, button names, and zero console errors.
- Security: the live response includes self-only CSP, response-header frame denial, MIME-sniffing denial, strict-origin referrer policy, disabled camera/microphone/geolocation, and HSTS.
- Lighthouse 13.4.1: live home and demo each scored 100/100/100/100. Home LCP was 1.4 s; demo LCP was 1.0 s; both had 10 ms TBT and 0 CLS.
- Production size: JavaScript 36,442 bytes raw / 12.40 kB gzip; CSS 18,942 bytes raw / 5.09 kB gzip; fonts 0; hero AVIF 74,110 bytes.
- Deployment identity: live `index.html`, hashed JavaScript, hashed CSS, `404.html`, and `sw.js` SHA-256 hashes match local `dist/` byte-for-byte.

## Result

No finding from reviews 1 through 4 remains open. The paper-cut explanation-workshop identity, static PWA artifact class, browser-only data model, and no-runtime-AI scope are unchanged. No known gap or follow-up work remains.
