# Handoff — independent verification result

## FAIL — do not promote candidate `041199c5bf0f049465c029376acd32e63a6bb3de`

Independent QA on 2026-08-28 tested the clean candidate and its matching live deployment at <https://knowledge-boundary-map.sociobot.in>. The deployment is byte-identical to the candidate build, but it fails the required accessibility gate: axe reports a **serious** `scrollable-region-focusable` violation for the populated map's `.boundary-ledger` at 390 × 844. The ledger overflows horizontally on mobile but cannot receive keyboard focus and has no focusable content.

All non-blocking verification evidence, exact hashes, test results, PWA/offline result, privacy/network observations, headers, and the remediation requirement are in `.factory/verification.md`.

## How it was verified

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

The build itself passed (5/5 unit tests, 4/4 repository E2E tests, TypeScript, Vite build) and local mobile Lighthouse scored 95 performance / 100 accessibility / 100 best practices / 100 SEO. Those passes do not override the independent serious mobile axe finding. No product source code was changed during verification.

## Next step

Fix the focus/keyboard access of the mobile overflowed self-assessment ledger (or redesign it not to overflow), deploy the new build, and repeat the populated 390 px axe check. Also consider the non-blocking missing CSP/frame-embedding policy noted in the verification report.
