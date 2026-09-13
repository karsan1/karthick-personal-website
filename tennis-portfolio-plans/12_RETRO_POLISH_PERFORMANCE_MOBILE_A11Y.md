# Phase 12 — Retro Polish, Performance, Mobile & Accessibility

## Objective

Finish the retro art direction with restrained lighting/audio/effects, then prove the experience performs and remains usable across device/motion/WebGL conditions.

Performance and accessibility are acceptance gates, not cleanup after launch.

---

## Primary agents

- Scene polish: `scene_engineer`
- Performance: `performance_engineer`
- Motion/reduced motion: `motion_engineer`
- UI accessibility: `ui_engineer`
- Review: `qa_reviewer`

---

## Lighting direction

Use simple lighting that reinforces faceted forms.

Recommended starting point:

- one directional/key light,
- ambient/hemisphere fill,
- limited intentional shadows,
- darker/subdued stadium background,
- clear ball/player separation from court.

Avoid lighting complexity that fights the retro low-poly aesthetic.

---

## Character/material polish

Characters:

- flat/faceted shading remains visible,
- colors remain readable at production distance,
- avoid shiny plastic unless intentional,
- skin/hair remain simplified.

Court:

- matte,
- high readability,
- no unnecessary normal/roughness texture stacks.

Environment:

- lower contrast/detail than the main actors/content.

---

## Optional retro rendering effect

Only after the scene looks good without postprocessing, evaluate one subtle retro-render treatment.

Possible approaches:

- render Canvas at a slightly reduced internal resolution and upscale,
- subtle color quantization/dithering,
- restrained vertex/facet emphasis.

Rules:

- never affect DOM text,
- effect must be quality-tiered/toggleable,
- avoid chromatic aberration, heavy glitch, CRT distortion, scanline spam, or fake VHS treatment unless there is a strong reviewed reason,
- do not intentionally make navigation harder to read.

A clean low-poly scene with no postprocess is an acceptable final choice.

---

## Texture filtering

Where intentionally low-res textures exist:

- nearest magnification may be used,
- verify minification/mipmaps to prevent distant shimmer,
- inspect on Retina and non-Retina displays,
- no global texture filter override that breaks unrelated assets.

---

## Audio

Audio remains opt-in.

Potential sounds:

- racket hit,
- court bounce,
- subtle shoe movement,
- quiet venue ambience,
- match-point cue.

Style can be slightly compressed/arcade-like but should not become novelty chiptune unless that is separately approved.

Synchronize hit/bounce audio from deterministic progress crossings.

Prevent repeated audio spam when users scrub rapidly back/forth.

---

## Performance profiling

Measure separately:

- network transfer,
- GLB decode/parse,
- animation CPU cost,
- draw calls,
- triangles,
- material/shader count,
- GPU frame time,
- React rerenders,
- GSAP/scroll work,
- texture memory.

Profile before lowering quality.

---

## Runtime rules

- no `setState` in `useFrame`,
- no per-frame Zustand narrative progress,
- reuse temporary vectors/quaternions,
- cache hierarchy/bone references,
- reuse/instance repeated environment geometry,
- lazy-load noncritical assets,
- pause/reduce work when page is hidden,
- avoid unnecessary raycasting targets.

---

## Quality tiers

### High
- DPR up to existing safe cap,
- selected shadows,
- full retro environment,
- optional approved retro-render effect,
- ambient character idle.

### Medium
- lower DPR cap,
- fewer shadow casters,
- simpler crowd/decorative detail,
- postprocess reduced/disabled.

### Low
- DPR near 1,
- minimal shadows,
- simplified stadium/crowd,
- no optional postprocess,
- reduced ambient animation.

The retro art direction should survive all tiers because it depends on silhouette, not expensive effects.

---

## Mobile composition

Phase 10 owns mobile camera/narrative choreography. This phase validates and optimizes the full mobile composition, DOM interaction, quality tiers, accessibility, and device behavior without creating a competing camera system.

Mobile is not desktop squeezed smaller.

Requirements:

- separate camera composition,
- fewer angle changes,
- simpler stadium detail,
- stable readable player size,
- touch targets remain DOM controls,
- project details use mobile-appropriate sheet/page pattern,
- no requirement to tap tiny in-world objects.

Test portrait and landscape/orientation changes where supported.

---

## Reduced motion

When `prefers-reduced-motion` is enabled:

- no scroll-scrubbed cinematic camera travel,
- character clips use stable representative poses or very subtle motion,
- ball is static or uses minimal non-essential movement,
- DOM navigation remains complete,
- project interactions still work,
- Canvas may use demand rendering if architecture allows cleanly.

Retro stepped animation is not a substitute for reduced-motion support.

---

## Non-WebGL fallback

The existing semantic portfolio must remain complete when Canvas fails/does not mount.

Verify:

- hero,
- About,
- Experience,
- Research,
- Projects,
- Contact,
- Resume/navigation.

Do not add critical information only to the scoreboard or 3D court.

---

## Loading UX

Target progression:

1. DOM content/styles visible,
2. lightweight Canvas/fallback state,
3. court + player essentials interactive,
4. scoreboard/near props,
5. stadium/crowd/decorative detail.

Do not block the page on the full venue.

---

## Acceptance criteria

Phase boundary: stop after Phase 12 acceptance. Do not begin Phase 13 QA,
deployment, or cleanup without a new explicit request.

- [ ] Scene looks complete with postprocessing disabled.
- [ ] Lighting clearly supports low-poly/faceted characters.
- [ ] Optional retro effect is subtle, quality-tiered, and Canvas-only.
- [ ] Audio is opt-in and deterministic.
- [ ] Performance is profiled with documented bottlenecks/results.
- [ ] Quality tiers can independently reduce expensive features.
- [ ] Mobile has separately authored composition.
- [ ] Reduced-motion path is complete.
- [ ] Non-WebGL DOM portfolio remains complete.
- [ ] No obvious continuous main-thread or GPU jank remains from architecture.
