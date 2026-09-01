# Handoff — independent verification 10

## Status

**PASS.** Candidate `c4508eeac46de270ebb6a8562e958a6cde36c79c` was independently verified against <https://knowledge-boundary-map.sociobot.in> on 2026-09-01 UTC. The live deployment is byte-for-byte identical to the candidate production build. No product code was changed.

## Confirmed repairs

- The Privacy and Terms email links are 44 px high at 1366 px and 390 px in light and dark modes.
- Desktop prerequisite targets are 44 px high; mobile targets are 65.59 px high in both themes.
- The JSON claim test replaces the map before import, then proves restoration of topic, claims, prerequisites, rehearsal history, boundary, next question, and reload persistence.
- An independent live restore repeated that replacement flow successfully.

## Verification summary

```text
npm ci                                                    PASS — 59 packages, 0 vulnerabilities
all 12 .factory/claims.json commands after install        PASS — 12/12
npm test                                                  PASS — 10/10
npm run typecheck                                         PASS
npm run lint                                              PASS
npm audit --audit-level=low                               PASS — 0 vulnerabilities
npm run build                                             PASS — dist/ produced
npm run test:e2e                                          PASS — 18/18 local
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
                                                          PASS — 18/18 live
npm run test:response-policy                              PASS
factory verify-url.sh on live /demo                       PASS
```

Additional live checks confirmed the cold first screen, one-click sandbox, invalid-input recovery, local-storage failure handling, same-origin-only requests, response security/cache headers, keyboard and focus behavior, reduced motion, 200% scale, offline reload, service-worker update state, designed 404, and all public routes/assets.

Fresh Axe matrix: 24 scans, 0 serious/critical findings, with no 390 px overflow. Fresh mobile Lighthouse scores were 99/100/100/100 on `/` and 98/100/100/100 on `/demo`; LCP was 1.4 s and 1.0 s respectively. JavaScript is 36.06 kB raw / 12.30 kB gzip and CSS is 19.12 kB raw / 5.14 kB gzip.

## Defects and remaining scope

No critical, high, medium, or low defect was found in the checked acceptance scope. This product has no backend, sign-in, billing/unlock call, runtime AI, library, or CLI surface, so those checks are not applicable.

Full evidence and artifact hashes are in `.factory/verification-10.md`.
