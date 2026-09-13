# Phase 07 — Blockbench Character Asset Pipeline

## Objective

Create a reproducible Blockbench → GLB → optimized web asset workflow for the final low-poly tennis players and rackets.

Do not redesign choreography in this phase. This phase establishes reliable authored assets and runtime contracts.

---

## Primary agents

- Owner: `asset_pipeline_engineer`
- Runtime integration support: `scene_engineer`
- Discovery: `repo_explorer`
- Review: `qa_reviewer`

Human visual/manual work is expected in Blockbench. Coding agents must document manual authoring steps rather than pretending they created/validated a `.bbmodel` visually when they did not.

---

## Source layout

Use:

```text
assets-source/
├── blockbench/
│   ├── player-a.bbmodel
│   ├── player-b.bbmodel
│   └── shared-racket.bbmodel        # optional if not embedded
├── blockbench-exports/
│   ├── player-a.glb
│   ├── player-b.glb
│   └── shared-racket.glb            # optional
└── ...legacy Phase 04 assets
```

Production derivatives remain:

```text
public/models/
```

Never hand-edit optimized production GLBs as the source of truth.

---

## Coordinate contract

Preserve application coordinates established by Phase 04.

Character contract:

- root at ground level,
- Y-up after glTF export/runtime import,
- forward direction documented for both players,
- consistent character scale,
- racket grip pivot placed at hand attachment,
- no arbitrary export scale correction hidden in runtime code unless documented.

Create a simple runtime calibration scene/flag that places a character at each baseline with no animation.

---

## Naming contract

Use stable node/bone names.

Recommended skeleton hierarchy:

```text
CHAR_PlayerA_Root
└── BONE_Hips
    ├── BONE_Spine
    │   ├── BONE_Head
    │   ├── BONE_Arm_L_Upper
    │   │   └── BONE_Arm_L_Lower
    │   └── BONE_Arm_R_Upper
    │       └── BONE_Arm_R_Lower
    │           └── SOCKET_Racket
    ├── BONE_Leg_L_Upper
    │   └── BONE_Leg_L_Lower
    └── BONE_Leg_R_Upper
        └── BONE_Leg_R_Lower
```

Exact names may differ, but once selected they become a validated contract.

Avoid auto-generated names like `cube12` / `bone23` in production.

---

## Character budgets

Initial per-player target:

- 500–1,500 triangles preferred,
- review above 2,500 triangles,
- 1 primary material preferred,
- 2–3 material slots maximum unless clearly justified,
- no invisible interior geometry,
- no facial rig,
- no finger bones,
- no cloth simulation.

The point is silhouette and animation readability, not geometric fidelity.

---

## Texture strategy

Preferred options, in order:

### Option A — vertex/material colors
Use if the desired look can be achieved without raster textures.

### Option B — tiny palette/atlas texture
Use 64×64, 128×128, or 256×256 source textures.

If pixel texture style is intentional:

- use nearest filtering for magnification,
- disable mip behavior only if visual testing supports it; otherwise retain mipmaps for distance stability,
- verify color space,
- avoid texture bleeding around atlas islands.

Do not introduce KTX2 until actual textures exist and profiling shows a reason.

---

## Blockbench manual authoring checklist

For each player:

1. Match proportions accepted in Phase 06.
2. Keep major limb forms angular/faceted.
3. Build a readable tennis stance before detailed texturing.
4. Create/verify skeleton pivots at anatomical joints.
5. Verify feet meet ground plane.
6. Verify racket grip/hand orientation.
7. Keep face extremely simple.
8. Export a static calibration GLB first.
9. Integrate and verify scale/orientation in browser.
10. Only then author animation clips in Phase 08.

---

## Optimization pipeline changes

Update existing asset scripts instead of creating a parallel one-off pipeline.

Requirements:

- recognize `blockbench-exports`,
- preserve node/bone/animation names,
- run glTF Transform inspection,
- prune/dedup only when safe for skin/animation data,
- apply Meshopt where compatible,
- emit production files to `public/models`,
- update `asset-manifest.json`,
- record source kind such as `blockbench-export`,
- add size/budget validation for player assets.

Be conservative around transforms/weld operations on skinned meshes. Validate animation after optimization.

---

## Runtime loader

Create a reusable but narrow character loader/component.

Possible structure:

```text
src/components/scene/characters/
├── RetroPlayer.tsx
├── useRetroPlayerAsset.ts
└── characterAssetContract.ts
```

Requirements:

- preload where useful,
- no repeated per-frame hierarchy searches,
- cache required bone/socket references after load,
- avoid unnecessary deep clones,
- support Player A/B variants cleanly.

Do not connect final clips to the narrative timeline until Phase 08.

---

## Fallback policy

If player GLB fails:

- fall back to the accepted Phase 06 low-poly R3F prototype,
- do not fall all the way back to the old balloon capsule unless there is no better safe fallback.

---

## Validation additions

Extend asset validation to check at least:

- player file exists,
- size budget,
- expected root/node prefix,
- animation count may be zero at this phase,
- no accidental huge textures,
- source kind is recognized.

---

## Acceptance criteria

Phase boundary: stop after Phase 07 asset and loader validation. Do not connect
final animation clips or begin Phase 08 without a new explicit request.

- [ ] `.bbmodel` source policy is documented.
- [ ] Player A and Player B calibration assets export from Blockbench.
- [ ] Stable node/bone/socket naming contract exists.
- [ ] Export scale/orientation matches the Phase 04 court without ad-hoc fixes.
- [ ] Existing optimization pipeline accepts Blockbench exports.
- [ ] Optimized character GLBs preserve required hierarchy names.
- [ ] Asset manifest records the new source kind.
- [ ] Runtime can load each static character with Phase 06 fallback.
- [ ] Character asset sizes meet documented budgets.
- [ ] No final animation/choreography work leaked into this phase.
