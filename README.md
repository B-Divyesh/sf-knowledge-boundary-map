# Knowledge Boundary Map

Knowledge Boundary Map is a private practice map stored in your browser. It helps self-learners separate “I recognize this” from “I can explain this.”

Pin a claim, connect prerequisites, run a 90-second teach-back, name a boundary, and record your next question.

Live: <https://knowledge-boundary-map.sociobot.in>

## Who it is for

Use it after reading, watching, or taking notes on a topic. It does not fact-check claims or measure intelligence. It shows your recorded evidence and uncertainty so you can pick the next question.

## Product behavior

- Your map stays in this browser unless you export it. There are no accounts, analytics, or trackers. The app loads no fonts or scripts from other sites.
- JSON keeps the full map and can be restored here. CSV exports a readable table.
- The one-click sample is at `/demo` or `/?demo=1`. Sample changes use browser keys beginning with `demo:`.
- The claim map and rehearsal dialog work with a keyboard.
- The app reloads offline after your first visit.
- Each map holds up to 12 claims.

## Develop and verify

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
npm run lint
npm test
npm run build       # writes dist/
npm run test:e2e    # builds, then starts the production preview automatically
npm run test:response-policy
```

The build writes the deployable site to `dist/`, with `index.html` at its root. `staticwebapp.config.json` sends app routes to `index.html` and adds security headers. The factory owns deployment and DNS.

## Data and safety

Claims stay in this browser. Demo changes use browser keys beginning with `demo:`. **Start for real** and the home wordmark discard those changes. Export before clearing site data or switching browsers. `/privacy` and `/terms` document the exact behavior. The visual system and generated-image provenance are recorded in `.factory/design.md`.

Licensed under MIT; see [LICENSE](LICENSE).
