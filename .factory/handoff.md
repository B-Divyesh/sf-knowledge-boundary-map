# Handoff — polish round 1

## Status

All findings in `.factory/review-1.md` are repaired. The released product remains a Vite + TypeScript static web app; `dist/` has `index.html` at its root.

## What changed

- Replaced the empty sample with a completed, mixed-status causal-inference map. Demo remains isolated under `demo:` keys and has Reset demo and Start for real controls.
- Rewrote first-screen, README, privacy, terms, metadata, and mobile copy in plain language. “Next question” is the one term used throughout.
- Removed the external Studio purchase path because its catalog claim was unreliable during review. The product makes no price or checkout claim and makes no runtime external request.
- Added claim-contract coverage for prerequisite persistence, the 90-second timer, counterexample saving, and deterministic next-question selection.
- Completed static 404 metadata and chrome, retained real app routes, added a visible mobile wordmark, and fixed hero-art stacking.

## Exact verification

Run from a clean checkout:

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:e2e -- --grep @claim:
npm run test:e2e
npm run test:response-policy
```

This repair run produced:

- `npm test`: 10 passed.
- `npm run lint`: passed.
- `npm run build`: passed; `dist/` produced. Initial JS is 36.06 kB raw / 12.30 kB gzip; CSS is 18.74 kB raw / 5.05 kB gzip.
- `npm run test:e2e -- --grep @claim:`: 12 passed.
- Fresh clone `/tmp/kbm-clean.z6PCfy`: `npm ci`, `npm run build`, and all 12 tagged claim tests passed.
- `npm run test:e2e`: 15 passed, including offline/service-worker and Axe Playwright checks.
- `npm run test:response-policy`: passed; the live product AVIF returned HTTP 200 with `image/avif`.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173`: passed title, language, h1, main, alt text, named buttons, and console checks. Report: `/tmp/kbm-verify.i8wHQh`.

Visual evidence is `/tmp/kbm-polish-shots/demo-mobile.png` and `/tmp/kbm-polish-shots/hero-element.png`. Finding-by-finding evidence is in `.factory/polish-1.md`.

## Deployment status

The repair commit was pushed to `main` as `ba8fe539c785eacad176c16eb6ae13594240e761`. The work-order configuration has a static deploy build command and no repository-local deployment command. At handoff, the live URL still served the prior title, `Knowledge Boundary Map — check what you can explain`.

The only in-scope manual deploy check (`sf-knowledge-boundary-map`) was denied by Azure with `AuthorizationFailed` for `Microsoft.Web/staticSites/read`; no other resource was accessed. The source tree is committed, pushed, and buildable, but a deployment identity with access to that exact Static Web App must run the configured static deployment before live re-check can complete.

The optional paid tier is intentionally not offered in this release; no payment or price promise remains.
