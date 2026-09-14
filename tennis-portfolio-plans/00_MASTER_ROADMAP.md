# 3D Tennis Portfolio — Canonical Retro Roadmap

## Status of the existing roadmap

Phases 01–04 are **accepted and remain the foundation**:

- `01_FOUNDATION_ARCHITECTURE.md`
- `02_INTERACTION_PROTOTYPE.md`
- `03_CONTENT_AND_INFORMATION_ARCHITECTURE.md`
- `04_BLENDER_ASSET_PIPELINE.md`

This roadmap **supersedes the original roadmap from Phase 05 onward**. Do not redo
Phases 01–04. Phases 05–12 are implemented; **Phase 13 — QA, Deployment & Legacy
Pipeline Cleanup** is active but remains unaccepted until the full regression,
production/preview measurement, preview review, and rollback-path gates pass.

The procedural Phase 09 environment is the primary runtime scene. The Phase 04
Blender environment and optimization pipeline remain the accepted fallback and a
live default-build dependency. Blockbench is preferred for new retro character
authoring; Blender is optional for new work and remains supported for the Phase 04
fallback and specialized legacy maintenance. Do not retire those Blender sources
or GLBs while the fallback/build references remain.

---

## Revised product vision

Build a professional personal portfolio presented inside a stylized retro 3D tennis match.

The target is **early-console / PS1-N64/early-2000s sports-game visual language interpreted through a modern web portfolio**, not literal pixel art and not photorealism. Evoke the era without copying any particular copyrighted game, character, branding, or asset.

The contrast is intentional:

```text
DOM portfolio UI
├── modern
├── highly readable
├── professional
├── accessible
└── restrained

3D tennis world
├── low-poly
├── faceted
├── retro-game-inspired
├── limited palette
├── deliberately simplified
└── expressive through silhouette + animation
```

The site should feel authored and memorable, not like a generic WebGL demo, Minecraft clone, or AI-generated 3D portfolio.

---

## Architecture that must not change

These contracts survived Phases 01–04 and remain non-negotiable:

1. One persistent React Three Fiber Canvas.
2. Semantic portfolio content remains in HTML/DOM.
3. GSAP/ScrollTrigger owns normalized narrative progress.
4. `useFrame`/refs own per-frame 3D transforms.
5. Zustand stores coarse state only.
6. Ball trajectories remain deterministic and authored; do not add a physics engine.
7. Camera has one owner.
8. Reduced-motion and non-WebGL paths remain first-class.
9. Project/resume/contact access must not depend on interacting with the 3D world.
10. Progressive loading remains intact.

---

## Revised visual principles

### Characters
- angular low-poly silhouettes,
- no capsule-body + sphere-head final design,
- no realistic digital-human goal,
- readable pose from expected camera distance,
- simplified hands/feet/faces,
- chunky but recognizable racket,
- flat/faceted shading,
- small texture palette if textures are used.

### Environment
- retain correct tennis-court proportions,
- simplify stadium and prop geometry,
- use limited material families,
- prefer shape, lighting, and composition over texture detail,
- crowds should be cards/sprites/instanced silhouettes rather than individual characters,
- environment can mix procedural R3F geometry and authored Blockbench assets.

### Motion
- ball and camera remain smooth,
- character clips may intentionally use stepped/low-frame-rate playback,
- poses should be exaggerated enough to read like a sports game,
- gameplay beats should synchronize with portfolio chapters,
- no motion-capture realism requirement.

### UI
- main DOM UI stays crisp and modern,
- retro styling is concentrated in the 3D world, scoreboard, subtle labels, and small accents,
- never make résumé/project copy look like an unreadable 8-bit game screen.

---

## Revised toolchain

### Runtime
- Next.js
- React 19
- TypeScript
- React Three Fiber
- Three.js
- Drei
- GSAP + ScrollTrigger
- Zustand

### Asset authoring
- **Blockbench becomes the preferred authoring tool for new low-poly characters and selected props/environment pieces.**
- GLTF/GLB remains the runtime interchange format.
- glTF Transform + Meshopt remains the optimization path.
- KTX2/Basis is introduced only if raster textures justify it.

### Legacy support
- Existing Blender-generated Phase 04 environment GLBs remain valid during migration.
- Do not delete or archive Blender sources until the retro replacements are integrated and validated.

---

## New phase order

| Phase | File | Primary outcome |
|---|---|---|
| 05 | `05_RETRO_ART_DIRECTION_AND_MIGRATION.md` | Lock new art/technical contracts and remove contradictory Blender-first instructions for future work |
| 06 | `06_RETRO_CHARACTER_PROTOTYPE.md` | Prove the low-poly player style directly in R3F before authoring final assets |
| 07 | `07_BLOCKBENCH_CHARACTER_PIPELINE.md` | Establish reproducible Blockbench → GLB → optimization workflow |
| 08 | `08_RETRO_ANIMATION_AND_RALLY_SYNC.md` | Final low-poly players, rackets, clips, stepped animation, deterministic hit synchronization |
| 09 | `09_RETRO_ENVIRONMENT_RESTYLE.md` | Restyle court/stadium/props without breaking Phase 04 loading contracts |
| 10 | `10_RETRO_CAMERA_AND_GAME_FEEL.md` | Convert existing choreography into deliberate retro sports-game presentation |
| 11 | `11_RETRO_UI_SCOREBOARD_AND_PROJECTS.md` | Blend modern portfolio UI with in-world retro scoreboard/project interactions |
| 12 | `12_RETRO_POLISH_PERFORMANCE_MOBILE_A11Y.md` | Lighting, sound, retro FX, performance, mobile, reduced motion, fallbacks |
| 13 | `13_QA_DEPLOYMENT_AND_LEGACY_CLEANUP.md` | Regression QA, deployment, docs, and safe retirement of obsolete Blender workflow |

---

## Migration gates

### Gate R1 — Style proof
Before opening Blockbench for final characters:
- R3F prototype player clearly no longer looks balloon-like,
- silhouette reads as a tennis player,
- faceted shading reads intentionally retro,
- camera distance still supports the design,
- existing rally remains synchronized.

If the prototype style is wrong, fix Phase 06 before authoring final assets.

### Gate R2 — Character pipeline proof
Before replacing prototype players:
- Blockbench export has stable names,
- optimized GLB passes validation,
- skeleton/clip names are deterministic,
- racket pivot and hand attachment are stable,
- source file is reproducible and committed according to repository policy.

### Gate R3 — Environment proof
Before removing legacy Blender assets:
- retro court overlays the same application-space dimensions,
- net remains aligned to `z = 0`,
- scene loading/fallback behavior remains intact,
- no visual regression in chapter compositions,
- replacement assets meet or beat current performance budgets.

### Gate R4 — Launch proof
Before production:
- desktop interaction remains smooth,
- mobile composition is intentionally authored,
- reduced-motion path works without cinematic movement,
- non-WebGL content remains complete,
- no critical navigation depends on Canvas,
- asset waterfall is measured,
- reverse scroll remains deterministic.

---

## Agent routing

Use the existing Codex agents rather than asking one agent to do everything.

- `orchestrator` — phase decomposition, cross-cutting migration decisions, integration review.
- `repo_explorer` — CodeGraph-first ownership/dependency discovery.
- `scene_engineer` — R3F meshes, materials, GLB integration, scene behavior.
- `motion_engineer` — GSAP, camera, narrative progress, hit synchronization.
- `asset_pipeline_engineer` — Blockbench and legacy Blender source contracts, glTF/GLB export, optimization, manifests, and validation.
- `ui_engineer` — modern DOM UI, navigation, project panels, accessibility.
- `performance_engineer` — profiling and quality tiers.
- `qa_reviewer` — milestone validation.
- `release_engineer` — Vercel/release checks.

Use the fewest agents necessary per task. Do not let multiple agents edit the same high-conflict file simultaneously.

---

## Standard implementation rule

For each phase:

1. Read `AGENTS.md`.
2. Read `docs/CURRENT_STATE.md`.
3. Read this revised roadmap.
4. Read `CODEX_EXECUTION_GUIDE.md`.
5. Read exactly one current phase file.
6. Use CodeGraph before broad repository reads.
7. Implement only that phase.
8. Run targeted validation plus lint/typecheck/build.
9. Perform the phase's visual review.
10. Update `docs/CURRENT_STATE.md` only after acceptance.
11. Stop; do not begin the next phase without a new explicit request.

---

## Definition of done

The redesign is complete when the site is simultaneously:

- clearly a professional portfolio,
- visually identifiable as a deliberate retro 3D tennis experience,
- free of the current capsule/balloon-character look,
- deterministic when scrolling forward and backward,
- performant across reasonable desktop/mobile hardware,
- accessible without WebGL, audio, or full-motion animation,
- maintainable without reopening Blender for ordinary future work.
