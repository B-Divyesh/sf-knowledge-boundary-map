# Handoff — first-read review 2

## Status

**FAIL.** Candidate `ef013d028fab17041cb3f035362423174b7ee9d4` was reviewed against <https://knowledge-boundary-map.sociobot.in> on 2026-09-01 UTC. No product code was changed.

The cold first screen and completed demo are clear and usable. Demo map data stays separate from a seeded real map, Reset works, Start for real removes demo map data, all 12 declared claim commands return successfully from a clean clone, and the live production assets match the local build.

Acceptance remains blocked by five findings: the demo wordmark labeled home stays in demo; the free-flow and self-assessment tests do not confirm their full claims; theme-storage privacy wording has no claims entry or tagged test; and the earlier README **“namespace”** wording remains in one section. Three minor copy and structure findings also remain.

## Review artifact

See `.factory/review-2.md` for exact quotes, finding ids, proposed fixes, the complete landing and README copy audit, claim results, earlier-finding confirmation, route checks, and missed-leverage assessment.

Screenshots:

- `.factory/qa-artifacts/review-2-first-read-mobile.png`
- `.factory/qa-artifacts/review-2-first-read-desktop.png`
- `.factory/qa-artifacts/review-2-demo-mobile.png`

## Verification

```text
npm ci in /tmp/kbm-review-2.GyklmS                       PASS
all 12 .factory/claims.json commands                      PASS as commands; two have incomplete assertions
npm test                                                  PASS — 10/10
npm run build                                             PASS
npm run test:response-policy                              PASS
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
                                                           PASS — 18/18
/opt/fleet/lib/verify-url.sh on live home                 PASS
fresh Axe: 4 routes × 2 widths × 2 themes                PASS — 0 violations
live/local production asset hashes                        PASS — identical
```

## Next step

Resolve F-2-1 through F-2-8, deploy the repaired build, then repeat the full review from a fresh context. There are no runtime model, account, backend, payment, or sync surfaces to verify in this release.
