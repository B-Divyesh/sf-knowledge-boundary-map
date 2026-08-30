# Polish round 1 — finding closure

Candidate repaired from `bc25c40cebf0247529f8266fe856ba120ddd7012`.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Seeded `/demo` with one Can explain, one Recognize only, and one Blocked causal-inference claim. Each has a teach-back, next question, timestamp, and relevant boundary. The next-question panel appears before map cards on mobile. | `@claim:demo-sandbox`; `/tmp/kbm-polish-shots/demo-mobile.png` |
| F-1-2 | Removed the unreliable Studio price, checkout link, license code, billing test, and API CSP exceptions. This release is honestly free and makes no purchase claim. | `rg` policy audit; `@claim:local-only` request capture |
| F-1-3 | Added claims and one tagged browser test each for prerequisites, the 90-second timer, counterexample capture, and deterministic next-question selection. Rewrote subjective copy as observable behavior. | `.factory/claims.json`; all `@claim:` tests pass |
| F-1-4 | Replaced the repeated audience eyebrow with “After reading, watching, or taking notes.” | `.factory/copy-audit.md`; landing screenshot |
| F-1-5 | Split the README’s long sentence into two plain sentences. | `.factory/copy-audit.md` |
| F-1-6 | Replaced visible “next probe” wording with “next question” across the app, README, CSV, and tests. | `npm test`; terminology table |
| F-1-7 | Renamed the preview heading to “Preview a claim map.” | landing copy audit |
| F-1-8 | Renamed the privacy heading to “Your map stays in this browser.” | landing copy audit |
| F-1-9 | Removed the unavailable Studio tier rather than leaving inconsistent naming. | landing and header scan |
| F-1-10 | Rewrote README opening as browser-stored private practice map. | README audit |
| F-1-11 | Rewrote implementation jargon as “The app loads no fonts or scripts from other sites.” | `@claim:local-only` |
| F-1-12 | Explained demo isolation as browser keys beginning with `demo:`. | `.factory/demo.md`; `@claim:demo-sandbox` |
| F-1-13 | Rewrote offline copy as “reloads after your first visit.” | `@claim:offline-reload` |
| F-1-14 | Rewrote the build-output sentence in plain language. | README |
| F-1-15 | Rewrote the route-config sentence in plain language. | README; `npm test` release-config test |
| F-1-16 | Removed obsolete license storage copy with the unavailable purchase feature. | README and privacy scan |
| F-1-17 | Removed the metaphorical Studio route and offer; `/upgrade` is no longer a listed product route. | sitemap/config release test |
| F-1-18 | Added a visible “Boundary Map” mobile wordmark while retaining the full accessible home name. | `/tmp/kbm-polish-shots/demo-mobile.png`; mobile browser test |
| F-1-19 | Added canonical, description, Open Graph, Twitter metadata, theme control, Source, and build label to `404.html`. | `@finding:404-metadata`; `npm test` |

## Verification evidence

- Clean-install commands: `npm ci`, `npm test`, `npm run lint`, `npm run build`, `npm run test:e2e -- --grep @claim:`, `npm run test:e2e`, and `npm run test:response-policy`.
- Fresh clone evidence: `/tmp/kbm-clean.z6PCfy` completed `npm ci`, `npm run build`, and all 12 tagged claim tests.
- Browser accessibility: Axe Playwright checks on `/`, `/privacy`, `/terms`, and mobile demo reported no serious or critical violations.
- URL verifier: `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173` passed title, language, main, image alt, button names, and console checks. The local report is `/tmp/kbm-verify.i8wHQh`.
- Visual review: `/tmp/kbm-polish-shots/demo-mobile.png` and `/tmp/kbm-polish-shots/hero-element.png` were inspected locally.
- Live URL check at handoff: `https://knowledge-boundary-map.sociobot.in` still returned the pre-repair title after the pushed commit. The exact in-scope Static Web App denied the worker deployment identity, so no live finding is represented as passed without a deployed build.
