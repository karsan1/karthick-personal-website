# Current Project State

## Current phase

Phases 01–12 are implemented. Phase 13 QA, deployment readiness, and legacy
pipeline cleanup is now active but is not accepted: its production-browser,
preview-deployment, and rollback-path evidence is still outstanding.

Phase 12 adds restrained scene lighting, user-selectable rendering tiers,
deterministic opt-in rally audio, hidden-tab work suspension, mobile project sheets,
and a documented performance profile over the accepted Phase 11 interface.
Phase 08 adds deterministic authored-character clip playback
and synchronizes it to the accepted rally while preserving smooth ball, camera,
scroll, and DOM motion.
The checked-in animated GLBs remain generated calibration fixtures; human
Blockbench authoring and final visual approval are still required.

## Current objective

- Complete the Phase 13 regression and release gates across desktop/mobile,
  forward/reverse navigation, reduced motion, WebGL fallback, asset failure,
  quality tiers, and opt-in audio.
- Record production/preview measurements and verify the preview deployment and
  rollback path before accepting Phase 13 or promoting production.
- Retain the Phase 04 Blender sources and optimized environment partitions while
  they remain the active legacy fallback; do not mistake retention for unfinished
  migration work.

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
  eight instanced groups, and 97 instances; there are no
  per-frame transforms, large textures, extra canvases, or postprocessing.
- Critical court geometry mounts first; props, scoreboard, then venue decoration
  mount over subsequent frames. A retro render failure resolves to the accepted
  Phase 04 staged GLB loader, which retains its primitive court fallback. Use
  `?environment=legacy` to exercise that accepted loader directly during review.

## Phase 10 implementation status

- The original GSAP/ScrollTrigger master progress remains the only narrative
  clock. Camera, ball, characters, scoreboard acknowledgement, DOM cues, and
  debug readouts all sample it directly and reverse without retained elapsed
  state or secondary triggers.
- Camera compositions are explicitly authored for desktop, tablet, mobile, and
  reduced-motion modes. Desktop/tablet use restrained gameplay interpolation and
  short reversible soft-cut windows; portrait uses fewer stable full-court views;
  reduced motion holds one calm composition.
- The final live rally, player recovery, and angle change now resolve by the
  Research boundary at normalized progress `0.50`; Research and Projects hold
  settled ball/player states and stable reading compositions.
- Chapter-aligned match states centralize score, player, and ball labels. The
  ball now has a deterministic projected shadow plus subtle contact/bounce squash;
  the procedural scoreboard gives a brief scrubbed acknowledgement at chapter
  crossings but deliberately does not change its rendered numeric segments (that
  remains Phase 11 UI/scoreboard work). These effects do not introduce timers,
  physics, or React state updates.

## Phase 11 implementation status

- Global DOM navigation and a restrained chapter/point indicator subscribe to the
  coarse active chapter written by the existing master narrative timeline. The
  navigation remains usable independently of WebGL and retains normalized hash,
  history, resize, and reduced-motion behavior.
- The procedural in-world scoreboard now renders the active chapter number with
  its existing instanced segments, shared material, and draw submission. It adds
  no focus target or required interaction and keeps the Phase 09 material/draw-call
  budget intact.
- Project summaries remain semantic DOM content. Each project opens an accessible
  modal detail surface with focus entry/trapping/restoration, Escape and backdrop
  close, scroll locking, external links, and a coarse shared project state. The
  backdrop and Canvas attenuation reduce 3D distraction while details are open.

## Phase 12 implementation status

- The scene remains postprocess-free and uses a restrained hemisphere fill, warm
  shadowed key, and cool fill to preserve faceted character/material readability.
- High, medium, and low quality controls independently cap DPR at 2, 1.5, and 1;
  reduce the single shadow map from 1024 to 512 to disabled; and progressively omit
  stadium and scoreboard detail. Narrow layouts start at the balanced medium tier.
- Sound remains off by default. Enabling it creates short local Web Audio hit/bounce
  cues at the existing deterministic rally crossings, with per-cue/global cooldowns
  to prevent rapid scrub spam. Reduced motion and hidden pages do no audio sampling.
- Hidden pages pause the R3F frame loop and suspend audio work, with lifecycle cleanup
  on unmount. Existing ref/useFrame ownership and coarse Zustand state are preserved.
- Native semantic preference controls expose quality and sound. Narrow viewports use
  a bottom-sheet project detail while preserving Phase 11 focus trap/restoration,
  Escape/backdrop close, and scroll locking.
- `docs/PERFORMANCE_PROFILE.md` records verified asset, texture, instancing, quality,
  lifecycle, and animation-ownership results plus the production-browser measurement
  matrix. Current GLBs total 31,920 bytes, use Meshopt/quantization, and contain no
  raster textures; the procedural environment retains its 14-call ceiling.

## Phase 13 integration status

- Active documentation now treats the procedural Phase 09 environment as primary
  and the accepted Phase 04 Blender environment as an intentional fallback.
- The Blender sources, source exports, optimizer branch, runtime GLBs, and manual
  reproduction procedure are retained because the fallback and default asset build
  still depend on them. They are not eligible for archive/removal in this phase.
- Blockbench remains the preferred authoring tool for new characters. The checked-in
  player GLBs are still generated calibration fixtures pending human-authored visual
  approval; this art task is not silently converted into a release claim.
- Ordinary portfolio copy, experience, research, project, link, contact, and
  navigation edits remain semantic data/DOM work and require neither Blockbench nor
  Blender.
- Local static validation, full browser regression, preview review, production
  promotion, and rollback verification must be reported by their owners before this
  phase can be marked accepted.

## Do not work on yet

- Do not perform post-launch cleanup or unrelated redesign beyond the Phase 13
  acceptance criteria without a new explicit request.
- Do not introduce independent choreography or delete/archive Phase 04 assets while
  the Phase 09 fallback chain and default asset build retain them.

## Next milestone

Pass the Phase 13 local validation and regression matrix, then review a Vercel
preview and record its performance/rollback evidence. Human Blockbench character
and clip authoring/export approval remains a separate art task documented in
`assets-source/README.md`; generated fixtures must not be presented as final art.
