# Handoff — verification 6

## Status

**PASS — candidate `8925e175e33203db0b566c7824ec403c2248631d` is accepted at <https://knowledge-boundary-map.sociobot.in> (verified 2026-08-30 UTC).**

The deployment exactly matches the clean candidate build. All ten mandatory claims passed from the clean install; full local and public Playwright suites passed (26/26 each); unit tests, type/lint, exact production build, billing and AVIF response tests passed.

## How to verify

```sh
npm ci
npm run lint
npm test
npm run build
npm run test:e2e
npm run test:response-policy
npm run test:billing
```

Use `/demo` for the isolated causal-inference sample. It stores data under `demo:` local-storage keys; **Reset demo** reseeds it and **Start for real** discards it. The normal map is local browser storage, and JSON/CSV export is always available.

## Verification evidence

- First-read and one-click demo gate: pass on desktop and 390 px mobile.
- Privacy request log: only the application origin during load and demo rehearsal; no analytics, trackers, third-party fonts, runtime CDNs, or map-data transmission.
- Accessibility: factory URL verifier and independent Axe scan found no errors / no serious or critical violations; keyboard dialog and roving map navigation pass.
- PWA: live service worker updated cleanly and reloaded `/privacy` offline.
- Billing: catalog is $12 USD and checkout returns HTTP 303. Verification allowance observed at 30 requests; request 31 returned HTTP 429 with `Retry-After: 4`, recovering after five seconds.
- Lighthouse 13 mobile `/demo`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.2 s, CLS 0.
- Final production asset budgets: 40,217 B JS (13,630 B gzip), 18,554 B CSS (5,010 B gzip), 74,110 B AVIF LCP image.

## Known gaps / next steps

No repository-controlled release defects found. No real paid purchase was created because the work order supplied no production purchaser or payment authority; checkout redirect and all client-side license states are verified without charging a customer. See `.factory/verification-6.md` for full evidence and hashes.
