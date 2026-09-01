# Adversarial first-read review 3

- **Product:** Knowledge Boundary Map
- **Candidate:** `1f2cb758f68e4b33a3e8763e3f13b891f2c559c9`
- **Live URL:** <https://knowledge-boundary-map.sociobot.in>
- **Reviewed:** 2026-09-01 UTC

**Verdict: FAIL**

The product itself is clear, tryable, private, accessible, and structurally complete. All 13 declared claim commands passed separately from a clean clone, and the full 25-test browser suite passed locally and against production. The review still fails because the acceptance rule requires zero findings. Two README phrases use design jargon, and the required copy-audit artifact does not contain the current footer text.

## Findings

### Minor

#### F-3-1 — “Home wordmark” is unexplained design jargon

- **Location / exact quote:** `README.md`, Data and safety: **“Start for real and the home wordmark discard those changes.”**
- **Why this matters:** A first-time reader must infer that “home wordmark” means the product name in the header. The sentence describes an important demo-data deletion action, so the control should be named as the reader sees it.
- **Concrete fix:** Replace it with **“Select Start for real or the product name to discard those changes.”**

#### F-3-2 — “Generated-image provenance” is specialist wording

- **Location / exact quote:** `README.md`, Data and safety: **“The visual system and generated-image provenance are recorded in `.factory/design.md`.”**
- **Why this matters:** A first-time reader must translate both “visual system” and “provenance” before learning where the image source is documented.
- **Concrete fix:** Replace it with **“The visual design and source of its generated image are documented in `.factory/design.md`.”**

#### F-3-3 — The required copy audit does not contain the current footer text

- **Location / exact quote:** `.factory/copy-audit.md` says **“Built by Param Factory · build polish-2.”** The live site and current source say **“Built by Param Factory · build repair-9.”**
- **Why this matters:** This does not change the current visitor experience, but the file calls itself the exact visible-text audit. An inaccurate audit cannot reliably protect first-time visitors from later copy regressions.
- **Concrete fix:** Regenerate `.factory/copy-audit.md` from the current landing page and record the current footer text.

## 1. Cold first screen

Fresh browser contexts were used with empty cookies and storage. Nothing was scrolled before recording the result.

| Viewport | What does it do? | For whom? | What should I select first? | Result |
|---|---|---|---|---|
| 390 × 844 | Tests whether I can explain material instead of merely recognizing it | Self-learners reviewing something they read, watched, or noted | **Try it with sample data** | Pass |
| 1440 × 900 | Builds a claim map that separates explanations, recognition, and blocked understanding | Self-learners who want to test what they can produce from memory | **Try it with sample data** | Pass |

The decisive first-screen text was **“Test what you can explain.”**, **“For self-learners who want to separate recognition from an explanation they can produce.”**, and **“Try it with sample data.”** The adjacent sentence says **“Opens a completed causal-inference map.”** Both viewports also show the private, offline, and free facts before scrolling. No blocking first-screen finding remains.

## 2. Copy audit

Counts are whitespace-delimited. Hyphenated terms, URLs, and file paths count as one word. The tables include visible headings, labels, actions, navigation, and footer text so those short copy units are also checked. Commands in code blocks are not sentences and are excluded.

No copy unit exceeds 22 words. No banned marketing wording, empty slogan, inconsistent product term, or unclear button label was found. The two README jargon flags are F-3-1 and F-3-2.

### Landing page

| # | Exact copy | Words | Result |
|---:|---|---:|---|
| 1 | Skip to your map | 4 | Pass |
| 2 | Knowledge Boundary Map | 3 | Pass |
| 3 | Boundary Map | 2 | Pass; responsive short wordmark |
| 4 | Demo | 1 | Pass |
| 5 | Privacy | 1 | Pass |
| 6 | Use dark theme | 3 | Pass; accessible action name |
| 6a | Use light theme | 3 | Pass; alternate-theme accessible action name |
| 7 | After reading, watching, or taking notes | 6 | Pass |
| 8 | Test what you can explain. | 5 | Pass |
| 9 | For self-learners who want to separate recognition from an explanation they can produce. | 13 | Pass |
| 10 | Try it with sample data | 5 | Pass |
| 11 | Opens a completed causal-inference map. | 5 | Pass |
| 12 | Pin your first claim | 4 | Pass |
| 13 | Private: stored in this browser. | 5 | Pass; `local-only` |
| 14 | Offline: reloads after your first visit. | 6 | Pass; `offline-reload` |
| 15 | Free: up to 12 claims per map. | 7 | Pass; `free-workshop` |
| 16 | Record your own evidence and uncertainty. | 6 | Pass |
| 17 | This tool does not score intelligence. | 6 | Pass; `self-assessment-label` |
| 17a | Layered paper hills form a path from blue fog past an orange obstacle toward a clear golden marker. | 18 | Pass; meaningful image alternative |
| 18 | Live preview | 2 | Pass |
| 19 | Preview a claim map. | 4 | Pass |
| 20 | Each claim keeps its prerequisites and your latest self-assessment. | 9 | Pass; `prerequisites`, `self-assessment-label` |
| 21 | Correlation is not causation | 4 | Pass; sample claim |
| 22 | Can explain | 2 | Pass; sample status |
| 23 | A confounder affects both variables | 5 | Pass; sample claim |
| 24 | Recognize only | 2 | Pass; sample status |
| 25 | Random assignment reduces confounding | 4 | Pass; sample claim |
| 26 | Blocked · needs both earlier claims | 6 | Pass; sample status and prerequisites |
| 27 | How it works | 3 | Pass |
| 28 | Choose your next question. | 4 | Pass; `next-question` |
| 29 | Pin a claim. | 3 | Pass |
| 30 | Start with something that feels familiar. | 6 | Pass |
| 31 | Teach it back. | 3 | Pass |
| 32 | Write what you can produce without notes. | 7 | Pass |
| 33 | Record a next question. | 4 | Pass |
| 34 | Choose an example or prerequisite to test next. | 8 | Pass |
| 35 | Privacy and limits | 3 | Pass |
| 36 | Your map stays in this browser. | 6 | Pass; `local-only` |
| 37 | Your map stays here unless you export it. | 8 | Pass; `local-only` |
| 38 | There are no accounts, analytics, or trackers. | 7 | Pass; `local-only` |
| 39 | The app loads no fonts or scripts from other sites. | 10 | Pass; request log |
| 40 | What this does not do | 5 | Pass |
| 41 | It records your self-assessment. | 4 | Pass; `self-assessment-label` |
| 42 | It does not fact-check claims or measure intelligence. | 8 | Pass; `self-assessment-label` |
| 43 | Private map practice for self-learners | 5 | Pass |
| 44 | Terms | 1 | Pass |
| 45 | Source on GitHub | 3 | Pass |
| 46 | Built by Param Factory · build repair-9 | 7 | Pass; F-3-3 applies to the older audit artifact |

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
| 8 | It does not fact-check claims or measure intelligence. | 8 | Pass; `self-assessment-label` |
| 9 | It shows your recorded evidence and uncertainty so you can pick the next question. | 14 | Pass; `self-assessment-label`, `next-question` |
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
| 20 | Each map holds up to 12 claims. | 7 | Pass; `free-workshop` |
| 21 | Develop and verify | 3 | Pass |
| 22 | Requires Node.js 20 or newer. | 5 | Pass; clean run used Node.js 22 |
| 23 | The build writes the deployable site to `dist/`, with `index.html` at its root. | 13 | Pass; build confirmed |
| 24 | `staticwebapp.config.json` sends app routes to `index.html` and adds security headers. | 10 | Pass; configuration confirmed |
| 25 | The factory owns deployment and DNS. | 6 | Pass; responsibility statement |
| 26 | Data and safety | 3 | Pass |
| 27 | Claims stay in this browser. | 5 | Pass; `local-only` |
| 28 | Demo changes use browser keys beginning with `demo:`. | 8 | Pass; `demo-sandbox` |
| 29 | Start for real and the home wordmark discard those changes. | 10 | **F-3-1** |
| 30 | Export before clearing site data or switching browsers. | 8 | Pass |
| 31 | `/privacy` and `/terms` document the exact behavior. | 7 | Pass; routes confirmed |
| 32 | The visual system and generated-image provenance are recorded in `.factory/design.md`. | 10 | **F-3-2** |
| 33 | Licensed under MIT; see LICENSE. | 5 | Pass; license present |

### Terminology

| Concept | Current product term | Result |
|---|---|---|
| Statement to practice | Claim | Pass |
| Required prior knowledge | Prerequisite | Pass |
| Timed explanation | Teach-back | Pass |
| Recorded result | Self-assessment | Pass |
| Follow-up work | Next question | Pass; `nextProbe` remains internal only |
| Isolated sample | Demo | Pass |
| Demo storage separation | Browser keys beginning with `demo:` | Pass |

## 3. Demo

The first-screen action opens `/demo` in one click. At 390 × 844, the resulting first screen already shows:

- the persistent **“Demo — sample data, nothing is saved to your real map.”** banner;
- **Reset demo** and **Start for real** controls;
- the `Causal inference basics` topic;
- one Can explain, one Recognize only, and one Blocked claim; and
- the blocked claim and its specific next question.

The three claims include realistic explanations, prerequisites, a boundary where relevant, next questions, and rehearsal history. Reset generated fresh claim identifiers and restored the mixed-status sample. Start for real removed `demo:kbm:map:v1` and the demo theme while preserving a seeded `kbm:map:v1` marker byte-for-byte. Direct `/demo` and `/?demo=1` entry also work.

**Result: Pass.** No blocking demo finding remains.

## 4. Claims

A clean clone was created at `/tmp/kbm-review3-clean.mpK6XU`. After `npm ci`, every command in `.factory/claims.json` ran separately.

| Claim id | Result | Observable coverage confirmed |
|---|---|---|
| `demo-sandbox` | Pass | completed mixed-status sample, reset, exit, and real/demo key separation |
| `local-only` | Pass | complete demo work contacted only the product origin |
| `offline-reload` | Pass | dedicated context reloaded `/demo` while offline |
| `csv-export` | Pass | header plus all three sample claims, including the blocked claim |
| `json-restore` | Pass | topic, claims, prerequisites, history, boundary, and next question restored after replacement and reload |
| `keyboard-dialog` | Pass | arrows move between claims, Enter opens rehearsal, and Escape restores focus |
| `free-workshop` | Pass | 12 claims load and remain; a thirteenth entry is rejected with a named error |
| `self-assessment-label` | Pass | changed assessment and text save, reload, reopen, and remain labeled as self-assessment |
| `theme-storage` | Pass | real and demo themes remain separate; leaving demo removes only the demo choice |
| `prerequisites` | Pass | selected prerequisite remains after save and reload |
| `teach-back-timer` | Pass | timer starts at 01:30 and advances |
| `counterexample-capture` | Pass | can-explain boundary saves and reopens |
| `next-question` | Pass | blocked claim and its specific next question appear first |

Each claim id occurs in exactly one tagged test. Landing, README, privacy, terms, dialogs, and metadata were cross-checked against the inventory. No unlisted product claim or untested part of a listed claim was found. Repository setup, build, license, and asset-source statements were confirmed directly as documentation facts.

## 5. Sandbox, offline, and privacy

- A fresh live request log covered landing, demo entry, Reset demo, and Start for real. Every request used `https://knowledge-boundary-map.sociobot.in`.
- No account, analytics, tracker, remote font, remote script, runtime model, or payment request was observed.
- Demo writes used `demo:kbm:map:v1`; the seeded real key remained unchanged.
- Reset replaced the sample data without reading or changing the real map.
- Start for real removed demo map and theme keys and restored the real map and theme.
- The dedicated offline claim check passed after service-worker control and reload.

**Result: Pass.**

## 6. Earlier-finding confirmation

Every finding in `.factory/review-1.md` and `.factory/review-2.md`, both polish reports, and the current handoff was read. Each earlier numbered finding was checked in current source and on the live site.

| Earlier id | Current confirmation | Result |
|---|---|---|
| F-1-1 | Demo opens with three completed mixed statuses, history, and a next question in the first phone viewport. | Fixed |
| F-1-2 | Price, checkout, billing requests, and Studio UI are absent; `/upgrade` returns the designed 404. | Fixed |
| F-1-3 | Thirteen narrow claims and exactly one tagged test per id cover the current product promises. | Fixed |
| F-1-4 | The eyebrow says **“After reading, watching, or taking notes”** and does not repeat the audience sentence. | Fixed |
| F-1-5 | The longest README prose sentence is 17 words. | Fixed |
| F-1-6 | Visible copy consistently uses **“next question”**; `nextProbe` is internal code only. | Fixed |
| F-1-7 | The preview h2 is **“Preview a claim map.”** | Fixed |
| F-1-8 | The privacy h2 is **“Your map stays in this browser.”** | Fixed |
| F-1-9 | No Studio label or offer renders in source output or on the live site. | Fixed |
| F-1-10 | README describes a **“private practice map stored in your browser.”** | Fixed |
| F-1-11 | Copy uses plain site-loading wording; the live request log stays on the product origin. | Fixed |
| F-1-12 | README, demo documentation, privacy, terms, and visible error text use browser-key wording; “namespace” is absent. | Fixed |
| F-1-13 | README says the app reloads offline after the first visit; the dedicated offline test passes. | Fixed |
| F-1-14 | README says the build writes the deployable site to `dist/`. | Fixed |
| F-1-15 | README explains that the configuration sends app routes to `index.html` and adds headers. | Fixed |
| F-1-16 | Obsolete license-storage wording is absent. | Fixed |
| F-1-17 | The removed upgrade headline is absent and `/upgrade` returns the designed 404. | Fixed |
| F-1-18 | **“Boundary Map”** is visible in the 390 px header. | Fixed |
| F-1-19 | The 404 has metadata, shared controls, legal/source links, a build id, and a way home. | Fixed |
| F-2-1 | The demo wordmark opens `/`, focuses the landing h1, removes demo keys, and preserves real keys. | Fixed |
| F-2-2 | `free-workshop` now states only the 12-claim limit, and its test confirms 12 rendered/restored claims plus rejection of 13. | Fixed |
| F-2-3 | The tagged test saves, reloads, and reopens changed assessment content and history. | Fixed |
| F-2-4 | `theme-storage` is listed and confirms separate persistence plus demo-only cleanup. | Fixed |
| F-2-5 / F-1-12 | “Namespace” is absent from current user-facing copy and documentation. | Fixed |
| F-2-6 | **“Opens a completed causal-inference map.”** sits directly beneath the sample action. | Fixed |
| F-2-7 | Current labels are **Practice map**, **New claim**, **Map files**, and **Page not found.** | Fixed |
| F-2-8 | Footer links say **“Source on GitHub.”** | Fixed |

The handoff’s low-priority note about the stale footer entry in `.factory/copy-audit.md` is still true and is recorded as F-3-3.

## 7. Structure, links, identity, and accessibility

| Check | Result |
|---|---|
| Titles | Pass: landing, Demo, Privacy, Terms, and 404 use route-specific plain-word titles; all are at most 50 characters |
| One h1 and landmarks | Pass on all five public pages |
| Description and canonical | Pass on every route and the 404 |
| Open Graph, Twitter, favicon, and touch icon | Pass; social image is 1200 × 630 and touch icon is 180 × 180 |
| Designed 404 | Pass: unknown URLs return HTTP 404 with product styling and a way home |
| Deep links, reload, back button, and route focus | Pass in the live browser suite |
| Link crawl | Pass: all navigable HTTP targets return 200; email links are explicit; the current-document 404 skip fragment is valid |
| Header and footer | Pass on every route; wordmark, Demo, Privacy, Privacy/Terms footer links, source destination, and build id are consistent |
| Security headers | Pass: CSP, frame denial, MIME sniffing denial, referrer policy, permissions policy, and HSTS are present |
| Accessibility | Pass: the live 20-case route × viewport × theme Axe matrix has zero serious or critical findings |
| Keyboard and touch | Pass: skip link and focus ring work; dialogs restore focus; checked controls are at least 44 px |
| Mobile and text resize | Pass: no horizontal page overflow at 390 px or after 200% root text sizing |
| Reduced motion | Pass: smooth scrolling is disabled and transition duration is effectively zero |
| Console | Pass: no application console errors on normal routes |
| Visual identity | Pass: the paper-cut explanation map, state folds, hard shadows, palette, and original diorama are distinct from a generic template |
| Landing structure | Pass: header, first screen, live preview, three-step explanation, privacy/limits, and footer appear in the required order; there is no paid tier |
| Asset size | Pass: production JavaScript is 36.48 kB raw and 12.42 kB gzip |

The production `index.html`, JavaScript, and CSS SHA-256 values match the local `dist/` files byte-for-byte. `robots.txt`, `sitemap.xml`, the manifest, favicon, touch icon, social card, and hero image all return the expected status and content type.

## 8. Missed leverage

No additional feature is clearly implied. JSON restore and CSV already provide portability. Sync would conflict with the browser-only privacy model unless the product added accounts and a new data policy. A model-generated assessment would conflict with the explicit self-assessment boundary and the brief’s instruction not to present an objective intelligence measure. No runtime model feature or provider key is present.

## 9. Verification record

```text
npm ci in clean clone                                      PASS — 59 packages, 0 vulnerabilities
13 claims.json commands run separately                     PASS — 13/13
npm test                                                   PASS — 11/11
npm run lint                                               PASS
npm run build                                              PASS — dist/ produced
npm run test:response-policy                               PASS
npm run test:e2e                                           PASS — 25/25 local
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
                                                           PASS — 25/25 live
verify-url.sh on live home                                 PASS
independent live route/metadata/link/Axe check             PASS
live/local HTML, JavaScript, and CSS hashes                PASS — identical
```

## What would make this perfect

1. Replace **“home wordmark”** with the visible control name.
2. Replace **“visual system”** and **“generated-image provenance”** with plain descriptions.
3. Regenerate `.factory/copy-audit.md` so its claimed exact footer text matches the current product.

After those three documentation changes and a repeat copy check, there would be nothing left in this review scope.
