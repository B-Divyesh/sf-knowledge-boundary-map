# Handoff — independent verification 9

## Status

**FAIL — not release ready.** Candidate `57d5b794dece30468a65571c401ea36a9bc1ed71` was tested locally and at <https://knowledge-boundary-map.sociobot.in> on 2026-08-30 UTC. The deployment matches the candidate, and the earlier deployment-only concern did not reproduce.

## Release-blocking findings

1. **Medium: touch targets below 44 px.** The Privacy and Terms contact links are 19 px high at desktop and 390 px in both themes. Populated prerequisite labels are 42 px high at desktop.
2. **Medium: `@claim:json-restore` does not prove restore.** It imports the exported sample over the unchanged sample and asserts data that was already present. A no-op importer would pass, contrary to the declared sandbox and claims contract.

The runtime JSON import was independently exercised against a different map and works. The failure is missing permanent claim proof, not a broken importer.

## Verification summary

- All 12 exact `.factory/claims.json` commands passed individually after clean `npm ci`.
- Cold first-read passed; the audience, job, first action, and one-click sample are clear in one viewport.
- `npm test` passed 10/10; typecheck, lint, audit, response-policy, and production build passed.
- Full Playwright passed 17/17 locally and 17/17 against production.
- Independent live five-claim workflow passed: prerequisites, validation/recovery, Can explain, later downgrade to Recognize only, history, persistence, exports, malformed import, deletion, and Undo.
- Privacy passed: all runtime requests stayed same-origin; no accounts, analytics, trackers, third-party scripts/fonts, uploads, or API traffic appeared.
- Axe found zero serious/critical findings across five routes, two themes, and desktop/mobile, including the rehearsal dialog.
- Keyboard, skip-link, focus restoration, 6.08:1/7.94:1 focus contrast, reduced motion, 200% scale, 390 px reflow, SPA Back/scroll restoration, storage-denial recovery, and designed 404 behavior passed.
- PWA install/update/offline reload passed. Live cache: `kbm-shell-75782fcde263`.
- Lighthouse mobile scored 100/100/100/100 on `/` and `/demo`; home LCP 1.4 s, demo LCP 1.0 s, TBT 80 ms, CLS 0.
- Bundle sizes: JS 36.06 kB raw/12.31 kB gzip; CSS 19.01 kB raw/5.12 kB gzip; hero AVIF 74,110 bytes; no fonts.
- Core live artifacts match `dist/` byte-for-byte. Exact hashes and full evidence are in `.factory/verification-9.md`.

## Scope notes

This release is a static local-first PWA with no backend, sign-in, billing call, or product-unlock endpoint. API rate limiting, server persistence/concurrency/health, Entra authority, and package-consumer checks do not apply. No product code or infrastructure was modified during verification.

## Required next steps

1. Increase the legal contact-link and desktop prerequisite-label hit areas to at least 44 px.
2. Make the tagged JSON restore test clear or replace the current map before importing, then assert the restored full-map fields.
3. Rebuild, deploy, and repeat the claim, accessibility-target, live identity, PWA, and Lighthouse checks.
