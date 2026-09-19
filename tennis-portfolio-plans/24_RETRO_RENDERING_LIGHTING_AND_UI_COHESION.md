# Phase 24 — Retro Rendering, Lighting & UI Cohesion

## Objective

Make the finished scene read as a bright, intentional old-console grass-court game rather than a dark modern low-poly WebGL scene.

This phase does not add major geometry. It tunes:
- background/fog,
- lighting,
- material response,
- scene resolution/antialiasing,
- color hierarchy,
- restrained DOM/world-control palette cohesion.

Read first:
- `src/components/scene/Scene.tsx`
- `src/components/scene/Lighting.tsx`
- `src/components/experience/ExperienceCanvas.tsx`
- `src/components/scene/sceneQuality.ts`
- `src/app/globals.css`
- `docs/RETRO_ART_DIRECTION.md`
- `docs/PIXEL_SPORTS_COURT_ART_DIRECTION.md`

## Owner

- Primary: `scene_engineer`
- Rendering/performance: `performance_engineer`
- DOM palette/accessibility: `ui_engineer`
- Review: `qa_reviewer`

## Current blockers to fix

1. `Scene.tsx` still uses a dark green background and fog from 17–34 units, which can mute the far stand, crowd, signage, and scoreboard.
2. The art direction explicitly favors bright outdoor value separation and warns against fog that weakens court readability.
3. The Canvas still renders with antialiasing enabled and high DPR, so the scene can feel cleaner/more modern than the intended pixel-sports presentation.
4. The DOM/world-control accent is a bright neon yellow-green, which can clash with the traditional green/cream/purple venue direction.
5. MeshStandardMaterial + smooth lighting can still look more contemporary than necessary even with flatShading.

## Protected contracts

Do not:
- rasterize DOM,
- add a heavy post-processing stack by default,
- create a second camera owner,
- remove quality tiers,
- break pointer alignment,
- remove accessibility focus contrast,
- change portfolio information architecture.

## Implementation tasks

### 1. Remove or greatly weaken venue fog

First test:
- no fog.

If some depth separation is still needed, push fog start/end beyond the visible stadium so it does not wash out:
- far crowd,
- scoreboard,
- court lines,
- tunnel,
- station objects.

The venue should feel like daylight, not a dark atmospheric arena.

### 2. Rework background value

Test a brighter background family that supports outdoor grass-court readability.

Options:
- muted pale blue/green sky,
- desaturated warm daylight,
- deep-green background only where stadium architecture actually fills the frame.

Do not create a photoreal skybox.

A flat retro background or simple two-tone sky/structure split is acceptable.

### 3. Tune lighting for graphic separation

Goal:
- readable faceted silhouettes,
- light grass,
- dark walls,
- cream lines,
- clear white-dominant player kits.

Test:
- slightly stronger hemisphere/day fill,
- one dominant warm sun/key,
- weaker cool fill,
- crisper but still inexpensive shadows,
- no glossy grass.

Avoid cinematic contrast that crushes the stands into darkness.

### 4. Review material model

For the environment, compare:
- current `MeshStandardMaterial` flat-shaded setup,
- `MeshLambertMaterial`,
- `MeshToonMaterial` only if it does not add fragile texture/dependency behavior.

Choose the simplest material model that makes the scene feel deliberately retro.

Do not blindly convert all materials if Standard is already better for shadows/readability.

### 5. Controlled retro resolution experiment

The user-facing DOM must remain full resolution.

Test the WebGL world at:
- current high DPR,
- ~1.25 max DPR,
- 1.0 max DPR,
- antialiasing on/off.

Evaluate:
- court-line shimmer,
- net readability,
- player/racket silhouette,
- crowd readability,
- grass band stability,
- hotspot hit alignment,
- Retina display appearance.

If a lower-resolution mode clearly improves the old-console look, encode it in `SCENE_QUALITY` rather than adding postprocessing.

Do not add a pixelation postprocess unless the simpler DPR/AA experiments fail.

### 6. Reconcile the world-control accent palette

The current `--accent: #d8ff39` is intentionally bright but can read neon/cyber.

Keep the DOM modern, but tune world-adjacent controls toward the venue palette.

Recommended split:
- keep a high-contrast focus token for accessibility,
- add a separate tournament accent token for world menu / chapter indicator / small status UI,
- use cream/gold or restrained purple/cream rather than neon green where visual review improves cohesion.

Do not make long-form DOM copy look like an 8-bit UI.

### 7. Preserve clear interactive feedback

Any palette changes must keep:
- focus-visible state obvious,
- hovered hotspot state obvious,
- active chapter legible,
- World Menu usable over bright grass and dark stands.

### 8. Remove stale visual-prototype artifacts

Review and remove or retire normal-production remnants that are no longer part of the final product, including:
- old prototype content cues if they are still reachable,
- stale color constants from the pre-grass visual direction,
- unused environment staging state,
- comments that describe superseded visuals.

Do not remove diagnostics that are still used by `?debug=1`.

## Validation

Run:
- `corepack pnpm lint`
- `corepack pnpm typecheck`
- `corepack pnpm build`

Performance comparison:
- high/medium/low DPR,
- idle frame cost,
- rally frame cost,
- mobile thermal/jank observation.

## Acceptance criteria

- [ ] Far-side stadium/scoreboard is not lost in fog.
- [ ] Scene reads as bright outdoor tournament tennis.
- [ ] Grass remains natural rather than neon.
- [ ] Deep-green architecture still frames the court.
- [ ] Players/rackets remain readable against the new values.
- [ ] Retro rendering feels intentional without blurring the DOM.
- [ ] Pointer hit regions still align after DPR/AA changes.
- [ ] World-control palette supports green/cream/purple venue styling.
- [ ] Accessibility focus contrast remains strong.
- [ ] No heavy post-processing dependency is added without measured need.

Stop after rendering/palette review passes on desktop and mobile.
