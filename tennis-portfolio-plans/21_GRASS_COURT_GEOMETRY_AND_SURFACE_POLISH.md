# Phase 21 — Grass Court Geometry & Surface Polish

## Objective

Make the court itself read immediately as a traditional grass-court tournament court from the existing elevated game camera.

The current Phase 16 implementation has the right palette direction, but the playable surface still reads too much like a compact green platform: the grass ends close to the line geometry, the mowing bands are simple raised strips, the wear treatment is a few straight bars, and the line layout does not yet create the richer singles/doubles-court read expected from a classic tournament venue.

This phase changes **visual court geometry only**. It must not change the rally coordinate contract, ball curves, player baseline positions, chapter model, hotspot routing, or camera ownership.

Read first:
- `docs/CURRENT_STATE.md`
- `docs/PIXEL_SPORTS_COURT_ART_DIRECTION.md`
- `docs/RETRO_ART_DIRECTION.md`
- `src/components/scene/RetroEnvironment.tsx`
- `src/animations/prototypeMotion.ts`

## Owner

- Primary: `scene_engineer`
- Review: `qa_reviewer`
- Performance review only if geometry/material counts materially increase: `performance_engineer`

## Current blockers to fix

1. The grass surface is almost the same footprint as the marked court, leaving very little visible grass runoff beyond baselines/sidelines.
2. The mowing pattern is implemented as a handful of raised rectangular strips, which can look like layered panels rather than cut grass.
3. Worn grass is represented as narrow straight bars only.
4. The court does not clearly show a richer singles/doubles-alley structure.
5. The court perimeter transitions immediately into large dark-green blocks instead of first reading as an outdoor grass playing area.
6. The net should remain dark and readable without disappearing against the grass or becoming visually noisy.

## Protected contracts

Do not change:
- `COURT_DIMENSIONS.netHeight`
- player baseline Z coordinates
- deterministic ball paths
- world hotspot destination behavior
- one persistent Canvas
- GSAP/ScrollTrigger narrative ownership
- Phase 04 fallback environment
- semantic DOM content

## Implementation tasks

### 1. Add a real grass apron / runoff area

Create a larger visible grass plane around the marked court while preserving the current rally-space center and player coordinates.

Target impression:
- marked court sits inside a broader lawn,
- visible runoff exists behind both baselines,
- visible runoff exists outside doubles sidelines,
- deep-green retaining walls sit outside the grass apron rather than directly against the line geometry.

Do not move the rally actors merely to make the court larger.

If station props need small positional adjustments because the apron expands, keep their semantic destination and camera relationship unchanged.

### 2. Improve court markings

Use a regulation-inspired visual hierarchy rather than treating the current line set as final.

Recommended visible markings:
- outer doubles sidelines,
- inner singles sidelines,
- both baselines,
- both service lines,
- center service line,
- optional small center marks at baselines if readable.

Exact real-world dimensions are not required if they break the existing application-space composition, but the **relative structure** should unmistakably read as a complete tennis court.

Keep the lines:
- cream/white,
- crisp,
- flat or nearly coplanar,
- readable at desktop and mobile game-camera distance.

Avoid thick floating strips.

### 3. Replace panel-like mowing bands

Keep a limited retro pattern, but make it feel like grass value variation rather than stacked geometry.

Preferred options, in order:
1. coplanar material/geometry zones with tiny safe Y offsets,
2. vertex-color regions,
3. one tiny nearest-neighbor palette texture only if necessary.

Use broad alternating bands aligned consistently across the full lawn.

Do not introduce a photoreal grass texture.

### 4. Improve worn-grass treatment

Replace the current four straight wear strips with a more believable low-resolution wear pattern.

Use simple, performance-cheap shapes such as:
- broken baseline traffic patches,
- subtle service-box wear,
- center-line approach wear,
- slightly asymmetric olive/tan patches.

The wear should read at the game camera but remain restrained.

Avoid:
- brown clay-like coloring,
- noisy procedural detail,
- transparent decals that shimmer,
- high-resolution textures.

### 5. Net readability pass

Keep the net dark with a cream/white tape, but review:
- mesh opacity,
- line density,
- post thickness,
- top-tape thickness,
- aliasing at the Hero camera.

If the current wireframe plane shimmers or disappears, replace it with a cheaper explicit low-resolution cord grid or a tiny nearest-neighbor alpha texture.

Do not add a heavy post-processing dependency.

### 6. Court shadow/contact grounding

Verify the grass receives:
- player shadows where enabled,
- ball projected shadow,
- net/post grounding where visually useful.

The court should not look like floating geometry.

### 7. Reposition perimeter walls only after court acceptance

After the court apron is correct, push deep-green perimeter geometry outward enough that:
- the grass has breathing room,
- station props are not squeezed,
- the far scoreboard remains readable,
- side stands still frame the court.

Do not redesign the stadium in this phase; Phase 22 owns the venue structure.

## Validation

Run:
- `corepack pnpm lint`
- `corepack pnpm typecheck`
- `corepack pnpm build`

If material/draw structure changes materially, also run/update the environment metrics and performance documentation.

## Visual review frames

Capture:
1. desktop Hero full court,
2. tablet Hero,
3. mobile Hero,
4. About/player view,
5. Projects/scoreboard view,
6. low-quality Hero,
7. reduced-motion Hero.

## Acceptance criteria

- [ ] The court unmistakably reads as grass before explanatory text.
- [ ] There is visible grass runoff beyond baselines and sidelines.
- [ ] Singles/doubles/service geometry reads like a complete tennis court.
- [ ] Mowing bands feel like grass treatment, not stacked panels.
- [ ] Wear is subtle, asymmetric, and grass-like rather than clay-like.
- [ ] Court lines remain crisp with no obvious z-fighting.
- [ ] Net remains readable from the main gameplay camera.
- [ ] Rally/player/ball coordinates are unchanged.
- [ ] Mobile still shows the full-court structure clearly.
- [ ] No photoreal grass textures or Wimbledon branding are introduced.

Stop after the court itself passes visual review. Phase 22 owns the stadium around it.
