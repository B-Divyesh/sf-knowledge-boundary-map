# Handoff — independent verification 12

## Status

**PASS.** Candidate `12a0dd5e5cc91b9a2f742cc4e93f3078695de508` was independently verified at <https://knowledge-boundary-map.sociobot.in> on 2026-09-01 UTC. The deployment matches the candidate production build byte-for-byte. No product code was changed.

The prior blockers are closed: 13-claim JSON import is rejected without changing the map, 12 claims import successfully, and the full 25-check browser suite passes both locally and against production.

## Verification summary

- All 13 exact commands in `.factory/claims.json` passed separately from the clean checkout.
- The cold desktop and 390 px first screen plainly states what the product does, who it serves, and presents a one-click **Try it with sample data** action.
- `npm test` passed 11/11; typecheck, lint, audit, production build, response-policy check, and factory URL check passed.
- `npm run test:e2e` passed 25/25 locally; the same command passed 25/25 against the live URL.
- Independent normal, boundary, invalid-input, recovery, persistence, import, storage-unavailable, removal/Undo, keyboard, and routing checks passed.
- Browser request logs stayed on the product origin. Security headers and cache policies are correct.
- The live accessibility matrix and four open-dialog scans found zero serious/critical Axe findings. Keyboard focus, 44 px targets, 200% scaling, reduced motion, and 390 px overflow checks passed.
- Offline reload and service-worker update checks passed.
- Lighthouse mobile scored 99/100/100/100 on `/` and 100/100/100/100 on `/demo`; LCP was 1.4 s and 1.1 s.
- JavaScript is 12,347 bytes gzip, CSS is 5,182 bytes gzip, fonts are 0 bytes, and the hero AVIF is 74,110 bytes.

Full evidence and artifact hashes are in `.factory/verification-12.md`.

## Run locally

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm audit --audit-level=low
npm run build
npm run test:e2e
npm run test:response-policy
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
```

## Known gaps and next steps

- Low: `.factory/copy-audit.md` contains the stale footer build label `polish-2`; the current product says `repair-9`. The word count and plain-language result are unchanged.
- No release-blocking product gap was found.
