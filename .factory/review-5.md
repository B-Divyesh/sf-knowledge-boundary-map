# Adversarial first-read review 5

- **Product:** Knowledge Boundary Map
- **Candidate:** `14c7f41e67b7fab82fb13550998378f65537905b`
- **Live URL:** <https://knowledge-boundary-map.sociobot.in>
- **Reviewed:** 2026-09-02 UTC

## Verdict: PASS

No finding remains. A cold visitor can identify the job, audience, and first
action without scrolling. The one-click demo opens an already-used map, stays
separate from real browser data, and resets cleanly. All 13 listed claim tests
passed separately from a fresh clone. No unlisted product claim, broken route,
dead link, accessibility blocker, generic-template regression, or unfinished
earlier finding was found.

## Findings

None.

## 1. Cold first screen

Fresh Chromium contexts had empty cookies and storage. Service workers were
blocked for this capture. Nothing was scrolled before recording the answers.

| Viewport | What it does, in my words | Who it is for | What I should select first | Result |
|---|---|---|---|---|
| 390 × 844 | Tests whether I can explain study material rather than merely recognize it. | A self-learner reviewing something they read, watched, or noted. | **Try it with sample data** | Pass |
| 1440 × 900 | Maps claims and prerequisites so I can record what I can explain and what blocks me. | Self-learners separating recognition from an explanation they can produce. | **Try it with sample data** | Pass |

The decisive text was **“Test what you can explain.”**, **“For self-learners
who want to separate recognition from an explanation they can produce.”**, and
**“Try it with sample data”** followed by **“Opens a completed
causal-inference map.”** The private, offline, and free facts also appear before
scrolling at 390 px.

Evidence: `.factory/evidence-5/live-cold-mobile-390.png`,
`.factory/evidence-5/live-cold-desktop.png`, and
`.factory/evidence-5/cold-read.json`.

## 2. Copy audit

Counts are whitespace-delimited. Hyphenated words, URLs, and file paths count
as one word. The landing table includes headings, labels, actions, responsive
text, image alternative text, and shared chrome. Commands in the README code
block are commands rather than sentences.

No unit exceeds 22 words. No banned marketing adjective, unexplained jargon,
metaphorical or mood heading, conflicting core term, or non-result-naming
button was found. **Close** and **Cancel** accurately name dismissal actions.

### Landing page

| # | Exact copy | Words | Result |
|---:|---|---:|---|
| 1 | Skip to your map | 4 | Pass |
| 2 | Knowledge Boundary Map | 3 | Pass |
| 3 | Boundary Map | 2 | Pass; responsive product name |
| 4 | Demo | 1 | Pass |
| 5 | Privacy | 1 | Pass |
| 6 | Use dark theme | 3 | Pass |
| 7 | Use light theme | 3 | Pass |
| 8 | After reading, watching, or taking notes | 6 | Pass |
| 9 | Test what you can explain. | 5 | Pass |
| 10 | For self-learners who want to separate recognition from an explanation they can produce. | 13 | Pass |
| 11 | Try it with sample data | 5 | Pass |
| 12 | Opens a completed causal-inference map. | 5 | Pass |
| 13 | Pin your first claim | 4 | Pass |
| 14 | Private: stored in this browser. | 5 | `local-only` |
| 15 | Offline: reloads after your first visit. | 6 | `offline-reload` |
| 16 | Free: up to 12 claims per map. | 7 | `free-workshop` |
| 17 | Layered paper hills form a path from blue fog past an orange obstacle toward a clear golden marker. | 18 | Pass; useful image alternative |
| 18 | Record your own evidence and uncertainty. | 6 | `self-assessment-label` |
| 19 | This tool does not score intelligence. | 6 | `self-assessment-label` |
| 20 | Live preview | 2 | Pass |
| 21 | Preview a claim map. | 4 | Pass |
| 22 | Each claim keeps its prerequisites and your latest self-assessment. | 9 | `prerequisites`, `self-assessment-label` |
| 23 | Correlation is not causation | 4 | Sample content |
| 24 | Can explain | 2 | Sample status |
| 25 | A confounder affects both variables | 5 | Sample content |
| 26 | Recognize only | 2 | Sample status |
| 27 | Random assignment reduces confounding | 4 | Sample content |
| 28 | Blocked · needs both earlier claims | 6 | Sample status and prerequisites |
| 29 | How it works | 3 | Pass |
| 30 | Choose your next question. | 4 | `next-question` |
| 31 | Pin a claim. | 3 | Pass |
| 32 | Start with something that feels familiar. | 6 | Pass |
| 33 | Teach it back. | 3 | Pass |
| 34 | Write what you can produce without notes. | 7 | Pass |
| 35 | Record a next question. | 4 | Pass |
| 36 | Choose an example or prerequisite to test next. | 8 | Pass |
| 37 | Privacy and limits | 3 | Pass |
| 38 | Your map stays in this browser. | 6 | `local-only` |
| 39 | Your map stays here unless you export it. | 8 | `local-only` |
| 40 | There are no accounts, analytics, or trackers. | 7 | `local-only` |
| 41 | The app loads no fonts or scripts from other sites. | 10 | `local-only` request test |
| 42 | What this does not do | 5 | Pass |
| 43 | It records your self-assessment. | 4 | `self-assessment-label` |
| 44 | It does not fact-check claims or measure intelligence. | 8 | `self-assessment-label` |
| 45 | Private map practice for self-learners | 5 | Pass |
| 46 | Terms | 1 | Pass |
| 47 | Source on GitHub | 3 | Pass; external destination named |
| 48 | Built by Param Factory · build polish-4 | 7 | Pass |

### README

| # | Exact copy | Words | Result |
|---:|---|---:|---|
| 1 | Knowledge Boundary Map | 3 | Pass |
| 2 | Knowledge Boundary Map is a private practice map stored in your browser. | 12 | `local-only` |
| 3 | It helps self-learners separate “I recognize this” from “I can explain this.” | 12 | Pass; product purpose |
| 4 | Pin a claim, connect prerequisites, run a 90-second teach-back, name a boundary, and record your next question. | 17 | `prerequisites`, `teach-back-timer`, `counterexample-capture`, `next-question` |
| 5 | Live: https://knowledge-boundary-map.sociobot.in | 2 | Pass |
| 6 | Who it is for | 4 | Pass |
| 7 | Use it after reading, watching, or taking notes on a topic. | 11 | Pass |
| 8 | It does not fact-check claims or measure intelligence. | 8 | `self-assessment-label` |
| 9 | It shows your recorded evidence and uncertainty so you can pick the next question. | 14 | `self-assessment-label`, `next-question` |
| 10 | Product behavior | 2 | Pass |
| 11 | Your map stays in this browser unless you export it. | 10 | `local-only` |
| 12 | There are no accounts, analytics, or trackers. | 7 | `local-only` |
| 13 | The app loads no fonts or scripts from other sites. | 10 | `local-only` request test |
| 14 | JSON keeps the full map and can be restored here. | 10 | `json-restore` |
| 15 | CSV exports a readable table. | 5 | `csv-export` |
| 16 | The one-click sample is at `/demo` or `/?demo=1`. | 8 | `demo-sandbox` |
| 17 | Sample changes use browser keys beginning with `demo:`. | 8 | `demo-sandbox` |
| 18 | The claim map and rehearsal dialog work with a keyboard. | 10 | `keyboard-dialog` |
| 19 | The app reloads offline after your first visit. | 8 | `offline-reload` |
| 20 | Each map holds up to 12 claims. | 7 | `free-workshop` |
| 21 | Develop and verify | 3 | Pass |
| 22 | Requires Node.js 20 or newer. | 5 | Confirmed in a clean Node.js 22 clone |
| 23 | The build writes the deployable site to `dist/`, with `index.html` at its root. | 13 | Confirmed by clean build |
| 24 | `staticwebapp.config.json` sends app routes to `index.html` and adds security headers. | 10 | Confirmed in config and live headers |
| 25 | The factory owns deployment and DNS. | 6 | Repository responsibility note |
| 26 | Data and safety | 3 | Pass |
| 27 | Claims stay in this browser. | 5 | `local-only` |
| 28 | Demo changes use browser keys beginning with `demo:`. | 8 | `demo-sandbox` |
| 29 | Select Start for real or the product name to discard those changes. | 12 | `demo-sandbox`, `theme-storage` |
| 30 | Export before clearing site data or switching browsers. | 8 | Plain data-safety instruction |
| 31 | `/privacy` and `/terms` document the exact behavior. | 7 | Confirmed routes |
| 32 | The visual design and source of its generated image are documented in `.factory/design.md`. | 13 | Confirmed in repository |
| 33 | Licensed under MIT; see LICENSE. | 5 | Confirmed |

### Terminology

| Concept | Consistent public term | Result |
|---|---|---|
| Statement to practice | Claim | Pass |
| Required prior knowledge | Prerequisite | Pass |
| Timed explanation | Teach-back | Pass |
| Recorded result | Self-assessment | Pass |
| Follow-up work | Next question | Pass |
| Isolated sample | Demo | Pass |
| Demo storage separation | Browser keys beginning with `demo:` | Pass |

## 3. Demo and sandbox

| Check | Result | Evidence |
|---|---|---|
| One-click entry | Pass | Landing action opens `/demo` directly. |
| Already-used first screen | Pass | The first 390 px screen shows the topic, one Can explain, one Recognize only, one Blocked, and a specific next question. |
| Realistic sample | Pass | Three connected causal-inference claims include explanations, a boundary, next questions, prerequisites, and history. |
| Persistent banner | Pass | **“Demo — sample data, nothing is saved to your real map.”** stays visible with Reset demo and Start for real. |
| Reset demo | Pass | Reset replaces sample identifiers and restores all three statuses. |
| Map isolation | Pass | A seeded `kbm:map:v1` marker remains unchanged while only `demo:kbm:map:v1` changes. |
| Theme isolation | Pass | The real theme remains unchanged; leaving demo removes only the demo theme. |
| Start for real | Pass | Demo keys are removed, `/` opens, and focus moves to the landing h1. |
| Direct entry | Pass | `/demo` and `/?demo=1` both enter the completed sample. |
| Runtime requests | Pass | The full live flow contacts only the product origin. |

Evidence: `.factory/evidence-5/live-demo-mobile-390-dark.png`,
`.factory/evidence-5/live-demo-desktop.png`, and
`.factory/evidence-5/live-audit.json`.

## 4. Claims

A fresh remote clone at `/tmp/kbm-review5-clean.8PVRW4` resolved to the assigned
base commit. After `npm ci`, every command in `.factory/claims.json` was run
separately. Each id occurs in exactly one tagged browser test.

| Claim id | Result | Observable check |
|---|---|---|
| `demo-sandbox` | Pass | Completed mixed-status sample, reset, exit, and real/demo key separation |
| `local-only` | Pass | Full demo activity contacted only the product origin |
| `offline-reload` | Pass | A dedicated context reloaded the controlled demo offline |
| `csv-export` | Pass | Header and all three sample claims, including the blocked claim |
| `json-restore` | Pass | Topic, claims, prerequisites, history, boundary, and next question returned |
| `keyboard-dialog` | Pass | Arrows moved claims, Enter opened rehearsal, and Escape restored focus |
| `free-workshop` | Pass | Twelve claims remained; a thirteenth was rejected with the named limit |
| `self-assessment-label` | Pass | Changed content and history survived reload with non-scoring labels |
| `theme-storage` | Pass | Real and demo choices remained separate; exit removed only the demo choice |
| `prerequisites` | Pass | A selected prerequisite remained after save and reload |
| `teach-back-timer` | Pass | The timer showed 01:30 and advanced |
| `counterexample-capture` | Pass | A Can explain boundary saved and reopened |
| `next-question` | Pass | The blocked claim and its specific question appeared first |

The landing page, README, Privacy, Terms, dialogs, metadata, and offline banner
were cross-checked against this inventory. Capability and privacy statements map
to the entries above. Repository setup, build output, license, route
configuration, and image-source statements were directly verified as
repository facts. There is no unlisted product claim and no untested listed
claim.

## 5. Offline and privacy behavior

- The dedicated `offline-reload` test passed in its own browser context.
- The landing, demo entry, rehearsal, Reset, legal routes, 404, and exit flow
  requested only `https://knowledge-boundary-map.sociobot.in`.
- No analytics, tracker, remote font, remote script, account, billing, model, or
  payment request appeared.
- Demo map and theme writes used `demo:` keys. Real markers remained unchanged.
- No Azure endpoint, provider key, Sociobot runtime key, or model request exists
  in product source.

## 6. Earlier findings rechecked

Every earlier review, polish report, and handoff was read. Each numbered finding
was checked in current source and on the live site.

| Earlier id | Current confirmation | Result |
|---|---|---|
| F-1-1 | Demo opens already used with explain, recognize, and blocked claims plus a concrete next question. | Fixed |
| F-1-2 | Price, checkout, billing calls, and the Studio offer remain absent; `/upgrade` returns the designed 404. | Fixed |
| F-1-3 | Current capabilities have 13 narrow entries and exactly one tagged test per id. | Fixed |
| F-1-4 | The eyebrow is **“After reading, watching, or taking notes”** without a repeated audience line. | Fixed |
| F-1-5 | The longest README prose sentence is 17 words. | Fixed |
| F-1-6 | Visitor copy consistently uses **next question**; `nextProbe` is only an internal field. | Fixed |
| F-1-7 | The preview heading is **“Preview a claim map.”** | Fixed |
| F-1-8 | The privacy heading is **“Your map stays in this browser.”** | Fixed |
| F-1-9 | No Studio label or offer appears in rendered product copy. | Fixed |
| F-1-10 | README calls it a private practice map stored in the browser. | Fixed |
| F-1-11 | Plain privacy wording remains, and the request log is same-origin only. | Fixed |
| F-1-12 | Public copy uses literal `demo:` browser-key wording; “namespace” is absent. | Fixed |
| F-1-13 | Copy says the app reloads after the first visit; the dedicated offline test passes. | Fixed |
| F-1-14 | README names `dist/`; the clean build produced `dist/index.html`. | Fixed |
| F-1-15 | README explains route handling and security headers; live headers match. | Fixed |
| F-1-16 | Obsolete license-storage wording is absent. | Fixed |
| F-1-17 | The removed upgrade offer stays absent and `/upgrade` returns the product 404. | Fixed |
| F-1-18 | **Boundary Map** remains visible at 390 px with 44 px controls. | Fixed |
| F-1-19 | The 404 has metadata, shared controls, legal/source links, build id, and a way home. | Fixed |
| F-2-1 | The demo product-name link exits to `/`, preserves real data, clears demo data, and focuses the home h1. | Fixed |
| F-2-2 | `free-workshop` states and tests only the exact 12-claim limit. | Fixed |
| F-2-3 | The self-assessment test saves, reloads, reopens, and checks changed content and history. | Fixed |
| F-2-4 | `theme-storage` tests separate real/demo theme persistence and demo-only cleanup. | Fixed |
| F-2-5 / F-1-12 | “Namespace” remains absent from public documentation. | Fixed |
| F-2-6 | **“Opens a completed causal-inference map.”** remains directly beneath the sample action. | Fixed |
| F-2-7 | Current task labels are **Practice map**, **New claim**, **Map files**, and **Page not found.** | Fixed |
| F-2-8 | Repository links say **“Source on GitHub.”** | Fixed |
| F-3-1 | Documentation calls the visible exit control **the product name**. | Fixed |
| F-3-2 | Documentation says **visual design** and **source of its generated image**. | Fixed |
| F-3-3 | Copy audit and both product footers identify build `polish-4`. | Fixed |
| F-4-1 | **“No purchase is offered in this release.”** is absent from live Terms and source. | Fixed |

The standalone 404 dark-theme contrast correction recorded in polish round 2
also remains present.

## 7. Structure, routing, accessibility, and identity

| Check | Result |
|---|---|
| Titles | Pass: home, Demo, Privacy, Terms, and 404 use route-specific plain titles under 60 characters. |
| Metadata | Pass: descriptions, canonicals, OG/Twitter fields, SVG favicon, 180 px touch icon, and 1200 × 630 social image are present. |
| Semantics | Pass: `lang="en"`, one h1, header, main, navigation, and footer on all checked routes. |
| Designed 404 | Pass: a new missing URL returned HTTP 404 with product styling and a home action. |
| Deep links, Back, and focus | Pass: direct routes reload, route changes focus the new h1, and Back restores the prior route. |
| Links | Pass: all 14 discovered link targets were valid or explicit `mailto:`/same-document fragments. |
| Header and footer | Pass: product-name home link, Demo/Privacy navigation, Privacy/Terms, source destination, and build id are consistent. |
| Accessibility matrix | Pass: 20 route × viewport × theme checks found zero serious/critical Axe issues, zero overflow, and zero visible targets below 44 px. |
| Reduced motion | Pass: the matrix used reduced-motion preference; the live suite also checks the fallback. |
| Console | Pass: no application error occurred on normal routes. |
| Security | Pass: CSP, response-header frame denial, MIME protection, referrer policy, permissions policy, and HSTS are live. |
| Sitemap and robots | Pass: all product routes are listed and crawlable. |
| Visual identity | Pass: paper-cut topography, physical slips, state folds, hard shadows, and the original diorama are specific to this learning task. |
| Landing order | Pass: header, first screen, live preview, three steps, privacy/limits, and footer follow the required skeleton. |
| Asset budget | Pass: production JavaScript is 36,442 bytes raw and 12.40 kB gzip. |

The factory URL verifier passed title, language, h1, main landmark, image alt,
button names, and console checks. The original social and hero assets match the
dimensions and provenance documented in `.factory/design.md`.

## 8. Missed leverage

No additional feature is clearly implied. JSON restore and CSV already provide
portable backup. Sync would contradict the browser-only privacy model without
adding accounts and a new data policy. A model-generated assessment would
weaken the brief’s explicit self-assessment boundary and risk presenting an
objective score. No decorative AI feature or embedded provider key exists.

## 9. Verification record

```text
fresh remote clone at assigned base                         PASS
npm ci                                                      PASS — 59 packages, 0 vulnerabilities
13 claims.json commands, each run separately                PASS — 13/13
npm test                                                    PASS — 16/16
npm run lint                                                PASS
npm run build                                               PASS — dist/ produced
npm run test:response-policy                                PASS
PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e
                                                              PASS — 26/26
independent live route/link/demo/request audit              PASS
20-case route × viewport × theme Axe/touch/overflow matrix PASS
factory verify-url.sh                                       PASS
```

## What would make this perfect

Nothing remains within this review scope. No corrective product or copy change
is warranted.
