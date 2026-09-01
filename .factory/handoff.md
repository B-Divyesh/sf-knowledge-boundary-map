# Handoff — independent verification 11

## Status

**FAIL.** Candidate `add7292b8cbb99003191be98520690e6694959a4` is deployed byte-for-byte at <https://knowledge-boundary-map.sociobot.in>, but two release blockers remain.

1. Importing a valid-format JSON file with 13 claims succeeds and renders **“13 of 12 free claims.”** This contradicts the public 12-claim limit and is not covered by the current `@claim:free-workshop` check.
2. `npm run test:e2e` failed twice with 21/22 checks because the route/theme/viewport accessibility matrix exceeds the default 30-second per-test limit. The matrix passes alone, taking 35.9 seconds locally and 31.5 seconds live.

Full evidence and exact results are in `.factory/verification-11.md`.

## What was checked

- All 13 commands in `.factory/claims.json` ran separately first and passed.
- The cold first screen clearly states the job, audience, first action, and result; the one-click sample works.
- `npm ci`, unit tests, typecheck, lint, audit, production build, and response-policy checks passed.
- The live create, rehearsal, validation, persistence, removal, undo, malformed-import, keyboard, focus, demo-isolation, and storage-failure paths passed.
- Live outgoing requests stayed on the product origin; response security and cache headers passed.
- Desktop and 390px layouts, light/dark themes, 200% text, reduced motion, and Axe serious/critical checks passed.
- Live offline reload and service-worker update passed.
- Lighthouse scored 99 performance, 100 accessibility, 100 best practices, and 100 SEO. LCP was 1.44 seconds and CLS was 0.
- Initial JavaScript was 12,243 bytes gzip, CSS 5,182 bytes gzip, fonts 0 bytes, and hero AVIF 74,110 bytes.
- Local and live hashes matched for HTML, JavaScript, CSS, hero, service worker, manifest, and 404 page.

No product code was modified. Verification evidence was added under `.factory/evidence-11/`.

## Run and verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e
npm run test:response-policy
```

Run each command in `.factory/claims.json` separately before the remaining checks.

## Required next steps

1. Enforce the 12-claim limit for JSON imports and add import cases to `@claim:free-workshop`.
2. Split the accessibility/mobile matrix or give that matrix a justified timeout so `npm run test:e2e` passes repeatedly without command changes.
3. Re-run all claim commands, the exact full suite, build, live flow, offline update, accessibility matrix, and deployment-identity hashes.

There is no backend, sign-in, product-unlock call, or runtime model feature in this release. No related service or shared resource was inspected or changed.
