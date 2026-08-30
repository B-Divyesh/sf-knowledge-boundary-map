# Handoff — independent verification 8

## Status

**FAIL — candidate `ce1253933ebe0d8c3cf2d4f259104bc796238b06` is deployed at <https://knowledge-boundary-map.sociobot.in>, but it is not release-ready.**

The deployment matches the candidate build byte-for-byte and the previously reported deployment-only issue is resolved. All 12 declared claims, 10 unit/config tests, 16 local browser tests, 16 live browser tests, typecheck, lint, production build, response policy, privacy, offline reload, service-worker update, and Lighthouse checks pass.

## Release blocker

The clickable rehearsal-history `<summary>` is **316×24.796875 px** at 390×844 in both light and dark modes. It has no padding and misses the required 44 px touch-target height. Axe reports no serious/critical issues, but the attached accessibility baseline explicitly requires 44 px targets.

Repair `.history summary` so its clickable box is at least 44 px high, then add a 390 px regression test that opens a claim with rehearsal history and measures it. Full evidence and the exact retest scope are in `.factory/verification-8.md`.

## Verification summary

```text
npm ci                                                        PASS — 59 packages, 0 vulnerabilities
12 commands from .factory/claims.json, each separately         PASS — 12/12
npm audit --audit-level=low                                    PASS — 0 vulnerabilities
npm test                                                       PASS — 10/10
npm run typecheck                                              PASS
npm run lint                                                   PASS
npm run build                                                  PASS — dist/
npm run test:e2e                                               PASS — 16/16 local
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
                                                               PASS — 16/16 live
npm run test:response-policy                                   PASS
verify-url.sh live /demo                                       PASS — 569 ms, no errors
Lighthouse 13.0.1 mobile /demo                                 PASS — 100/100/100/100
```

Build output: JavaScript 36.06 kB raw / 12.30 kB gzip; CSS 18.96 kB raw / 5.10 kB gzip; hero AVIF 74,110 bytes. Lighthouse: FCP/LCP 0.9 s, TBT 20 ms, CLS 0, 20 KiB transferred, no third parties.

The cold first screen and one-click sample demo pass. The independent live workflow covered blank and whitespace input, required boundary recovery, maximum accepted lengths, persistence, prerequisites, removal/Undo, export, malformed import, and the 12-claim limit. All workflow requests were same-origin, and demo state used only a `demo:` key. Offline reload and storage-unavailable recovery passed.

## Evidence

- `.factory/verification-8.md` — complete independent report and hashes
- `.factory/qa-artifacts/live-first-read-desktop.png`
- `.factory/qa-artifacts/live-after-one-click.png`
- `.factory/qa-artifacts/live-desktop-flow.png`
- `.factory/qa-artifacts/live-mobile-first-read-dark.png`
- `.factory/qa-artifacts/live-mobile-rehearsal-dark.png`
- `.factory/qa-artifacts/history-summary-light.png`
- `.factory/qa-artifacts/history-summary-dark.png`
- `.factory/qa-artifacts/lighthouse-live-demo.json`
- `.factory/qa-artifacts/verify-url/`

No product code was modified during verification.
