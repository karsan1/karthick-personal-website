# Phase 09 — Performance Optimization

## Objective
Make the 3D portfolio stable on real consumer hardware while preserving the premium experience.

## Deliverable
Measured performance budgets, adaptive quality tiers, optimized GLBs/textures, reduced draw calls, and verified loading behavior.

---

## First principle
Profile before and after each optimization. Do not reduce visual quality blindly.

Inspect separately:
- network transfer,
- GLB decode/parse time,
- texture upload/VRAM,
- CPU main-thread work,
- React renders,
- GPU frame time,
- draw calls,
- triangles,
- shader/material count.

---

## R3F rules
- No React `setState` in `useFrame`.
- Mutate refs for high-frequency transforms.
- Reuse temporary `Vector3`, `Quaternion`, etc.; avoid allocations every frame.
- Cache loaders/resources.
- Reuse materials/geometries.
- Avoid mounting/unmounting expensive scene graphs repeatedly.
- Instance repeated objects.
- Use LOD only where meaningful.

---

## Render-loop policy
The scene contains ongoing ambient character motion, so full `frameloop="demand"` may not suit the entire cinematic mode.

However:
- reduced-motion/static fallback can use demand rendering,
- pause/reduce animation when document is hidden,
- reduce expensive effects while scrolling/camera moves,
- consider demand mode for static project/detail states if architecture allows cleanly.

---

## Adaptive quality
Use Drei `PerformanceMonitor` and/or R3F performance regression to select quality.

Suggested tiers:

### High
- DPR up to ~2 where appropriate,
- full hero assets,
- selected shadows,
- optional postprocessing,
- higher detail stadium.

### Medium
- DPR capped lower,
- fewer shadow casters,
- reduced postprocessing,
- lower-detail decorative props.

### Low
- DPR near 1,
- minimal/no postprocessing,
- simplified shadows,
- lower LOD stadium,
- reduced ambient character updates,
- simpler mobile-friendly environment.

Do not use Drei `AdaptiveDpr`'s pixelated option for production art unless intentionally desired; standard adaptive DPR is preferable for this visual direction.

---

## Asset budgets
Set actual measured budgets after first production exports. Initial targets:
- keep critical first-view transfer as small as practical,
- split decorative stadium detail from critical court/player assets,
- no accidental 4K textures,
- animations compressed with meshopt where effective,
- KTX2/Basis for GPU-friendly texture delivery,
- avoid duplicate textures/materials across models.

Create an asset report script/table with:
- filename,
- transfer size,
- uncompressed geometry estimate,
- texture dimensions/formats,
- animation count,
- notes.

---

## Loading UX
Do not trap visitors at a giant percentage loader while every decorative asset downloads.

Progressive experience:
1. HTML and basic styling visible immediately,
2. lightweight static/gradient/court placeholder,
3. critical 3D assets become interactive,
4. secondary assets stream in,
5. decorative detail appears later.

Avoid faking percentage precision if loading progress is not truly measurable.

---

## Draw-call reduction
Audit:
- stadium seating,
- ball collections,
- line segments,
- repeated fixtures,
- repeated signs,
- crowd if any.

Use instancing for repeated geometry. A detailed crowd should likely be silhouettes/cards/instanced low-detail forms, not hundreds of individual characters.

---

## Texture strategy
- right-size source textures,
- KTX2/Basis in production,
- use color textures in correct color space,
- keep normal/roughness maps only where visually justified,
- test mobile GPU memory behavior.

---

## CPU/React profiling
Use React DevTools Profiler and browser Performance panel.

Look for:
- UI components rerendering on every scroll tick,
- Zustand subscriptions that are too broad,
- large arrays recreated in render,
- GSAP timelines recreated repeatedly,
- expensive raycasting over unnecessary scene objects.

---

## Acceptance criteria
- [ ] Quality tiers adapt without visible instability.
- [ ] High-frequency animation bypasses React state.
- [ ] Repeated environment geometry is instanced/reused where valuable.
- [ ] Production GLBs are compressed reproducibly.
- [ ] Production textures are right-sized/compressed.
- [ ] Decorative loading does not block first meaningful content.
- [ ] Mobile/lower-tier mode can disable expensive effects independently.
- [ ] Browser performance trace shows no obvious continuous main-thread jank from architecture.
