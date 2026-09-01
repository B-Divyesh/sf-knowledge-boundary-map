# Independent first-read review 2

- **Product:** Knowledge Boundary Map
- **Candidate:** `ef013d028fab17041cb3f035362423174b7ee9d4`
- **Live URL:** <https://knowledge-boundary-map.sociobot.in>
- **Reviewed:** 2026-09-01 UTC

**Verdict: FAIL**

The first screen is clear and the sample is realistic, completed, and isolated. All 12 declared claim commands return successfully from a clean clone. The result is still FAIL because two tagged tests do not confirm their full claims, one privacy promise has no claims entry, the demo wordmark labeled as home does not open home, and an earlier storage-jargon finding remains half-fixed. Three minor findings also remain. A PASS requires zero findings and no untested part of a claim.

## Findings

### Blocking

#### F-2-1 — The demo wordmark labeled “home” does not open home

- **Location / exact text:** `/demo`, header link accessible name **“Knowledge Boundary Map home.”** Its `href` is `/?demo=1`.
- **Confirmed behavior:** Selecting it opens `/?demo=1`; the h1 remains **“Your explanation map”** instead of opening the landing page.
- **Code:** `src/main.ts:101-109` adds `?demo=1` to the home path while demo mode is active.
- **Why this blocks acceptance:** The header contract requires the wordmark to open home. The accessible name promises a destination the control does not provide.
- **Concrete fix:** Make the wordmark open `/`. Discard demo data when it leaves demo mode, or present the same explicit choice as **Start for real**. Test the URL, landing h1, focus, and demo-data cleanup.

#### F-2-2 — The free-workshop test checks only the claim limit

- **Declared claim:** **“Each map holds up to 12 claims and includes the complete rehearsal flow.”** The README broadens this to **“the complete rehearsal and export flow.”**
- **Location:** `.factory/claims.json:8`; `README.md`, Product behavior.
- **Confirmed test behavior:** `@claim:free-workshop` seeds 12 claims, presses `N`, and checks only **“This map holds up to 12 claims.”** It does not run a rehearsal or confirm JSON and CSV export (`tests/e2e/app.spec.ts:171-179`).
- **Why this blocks acceptance:** The command passes, but part of the declared claim remains untested. Other tests cover individual actions, but the test tagged for this combined claim does not confirm that the full flow is available at the stated limit.
- **Concrete fix:** Keep `free-workshop` for the 12-claim limit. Add a separate claim and tagged test for the free rehearsal and export flow, or extend this tagged test to rehearse and download both formats at the 12-claim state. Use identical scope in README and claims inventory.

#### F-2-3 — The self-assessment test confirms labels, not recording

- **Declared claim:** **“The map records self-assessments and does not measure intelligence.”**
- **Location:** `.factory/claims.json:9`; `tests/e2e/app.spec.ts:181-186`.
- **Confirmed test behavior:** `@claim:self-assessment-label` checks two explanatory sentences. It never saves, reloads, or reopens a self-assessment.
- **Why this blocks acceptance:** Copy presence does not confirm the promised recording behavior.
- **Concrete fix:** In the tagged test, change a sample claim’s assessment, explanation, and next question; save; reload; reopen; and confirm the status, content, and history. Keep the non-scoring copy checks or split the sentence into two precise claims.

#### F-2-4 — Theme-storage privacy promises are absent from the claims inventory

- **Live quote:** `/privacy`: **“Claims, prerequisites, teach-backs, counterexamples, self-assessments, the topic name, and theme choice are stored in browser local storage.”**
- **Related documentation:** `.factory/demo.md`: **“The demo stores map changes and theme choice only under browser keys beginning with `demo:`.”**
- **Confirmed inventory:** `.factory/claims.json` covers map keys but has no theme-storage or theme-separation claim. Neither `@claim:local-only` nor `@claim:demo-sandbox` changes the theme or checks its keys.
- **Why this blocks acceptance:** A user-facing privacy and isolation promise has no declared sandbox test.
- **Concrete fix:** Add one `theme-storage` entry and tagged test. Set different real and demo themes, reload each mode, confirm the correct theme, select **Start for real**, and confirm only the demo theme key is removed. Alternatively, remove these promises.

#### F-2-5 / reopened F-1-12 — “Namespace” remains in the README

- **Exact quote:** README, Data and safety: **“Demo data uses a separate `demo:` namespace and is discarded by Start for real.”**
- **Earlier finding:** F-1-12 required plain browser-key language because **“storage namespace”** did not explain the isolation. Polish round 1 marked it fixed.
- **Confirmed current state:** Product behavior now says **“browser keys beginning with `demo:`,”** but Data and safety still says **“namespace.”** The live sandbox itself remains isolated.
- **Why this blocks acceptance:** The earlier wording finding is only half-fixed.
- **Concrete fix:** Use **“Demo changes use browser keys beginning with `demo:` and are discarded by Start for real.”** in both README sections and `.factory/demo.md`.

### Minor

#### F-2-6 — The primary action lacks adjacent outcome text

- **Location:** The landing first screen places **“Try it with sample data”** beside **“Pin your first claim.”**
- **Why this matters:** The first-screen pattern calls for nearby text saying what opens. The adjacent text is a second action, not the sample outcome.
- **Concrete fix:** Add **“Opens a completed causal-inference map.”** beside or directly below the sample action.

#### F-2-7 — Several labels rely on workshop or paper metaphors

- **Locations:** `/demo`: **“Boundary workshop.”** Claim dialog: **“New paper slip.”** Export dialog: **“Your data, your way.”** Designed 404 h1: **“That page is not in this map.”**
- **Why this matters:** These labels do not name their sections directly. **“Your data, your way”** is a reusable slogan rather than export information.
- **Concrete fix:** Use **“Practice map,” “New claim,” “Map files,”** and **“Page not found.”** Keep the paper-cut identity in the visual treatment.

#### F-2-8 — The external Source link is not identified as external

- **Location:** Footer on `/`, `/demo`, `/privacy`, `/terms`, and the 404: **“Source.”** It opens the GitHub repository in the same tab.
- **Why this matters:** The site-structure contract requires external links to say so.
- **Concrete fix:** Change the visible label to **“Source on GitHub.”** If it opens a new tab, also announce that behavior.

## 1. Cold first screen

Fresh contexts had empty cookies and storage. Nothing was scrolled before recording these answers.

| Viewport | What does it do? | For whom? | First selection | Result |
|---|---|---|---|---|
| 390 × 844 | Tests whether I can produce an explanation, not merely recognize a topic | Self-learners reviewing material they consumed | **Try it with sample data** | Pass |
| 1440 × 900 | Maps claims and prerequisites to identify the next explanation gap | Self-learners separating recognition from explanation | **Try it with sample data** | Pass |

The decisive text is **“Test what you can explain,” “For self-learners who want to separate recognition from an explanation they can produce,”** and **“Try it with sample data.”** Mobile also shows private, offline, and free facts before scrolling. F-2-6 records the missing adjacent outcome, but all three cold-read questions remain answerable.

Evidence: `.factory/qa-artifacts/review-2-first-read-mobile.png` and `.factory/qa-artifacts/review-2-first-read-desktop.png`.

## 2. Copy audit

Counts are whitespace-delimited; hyphenated terms and URLs count as one word. README shell commands are commands, not sentences, and are excluded. No sentence exceeds 22 words. No banned marketing adjective appears. F-2-5 is the terminology flag.

### Landing page

| # | Exact copy | Words | Result |
|---:|---|---:|---|
| 1 | Skip to your map | 4 | Pass |
| 2 | Knowledge Boundary Map | 3 | Pass |
| 3 | Demo | 1 | Pass |
| 4 | Privacy | 1 | Pass |
| 5 | After reading, watching, or taking notes | 6 | Pass |
| 6 | Test what you can explain. | 5 | Pass |
| 7 | For self-learners who want to separate recognition from an explanation they can produce. | 13 | Pass |
| 8 | Try it with sample data | 5 | F-2-6 |
| 9 | Pin your first claim | 4 | Pass |
| 10 | Private: stored in this browser. | 5 | Pass; `local-only` |
| 11 | Offline: reloads after your first visit. | 6 | Pass; `offline-reload` |
| 12 | Free: up to 12 claims per map. | 7 | F-2-2 |
| 13 | Record your own evidence and uncertainty. | 6 | F-2-3 |
| 14 | This tool does not score intelligence. | 6 | Pass; non-scoring copy |
| 15 | Live preview | 2 | Pass |
| 16 | Preview a claim map. | 4 | Pass |
| 17 | Each paper slip keeps one claim, its prerequisites, and your latest self-assessment. | 12 | F-2-3; `prerequisites` passes |
| 18 | Correlation is not causation | 4 | Pass |
| 19 | Can explain | 2 | Pass |
| 20 | A confounder affects both variables | 5 | Pass |
| 21 | Recognize only | 2 | Pass |
| 22 | Random assignment reduces confounding | 4 | Pass |
| 23 | Blocked · needs both earlier claims | 5 | Pass |
| 24 | How it works | 3 | Pass |
| 25 | Choose your next question. | 4 | Pass; `next-question` |
| 26 | Pin a claim. | 3 | Pass |
| 27 | Start with something that feels familiar. | 6 | Pass |
| 28 | Teach it back. | 3 | Pass |
| 29 | Write what you can produce without notes. | 7 | Pass |
| 30 | Record a next question. | 4 | Pass |
| 31 | Choose an example or prerequisite to test next. | 8 | Pass |
| 32 | Privacy and limits | 3 | Pass |
| 33 | Your map stays in this browser. | 6 | Pass; `local-only` |
| 34 | Your map stays here unless you export it. | 8 | Pass; `local-only` |
| 35 | There are no accounts, analytics, or trackers. | 7 | Pass; `local-only` |
| 36 | The app loads no fonts or scripts from other sites. | 10 | Pass; request log |
| 37 | What this does not do | 5 | Pass |
| 38 | It records your self-assessment. | 4 | F-2-3 |
| 39 | It does not fact-check claims or measure intelligence. | 8 | Pass; non-scoring copy |
| 40 | Private map practice for self-learners | 5 | Pass |
| 41 | Privacy | 1 | Pass |
| 42 | Terms | 1 | Pass |
| 43 | Source | 1 | F-2-8 |
| 44 | Built by Param Factory · build polish-1 | 7 | Pass |

### README

| # | Exact copy | Words | Result |
|---:|---|---:|---|
| 1 | Knowledge Boundary Map | 3 | Pass |
| 2 | Knowledge Boundary Map is a private practice map stored in your browser. | 12 | Pass; `local-only` |
| 3 | It helps self-learners separate “I recognize this” from “I can explain this.” | 12 | Pass |
| 4 | Pin a claim, connect prerequisites, run a 90-second teach-back, name a boundary, and record your next question. | 17 | Pass; declared behavior claims |
| 5 | Live: https://knowledge-boundary-map.sociobot.in | 2 | Pass |
| 6 | Who it is for | 4 | Pass |
| 7 | Use it after reading, watching, or taking notes on a topic. | 11 | Pass |
| 8 | It does not fact-check claims or measure intelligence. | 8 | Pass; non-scoring copy |
| 9 | It shows your recorded evidence and uncertainty so you can pick the next question. | 14 | F-2-3; `next-question` passes |
| 10 | Product behavior | 2 | Pass |
| 11 | Your map stays in this browser unless you export it. | 10 | Pass; `local-only` |
| 12 | There are no accounts, analytics, or trackers. | 7 | Pass; `local-only` |
| 13 | The app loads no fonts or scripts from other sites. | 10 | Pass; request log |
| 14 | JSON keeps the full map and can be restored here. | 10 | Pass; `json-restore` |
| 15 | CSV exports a readable table. | 5 | Pass; `csv-export` |
| 16 | The one-click sample is at `/demo` or `/?demo=1`. | 8 | Pass; `demo-sandbox` |
| 17 | Sample changes use browser keys beginning with `demo:`. | 8 | Pass; `demo-sandbox` |
| 18 | The claim map and rehearsal dialog work with a keyboard. | 10 | Pass; `keyboard-dialog` |
| 19 | The app reloads offline after your first visit. | 8 | Pass; `offline-reload` |
| 20 | Each map holds up to 12 claims and includes the complete rehearsal and export flow. | 15 | F-2-2 |
| 21 | Develop and verify | 3 | Pass |
| 22 | Requires Node.js 20 or newer. | 5 | Pass as a setup requirement; clean run used Node 22 |
| 23 | The build writes the deployable site to `dist/`, with `index.html` at its root. | 13 | Pass; observed build output |
| 24 | `staticwebapp.config.json` sends app routes to `index.html` and adds security headers. | 10 | Pass; release and response checks |
| 25 | The factory owns deployment and DNS. | 6 | Pass as responsibility documentation |
| 26 | Data and safety | 3 | Pass |
| 27 | Claims stay in this browser. | 5 | Pass; `local-only` |
| 28 | Demo data uses a separate `demo:` namespace and is discarded by Start for real. | 14 | F-2-5 / F-1-12 reopened |
| 29 | Export before clearing site data or switching browsers. | 8 | Pass |
| 30 | `/privacy` and `/terms` document the exact behavior. | 7 | Pass; routes checked |
| 31 | The visual system and generated-image provenance are recorded in `.factory/design.md`. | 10 | Pass; source files checked |
| 32 | Licensed under MIT; see LICENSE. | 5 | Pass; file present |

### Terminology

| Concept | Consistent term | Result |
|---|---|---|
| Statement to practice | Claim | Pass |
| Required prior knowledge | Prerequisite | Pass |
| Timed explanation | Teach-back | Pass |
| Recorded result | Self-assessment | Pass |
| Follow-up work | Next question | Pass; `nextProbe` is internal only |
| Isolated sample | Demo | Pass |
| Browser-key separation | Browser keys beginning with `demo:` | F-2-5: README also says “namespace” |

Landing actions use verbs and name their result. **Cancel** and the accessible **Close** labels describe dismissal. No other button-copy finding remains.

## 3. Demo and sandbox

| Check | Result | Evidence |
|---|---|---|
| One-click entry | Pass | Landing action opens `/demo` |
| Already-used product | Pass | First mobile viewport shows 1 Can explain, 1 Recognize only, 1 Blocked, and a concrete next question |
| Realistic sample | Pass | Three connected causal-inference claims with explanations, a boundary, next questions, and history |
| Persistent banner | Pass | **“Demo — sample data, nothing is saved to your real map.”** |
| Reset demo | Pass | Fresh ids and mixed statuses return |
| Start for real | Pass | Removes `demo:kbm:map:v1` and returns to `/` |
| Real map isolation | Pass | Seeded `kbm:map:v1` marker stayed byte-identical through entry, Reset, and Start for real |
| Requests | Pass | Product origin only |
| Theme isolation | **Untested claim** | F-2-4 |

Evidence: `.factory/qa-artifacts/review-2-demo-mobile.png`.

## 4. Claims

The repository was cloned to `/tmp/kbm-review-2.GyklmS`. After `npm ci`, every command listed in `.factory/claims.json` ran separately. All commands returned successfully. Successful execution does not close F-2-2 or F-2-3 because their assertions do not cover the full declared sentence.

| Claim id | Command | Coverage |
|---|---|---|
| `demo-sandbox` | Pass | Pass for map keys, sample, Reset, and exit isolation |
| `local-only` | Pass | Pass; full demo work logs only the product origin |
| `offline-reload` | Pass | Pass in its own context |
| `csv-export` | Pass | Pass; header and all three rows |
| `json-restore` | Pass | Pass; all full-map fields return after replacement and reload |
| `keyboard-dialog` | Pass | Pass; arrows, Enter, Escape, focus return |
| `free-workshop` | Pass | **Incomplete — F-2-2** |
| `self-assessment-label` | Pass | **Incomplete — F-2-3** |
| `prerequisites` | Pass | Pass after save and reload |
| `teach-back-timer` | Pass | Pass; 01:30 and advances |
| `counterexample-capture` | Pass | Pass after save and reopen |
| `next-question` | Pass | Pass; Blocked claim and its question appear first |

The live cross-check found the unlisted theme-storage promise in F-2-4. Other capability, privacy, offline, export, prerequisite, timer, and next-question statements map to the inventory. Repository setup and build facts were confirmed by clean build and release checks rather than treated as end-user capability claims.

## 5. Offline and privacy

- The live suite passes `@claim:offline-reload` in a dedicated context.
- The first load and complete demo interaction contact only `https://knowledge-boundary-map.sociobot.in`.
- No analytics, remote font, remote script, account, runtime model, or payment request was observed.
- Demo map changes use `demo:kbm:map:v1`; `kbm:map:v1` remained unchanged.
- F-2-4 remains because theme storage and its separation are stated but not declared or tested.

## 6. Earlier-finding confirmation

Every finding in `.factory/review-1.md` and closure statement in `.factory/polish-1.md` and `.factory/handoff.md` was checked in current source and live behavior.

| Earlier id | Confirmation | Result |
|---|---|---|
| F-1-1 | Demo has three completed mixed statuses and a next question in the first phone viewport | Fixed |
| F-1-2 | No price, purchase, billing request, Studio UI, or upgrade route; `/upgrade` returns 404 | Fixed |
| F-1-3 | Prerequisite, timer, boundary, and next-question entries and tests exist | Fixed for listed items; new gaps are F-2-2 to F-2-4 |
| F-1-4 | Eyebrow is **“After reading, watching, or taking notes”** | Fixed |
| F-1-5 | Maximum current README prose sentence is 17 words | Fixed |
| F-1-6 | Visible copy uses **“next question”**; `nextProbe` is internal | Fixed |
| F-1-7 | Heading is **“Preview a claim map.”** | Fixed |
| F-1-8 | Heading is **“Your map stays in this browser.”** | Fixed |
| F-1-9 | Studio copy is absent | Fixed |
| F-1-10 | README says **“private practice map stored in your browser”** | Fixed for exact quote; new labels are F-2-7 |
| F-1-11 | Plain font/script copy is present and the request log confirms it | Fixed |
| F-1-12 | One sentence is plain, but another still says **“namespace”** | **Reopened as F-2-5** |
| F-1-13 | README says the app reloads offline after the first visit | Fixed |
| F-1-14 | README names `dist/` directly | Fixed |
| F-1-15 | README explains route handling and headers | Fixed |
| F-1-16 | Obsolete license-storage copy is absent | Fixed |
| F-1-17 | Upgrade offer is absent and `/upgrade` returns the designed 404 | Fixed |
| F-1-18 | **“Boundary Map”** is visible at 390 px | Fixed |
| F-1-19 | Live 404 returns HTTP 404 with metadata, theme control, links, and build id | Fixed; new heading issue is F-2-7 |

## 7. Structure, links, and accessibility

| Check | Result |
|---|---|
| Titles | Pass on landing, Demo, Privacy, Terms, and 404 |
| One h1 and landmarks | Pass on all routes |
| Description, canonical, OG/Twitter, favicon | Pass on all routes and 404 |
| Designed 404 | Pass for status, metadata, and route back; F-2-7 flags its h1 |
| Deep links and reload | Pass |
| History and focus | Pass: route navigation and back focus the new h1 and restore route/scroll state |
| Wordmark home | **Fail — F-2-1** |
| Link crawl | Internal routes/assets and repository return 200; unknown route returns 404; mail links are explicit |
| External-link disclosure | **Fail — F-2-8** |
| Header/footer consistency | Pass apart from F-2-1 and F-2-8 |
| Visual identity | Pass: distinct paper-cut map, original diorama with source sidecars, non-template layout |
| Mobile overflow | Pass at 390 px in light and dark modes |
| Accessibility | Pass: 16 fresh Axe scans found zero violations and no overflow |
| URL verifier | Pass: title, language, h1, main, alt, buttons, console |
| Reduced motion and touch targets | Pass in source and live suite |

All sitemap routes, product assets, robots, sitemap, and the repository link returned the expected status. Current local HTML, JavaScript, and CSS hashes match live responses byte-for-byte. JavaScript is 36.06 kB raw and 12.30 kB gzip.

## 8. Missed leverage

No additional feature is clearly required. JSON restore and CSV cover portability. Sync would conflict with the private browser-only scope without accounts and a new privacy model. A runtime model step is not needed for recording the learner’s own explanation and could weaken the self-assessment job. No decorative model feature or embedded provider key is present.

## 9. Verification record

```text
npm ci in clean clone                                      PASS — 59 packages, 0 vulnerabilities
12 claims.json commands                                    PASS — 12/12 commands
npm test                                                   PASS — 10/10
npm run build                                              PASS — dist/ produced
npm run test:response-policy                               PASS — AVIF 200 image/avif
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
                                                           PASS — 18/18
verify-url.sh on live home                                 PASS
fresh Axe: 4 routes × 2 widths × 2 themes                 PASS — 0 violations
live/local HTML, JS, CSS hashes                            PASS — identical
```

## What would make this perfect

1. Make the demo wordmark open home and test the transition.
2. Make each tagged test confirm every outcome in its claim.
3. Add and test the theme-storage privacy claim.
4. Replace the remaining README **“namespace”** wording.
5. State that the sample action opens a completed causal-inference map.
6. Replace the remaining metaphor and slogan labels with task names.
7. Label the repository destination **“Source on GitHub.”**

After these items are confirmed on the deployed build and the full checklist returns no new finding, there will be nothing left in this review scope.
