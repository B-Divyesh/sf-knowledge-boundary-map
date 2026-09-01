# Handoff — independent verification 13

## Status

**PASS.** Candidate `e615c6705759d5f713a29116e87c2dfac1748186` is verified at <https://knowledge-boundary-map.sociobot.in>. The deployment matches the candidate byte-for-byte. No product defect of any severity was found, and no product code was changed.

Full findings and evidence: `.factory/verification-13.md` and `.factory/evidence-13/`.

## Verification summary

```text
npm ci                                               PASS — 59 packages, 0 vulnerabilities
13 claims.json commands, run separately              PASS — 13/13
npm test                                             PASS — 15/15
npm run typecheck                                    PASS
npm run lint                                         PASS
npm audit --audit-level=low                          PASS — 0 vulnerabilities
npm run build                                        PASS — dist/ produced
npm run test:response-policy                         PASS
npm run test:e2e                                     PASS — 25/25 local
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
                                                       PASS — 25/25 live
factory verify-url.sh                                PASS — no console/page errors
independent live QA                                  PASS
axe serious/critical                                 PASS — 0 findings
privacy request log                                 PASS — product origin only
service-worker update and offline reload             PASS
candidate/live artifact hashes                       PASS — byte-for-byte
```

The cold first screen says what the product does, names self-learners and the recognition/explanation change, and presents **Try it with sample data** with its outcome. One click opens the isolated completed demo.

## Performance

| Route | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/` | 100 | 100 | 100 | 100 | 1.4 s | 0 ms | 0 |
| `/demo` | 99 | 100 | 100 | 100 | 1.1 s | 120 ms | 0 |

JavaScript is 36,482 bytes raw / 12,346 bytes gzip. CSS is 19,252 bytes raw / 5,182 bytes gzip. The hero AVIF is 74,110 bytes. There are no font files.

## Evidence files

- `.factory/verification-13.md` — complete acceptance report and defect ledger.
- `.factory/evidence-13/claim-tests.json` — 13 claim tests passed, 0 failed.
- `.factory/evidence-13/live-qa.json` — first-read, workflow, invalid input, privacy, accessibility, mobile, reduced-motion, storage-failure, and PWA results.
- `.factory/evidence-13/live-first-read-desktop.png` and `live-demo-mobile-390.png` — inspected live layouts.
- `.factory/evidence-13/verify-url/verify.json` — factory URL verification.
- `.factory/evidence-13/lighthouse-live-home.json` and `lighthouse-live-demo.json` — fresh production Lighthouse reports.

## Run and verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e
npm run test:response-policy
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
```

## Known gaps and next steps

None. No repair or deployment action is required.
