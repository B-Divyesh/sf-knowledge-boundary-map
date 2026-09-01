# Polish round 2 — zero-finding closure

Candidate repaired from `1a331503922f05ca7b522c00a77ad185d4a7a1e3`. Product-code repair commit: `aeead84d15c637cddfb8b251858bc3d8dd06dbee`. Deployed at <https://knowledge-boundary-map.sociobot.in> on 2026-09-01 UTC.

## Review 2 findings

| Finding | Change made | Evidence |
|---|---|---|
| F-2-1 | The home-labelled wordmark now has `href="/"`. In demo it uses the same exit path as **Start for real**, removes demo map and theme keys, restores the real theme and map, opens `/`, and focuses the landing h1. Back-navigation out of demo also clears demo keys. | `@finding:demo-home-exit`; `@claim:demo-sandbox`; live 22-test run; `/` and `/?demo=1` live checks |
| F-2-2 | Narrowed `free-workshop` to the exact 12-claim promise. Its test now renders all 12 claims, blocks a thirteenth, and confirms the count stays 12. Removed the broader “complete flow” sentence from README. | `@claim:free-workshop`; `.factory/claims.json`; clean-clone claim run |
| F-2-3 | Strengthened the self-assessment claim test. It changes status, explanation, and next question; saves; reloads; reopens; and checks status, fields, history, and non-scoring labels. | `@claim:self-assessment-label`; clean-clone claim run |
| F-2-4 | Registered `theme-storage`. Real and demo theme choices now load independently; leaving demo removes its theme and restores the real choice. | `@claim:theme-storage`; `/privacy`; `.factory/demo.md` |
| F-2-5 / F-1-12 | Removed “namespace” and browser-storage jargon from current README, demo documentation, privacy, terms, and error copy. Current wording names browser keys or says data is saved in this browser. | `rg` terminology audit; `.factory/copy-audit.md` |
| F-2-6 | Added **“Opens a completed causal-inference map.”** directly beneath the primary sample action. | first-screen browser test; `.factory/qa-artifacts/polish-2-first-screen-mobile.png` |
| F-2-7 | Replaced labels with **Practice map**, **New claim**, **Map files**, and **Page not found**. Also made the empty state literal while retaining the paper-cut visual system. | full browser suite; `.factory/qa-artifacts/polish-2-demo-mobile.png`; `.factory/qa-artifacts/polish-2-404-dark.png` |
| F-2-8 | Renamed every repository link to **Source on GitHub** on app routes and the static 404. | route/metadata test; `@finding:404-metadata`; live `/404` document |

## Earlier findings rechecked

| Finding | Current closure | Evidence |
|---|---|---|
| F-1-1 | Demo remains an already-used causal-inference map with Can explain, Recognize only, Blocked, history, and a visible next question. | `@claim:demo-sandbox`; `.factory/qa-artifacts/polish-2-demo-first-screen-mobile.png` |
| F-1-2 | Paid UI, price, checkout, billing requests, and upgrade route remain absent. | live request capture in `@claim:local-only`; live `/upgrade` returns 404 |
| F-1-3 | All product promises are represented by 13 unique claims with exactly one tagged test each. | `.factory/claims.json`; clean-clone 13/13 claim commands |
| F-1-4 | First-screen context remains **After reading, watching, or taking notes** without repeating the audience. | `.factory/copy-audit.md`; first-screen screenshots |
| F-1-5 | README prose remains at or below 22 words per sentence. | `.factory/copy-audit.md` README table |
| F-1-6 | Visible product copy consistently uses **next question**. | terminology audit; `@claim:next-question` |
| F-1-7 | Preview heading remains **Preview a claim map.** | first-screen browser test |
| F-1-8 | Privacy heading remains **Your map stays in this browser.** | `@claim:local-only` |
| F-1-9 | The unavailable Studio tier remains removed. | source and live-text scan |
| F-1-10 | README uses **private practice map stored in your browser**; UI labels are literal task names. | `.factory/copy-audit.md` |
| F-1-11 | Copy says there are no trackers and no fonts or scripts from other sites. The request log permits only product origin. | `@claim:local-only` |
| F-1-12 | All current demo documentation uses browser-key wording. | F-2-5 evidence above |
| F-1-13 | Offline wording remains **reloads after your first visit** and is proven in its own browser context. | `@claim:offline-reload`; service-worker update test |
| F-1-14 | README says the build writes the deployable site to `dist/`. | clean-clone build; `dist/index.html` present |
| F-1-15 | README explains app-route handling and security headers plainly. | release-config tests; live header check |
| F-1-16 | Obsolete license wording remains absent. | source and live-text scan |
| F-1-17 | Upgrade offer remains absent; the route is a designed 404. | live `/upgrade` HTTP 404 |
| F-1-18 | **Boundary Map** remains visible in the 390 px header. | mobile browser test; first-screen screenshot |
| F-1-19 | Static 404 has route metadata, shared navigation, theme control, legal links, source label, build id, and a home action. | `@finding:404-metadata`; accessibility matrix; live HTTP 404 |

## Additional defect closed during verification

The expanded Axe matrix found that the standalone 404 used the light persimmon value in dark mode. It now uses the documented `#F18B70` dark token. The matrix then passed all five public pages at 390 × 844 and 1366 × 900 in both themes.

Evidence: `all public pages pass the accessibility and mobile-overflow matrix in both themes`; `.factory/qa-artifacts/polish-2-404-dark.png`.

## Verification record

- Clean clone: `/tmp/kbm-polish-2-clean.JH4EhW` at `aeead84d15c637cddfb8b251858bc3d8dd06dbee`.
- Clean install: 59 packages, 0 vulnerabilities.
- Claims: all 13 commands from `.factory/claims.json` ran separately and passed.
- Unit/config: 10/10 passed.
- Full browser/integration/offline/accessibility suite: 22/22 passed locally and 22/22 passed live.
- Axe matrix: 20 page × viewport × theme scans, zero serious or critical violations.
- Build: JS 36.23 kB raw / 12.30 kB gzip; CSS 19.25 kB raw / 5.17 kB gzip; hero AVIF 74.11 kB.
- Local Lighthouse home/demo: 100/100/100/100; LCP 1.6 s / 1.1 s; CLS 0 / 0; TBT 40 ms / 10 ms.
- Live Lighthouse home/demo: 100/100/100/100; LCP 1.4 s / 1.1 s; CLS 0 / 0; TBT 20 ms / 20 ms.
- URL verifier: local and live passed title, language, one h1, main landmark, alt text, button names, and console checks.
- Live routes: `/`, `/demo`, `/?demo=1`, `/privacy`, and `/terms` return 200; an unknown route returns 404.
- Live headers include CSP, frame denial, MIME sniffing denial, referrer policy, and permissions policy.
- Live JS and CSS SHA-256 values match the final local `dist/` files byte for byte.

No finding from review 1 or review 2 remains open.
