# Handoff — repair 7

## Status

**RELEASE READY.** The release blocker in independent verification 8 is repaired, covered by a browser regression, committed as `6190665a2710d464e18cda9dde24eb8fa9e1019b`, and deployed to <https://knowledge-boundary-map.sociobot.in>.

## What changed

The only product defect was the clickable rehearsal-history `<summary>`. At the verifier's 390×844 viewport it measured **316×24.796875 px** in both themes because it had only its natural 24.8 px line height and no target-sized padding.

`src/style.css` now makes the `<summary>` itself a native list-item disclosure target with `min-height: 44px` and vertical padding. No non-clickable parent padding is relied on, and native disclosure semantics are retained.

`tests/e2e/app.spec.ts` now contains `@finding:rehearsal-history disclosure opens with a 44px target at desktop and 390px in both themes`. It opens the completed sample's rehearsal dialog, finds its actual `<summary>`, asserts a 44×44-or-larger box at 1366×900 and 390×844 in light and dark themes, clicks it, and asserts that the matching `<details>` is open.

## Exact reproduction and repair evidence

- Before the change, a 390 px Playwright reproduction measured `316×24.796875 px`, computed `display: list-item`, `line-height: 24.8px`, and zero padding.
- On the deployed build, the same check measured **316×44 px** in both light and dark modes; clicking the summary set its `<details open>` state in both cases.
- Screenshot evidence: `qa-artifacts/repair-7-history-summary-light.png` and `qa-artifacts/repair-7-history-summary-dark.png`.

## Verification

Clean install and local quality gates:

```text
npm ci                                                    PASS — 59 packages installed, 0 vulnerabilities
all 12 .factory/claims.json test commands, separately    PASS — 12/12
npm test                                                  PASS — 10/10
npm run typecheck                                         PASS
npm run lint                                              PASS
npm run build                                             PASS — dist/ produced
npm audit --audit-level=low                               PASS — 0 vulnerabilities
npm run test:e2e                                          PASS — 17/17 production-preview browser tests
```

The static site is not a published library or CLI, so a package-consumer check is not applicable. The browser suite covers the full learner workflow, desktop and 390 px mobile, keyboard claim navigation/dialog return focus, offline reload, service-worker update, privacy request logging, local storage failure recovery, export/import, and every declared claim.

Independent browser checks:

- Factory `verify-url.sh` passed locally and live on `/demo`: correct title, `lang=en`, one H1, main landmark, all image alt text, labelled buttons, and no console/page errors. Live evidence is in `qa-artifacts/repair-7-verify-url-live/`.
- Axe found **0 serious or critical** violations for `/`, `/demo`, `/privacy`, `/terms`, and the designed 404 in light and dark at both 1366×900 and 390×844 (20 route/theme/viewport checks). None had horizontal overflow.
- Live `PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e` passed **17/17**.
- `npm run test:response-policy` passed live: the hero response is HTTP 200 with `Content-Type: image/avif`.
- Live headers include the shipped CSP with header-only `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict-origin referrer policy, HSTS, and disabled camera/microphone/geolocation.
- Mobile Lighthouse on live `/demo`: **Performance 100, Accessibility 100, Best Practices 100, SEO 100**; FCP 0.9 s, LCP 1.0 s, TBT 20 ms, CLS 0, 20 KiB transferred. Full report: `qa-artifacts/repair-7-lighthouse-live.json`.

Production build size remains within budget: 36.06 kB raw / 12.31 kB gzip JavaScript and 19.01 kB raw / 5.12 kB gzip CSS. The existing hero AVIF remains 74,110 bytes.

## Deployment identity

The supplied static deployment configuration uploaded `dist/` to the existing `sf-knowledge-boundary-map` Azure Static Web App. Deployment completed successfully (deployment ID `fb840b4d-c484-4627-a3fc-2c2b9127cc5d`), and the product's managed TLS endpoint returned HTTP 200.

The live build matches the final local production artifacts byte-for-byte:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `2fe2016203e378a86a7e0a56d6795609886d7e4adf077f2e208e0fee58335ad8` |
| `assets/index-DihHwhbI.css` | `eb246c0267b33bd13389ffcb0122c6949fca53648f581857839666b0e559ea0f` |
| `assets/index-B0BxfLFK.js` | `5a9c030b4c4a21eccc62530e2a89c653e3290a4d4a29fc09230ccf9d0590891d` |

## Privacy and known gaps

The app remains local-first: no accounts, analytics, trackers, third-party fonts, uploads, or runtime API calls. The privacy claim's request-log test passes with the product origin as the only origin, and demo data remains under the separate `demo:` storage namespace.

There are no known release-blocking gaps. Future work is product choice rather than repair work: learners can export JSON before clearing browser data, but there is intentionally no account or cloud sync in this private static release.
