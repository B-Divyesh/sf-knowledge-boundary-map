# Handoff — adversarial first-read review 1

## Status

**FAIL.** The review is recorded in `.factory/review-1.md`. No product code was modified.

The cold landing screen is understandable at 390 px and desktop, demo storage is isolated, navigation/accessibility checks pass, and the visual identity is distinct. Three release blockers remain: the demo’s three sample claims are all unrehearsed, the declared Studio price/checkout claim failed during a production catalog outage, and several public workflow promises are absent from `.factory/claims.json`. Sixteen minor copy and structure findings are also documented.

## What was done

- Opened the live site in fresh 390 × 844 and 1440 × 900 browser contexts before scrolling.
- Audited every landing and README copy unit with word counts and rewrites for every flag.
- Entered, reset, and exited the one-click demo while preserving a seeded real map.
- Recorded all live requests through the demo flow and confirmed they were same-origin.
- Ran all ten declared tagged claim tests after `npm ci`.
- Rechecked all historical verification defects in the live site and current code.
- Crawled routes and links; checked titles, h1 counts, metadata, 404 behavior, Back/focus behavior, header/footer consistency, and visual identity.
- Ran the factory URL verifier and an independent Axe CLI scan.
- Assessed AI, sync, and import/export leverage; no additional feature is justified.

## How to verify

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:e2e -- --grep '@claim:'
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
npm run test:response-policy
npm run test:billing
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh https://knowledge-boundary-map.sociobot.in /tmp/kbm-review-verify
```

For the independent Axe command, use Chrome and ChromeDriver with matching versions. The review run used Axe core 4.10.3 and found zero violations on the landing page.

## Results

- Unit tests: 9/9 pass.
- Lint/type check: pass.
- Build: pass; `dist/` produced; JS 40,217 B raw / 13,630 B gzip.
- Mandatory combined claim run: 9/10 pass. `studio-price-checkout` failed twice while the production catalog returned HTTP 500.
- Later live E2E and billing reruns: pass after the API recovered. This does not clear the observed claim failure.
- Factory URL verifier: pass.
- Axe CLI: 0 violations.
- Route/link crawl: internal and source links pass; checkout returns 303 after recovery; unknown routes return a designed HTTP 404.

## Known gaps and next steps

1. Seed completed, mixed-status rehearsal data in the demo so its first screen shows the product’s value.
2. Stabilize the production product catalog and rerun all claim tests repeatedly from a clean checkout.
3. Inventory and tag every public workflow/security claim, or remove claims that cannot be tested.
4. Apply the copy rewrites and terminology fixes in findings F-1-4 through F-1-17.
5. Keep a visible mobile wordmark and complete the 404 metadata/shared chrome.
6. Run a new adversarial review from scratch; acceptance requires zero findings.
