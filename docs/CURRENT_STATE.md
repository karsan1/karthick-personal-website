# Current Project State

## Current phase

Phases 01 foundation, 02 interaction prototype, 03 content/information
architecture, and 04 Blender/3D asset pipeline are complete and accepted.

The retro Phase 05–13 planning system is installed. No redesign implementation
has started. The current next milestone is **Phase 05 — Retro Art Direction &
Migration**.

## Current objective

- Implement only `tennis-portfolio-plans/05_RETRO_ART_DIRECTION_AND_MIGRATION.md`
  when explicitly requested.
- Establish the detailed visual and asset-source migration contracts without
  destabilizing the accepted Phase 01–04 implementation.

## Completed baseline

- Next.js App Router shell with one persistent, client-only R3F Canvas and
  semantic portfolio content.
- Coarse Zustand state, browser-safe GSAP/ScrollTrigger registration, WebGL
  fallback, loading state, and `?debug=1` helpers.
- Typed portfolio data, centralized chapter/match beats, production section
  copy, hash navigation, and a consistent DOM project-detail interaction.
- A scroll-scrubbed primitive serve/rally with deterministic curve sampling,
  independent camera keyframes, temporary capsule/sphere player responses,
  lifecycle cleanup, and a reduced-motion resting pose.
- Functional Blender-export environment GLBs for court, stadium shell, props,
  and scoreboard, with progressive loading and primitive/error fallbacks.
- A repeatable Phase 04 Blender source-generation/export workflow plus glTF
  Transform, Meshopt optimization, and GLB validation.

## Art-direction transition

- The previous stylized-realistic character direction was intentionally
  superseded before Phase 05.
- The target is now a deliberately low-poly early-console/retro tennis game
  aesthetic, evoking PS1/N64/early-2000s sports-game visual language without
  copying a particular copyrighted game.
- Retro styling belongs primarily in the 3D world. The professional portfolio
  UI and meaningful content remain clean, modern, readable semantic HTML.
- Existing capsule/sphere players are temporary prototype actors specifically
  scheduled for replacement in the retro character phases.
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

## Do not work on yet

- Do not begin Phase 05 or any later phase without an explicit request.
- Do not replace the temporary players, create Blockbench models, alter rally or
  camera behavior, restyle the environment/UI, or delete Phase 04 assets as part
  of planning integration.

## Next milestone

Phase 05 — Retro Art Direction & Migration:
`tennis-portfolio-plans/05_RETRO_ART_DIRECTION_AND_MIGRATION.md`.
