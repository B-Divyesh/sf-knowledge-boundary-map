# Adversarial first-read review 1

- **Product:** Knowledge Boundary Map
- **Candidate:** `eb85e441b1bf3fe2dda5cd90b7d51da85e582fd9`
- **Live URL:** <https://knowledge-boundary-map.sociobot.in>
- **Reviewed:** 2026-08-30 UTC

**Verdict:** **FAIL**

The cold landing screen is clear, the real-data and demo namespaces remain separate, and most quality checks pass. Acceptance is still blocked by an unused-looking sample, a declared price/checkout test that failed against production, and public product promises that are absent from the claims inventory. Sixteen additional copy and structure findings remain. A PASS requires zero findings and no failed or untested claim.

## Findings

### Blocking

#### F-1-1 — The sample opens before the product has been used

- **Location / exact copy:** `/demo`, immediately after selecting **“Try it with sample data”**: **“0 Can explain / 0 Recognize only / 0 Blocked / 3 Not rehearsed”** and **“Try explaining it without opening your notes.”**
- **Evidence:** The seeded `Causal inference basics` map contains three plausible claims and a prerequisite connection, but every claim has `status: "untested"`, empty teach-back, empty counterexample, empty next probe, and no rehearsal history. At 390 × 844 the status summary is visible, while the first claim begins near the bottom of the viewport.
- **Why this fails a first-time visitor:** The required sample must show the product already being used. This sample shows setup, not the promised boundary between “recognize,” “can explain,” and “blocked.” The visitor must perform the work before seeing the core value.
- **Concrete fix:** Seed at least one **Can explain**, one **Recognize only**, and one **Blocked** claim, each with a realistic teach-back, boundary/counterexample, next question, and rehearsal timestamp. Make the first mobile viewport show the mixed status summary and a specific next question. Keep the current `demo:` namespace, Reset demo, and Start for real behavior.

#### F-1-2 — A declared paid claim failed from the clean checkout

- **Location / exact claim:** Landing and README: **“Studio is a $12 USD one-time purchase.”** `.factory/claims.json`: `studio-price-checkout`.
- **Evidence:** After `npm ci`, `npm run test:e2e -- --grep '@claim:'` ran all ten declared claims. Nine passed and `@claim:studio-price-checkout` failed at `expect(catalogResponse.ok).toBe(true)`. An immediate direct request to `https://api.sociobot.in/api/v1/products` returned HTTP 500 with `{"error":"Internal server error","status":500}`. The individual claim test failed again. The service recovered later: the full live suite and `npm run test:billing` then passed, and checkout returned HTTP 303.
- **Why this is misleading:** The product makes a current purchase claim. A transient production catalog failure is still a failed claim test and makes the paid offer unreliable at the moment a visitor relies on it.
- **Concrete fix:** Restore reliable production catalog availability, retain the exact tagged test, and verify repeated clean runs without HTTP 5xx. If reliability cannot be restored, remove or disable the paid claim and purchase action until it can be verified.

#### F-1-3 — Several public product promises have no claims entry

- **Locations / exact copy:**

  - Landing: **“Each paper slip records one claim, its prerequisites, and your latest self-assessment.”**
  - Landing: **“Use the map to choose what to study next, not to score your intelligence.”**
  - README: **“Pin a claim, connect its prerequisites, attempt a 90-second teach-back, name a counterexample, and record the next probe.”**
  - README: **“It does not fact-check claims or measure intelligence; it makes your own evidence and uncertainty visible so you can choose what to study next.”**
  - Metadata: **“Check what you can explain with private, timed teach-backs and a prerequisite map.”**
  - README: **“No product ID or payment-provider code is embedded.”**

- **Evidence:** `.factory/claims.json` has entries for sandbox isolation, local-only behavior, offline reload, CSV, JSON restore, keyboard use, the free limit, self-assessment wording, Studio features, and price/checkout. It has no claim for prerequisite preservation, the 90-second flow, counterexample capture, selection of what to study next, or the embedded-payment-code statement. Ordinary tests exercise parts of this behavior, but none is the required exactly-one tagged claim test.
- **Why this fails:** A visitor can rely on these promises, but the claims contract cannot prove them from the declared sandbox. The “choose what to study next” outcome is also too subjective in its current form to test honestly.
- **Concrete fix:** Add narrowly worded entries and exactly one `@claim:<id>` test for observable behavior such as preserving prerequisite links, displaying and running the 90-second timer, saving counterexamples, and selecting the first blocked/recognize/untested claim. Add a static scan for forbidden embedded provider code. Rewrite or remove the subjective “choose what to study next” outcome if it cannot be asserted.

### Minor

#### F-1-4 — The first screen repeats the audience without adding information

- **Quote:** **“For self-learners testing familiar topics”** followed by **“For self-learners testing what feels familiar.”**
- **Why:** The two adjacent lines say the same thing; the eyebrow does not give the visitor another usable fact.
- **Rewrite:** Remove the eyebrow, or replace it with **“After reading, watching, or taking notes”** while keeping the audience sentence.

#### F-1-5 — One README sentence exceeds the 22-word limit

- **Quote:** **“It does not fact-check claims or measure intelligence; it makes your own evidence and uncertainty visible so you can choose what to study next.”** — 24 words.
- **Rewrite:** **“It does not fact-check claims or measure intelligence. It shows your recorded evidence and uncertainty so you can pick the next question.”** — 9 and 12 words.

#### F-1-6 — The same concept is called a “next question” and a “next probe”

- **Quotes:** **“choose your next question,” “Find the next question to study,” “Choose a next probe,”** and README **“record the next probe.”**
- **Why:** “Probe” is unexplained learning jargon and breaks the one-term-per-concept rule.
- **Rewrite:** Use **“next question”** everywhere: **“Choose your next question.”** and **“record the next question.”**

#### F-1-7 — A landing heading is an unexplained metaphor

- **Quote:** **“See the boundary before you start.”**
- **Why:** Heard out of context, it does not name the section or say that the content is a claim-map preview.
- **Rewrite:** **“Preview a claim map.”**

#### F-1-8 — The privacy heading is a slogan rather than a section name

- **Quote:** **“Your assessment stays yours.”**
- **Why:** It implies privacy but does not say what is stored or where.
- **Rewrite:** **“Your map stays in this browser.”**

#### F-1-9 — The Studio name is capitalized inconsistently

- **Quote:** Header link **“Lifetime studio”** versus **“Optional Studio,” “Studio is $12,”** and **“Studio details.”**
- **Why:** The paid tier is a named product term and should not change form.
- **Rewrite:** **“Lifetime Studio.”**

#### F-1-10 — “Local-first workshop” is jargon plus a product metaphor

- **Quote:** README: **“a private, local-first workshop.”**
- **Why:** A new user has to translate both “local-first” and “workshop” before learning that this is a browser-stored practice map.
- **Rewrite:** **“Knowledge Boundary Map is a private practice map stored in your browser.”**

#### F-1-11 — “Runtime CDN scripts” is implementation jargon

- **Quotes:** Landing: **“No account, analytics, trackers, third-party fonts, or runtime CDN scripts are used.”** README: **“There are no accounts, analytics, trackers, third-party fonts, or runtime CDN scripts.”**
- **Rewrite:** **“There are no accounts, analytics, or trackers. The app loads no fonts or scripts from other sites.”**

#### F-1-12 — “Storage namespace” does not explain the isolation

- **Quote:** README: **“uses a separate `demo:` storage namespace.”**
- **Rewrite:** **“stores sample changes only in browser keys beginning with `demo:`.”**

#### F-1-13 — “Offline shell” is unexplained developer jargon

- **Quote:** README: **“The offline shell works after the first production visit.”**
- **Rewrite:** **“The app reloads offline after your first visit.”**

#### F-1-14 — “Production artifact” obscures a simple build fact

- **Quote:** README: **“The production artifact is the `dist/` directory with `index.html` at its root, suitable for Azure Static Web Apps.”**
- **Rewrite:** **“The build writes the deployable site to `dist/`, with `index.html` at its root.”**

#### F-1-15 — “Route fallback” is not explained

- **Quote:** README: **“`staticwebapp.config.json` supplies route fallback and security headers.”**
- **Rewrite:** **“`staticwebapp.config.json` sends app routes to `index.html` and adds security headers.”**

#### F-1-16 — “License material” is vague

- **Quote:** README: **“Claims and license material stay in local storage.”**
- **Rewrite:** **“Claims and Studio license details stay in this browser.”**

#### F-1-17 — The upgrade headline hides the product result in a metaphor

- **Location / quote:** `/upgrade` h1: **“Keep a larger workshop.”**
- **Why:** It does not name the paid result when read alone and relies on the workshop metaphor.
- **Rewrite:** **“Keep unlimited claims and rehearsal history.”**

#### F-1-18 — The mobile header hides the product wordmark

- **Location:** 390 px header. The visible home link is only the **“↗”** mark; “Knowledge Boundary Map” is visually hidden.
- **Why:** The standard header requires a wordmark linking home. A cold mobile visitor sees an unexplained arrow rather than the product name.
- **Concrete fix:** Keep a short visible wordmark such as **“Boundary Map”** at 390 px, or rebalance the navigation so the full name fits without reducing 44 px targets.

#### F-1-19 — The designed 404 is missing shared metadata and site chrome

- **Location:** Any unknown route, verified at `/definitely-missing-review-1` with HTTP 404.
- **Evidence:** It has the correct title, one h1, favicon, a styled way home, Privacy and Terms. It has no meta description, canonical, Open Graph, or Twitter metadata. Its header omits the Studio link and theme control; its footer omits Source and the build id.
- **Why:** The route is designed, but it fails the requirement for route metadata and a consistent header/footer.
- **Concrete fix:** Add route-specific description, canonical, OG/Twitter tags, and match the live app’s header/footer controls and build label.

## 1. Cold first screen

Fresh contexts were used with no cookies or storage and no scrolling.

| Viewport | What does it do? | For whom? | First click? | Result |
|---|---|---|---|---|
| 390 × 844 | Tests whether a familiar topic can be explained by pinning and teaching back claims | Self-learners testing familiar topics | **Try it with sample data** | Pass |
| 1440 × 900 | Tests explanations and turns gaps into a next study question | Self-learners testing familiar topics | **Try it with sample data** | Pass |

The decisive copy was **“Check what you can explain.”**, **“For self-learners testing what feels familiar.”**, and **“Try it with sample data.”** Both first screens also showed the private/offline/free facts. The repetition is recorded as F-1-4, but it did not prevent answering all three questions.

## 2. Copy audit

Counts use whitespace-delimited words; hyphenated terms and URLs count as one word. The tables include headings, labels, navigation, actions, and footer text in addition to grammatical sentences so that no visible copy escapes review. No banned marketing adjective appears. No landing unit exceeds 22 words. Findings are referenced in the Result column.

### Landing page

| # | Exact copy | Words | Result |
|---:|---|---:|---|
| 1 | Knowledge Boundary Map | 3 | Pass |
| 2 | Demo | 1 | Pass |
| 3 | Privacy | 1 | Pass |
| 4 | Lifetime studio | 2 | F-1-9 |
| 5 | For self-learners testing familiar topics | 5 | F-1-4 |
| 6 | Check what you can explain. | 5 | Pass |
| 7 | For self-learners testing what feels familiar. | 6 | F-1-4 |
| 8 | Pin a claim, teach it back, and choose your next question. | 11 | F-1-3 |
| 9 | Try it with sample data | 5 | Pass |
| 10 | Pin your first claim | 4 | Pass |
| 11 | Private: stored in this browser. | 5 | Pass; `local-only` |
| 12 | Offline: works after your first visit. | 6 | Pass; `offline-reload` |
| 13 | Free: 12 claims; Studio is $12 once. | 7 | F-1-2 |
| 14 | Use the map to choose what to study next, not to score your intelligence. | 14 | F-1-3 |
| 15 | Live preview | 2 | Pass |
| 16 | See the boundary before you start. | 6 | F-1-7 |
| 17 | Each paper slip records one claim, its prerequisites, and your latest self-assessment. | 12 | F-1-3 |
| 18 | Correlation is not causation | 4 | Pass |
| 19 | Not rehearsed | 2 | Pass |
| 20 | A confounder affects both variables | 5 | Pass |
| 21 | Needs: correlation | 2 | Pass |
| 22 | Random assignment reduces confounding | 4 | Pass |
| 23 | Needs: both earlier claims | 4 | Pass |
| 24 | How it works | 3 | Pass |
| 25 | Find the next question to study. | 6 | F-1-3 |
| 26 | Pin a claim. | 3 | Pass |
| 27 | Start with something that feels familiar. | 6 | Pass |
| 28 | Teach it back. | 3 | Pass |
| 29 | Write what you can produce without notes. | 7 | Pass |
| 30 | Choose a next probe. | 4 | F-1-6 |
| 31 | Record the example or prerequisite to test next. | 8 | Pass |
| 32 | Privacy and limits | 3 | Pass |
| 33 | Your assessment stays yours. | 4 | F-1-8 |
| 34 | Your map stays in this browser unless you export it. | 10 | Pass; `local-only` |
| 35 | No account, analytics, trackers, third-party fonts, or runtime CDN scripts are used. | 12 | F-1-11; `local-only` |
| 36 | What this does not do | 5 | Pass |
| 37 | It records your self-assessment. | 4 | Pass; `self-assessment-label` |
| 38 | It does not fact-check claims or measure intelligence. | 8 | Pass; `self-assessment-label` |
| 39 | Optional Studio | 2 | Pass |
| 40 | Keep every claim in one map. | 6 | Pass; `studio-features` |
| 41 | Studio is a $12 USD one-time purchase. | 7 | F-1-2 |
| 42 | It adds unlimited claims and full rehearsal history. | 8 | Pass; `studio-features` |
| 43 | See Studio details | 3 | Pass |
| 44 | Private map practice for self-learners | 5 | Pass |
| 45 | Privacy | 1 | Pass |
| 46 | Terms | 1 | Pass |
| 47 | Source | 1 | Pass |
| 48 | Built by Param Factory · build repair-5 | 7 | Pass |

### README

| # | Exact copy | Words | Result |
|---:|---|---:|---|
| 1 | Knowledge Boundary Map is a private, local-first workshop for self-learners who need to separate “I recognize this” from “I can explain this.” | 22 | F-1-10 |
| 2 | Pin a claim, connect its prerequisites, attempt a 90-second teach-back, name a counterexample, and record the next probe. | 18 | F-1-3, F-1-6 |
| 3 | Live: https://knowledge-boundary-map.sociobot.in | 2 | Pass |
| 4 | Who it is for | 4 | Pass |
| 5 | Use it after reading, watching, or taking notes on a topic. | 11 | Pass |
| 6 | It does not fact-check claims or measure intelligence; it makes your own evidence and uncertainty visible so you can choose what to study next. | 24 | F-1-3, F-1-5 |
| 7 | Product behavior | 2 | Pass |
| 8 | Your map stays in this browser unless you export it. | 10 | Pass; `local-only` |
| 9 | There are no accounts, analytics, trackers, third-party fonts, or runtime CDN scripts. | 12 | F-1-11; `local-only` |
| 10 | JSON restores the complete map. | 5 | Pass; `json-restore` |
| 11 | CSV exports a readable table. | 5 | Pass; `csv-export` |
| 12 | A one-click sample map is available at `/demo` (or `/?demo=1`) and uses a separate `demo:` storage namespace. | 17 | F-1-12; `demo-sandbox` |
| 13 | The claim map and rehearsal dialog work with a keyboard. | 10 | Pass; `keyboard-dialog` |
| 14 | The offline shell works after the first production visit. | 9 | F-1-13; `offline-reload` |
| 15 | The free workshop includes 12 claims and the complete rehearsal and export flow. | 13 | Pass; `free-workshop`, export claims |
| 16 | Optional Studio is a $12 USD one-time purchase. | 8 | F-1-2 |
| 17 | It adds unlimited claims and full rehearsal history. | 8 | Pass; `studio-features` |
| 18 | Develop and verify | 3 | Pass |
| 19 | Requires Node.js 20 or newer. | 5 | Pass |
| 20 | Set `VITE_BILLING_API_BASE=https://pilot-api.sociobot.in` for staging billing tests. | 6 | Pass |
| 21 | Production defaults to `https://api.sociobot.in`. | 4 | Pass |
| 22 | No product ID or payment-provider code is embedded. | 8 | F-1-3 |
| 23 | The production artifact is the `dist/` directory with `index.html` at its root, suitable for Azure Static Web Apps. | 18 | F-1-14 |
| 24 | `staticwebapp.config.json` supplies route fallback and security headers. | 7 | F-1-15 |
| 25 | The factory owns deployment, DNS, and billing registration. | 8 | Pass |
| 26 | Data and safety | 3 | Pass |
| 27 | Claims and license material stay in local storage. | 8 | F-1-16 |
| 28 | Demo data uses a separate `demo:` namespace and is discarded by **Start for real**. | 14 | F-1-12; `demo-sandbox` |
| 29 | Export before clearing site data or switching browsers. | 8 | Pass |
| 30 | `/privacy` and `/terms` document the exact behavior. | 7 | Pass |
| 31 | The visual system and generated-image provenance are recorded in `.factory/design.md`. | 10 | Pass |
| 32 | Licensed under MIT; see LICENSE. | 5 | Pass |

All landing actions start with a verb and name the destination or result. No button-copy finding was recorded.

## 3. Demo and sandbox

| Check | Result | Evidence |
|---|---|---|
| One-click entry | Pass | Landing button opens `/demo` directly |
| Already-used sample | **Fail** | F-1-1: all three claims are Not rehearsed |
| Realistic topic/data | Pass | Three causal-inference claims and one prerequisite relationship |
| Persistent banner | Pass | “Demo — sample data, nothing is saved to your real map.” |
| Reset demo | Pass | Replaced the demo map with newly seeded claim ids |
| Start for real | Pass | Removed `demo:kbm:map:v1` and returned to `/` |
| Real data isolation | Pass | Seeded `kbm:map:v1` with topic `REAL MARKER`; it was unchanged after entry and Reset |
| Requests | Pass | Landing, demo, Reset, and Start for real requested only the product origin |

## 4. Claims

The ten tagged tests were run together after `npm ci` with `npm run test:e2e -- --grep '@claim:'`, which executes every command target declared in `.factory/claims.json` against a freshly built local preview.

| Claim id | Result | Evidence |
|---|---|---|
| `demo-sandbox` | Pass | Separate demo key and untouched real key |
| `local-only` | Pass | Observer installed before navigation; only same-origin requests |
| `offline-reload` | Pass | Dedicated context reloaded the controlled app offline |
| `csv-export` | Pass | Header plus all three sample rows |
| `json-restore` | Pass | Topic, result, and next question restored |
| `keyboard-dialog` | Pass | Arrow/Enter opened rehearsal; Escape restored claim focus |
| `free-workshop` | Pass | Twelfth claim allowed; thirteenth showed the limit |
| `self-assessment-label` | Pass | Non-scoring language visible before assessment |
| `studio-features` | Pass | Cached valid verdict exposed claim 13 and full history |
| `studio-price-checkout` | **Fail** | Production catalog returned HTTP 500; see F-1-2 |

Result: **9 passed, 1 failed** on the mandatory claim run. A later recovery does not erase the observed failed claim. F-1-3 lists additional unlisted claims.

## 5. Privacy and offline behavior

- A fresh request observer was attached before the first live navigation and retained through landing, demo entry, Reset, and Start for real. Every observed request used `https://knowledge-boundary-map.sociobot.in`; there were no analytics, trackers, third-party fonts, runtime scripts, or map-data requests.
- Demo writes used `demo:kbm:map:v1`; the seeded real key `kbm:map:v1` remained byte-for-byte unchanged. Start for real removed the demo key.
- `@claim:local-only` independently completed a demo rehearsal while checking the same-origin boundary and passed.
- `@claim:offline-reload` passed in its own browser context after service-worker control.
- The optional billing action is the documented exception and goes to `api.sociobot.in` only after explicit license or purchase activity.

## 6. History re-check

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist. The prior `.factory/handoff.md` and all `verification*.md` reports were read because the handoff relies on them.

| Earlier issue or assertion | Live and code re-check |
|---|---|
| Mobile status ledger not keyboard-scrollable | Fixed; checked-in live test and Axe pass |
| Missing CSP/frame protection | Fixed; response headers include CSP `frame-ancestors 'none'` and `X-Frame-Options: DENY` |
| Checkout unavailable | **Regressed intermittently as F-1-2**; catalog returned 500 during the mandatory claim run, then recovered |
| Storage denial crashes startup | Fixed; browser regression passes |
| Damaged rehearsal import crashes claim opening | Fixed; browser regression rejects it with recovery text |
| Mobile targets below 44 × 44 px | Fixed for measured brand/footer controls; regression passes |
| Parser jargon for malformed JSON | Fixed; actionable message regression passes |
| Unverified offline license unlock | Fixed; token-bound verdict regressions pass |
| Old service worker remains pinned | Fixed; update regression passes |
| Light focus ring below 3:1 | Fixed; computed contrast regression passes in both themes |
| AVIF served with generic MIME | Fixed; HTTP 200 `image/avif` |
| Claims not runnable after clean install | Fixed by the self-building Playwright server; all ten started, but F-1-2 failed on its external assertion |
| Incomplete claims inventory | **Still incomplete as F-1-3** |
| Unknown routes return home with 200 | Fixed; unknown route returns the designed page with HTTP 404 |
| Dialog close and Back lose focus | Fixed; live suite passes focus restoration and scroll history |
| Landing sections missing | Fixed; preview, three steps, privacy/limits, and paid tier are present |
| Social image, touch icon, build id missing | Fixed on app routes; social image is 1200 × 630, touch icon is 180 × 180, footer has build id |
| Handoff says all ten claims pass and no defects remain | No longer true because F-1-1 through F-1-19 remain |

## 7. Structure, routes, links, and visual identity

| Check | Result |
|---|---|
| `/` | 200; `Knowledge Boundary Map — check what you can explain`; one h1; route canonical |
| `/demo` | 200; `Demo — Knowledge Boundary Map`; one h1; route canonical |
| `/privacy` | 200; `Privacy — Knowledge Boundary Map`; one h1; route canonical |
| `/terms` | 200; `Terms — Knowledge Boundary Map`; one h1; route canonical |
| `/upgrade` | 200; `Studio — Knowledge Boundary Map`; one h1; route canonical; h1 copy finding F-1-17 |
| Unknown route | 404 with designed page and way home; metadata/chrome finding F-1-19 |
| Shared metadata | App routes have description, canonical, OG title/image, Twitter card, SVG favicon, 180 px touch icon, language, and matching theme color |
| Back/forward | Pass; route h1 receives focus, announcement updates, and prior scroll is restored |
| Link crawl | Pass; all internal links and GitHub returned 200, checkout returned 303, and `mailto:` links are explicit |
| Header/footer | Consistent on app routes; mobile and 404 exceptions are F-1-18 and F-1-19 |
| Accessibility | Factory verifier passed; independent Axe 4.10.3 found 0 violations; live 26-test suite passed after billing recovered |
| Console | No errors on normal route loads; the expected browser resource error appears only for the 404 response itself |
| Bundle | 40,217 B JS raw / 13,630 B gzip; 18,554 B CSS raw / 5,010 B gzip |
| Visual identity | Pass; paper-cut illustration, paper slips, hard shadows, state folds, and drafting-table dark theme are product-specific rather than a generic SaaS template |

## 8. Missed leverage

No additional AI, sync, or import/export finding is warranted. JSON restore and JSON/CSV export cover the obvious portability need. Cloud sync would conflict with the local-first privacy boundary. Automated AI scoring would undermine the brief’s explicit self-assessment boundary; an optional AI feature is not needed for the core job and should not be added decoratively.

## 9. Verification record

| Command/check | Result |
|---|---|
| `npm ci` | Pass; 59 packages, 0 vulnerabilities |
| `npm test` | Pass; 9/9 |
| `npm run lint` | Pass |
| `npm run build` | Pass; `dist/` produced |
| All tagged claim tests | **Fail; 9/10**, then later pass after the API recovered |
| Individual `studio-price-checkout` rerun | **Fail** during the outage |
| `PLAYWRIGHT_BASE_URL=https://knowledge-boundary-map.sociobot.in npm run test:e2e` | Pass after recovery |
| `npm run test:response-policy` | Pass |
| `npm run test:billing` | Pass after recovery |
| `/opt/fleet/lib/verify-url.sh` | Pass; title/lang/h1/main/alt/named buttons/console |
| Axe CLI 4.10.3 | Pass; 0 violations on `/` |

## What would make this perfect

Resolve every finding above, then repeat this review from a clean browser and clean checkout. The demo should communicate the boundary before interaction by showing varied completed assessments and a specific next question. Every public behavior statement should map to exactly one stable tagged claim test. Copy should use one plain term per concept, and every route—including 404—should carry the same complete site structure and metadata. A subsequent review must find zero blocking and zero minor issues; passing automation alone is not enough.
