# Current Project State

## Current phase

Phases 01 foundation, 02 interaction prototype, 03 content/information
architecture, 04 Blender/3D asset pipeline, 05 retro art-direction migration, and
06 retro character prototype are complete and accepted.

Phase 06 replaced the capsule/sphere production players with an articulated,
faceted direct-R3F style proof while preserving the accepted rally and camera.
The current next milestone is **Phase 07 — Blockbench Character Pipeline**.

## Current objective

- Implement only `tennis-portfolio-plans/07_BLOCKBENCH_CHARACTER_PIPELINE.md` when
  explicitly requested.
- Establish the reproducible Blockbench source/export/optimization contract for
  final characters without replacing the accepted Phase 06 prototype early.

## Completed baseline

- Next.js App Router shell with one persistent, client-only R3F Canvas and
  semantic portfolio content.
- Coarse Zustand state, browser-safe GSAP/ScrollTrigger registration, WebGL
  fallback, loading state, and `?debug=1` helpers.
- Typed portfolio data, centralized chapter/match beats, production section
  copy, hash navigation, and a consistent DOM project-detail interaction.
- A scroll-scrubbed serve/rally with deterministic curve sampling, independent
  camera keyframes, articulated low-poly player responses, lifecycle cleanup,
  and a reduced-motion resting pose.
- Functional Blender-export environment GLBs for court, stadium shell, props,
  and scoreboard, with progressive loading and primitive/error fallbacks.
- A repeatable Phase 04 Blender source-generation/export workflow plus glTF
  Transform, Meshopt optimization, and GLB validation.

## Art-direction transition

- `docs/RETRO_ART_DIRECTION.md` is the persistent visual specification for
  character silhouette, geometry/texture budgets, shading, motion, and the
  modern-DOM/retro-WebGL boundary.
- The previous stylized-realistic character direction was intentionally
  superseded before Phase 05.
- The target is now a deliberately low-poly early-console/retro tennis game
  aesthetic, evoking PS1/N64/early-2000s sports-game visual language without
  copying a particular copyrighted game.
- Retro styling belongs primarily in the 3D world. The professional portfolio
  UI and meaningful content remain clean, modern, readable semantic HTML.
- The former capsule/sphere production players were removed in Phase 06 and
  replaced by articulated direct-R3F prototypes pending final authored assets.
- Blockbench is preferred for new low-poly character authoring and `.bbmodel`
  source assets. Blender remains supported for existing Phase 04 assets and is
  optional/legacy rather than mandatory for new character work.
- Existing Blender court/stadium GLBs remain functional transitional production
  assets until later retro environment work explicitly replaces and validates
  them. Do not remove their sources, production files, or optimization path.

## Architecture contracts to preserve

- One persistent R3F Canvas; semantic portfolio content remains in the DOM.
- GSAP/ScrollTrigger owns narrative progress; `useFrame`/refs own realtime
  transforms; Zustand stores coarse state only.
- Tennis trajectories remain deterministic and authored; no physics engine is
  needed for rally synchronization.
- Existing motion, camera, scrolling, content, reduced-motion, WebGL fallback,
  and GLB loading/optimization architecture stays in place unless a later phase
  explicitly changes a contract.
- Canvas DPR remains bounded. Existing production GLBs retain Meshopt decoding,
  validation, and progressive loading behavior. KTX2/Basis remains optional
  until raster textures justify it.

## Phase 05 completion

- Blockbench is now the preferred source tool for new retro characters and
  suitable small/medium assets; GLB remains the authoring-tool-independent runtime
  contract.
- The asset pipeline agent and source documentation support both Blockbench and
  the accepted legacy Blender workflow.
- The original future Phase 05–13 plans are retained only as superseded historical
  records under `tennis-portfolio-plans/archive/pre-retro-roadmap/`.
- No runtime code, rally/camera behavior, or production Phase 04 asset was changed.

## Phase 06 completion

- Production `RallyActors` now renders two articulated, faceted low-poly players
  with stable hips/torso/head/limb transform groups and readable wrist-attached
  rackets; the primitive tennis ball system is unchanged.
- Direct `useFrame` ref mutation derives every root and joint pose from normalized
  progress. Reverse scroll is deterministic and introduces no per-frame
  React/Zustand updates or avoidable math allocations.
- Character pose sampling defaults to 18 fps, while player root movement, ball,
  camera, master scroll, and DOM rendering remain smooth.
- Contact-frame measurements are approximately 0.087 m for Player B and 0.346 m
  for Player A. Reduced motion rests at the existing stable `contentPause` pose.
- Desktop, reverse-scroll, and narrow-viewport visual review passed without
  weakening portfolio readability. No Blockbench/Phase 07 assets were created.

## Do not work on yet

- Do not begin Phase 07 or any later phase without an explicit request.
- Do not replace the accepted prototype with final characters, alter rally or
  camera behavior, restyle the environment/UI, or delete Phase 04 assets outside
  the requirements of the explicitly requested current phase.

## Next milestone

Phase 07 — Blockbench Character Pipeline:
`tennis-portfolio-plans/07_BLOCKBENCH_CHARACTER_PIPELINE.md`.
