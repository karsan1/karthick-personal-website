# Current Project State

## Current phase

Phases 01 foundation, 02 interaction prototype, 03 content/information
architecture, 04 Blender/3D asset pipeline, 05 retro art-direction migration, and
06 retro character prototype are complete and accepted.

Phase 09 restyles the visible environment as a procedural retro court and venue
while retaining the accepted Phase 04 GLB loader as a progressive fallback. Phase 08 adds deterministic authored-character clip playback and synchronizes it
to the accepted rally while preserving smooth ball, camera, scroll, and DOM motion.
The checked-in animated GLBs remain generated calibration fixtures; human
Blockbench authoring and final visual approval are still required.

## Current objective

- Visually approve the procedural retro environment across the application camera
  path, including court legibility behind DOM content and legacy fallback behavior.

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

## Phase 07 implementation status

- `assets-source/blockbench/` contains committed Player A/B hierarchy and pivot
  calibration templates. `blockbench-exports/` and `/public/models/` contain
  deterministic generated calibration fixtures, explicitly not claimed as visual
  Blockbench exports or final player art.
- The optimizer accepts legacy Blender environment exports plus Blockbench character
  exports in one reproducible pipeline. Character assets receive 80KB budgets and
  conservative inspect/prune/dedup/Meshopt processing without weld; the manifest
  records each asset's source kind and processing path.
- Validation checks both static character files, source kinds, bytes, Meshopt,
  root/bone/socket names, material slots, triangle review threshold, zero or named
  clips, and the no-raster-texture calibration policy.
- `?debug=1` now mounts Player A/B static GLBs at both baselines. The normal scene
  remains on the accepted Phase 06 prototype; each calibration GLB has that
  prototype as its Suspense/error fallback. No final clips or choreography changed.

## Phase 08 implementation status

- Generated Player A/B calibration GLBs contain the required stable named clips.
  Optimization preserves them and validation enforces exact clip sets, positive
  durations, in-place root motion, socket stability, Meshopt payloads, and manifest
  consistency. These fixtures are deterministic contract tests, not final art.
- Production actors now use cached cloned GLB scenes, resolved node/socket/action
  references, and an `AnimationMixer` controller scrubbed directly from normalized
  narrative progress. Normal character sampling is intentionally stepped at 18fps;
  `?debug=1` provides smooth reference sampling.
- Shot contacts are centralized with the deterministic ball labels. Contact-anchored
  stepping preserves the authored hit pose, recovery ranges are reversible, and
  reduced motion holds a representative `idle_ready` pose.
- Player root court placement remains application-owned. The ball and camera remain
  smooth, exactly one ball renders in normal/debug modes, and the Phase 06 prototype
  remains the Suspense/error fallback.

## Phase 09 implementation status

- The primary environment is now a procedural low-poly court, net, courtside props,
  retro scoreboard, stadium shell, seats, crowd silhouettes, and light fixtures.
  Court center, footprint, net axis, player baseline compatibility, ball curves, and
  camera coordinates retain the Phase 04 contract.
- Court lines, props, stands, seats, crowd, scoreboard digits, and fixtures use six
  shared material instances and instanced geometry. The fully mounted environment
  uses 14 structural draw submissions against a 15-call ceiling, six material instances,
  eight instanced groups, and 91 instances; there are no
  per-frame transforms, large textures, extra canvases, or postprocessing.
- Critical court geometry mounts first; props, scoreboard, then venue decoration
  mount over subsequent frames. A retro render failure resolves to the accepted
  Phase 04 staged GLB loader, which retains its primitive court fallback. Use
  `?environment=legacy` to exercise that accepted loader directly during review.

## Do not work on yet

- Do not begin Phase 10 or any later phase without an explicit request.
- Do not alter accepted camera/ball choreography, DOM/UI content, or delete Phase 04
  assets while the Phase 09 fallback chain remains under review.

## Next milestone

Complete Phase 09 browser visual/performance approval, then complete human Blockbench
character and clip authoring/export approval documented in `assets-source/README.md`.
