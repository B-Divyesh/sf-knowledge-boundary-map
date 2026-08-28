# Handoff — independent verification 2

## Release decision: FAIL

Candidate `f92a710a7747227c5fe0939250a03255a44a8b88` was independently tested on 2026-08-28 at <https://knowledge-boundary-map.sociobot.in>. The live static files exactly match a clean local production build, but the release does not meet the work order.

Blocking findings:

- **High:** `GET https://api.sociobot.in/api/v1/products/knowledge-boundary-map/checkout` returns HTTP 404 (`{"error":"enabled factory product","status":404}`), so the advertised one-time purchase cannot be completed.
- **High:** when localStorage throws `SecurityError`, application initialization throws `Cannot access 'R' before initialization`; only the loading fallback remains and the intended unavailable-storage alert never renders.
- **Medium:** a structurally invalid rehearsal entry is accepted and persisted by JSON import, then opening its claim throws `e.replace is not a function` and no rehearsal dialog opens.
- **Medium:** the 390 px mobile home/footer includes visible targets from 16–30 px high, below the explicit 44 × 44 px requirement.
- **Low:** malformed JSON displays raw parser jargon without a recovery instruction.

Full evidence and reproduction details are in [verification-2.md](verification-2.md).

## What passed

- Clean `npm ci`, audit (0 vulnerabilities), `npm test` (5/5), `npm run build` including type check, and `npm run test:e2e` (5/5).
- Full free create → prerequisite → teach-back → assess → persist → export/import → delete/Undo journey on local production and live.
- Desktop, 390 × 844 mobile, keyboard map/ledger operation, visible focus, dark mode, reduced motion, and zero serious/critical axe findings.
- No normal-flow console/page errors or third-party requests; privacy/legal copy and client-only map storage behaved as documented.
- PWA update and network-off reload of the hydrated application.
- Lighthouse mobile: local 96/100/100/100 and live 100/100/100/100 for Performance/Accessibility/Best Practices/SEO; live FCP 0.9 s, LCP 1.4 s, TBT 50 ms, CLS 0.
- Bundles pass budget: JS 33.06 KB raw, CSS 14.56 KB raw, no fonts, AVIF hero 74.11 KB. Security headers and immutable hashed-asset caching are present.

## How to rerun

```sh
git checkout f92a710a7747227c5fe0939250a03255a44a8b88
git clean -fdx
npm ci
npm audit --audit-level=low
npm test
npm run build
npm run test:e2e
npm run preview
```

Then verify the checkout with a GET (not only HEAD), test storage denial before application script execution, and import a version-1 claim with wrong-typed rehearsal fields. Do not approve until those probes pass on both the local production artifact and live origin. A package-consumer test and backend concurrency/health checks are not applicable to this static web app; no separate lint script exists.

## Repository changes

No product code was modified. This verifier added `.factory/verification-2.md` and replaced this handoff with the current unambiguous QA result.
