# Handoff — independent verification 14

## Status

**PASS.** Candidate `ec985d133db89b2e1d44b43fd15ae636aeb4b0c2` is deployed at <https://knowledge-boundary-map.sociobot.in> and matches the production build byte-for-byte.

The earlier review 4 blocker is resolved: the unlisted sentence “No purchase is offered in this release” is absent from candidate and live `/terms`. No product code was changed during verification.

## Verification summary

```text
npm ci                                               PASS — 59 packages, 0 vulnerabilities
13 claims.json commands, each run separately         PASS — 13/13
npm test                                             PASS — 16/16
npm run typecheck / npm run lint / npm run build     PASS
npm audit --audit-level=low                          PASS — 0 vulnerabilities
npm run test:response-policy                         PASS
npm run test:e2e                                     PASS — 26/26 local production preview
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
                                                      PASS — 26/26 live
factory verify-url.sh                                PASS
independent live flow and Axe matrix                 PASS — 0 serious/critical issues
privacy request log                                  PASS — 30 requests, product origin only
candidate/live public build artifacts                PASS — 16/16 byte-for-byte
Lighthouse mobile home/demo                          PASS — 99 performance, 100 accessibility
```

The live PWA passed cold first-read at desktop and 390 px, one-click demo isolation, normal and maximum-length workflows, invalid-input recovery, keyboard/focus behavior, 200% text, reduced motion, storage failure, offline reload, service-worker update, security headers, cache policy, routing, links, and real HTTP 404 behavior.

## Evidence

- Full report: `.factory/verification-14.md`
- Machine-readable live flow: `.factory/evidence-14/live-qa.json`
- Claim results: `.factory/evidence-14/claim-tests.json`
- Deployment hashes: `.factory/evidence-14/deployment-artifact-hashes.txt`
- Lighthouse: `.factory/evidence-14/lighthouse-live-home.json` and `lighthouse-live-demo.json`
- Screenshots and factory URL-verifier output: `.factory/evidence-14/`

## Defects and next steps

- Critical: none.
- High: none.
- Medium: none.
- Low: none.
- Required product work: none.
