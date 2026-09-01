# Polish round 3 — cumulative zero-finding closure

Released from review commit `68657ec178edd854d74c42cd8cb736a2b53fa121`. Repair commits: `566f3cd` and `af746cc`. Deployed to <https://knowledge-boundary-map.sociobot.in> on 2026-09-01 UTC with deployment id `9bcfb413-c894-4236-9540-d9434e2060aa`.

## Review 3 findings

| Finding | Change made | Evidence |
|---|---|---|
| F-3-1 | Replaced “home wordmark” with the visible control name, “product name,” in README and demo documentation. | `@finding:F-3-1 names the visible product-name control instead of using design jargon`; `rg` finds no old phrase; the live product-name exit passes in the 25-test production suite and `.factory/evidence-3/live-qa.json`. |
| F-3-2 | Replaced “visual system” and “generated-image provenance” with “visual design” and “source of its generated image.” | `@finding:F-3-2 documents the visual design and image source in plain words`; README copy audit; live product remains unchanged and passes at <https://knowledge-boundary-map.sociobot.in>. |
| F-3-3 | Regenerated `.factory/copy-audit.md` for round 3 and advanced both product footers to build `polish-3`. | `@finding:F-3-3 keeps the copy audit aligned with the released footer and README`; `.factory/evidence-3/live-home-mobile-390.png`; live footer check at <https://knowledge-boundary-map.sociobot.in>. |

## Review 2 findings

| Finding | Change retained and rechecked | Evidence |
|---|---|---|
| F-2-1 | The demo product name opens `/`, discards only demo keys, preserves the real map, and focuses the landing h1. | `@finding:demo-home-exit`; `@claim:demo-sandbox`; live 25/25 suite; `productNameExit: PASS` in `.factory/evidence-3/live-qa.json`. |
| F-2-2 | The free claim states only the 12-claim limit; the tagged test restores 12 and rejects 13. | `@claim:free-workshop`; clean-clone claim run; live 25/25 suite. |
| F-2-3 | The self-assessment test changes, saves, reloads, reopens, and checks the status, text, history, and non-scoring label. | `@claim:self-assessment-label`; clean-clone claim run; live 25/25 suite. |
| F-2-4 | Real and demo theme choices use separate keys; leaving demo removes only the demo choice. | `@claim:theme-storage`; clean-clone claim run; live 25/25 suite. |
| F-2-5 / F-1-12 | User-facing copy explains browser keys beginning with `demo:` and contains no “namespace.” | Copy regression tests; `.factory/demo.md`; `@claim:demo-sandbox`; live privacy/isolation check. |
| F-2-6 | The primary sample action is followed by “Opens a completed causal-inference map.” | First-screen browser test; `.factory/evidence-3/live-home-mobile-390.png`; live cold check. |
| F-2-7 | Task labels remain Practice map, New claim, Map files, and Page not found. | Live 25/25 suite; `.factory/evidence-3/live-demo-first-screen-mobile-390.png`; `.factory/evidence-3/live-404-mobile-dark.png`. |
| F-2-8 | Repository links are labelled “Source on GitHub.” | Route test; 404 metadata unit test; live route matrix at <https://knowledge-boundary-map.sociobot.in>. |

## Review 1 findings

| Finding | Change retained and rechecked | Evidence |
|---|---|---|
| F-1-1 | Demo contains one Can explain, one Recognize only, and one Blocked claim, with completed evidence, history, and a specific next question. | `@claim:demo-sandbox`; `.factory/evidence-3/live-demo-first-screen-mobile-390.png`; live `/demo` and `/?demo=1`. |
| F-1-2 | Removed the unreliable paid offer, checkout, billing requests, and Studio route. | `@claim:local-only`; request origin is product-only in `.factory/evidence-3/live-qa.json`; live `/upgrade` returns the designed 404. |
| F-1-3 | Thirteen narrow claims cover demo, privacy, offline, export/restore, keyboard, limit, self-assessment, theme, prerequisites, timer, boundary, and next question. | All 13 exact `.factory/claims.json` commands passed separately from `/tmp/kbm-polish3-clean.qrIlzX`; each id occurs in one tagged test. |
| F-1-4 | First-screen context says “After reading, watching, or taking notes,” without repeating the audience. | First-screen browser test; `.factory/evidence-3/live-home-mobile-390.png`; live cold check. |
| F-1-5 | README prose remains within the 22-word cap. | `.factory/copy-audit.md`; copy regression suite. |
| F-1-6 | Visible copy consistently uses “next question”; `nextProbe` remains internal data naming only. | `@claim:next-question`; copy audit; live `/demo` check. |
| F-1-7 | The preview heading remains “Preview a claim map.” | First-screen browser test; live home screenshot. |
| F-1-8 | The privacy heading remains “Your map stays in this browser.” | `@claim:local-only`; live home screenshot and `/privacy`. |
| F-1-9 | Studio UI and terminology remain absent. | Source scan; live page text; same-origin request capture. |
| F-1-10 | README describes a private practice map stored in the browser. | README copy audit and `@claim:local-only`. |
| F-1-11 | Copy says there are no accounts, analytics, or trackers and no fonts or scripts from other sites. | `@claim:local-only`; live request-origin check. |
| F-1-12 | Demo separation is described with literal `demo:` browser keys. | `@claim:demo-sandbox`; `.factory/demo.md`; live isolation check. |
| F-1-13 | Offline copy says the app reloads after the first visit. | `@claim:offline-reload`; service-worker update test; live 25/25 suite. |
| F-1-14 | README says the build writes the deployable site to `dist/`. | Clean work-order build; `dist/index.html` present. |
| F-1-15 | README explains that the configuration sends app routes to `index.html` and adds security headers. | Release-config tests; live headers show CSP, frame denial, MIME protection, referrer policy, and permissions policy. |
| F-1-16 | Obsolete license-storage language remains absent. | Source and live copy scan. |
| F-1-17 | The removed upgrade page remains a designed 404. | Live `/upgrade` status check in the route/browser suite; `.factory/evidence-3/live-404-mobile-dark.png`. |
| F-1-18 | “Boundary Map” remains visible in the 390 px header. | `.factory/evidence-3/live-home-mobile-390.png`; live mobile matrix. |
| F-1-19 | The 404 retains its own metadata, theme control, shared legal/source links, build id, and a way home. | `@finding:404-metadata`; 404 hash matches live; `.factory/evidence-3/live-404-mobile-dark.png`; live HTTP 404. |

## Final verification

- Clean clone: `/tmp/kbm-polish3-clean.qrIlzX`; `npm ci` installed 59 packages with 0 vulnerabilities.
- Claims: all 13 commands in `.factory/claims.json` ran separately and passed.
- Unit/config/copy: `npm test` passed 15/15; `npm run lint` and `npm run build` passed.
- Browser: `npm run test:e2e` passed 25/25 locally; the same suite passed 25/25 live.
- Accessibility and mobile: the independent 20-case route × viewport × theme matrix found 0 serious/critical Axe issues, 0 px overflow, and 0 unexpected console errors. Reduced motion left 0 material durations.
- Privacy: the cold landing, demo, reset, exit, and `?demo=1` flow contacted only `https://knowledge-boundary-map.sociobot.in`.
- Offline: the dedicated claim test and prior-worker update test passed in their own browser contexts.
- URL verifier: local and live checks passed title, language, one h1, main, alt text, button names, and console checks.
- Lighthouse 13.4.1: local home/demo and live home/demo scored 100/100/100/100. Live LCP was 1.36 s / 0.93 s; TBT 2 ms / 12 ms; CLS 0 / 0.
- Production size: JS 36,482 bytes raw / 12.42 kB gzip; CSS 19,252 bytes raw / 5.17 kB gzip; fonts 0; hero AVIF 74,110 bytes.
- Deployment identity: live `index.html`, JavaScript, CSS, `404.html`, and `sw.js` SHA-256 hashes match local `dist/` byte-for-byte.

No finding from review 1, review 2, or review 3 remains open.
