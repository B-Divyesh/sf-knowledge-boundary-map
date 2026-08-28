# Visual thesis — the explanation workshop

## Direction and purpose

Knowledge Boundary Map is a **paper-cut diorama**, seen from a learner's desk. Claims are cream paper slips at different physical depths; prerequisites are tucked underneath and joined with pencilled paths. Torn coral tabs mean “blocked,” a blue fold means “recognize,” and a green stitched edge means “explain.” This makes the abstract knowledge boundary tangible without pretending the app objectively scores intelligence. The interface is a workshop, not a dashboard.

Decoration must explain state. Paper layers distinguish map depth, the cut edge identifies the current rehearsal, and the small landscape illustration demonstrates the move from hazy familiarity to a route that can be explained. There is no generic gradient hero and there are no glass cards.

## Palette

Light is the canonical, explicitly painted treatment because paper and pencil are central to the metaphor. Dark mode is a deep drafting-table treatment with the same paper-state colors.

| Token | Light | Dark | Role |
|---|---:|---:|---|
| canvas | `#F4EBD9` | `#191D1B` | unbleached sketch paper / night desk |
| paper | `#FFFDF5` | `#242A26` | raised claim sheet |
| ink | `#17231E` | `#F7F0DE` | primary text |
| muted ink | `#53635B` | `#B9C2B9` | secondary text |
| pencil | `#77847D` | `#89958E` | edges and routes |
| moss | `#26704D` | `#67C491` | explain / completion |
| lake | `#225F75` | `#74BCD2` | recognize / orientation |
| persimmon | `#A9422A` | `#F18B70` | blocked / attention |
| saffron | `#E2AA3B` | `#D8AA53` | focus and timer tab |

All body combinations meet WCAG AA; states always include labels and shapes, never color alone. Focus is a 3px saffron ring plus ink offset.

## Typography

- Display and controls: `Avenir Next`, `Segoe UI`, sans-serif. Rounded geometry reads like labelled museum models while staying crisp.
- Claims and teaching text: Georgia, `Times New Roman`, serif. The bookish texture slows scanning just enough to favor recall.
- Five-step scale: 14, 16, 20, 28, and clamp(36–62) px. Body never drops below 16px. Text measure is capped near 68 characters.
- No network font dependency. The paired system stacks are fully local and keep first paint lean.

## Space, shape, and layout

The base unit is 4px; normal rhythm uses 8, 12, 16, 24, 32, 48, and 72px. Paper corners use restrained 3–14px irregularity rather than generic pill cards. Shadows are hard, offset paper shadows, not ambient blur. Controls are at least 44px.

Desktop places the working map beside a narrow boundary ledger. On phones, the ledger becomes a concise row above the map and secondary copy is shortened; edit controls remain below each claim so the task never depends on hover. The hero illustration recedes once claims exist so learners reach their work immediately.

## Interaction grammar

- “Pin a claim” adds a paper slip from the top edge.
- Selecting a claim lifts it one paper layer and opens the rehearsal sheet.
- Arrow keys move between map claims; Enter rehearses; `N` starts a new claim when focus is not in a field.
- Status changes replace the slip's folded corner and announce the result. Destructive removal requires a named confirmation and has a short undo.
- The timer is a finite circular paper dial; it never blocks self-assessment when it reaches zero.

## Motion

UI changes take 180–240ms and animate only transform and opacity: slips settle vertically, the active paper lifts 3px, and the timer dial advances without looping. Under `prefers-reduced-motion: reduce`, transitions and smooth scrolling are removed and state swaps are instant. No animation flashes or runs indefinitely.

## Original asset plan and provenance

The hero is an original raster illustration generated for this product and used as an explanatory scene, not evidence of automated analysis. Art direction prompt:

> A tactile editorial paper-cut diorama viewed slightly from above: a winding dark-green path crosses layered cream paper hills from a hazy blue fog bank toward three crisp labelled-by-shape blank paper markers, tiny coral obstruction tab and golden question flag, visible cut fibers and soft directional desk-light shadows, handmade educational model, quiet confident composition, palette of unbleached paper, bottle green, slate blue, persimmon and saffron, generous negative space, no people, no text, no letters, no numbers, no logos, no watermark, no UI, no photorealistic plastic, no gradient background.

Generated with the factory image deployment (`gen-image.sh`, Azure OpenAI image generation), 2026-08-28. Source PNG and prompt sidecar live in `assets/src/`; optimized AVIF/WebP derivatives live in `public/assets/`. Generated imagery is original to this product. All interface icons and the timer/map geometry are hand-authored SVG/CSS under the MIT project license.
