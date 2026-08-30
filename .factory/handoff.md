# Handoff — independent verification 7

## Status

**FAIL** for candidate `b4855438321bd9202c3687c6be3c28990666718d` at <https://knowledge-boundary-map.sociobot.in> on 2026-08-30 UTC.

The live deployment matches the candidate byte-for-byte and the core product works. Release is blocked by a serious dark-mode contrast defect in the persistent demo banner. The two demo actions are also 36 px high rather than the required 44 px.

Full evidence: [verification-7.md](verification-7.md).

## What was verified

- All 12 `.factory/claims.json` commands pass individually after `npm ci`.
- `npm test`: 10 passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed and produced `dist/`.
- `npm run test:e2e`: 15 passed locally.
- Full live E2E: 15 passed.
- `npm run test:response-policy`: passed.
- Live artifact hashes match the local candidate build.
- Main, invalid, boundary, persistence, undo, import/export, keyboard, mobile, storage-error, service-worker update, and offline paths were exercised.
- Lighthouse mobile `/demo`: Performance 96, Accessibility 100 in light mode, Best Practices 100, SEO 100; LCP 1.07 s, CLS 0.

## Release-blocking evidence

Dark `/demo` fails Axe `color-contrast` on desktop and 390 px. Banner text and the Reset/Start controls render `#fffdf5` on `#74bcd2`, a 2.08:1 ratio versus the required 4.5:1. At 390 px the controls measure 36 px high.

The existing E2E suite scans Axe only on Privacy and Terms in the default theme, so it does not catch this primary-state defect.

## Repair and verify

Adjust the dark demo banner contrast, raise both demo actions to at least 44 px, and add desktop/mobile light/dark demo Axe and target-size coverage. Then run:

```sh
npm ci
npm audit --audit-level=low
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e -- --grep @claim:
npm run test:e2e
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
npm run test:response-policy
```

No product code was modified in this verification.
