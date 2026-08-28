# Knowledge Boundary Map

Knowledge Boundary Map is a private, local-first workshop for self-learners who need to separate “I recognize this” from “I can explain this.” Pin a claim, connect its prerequisites, attempt a 90-second teach-back, name a counterexample, and record the next probe.

Live: <https://knowledge-boundary-map.sociobot.in>

## Who it is for

Use it after reading, watching, or taking notes on a topic. It does not fact-check claims or measure intelligence; it makes your own evidence and uncertainty visible so you can choose what to study next.

## Product behavior

- Browser-only storage with JSON and CSV export; no account or analytics.
- Keyboard-navigable claim map and accessible rehearsal dialogs.
- Offline shell after the first production visit.
- Free workshop with 12 claims and the complete rehearsal/export flow.
- Optional $12 one-time Studio license for unlimited claims and full rehearsal history, verified only through the Sociobot billing API.

## Develop and verify

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
npm test
npm run build       # exact production command; output is dist/
npm run test:e2e    # starts the production preview automatically
```

Set `VITE_BILLING_API_BASE=https://pilot-api.sociobot.in` for staging billing tests. Production defaults to `https://api.sociobot.in`. No product ID or payment-provider code is embedded.

The production artifact is the `dist/` directory with `index.html` at its root, suitable for Azure Static Web Apps. `staticwebapp.config.json` supplies route fallback and security headers. The factory owns deployment, DNS, and billing registration.

## Data and safety

Claims and license material stay in local storage. Export before clearing site data or switching browsers. `/privacy` and `/terms` document the exact behavior. The visual system and generated-image provenance are recorded in `.factory/design.md`.

Licensed under MIT; see [LICENSE](LICENSE).
