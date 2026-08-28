# Independent verification — FAIL

**Work order:** `knowledge-boundary-map-verify-1`  
**Tested candidate:** `041199c5bf0f049465c029376acd32e63a6bb3de` (`041199c fix: polish accessibility and reversible map actions`)  
**Live URL:** <https://knowledge-boundary-map.sociobot.in>  
**Date:** 2026-08-28

## Decision

**FAIL.** The candidate fails the explicit accessibility quality gate: an independent axe scan finds one **serious** issue on the populated map at the required 390 px mobile viewport. This is reproducible from both the locally built production artifact and the byte-identical live deployment.

## Blocking defect

### High — mobile status ledger cannot be used with a keyboard

At 390 × 844 with a populated map, `.boundary-ledger` becomes horizontally scrollable (`overflow-x: auto`) but has no focusable descendants and is not focusable itself. Axe 4.10.2 reports:

```
scrollable-region-focusable (serious)
target: .boundary-ledger
<ul class="boundary-ledger" aria-label="Self-assessed boundary summary">
Ensure elements that have scrollable content are accessible by keyboard
WCAG 2.1.1 / 2.1.3
```

Keyboard-only users at the required mobile size cannot scroll the four-part assessment summary when it overflows. The applicable factory acceptance contract requires no serious/critical axe findings, keyboard access, and mobile support. This is the reason for the FAIL.

## Non-blocking observation

### Low — response policy lacks CSP and frame-embedding control

The live HTML response supplies HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, and a restrictive camera/microphone/geolocation permissions policy. It does **not** supply `Content-Security-Policy` or `X-Frame-Options`/a CSP `frame-ancestors` directive. This did not produce a functional failure in testing, but a restrictive CSP (including `connect-src 'self' https://api.sociobot.in`) and embedding policy would enforce the product's privacy/security boundary in the browser.

## Evidence

### Clean local candidate

Started at the requested commit with a clean worktree; removed only untracked `graphify-out/` with `git clean -fdx`, then installed from the lockfile.

| Check | Result |
|---|---|
| `npm ci` | Passed; 0 audit vulnerabilities reported |
| `npm test` | Passed: 5/5 Vitest tests |
| Type check + exact production build (`npm run build`) | Passed; `tsc --noEmit` and Vite build completed |
| `npm run test:e2e` | Passed: 4/4 Chromium tests |
| Separate lint script | None is defined in `package.json` |
| Build output | `dist/` produced; total 272,960 bytes |
| Initial JS budget | 32,830 bytes raw / 11,590 bytes gzip (under 200 KB) |
| CSS budget | 14,530 bytes raw / 4,270 bytes gzip (under 50 KB) |
| Lighthouse 13.4.1, local production preview, simulated mobile | Performance 95; Accessibility 100; Best Practices 100; SEO 100; FCP 1.0 s; LCP 1.6 s; TBT 240 ms; CLS 0 |

### Independent browser exercise

On the live candidate, Chromium/Playwright exercised the brief's job end to end:

- Empty state and skip link; one claim creation; whitespace-only claim error and recovery.
- Teach-back saved as **Can explain** only after the required explanation, boundary/counterexample, and next probe; missing-boundary error was shown and then recovered.
- CSV export download; malformed JSON import error; valid JSON import with a prerequisite link; confirmed removal and Undo restoration.
- Three-claim example, arrow-key map navigation, desktop layout, 390 px layout, reduced-motion media query, privacy/terms/upgrade routes, and one-`h1` checks.
- No console errors or page errors were observed. In the normal free flow every browser request remained at `https://knowledge-boundary-map.sociobot.in`; there were no third-party fonts, scripts, analytics, or tracker requests. Billing is not contacted until a user supplies/returns a license.
- Axe serious/critical findings were zero for desktop populated map and `/privacy`, `/terms`, and `/upgrade`; the 390 px populated map finding above is the sole serious finding.

### PWA, deployment, and headers

- The live page registered an active controller at `https://knowledge-boundary-map.sociobot.in/sw.js`, cache `kbm-shell-v1`. `registration.update()` completed with no waiting/installing worker for the current revision. An offline reload after service-worker control rendered the application `h1` successfully.
- Candidate/live identity is confirmed: `index.html` SHA-256 `b447aeb29ffc4cabf6c5f6acad6eea61a1d3cbf8303b4b305b89851f40a2d68d`; CSS SHA-256 `af775da8a65fd0d0abe9e4ef358d4ab88917cc63f5789e3baf1ea61dfb6d61ec`; JS SHA-256 `3d9a76cc0262f5d03d62feda7ee71543d179ae9667883e2f85528e0a5466257d` match `dist/` exactly.
- Live assets use immutable one-year caching for hashed CSS/JS. HTML, service worker, and manifest use `public, must-revalidate, max-age=30`. HSTS, referrer, nosniff, and permissions headers are present as noted above.

## Required remediation and re-verification

Make the mobile overflowed ledger keyboard-reachable (or remove the overflow by intentionally adapting the mobile layout), then rerun axe against a populated 390 px map. A verifier must obtain zero serious/critical findings before this candidate can pass.
