# Handoff — perfection-loop polish round 3

## Status

**PASS.** Every finding in `.factory/review-1.md`, `.factory/review-2.md`, and `.factory/review-3.md` is closed. The repair is deployed at <https://knowledge-boundary-map.sociobot.in> with visible build label `polish-3`.

Repair commits: `566f3cd` and `af746cc`. Azure Static Web Apps deployment id: `9bcfb413-c894-4236-9540-d9434e2060aa`.

## What changed

- Replaced the README’s “home wordmark” jargon with the visible “product name” control.
- Rewrote “visual system” and “generated-image provenance” as plain descriptions of the visual design and generated image source.
- Regenerated `.factory/copy-audit.md` and aligned the app and 404 footers on build `polish-3`.
- Added four unit regressions covering F-3-1, F-3-2, F-3-3, and the verb-first 120-character catalog rule.
- Updated `.factory/catalog-description.txt` to an 83-character verb-first sentence.
- Preserved the paper-cut diorama visual identity and all earlier demo, claims, routing, legal, mobile, accessibility, privacy, and offline fixes.

The cumulative finding-to-change-to-evidence map is in `.factory/polish-3.md`.

## Exact verification evidence

```text
Clean clone                                         /tmp/kbm-polish3-clean.qrIlzX
npm ci                                              PASS — 59 packages, 0 vulnerabilities
13 claims.json commands, run separately             PASS — 13/13
npm test                                            PASS — 15/15
npm run lint                                        PASS
npm run build                                       PASS — dist/index.html produced
npm audit --audit-level=low                         PASS — 0 vulnerabilities
npm run test:response-policy                        PASS — live AVIF is 200 image/avif
npm run test:e2e                                    PASS — 25/25 local
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
                                                      PASS — 25/25 live
verify-url.sh local                                 PASS — 0 console errors
verify-url.sh live                                  PASS — 0 console errors
independent live route/theme/viewport Axe matrix    PASS — 20/20, 0 serious/critical
independent live mobile overflow matrix             PASS — 20/20, 0 px overflow
independent live privacy flow                       PASS — product origin only
independent live reduced-motion check               PASS — 0 material durations
live/local HTML, JS, CSS, 404, and SW hashes        PASS — byte-for-byte identical
```

Evidence files:

- `.factory/evidence-3/live-qa.json` — demo isolation, reset, product-name exit, `?demo=1`, request origins, 20-case Axe/overflow matrix, reduced motion.
- `.factory/evidence-3/live-home-mobile-390.png` — cold first screen and build `polish-3` footer.
- `.factory/evidence-3/live-demo-first-screen-mobile-390.png` — completed mixed-status sample, banner, controls, and next question.
- `.factory/evidence-3/live-404-mobile-dark.png` — real styled 404 with shared links and build label.
- `.factory/evidence-3/live-url/verify.json` — factory URL verifier report.
- `.factory/evidence-3/lighthouse-live-home.json` and `lighthouse-live-demo.json` — production performance reports.

## Performance

| Target | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Local `/` | 100 | 100 | 100 | 100 | 1.65 s | 3 ms | 0 |
| Local `/demo` | 100 | 100 | 100 | 100 | 1.09 s | 21 ms | 0 |
| Live `/` | 100 | 100 | 100 | 100 | 1.36 s | 2 ms | 0 |
| Live `/demo` | 100 | 100 | 100 | 100 | 0.93 s | 12 ms | 0 |

Production JavaScript is 36,482 bytes raw / 12.42 kB gzip. CSS is 19,252 bytes raw / 5.17 kB gzip. The hero AVIF is 74,110 bytes. There are no font files.

## Deployment identity and headers

The live and local SHA-256 values match:

| Artifact | SHA-256 |
|---|---|
| `index.html` | `2073423c5b7e9d163f19ba88a70367668141342b795a51df035e40d67191f938` |
| `/assets/index-DCXFTcNK.js` | `699db035acd39825457d4b1b4553bdda9c2e4c22bc527651a8711663245323a2` |
| `/assets/index-BIFJACiF.css` | `60cc10eb6c9bb491f83e8c9cc5d9db24a462c31ac7b04203387f9262370a1d86` |
| `404.html` | `758be05fb1717674e3f9e8076aab94cb53143fc379b07e2101ccaa2dd33d3ce8` |
| `sw.js` | `6c9772a3abb01d5748ff2d2e67bde429a8091a958f19ade83f2672d5a9d1c59a` |

Production returns CSP with response-header `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, permissions policy, and HSTS.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:e2e
npm run test:response-policy
```

## Known gaps and next steps

None. No finding of any severity remains, and no follow-up repair is required for this work order.
