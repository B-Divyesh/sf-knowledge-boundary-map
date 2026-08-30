# Knowledge Boundary Map

Knowledge Boundary Map is a private, local-first workshop for self-learners who need to separate “I recognize this” from “I can explain this.” Pin a claim, connect its prerequisites, attempt a 90-second teach-back, name a counterexample, and record the next probe.

Live: <https://knowledge-boundary-map.sociobot.in>

## Who it is for

Use it after reading, watching, or taking notes on a topic. It does not fact-check claims or measure intelligence; it makes your own evidence and uncertainty visible so you can choose what to study next.

## Product behavior

- Your map stays in this browser unless you export it. There are no accounts, analytics, trackers, third-party fonts, or runtime CDN scripts.
- JSON restores the complete map. CSV exports a readable table.
- A one-click sample map is available at `/demo` (or `/?demo=1`) and uses a separate `demo:` storage namespace.
- The claim map and rehearsal dialog work with a keyboard.
- The offline shell works after the first production visit.
- The free workshop includes 12 claims and the complete rehearsal and export flow.
- Optional Studio is a $12 USD one-time purchase. It adds unlimited claims and full rehearsal history.

## Develop and verify

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
npm run lint
npm test
npm run build       # exact production command; output is dist/
npm run test:e2e    # builds, then starts the production preview automatically
npm run test:billing # production catalog and hosted-checkout regression
```

Set `VITE_BILLING_API_BASE=https://pilot-api.sociobot.in` for staging billing tests. Production defaults to `https://api.sociobot.in`. No product ID or payment-provider code is embedded.

The production artifact is the `dist/` directory with `index.html` at its root, suitable for Azure Static Web Apps. `staticwebapp.config.json` supplies route fallback and security headers. The factory owns deployment, DNS, and billing registration.

## Data and safety

Claims and license material stay in local storage. Demo data uses a separate `demo:` namespace and is discarded by **Start for real**. Export before clearing site data or switching browsers. `/privacy` and `/terms` document the exact behavior. The visual system and generated-image provenance are recorded in `.factory/design.md`.

Licensed under MIT; see [LICENSE](LICENSE).
