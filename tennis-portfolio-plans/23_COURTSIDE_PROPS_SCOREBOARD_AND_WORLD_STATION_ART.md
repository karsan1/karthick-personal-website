# Phase 23 — Courtside Props, Scoreboard & World-Station Art

## Objective

Make every interactive destination look like a believable tennis-venue object first and a portfolio hotspot second.

The current hotspot architecture is good; the art is still placeholder-like. Bench, clipboard, chair, equipment rack, tunnel, and scoreboard are mostly simple boxes. This phase keeps the interaction system unchanged while giving those objects recognizable retro tennis silhouettes.

Read first:
- `src/components/scene/RetroEnvironment.tsx`
- `src/components/scene/interactions/WorldHotspot.tsx`
- `src/components/scene/interactions/worldHotspots.ts`
- `docs/PIXEL_SPORTS_COURT_ART_DIRECTION.md`
- Phases 21–22

## Owner

- Primary: `scene_engineer`
- Interaction review: `ui_engineer`
- Review: `qa_reviewer`

## Protected contracts

Do not change:
- hotspot IDs,
- destination chapters,
- DOM equivalents,
- camera ownership,
- selected/hovered Zustand ownership,
- pointer suppression when project details are open,
- semantic portfolio data.

## Implementation tasks

### 1. Experience bench

Upgrade the current bench/kit-box composition into a recognizable courtside player bench.

Add:
- slatted or stepped seat/back geometry,
- legs/supports,
- compact kit bag,
- water bottle/cooler block,
- folded towel card/block.

Keep the hotspot proxy generous and root-level.

The bench should read from the Experience camera without requiring the floating diamond marker.

### 2. Research umpire / strategy station

Upgrade the chair into a recognizable umpire-chair silhouette.

Add:
- ladder/steps,
- elevated seat,
- slim backrest,
- small writing/score shelf,
- optional tiny canopy/rail if it helps silhouette.

Keep the structure low-poly and original.

The Research destination should visually read as an official/analysis station.

### 3. Capabilities equipment rack

Make the rack unmistakably tennis-related.

Add:
- 2–3 simplified rackets,
- ball basket/tube,
- towel or grip blocks,
- maybe a small shoe/gear crate.

Use the rackets as a visual echo of the player rackets.

Do not turn this into a literal technology icon wall; capability copy remains in DOM.

### 4. Contact tunnel / exit

Turn the current box opening into a stronger stadium exit.

Add:
- arch/frame,
- dark passage,
- cream/purple trim,
- small generic `EXIT` or `PLAYER TUNNEL` sign if readable,
- side wall integration with Phase 22 architecture.

It should feel like part of the stadium rather than a freestanding box.

### 5. Résumé clipboard / placard

Keep the semantic action, but improve the object so it reads as a real clipboard or courtside paperwork placard.

Add:
- clip,
- paper layer,
- 2–3 simple dark lines,
- small stand/hook if needed.

Do not put full résumé content into WebGL.

### 6. Tennis-style scoreboard redesign

The scoreboard should look like a real retro tennis scoreboard while continuing to support the Projects destination.

Current behavior only renders a two-digit chapter number. Replace that with a more meaningful game-like composition.

Preferred structure:
- two player rows,
- simple abbreviated labels such as `KAR` and `VIS` or another original neutral opponent label,
- point/game/set cells or segmented numeric blocks,
- a small project/chapter indicator area,
- restrained cream/purple trim,
- dark-green frame.

Tie score changes deterministically to narrative progress or chapter state; no timers.

Possible chapter mapping:
- Hero: 0–0
- About: 15–0
- Experience: 15–15
- Research: 30–15
- Projects: 30–30 or highlighted `PROJECTS`
- Capabilities: 40–30
- Contact: GAME / MATCH

Exact tennis realism is less important than a coherent retro scoreboard metaphor.

### 7. Project affordance on scoreboard

When Projects is hovered/selected:
- use the existing subtle marker,
- optionally add a small value/emissive lift,
- optionally switch one small scoreboard panel to `PROJECTS`,
- do not replace the semantic project gallery.

No neon holograms.

### 8. Add noninteractive courtside detail

Medium/high only, if performance allows:
- ball basket,
- towel box,
- small net-post hardware,
- courtside cooler,
- line judge chair/card,
- spare racket.

These details should improve venue richness without adding new destinations.

### 9. Maintain hit regions after art changes

For every station:
- retain or re-tune invisible hit boxes,
- test hover from real camera angles,
- test touch-sized viewport,
- ensure proxy does not overlap adjacent destinations excessively,
- keep marker placement above the visible object.

## Validation

Run:
- `corepack pnpm lint`
- `corepack pnpm typecheck`
- `corepack pnpm build`

Interaction test:
- mouse hover/click,
- keyboard DOM equivalent,
- touch viewport,
- direct hash navigation,
- project modal open/close suppression,
- reverse-scroll then hotspot click.

## Acceptance criteria

- [ ] Bench reads as a tennis bench/kit area.
- [ ] Research station reads as an umpire/official chair.
- [ ] Equipment rack visibly contains tennis gear.
- [ ] Contact destination reads as a real stadium tunnel/exit.
- [ ] Résumé object reads as clipboard/placard, not a random rectangle.
- [ ] Scoreboard reads like tennis scoring, not just chapter digits.
- [ ] Projects destination remains semantically complete in DOM.
- [ ] Hotspot hit regions remain generous and stable.
- [ ] New art uses shared materials/geometry where practical.
- [ ] No copied tournament signs or logos are introduced.

Stop after the courtside station art passes review.
