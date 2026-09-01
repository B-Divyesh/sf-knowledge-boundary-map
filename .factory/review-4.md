# Adversarial first-read review 4

- **Product:** Knowledge Boundary Map
- **Candidate and deployed build:** `b3d6b774b358a36f521e425d291fd83c437a3352`
- **Live URL:** <https://knowledge-boundary-map.sociobot.in>
- **Reviewed:** 2026-09-01 UTC

## Verdict: FAIL

The published product is clear on a cold phone visit, opens a realistic completed
sample in one selection, keeps the sample separate from real browser data, and
passes the listed claims and quality checks. One public statement in Terms is a
product claim without an entry and observable tagged test in
`.factory/claims.json`. A PASS requires zero findings.

## Findings

### Blocking

#### F-4-1 — Terms promises that no purchase is offered, but that promise has no claim entry or test

- **Location / exact quote:** `/terms`, **“No purchase is offered in this release.”**
- **Why this fails review:** This is a concrete product promise a visitor can
  rely on when deciding whether to use the tool. The claims inventory has no
  `no-purchase` entry. The `local-only` test records origin only during one
  rehearsal; it does not assert that every public route has no price, purchase
  control, billing request, or checkout destination. Therefore the promise is
  not covered by the required exactly-one tagged observable claim test.
- **Concrete fix:** Delete the sentence because it is not needed to explain the
  free limit, or add a `no-purchase` claim with one
  `@claim:no-purchase` browser test. That test should visit `/`, `/demo`,
  `/privacy`, and `/terms`, assert that no price or purchase action is exposed,
  and record that no billing or checkout request occurs.

## 1. Cold first screen

Fresh Chromium contexts had empty cookies and storage. No scrolling occurred
before answering the three questions.

| Viewport | What it does, in my words | Who it is for | First selection | Result |
|---|---|---|---|---|
| 390 × 844 | It asks me to test whether I can explain a topic rather than merely recognize it. | A self-learner after reading, watching, or taking notes. | **Try it with sample data** | Pass |
| 1440 × 900 | It maps claims and prerequisites, then records the explanation gap to study next. | A self-learner separating recognition from an explanation they can produce. | **Try it with sample data** | Pass |

The decisive first-screen text was **“Test what you can explain.”**,
**“For self-learners who want to separate recognition from an explanation they
can produce.”**, and **“Try it with sample data”** followed immediately by
**“Opens a completed causal-inference map.”** The private, offline, and free
facts are also visible before a phone visitor scrolls. This is clear and
actionable.

## 2. Copy audit

Counts use whitespace-delimited words; hyphenated words and URLs each count as
one word. The landing audit includes readable headings, actions, labels, the
image alternative, and shared header/footer text so no visitor-facing wording is
omitted. Commands in the README are commands rather than prose sentences.

### Landing page

| Copy | Words | Result |
|---|---:|---|
| Skip to your map | 4 | Pass |
| Knowledge Boundary Map | 3 | Pass |
| Boundary Map | 2 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| After reading, watching, or taking notes | 6 | Pass |
| Test what you can explain. | 5 | Pass |
| For self-learners who want to separate recognition from an explanation they can produce. | 13 | Pass |
| Try it with sample data | 5 | Pass |
| Opens a completed causal-inference map. | 5 | Pass |
| Pin your first claim | 4 | Pass |
| Private: stored in this browser. | 5 | `local-only` |
| Offline: reloads after your first visit. | 6 | `offline-reload` |
| Free: up to 12 claims per map. | 7 | `free-workshop` |
| Layered paper hills form a path from blue fog past an orange obstacle toward a clear golden marker. | 18 | Pass; useful image alternative |
| Record your own evidence and uncertainty. | 6 | `self-assessment-label` |
| This tool does not score intelligence. | 6 | `self-assessment-label` |
| Live preview | 2 | Pass |
| Preview a claim map. | 4 | Pass |
| Each claim keeps its prerequisites and your latest self-assessment. | 9 | `prerequisites`, `self-assessment-label` |
| Correlation is not causation | 4 | Sample content |
| Can explain | 2 | Status label |
| A confounder affects both variables | 5 | Sample content |
| Recognize only | 2 | Status label |
| Random assignment reduces confounding | 4 | Sample content |
| Blocked · needs both earlier claims | 6 | Sample state |
| How it works | 3 | Pass |
| Choose your next question. | 4 | `next-question` |
| Pin a claim. | 3 | Result-naming step |
| Start with something that feels familiar. | 6 | Pass |
| Teach it back. | 3 | Result-naming step |
| Write what you can produce without notes. | 7 | Pass |
| Record a next question. | 4 | Result-naming step |
| Choose an example or prerequisite to test next. | 8 | Pass |
| Privacy and limits | 3 | Pass |
| Your map stays in this browser. | 6 | `local-only` |
| Your map stays here unless you export it. | 8 | `local-only` |
| There are no accounts, analytics, or trackers. | 7 | `local-only` |
| The app loads no fonts or scripts from other sites. | 10 | `local-only` |
| What this does not do | 5 | Pass |
| It records your self-assessment. | 4 | `self-assessment-label` |
| It does not fact-check claims or measure intelligence. | 8 | `self-assessment-label` |
| Private map practice for self-learners | 5 | Pass |
| Terms | 1 | Pass |
| Source on GitHub | 3 | External destination named |
| Built by Param Factory · build polish-3 | 7 | Pass |

### README

| Copy | Words | Result |
|---|---:|---|
| Knowledge Boundary Map | 3 | Pass |
| Knowledge Boundary Map is a private practice map stored in your browser. | 12 | `local-only` |
| It helps self-learners separate “I recognize this” from “I can explain this.” | 12 | Pass |
| Pin a claim, connect prerequisites, run a 90-second teach-back, name a boundary, and record your next question. | 17 | `prerequisites`, `teach-back-timer`, `counterexample-capture`, `next-question` |
| Live: https://knowledge-boundary-map.sociobot.in | 2 | Pass |
| Who it is for | 4 | Pass |
| Use it after reading, watching, or taking notes on a topic. | 11 | Pass |
| It does not fact-check claims or measure intelligence. | 8 | `self-assessment-label` |
| It shows your recorded evidence and uncertainty so you can pick the next question. | 14 | `self-assessment-label`, `next-question` |
| Product behavior | 2 | Pass |
| Your map stays in this browser unless you export it. | 10 | `local-only` |
| There are no accounts, analytics, or trackers. | 7 | `local-only` |
| The app loads no fonts or scripts from other sites. | 10 | `local-only` |
| JSON keeps the full map and can be restored here. | 10 | `json-restore` |
| CSV exports a readable table. | 5 | `csv-export` |
| The one-click sample is at `/demo` or `/?demo=1`. | 8 | `demo-sandbox` |
| Sample changes use browser keys beginning with `demo:`. | 8 | `demo-sandbox` |
| The claim map and rehearsal dialog work with a keyboard. | 10 | `keyboard-dialog` |
| The app reloads offline after your first visit. | 8 | `offline-reload` |
| Each map holds up to 12 claims. | 7 | `free-workshop` |
| Develop and verify | 3 | Pass |
| Requires Node.js 20 or newer. | 5 | Confirmed by clean run with Node 22 |
| The build writes the deployable site to `dist/`, with `index.html` at its root. | 13 | Confirmed |
| `staticwebapp.config.json` sends app routes to `index.html` and adds security headers. | 10 | Confirmed |
| The factory owns deployment and DNS. | 6 | Repository responsibility note |
| Data and safety | 3 | Pass |
| Claims stay in this browser. | 5 | `local-only` |
| Demo changes use browser keys beginning with `demo:`. | 8 | `demo-sandbox` |
| Select Start for real or the product name to discard those changes. | 12 | `demo-sandbox`, `theme-storage` |
| Export before clearing site data or switching browsers. | 8 | Plain data-safety instruction |
| `/privacy` and `/terms` document the exact behavior. | 7 | Confirmed |
| The visual design and source of its generated image are documented in `.factory/design.md`. | 13 | Confirmed in repository |
| Licensed under MIT; see LICENSE. | 5 | Confirmed |

No landing or README sentence exceeds 22 words. I found no banned marketing
adjective, vague mood heading, inconsistent core term, or non-result-naming
landing action. The Terms sentence in F-4-1 is the one unlisted public claim
found during the full route cross-check.

## 3. Demo and sandbox

| Check | Result | Evidence |
|---|---|---|
| One-click entry | Pass | Primary action opened `/demo`. |
| First demo screen is already used | Pass | At 390 px it showed 1 Can explain, 1 Recognize only, 1 Blocked, a causal-inference topic, and a concrete next question. |
| Persistent isolation banner | Pass | **“Demo — sample data, nothing is saved to your real map.”** remained visible with Reset demo and Start for real. |
| Reset | Pass | The declared `demo-sandbox` test observed new sample IDs and restored mixed statuses. |
| Real/demo map isolation | Pass | The test seeded `kbm:map:v1`, then verified it remained unchanged while `demo:kbm:map:v1` changed and was discarded. |
| Theme isolation | Pass | `theme-storage` confirmed real and demo choices remain separate and exit removes only the demo key. |
| Privacy request log | Pass | Fresh live navigation, demo entry, reset, exit, and a rehearsal requested only `https://knowledge-boundary-map.sociobot.in`. |
| Offline | Pass | The dedicated context waited for service-worker control, went offline, reloaded `/demo`, and retained the app. |

## 4. Claims and clean-clone verification

A fresh non-local clone at `/tmp/kbm-review4.rmBesk` completed `npm ci` with
59 packages and zero vulnerabilities. Each command listed in
`.factory/claims.json` was run separately; all 13 passed.

| Claim id | Result |
|---|---|
| `demo-sandbox` | Pass |
| `local-only` | Pass |
| `offline-reload` | Pass |
| `csv-export` | Pass |
| `json-restore` | Pass |
| `keyboard-dialog` | Pass |
| `free-workshop` | Pass |
| `self-assessment-label` | Pass |
| `theme-storage` | Pass |
| `prerequisites` | Pass |
| `teach-back-timer` | Pass |
| `counterexample-capture` | Pass |
| `next-question` | Pass |

Additional clean-clone checks passed: `npm test` (15/15), `npm run typecheck`,
`npm run lint`, `npm run build` (produced `dist/`),
`npm run test:response-policy`, and `npm run test:e2e` (25/25). The live
25-test browser suite also completed successfully. The live HTML, JavaScript,
and CSS SHA-256 values match the locally built files byte-for-byte.

F-4-1 is not a failing listed test; it is an unlisted claim discovered while
cross-checking the public `/terms` route.

## 5. Earlier findings rechecked

Every prior review, polish record, and handoff was read. The following table
records a live and code confirmation for each earlier numbered finding.

| Earlier finding | Current confirmation | Result |
|---|---|---|
| F-1-1 | Demo opens with completed explain, recognize, and blocked sample claims plus a concrete next question. | Fixed |
| F-1-2 | No Studio price, checkout, payment route, or billing request remains. | Fixed; distinct unlisted no-purchase statement is F-4-1. |
| F-1-3 | Current capabilities have 13 narrow claim entries with one tagged test each. | Fixed |
| F-1-4 | The first-screen context says “After reading, watching, or taking notes” without repeating the audience. | Fixed |
| F-1-5 | README prose maximum is 17 words. | Fixed |
| F-1-6 | Visible copy uses “next question”; `nextProbe` is internal only. | Fixed |
| F-1-7 | Preview heading is “Preview a claim map.” | Fixed |
| F-1-8 | Privacy heading is “Your map stays in this browser.” | Fixed |
| F-1-9 | Studio naming and offer are absent. | Fixed |
| F-1-10 | README calls it a private practice map stored in the browser. | Fixed |
| F-1-11 | Plain privacy wording and same-origin request log remain present. | Fixed |
| F-1-12 | User copy uses browser-key language; “namespace” is absent. | Fixed |
| F-1-13 | Offline copy says “reloads after your first visit,” and the dedicated test passes. | Fixed |
| F-1-14 | README names `dist/` and the build creates it. | Fixed |
| F-1-15 | README explains application route handling and headers plainly. | Fixed |
| F-1-16 | Obsolete license-storage wording is absent. | Fixed |
| F-1-17 | The removed upgrade route returns the designed 404. | Fixed |
| F-1-18 | “Boundary Map” is visible in the 390 px header. | Fixed |
| F-1-19 | The 404 has route metadata, theme control, shared legal/source links, build id, and home path. | Fixed |
| F-2-1 | The product-name link exits demo, clears demo keys, preserves real keys, opens `/`, and focuses the home h1. | Fixed |
| F-2-2 | The free claim now covers only the 12-claim limit and its test proves that limit. | Fixed |
| F-2-3 | The tagged self-assessment test saves, reloads, and reopens changed content and history. | Fixed |
| F-2-4 | `theme-storage` covers real/demo theme separation and cleanup. | Fixed |
| F-2-5 / F-1-12 | “Namespace” remains absent from public documentation. | Fixed |
| F-2-6 | The sample action has adjacent outcome text. | Fixed |
| F-2-7 | Current labels name the task: Practice map, New claim, Map files, and Page not found. | Fixed |
| F-2-8 | The repository link says “Source on GitHub.” | Fixed |
| F-3-1 | Documentation calls the visible control “the product name.” | Fixed |
| F-3-2 | Documentation uses plain “visual design” and “source of its generated image.” | Fixed |
| F-3-3 | Copy audit, app footer, and standalone 404 all say build `polish-3`. | Fixed |

The standalone 404 dark-theme contrast correction noted in polish round 2 also
remains present; the independent Axe scan found zero serious or critical issues.

## 6. Structure, routing, accessibility, and identity

| Check | Result |
|---|---|
| Titles, descriptions, canonical, OG/Twitter, favicon | Pass on home, Demo, Privacy, Terms, and 404. |
| Semantic structure | Pass: `lang="en"`, one h1, header, main, footer on every checked route. |
| Designed 404 | Pass: unknown URL returned HTTP 404 with a product-styled page and home action. The browser’s expected network 404 message was the only console entry on that route; normal routes had no console errors. |
| Deep links, back button, route focus | Pass in the 25-test browser suite. |
| Links | Pass: all internal, legal, asset, and named GitHub targets returned expected status; the 404 skip link points to its current 404 document and is not a dead navigation target. |
| Header/footer | Pass: consistent product-name home link, Demo/Privacy nav, legal links, source label, and build identifier. |
| Accessibility | Pass: zero serious/critical Axe violations across the five public routes at 390 px; no horizontal overflow. `verify-url.sh` passed title, language, main, alt text, button names, and normal-route console checks. |
| Security/privacy | Pass: CSP, frame denial, MIME protection, referrer policy, permissions policy, and same-origin runtime requests. |
| Visual identity | Pass: the original paper-cut diorama, hard paper shadows, state folds, palette, and map layout are specific to the explanation-boundary task, not a generic SaaS template. |
| Performance budget | Pass: JavaScript is 36.48 kB raw / 12.42 kB gzip, well below the static-product budget. |

## 7. Missed leverage

No further feature is clearly implied by the brief. The product already has the
valuable portability features: JSON restore and CSV export. Sync would conflict
with its stated browser-only privacy model. An AI assessment would weaken the
brief’s explicit self-assessment boundary and could misrepresent an explanation
as an objective intelligence score. No runtime model feature or provider key is
present.

## What would make this perfect

Remove the unnecessary no-purchase sentence from Terms, or register and test it
as described in F-4-1. Then rerun the complete claims inventory and the live
route scan. With that single claims-contract gap closed, no other finding remains
in this review scope.
