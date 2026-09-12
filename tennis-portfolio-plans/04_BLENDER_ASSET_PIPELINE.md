# Phase 04 — Blender & 3D Asset Pipeline

## Objective
Replace primitives with an optimized, coherent tennis environment while preventing asset-size and draw-call problems.

## Deliverable
Production court/environment GLBs exported from Blender under documented conventions and optimized for web delivery.

---

## Art direction
Target: **stylized editorial realism**.

Characteristics:
- correct court proportions,
- convincing sports equipment,
- clean silhouette,
- moderate geometric detail,
- subtle texture detail,
- matte/semi-matte physical materials,
- restrained color palette,
- no hyper-detailed skin or uncanny close-up faces,
- visual quality primarily from lighting/composition/motion.

---

## Blender scene organization

```text
TennisPortfolio.blend
├── ENV_Court
├── ENV_Net
├── ENV_Stadium
├── ENV_UmpireChair
├── ENV_Benches
├── ENV_Scoreboard
├── PROP_Rackets
├── PROP_Balls
├── PROP_BallCart
├── CHAR_PlayerA
├── CHAR_PlayerB
├── CHAR_Umpire
├── LIGHT_References
└── CAMERA_References
```

Use stable names. Never export `Cube.042` into production.

---

## Unit/origin standards
- Blender unit scale consistent with prototype world scale.
- Z-up in Blender will be converted appropriately for glTF; verify orientation after export.
- Court center maps to application origin.
- Pivot/origin for moving props is intentional.
- Character root bones sit at ground level.
- Tennis ball origin at geometric center.
- Racket origin matches hand-grip attachment point.

Create a tiny calibration export early and verify it overlays the primitive court exactly.

---

## Asset partitioning
Do **not** export the entire experience as one giant opaque GLB unless profiling proves that optimal.

Recommended groups:
- `court.glb`
- `stadium-shell.glb`
- `props.glb`
- `scoreboard.glb`
- `player-a.glb`
- `player-b.glb`
- `umpire.glb`

This permits progressive loading and quality variants.

---

## Geometry policy
- reuse repeated chairs/balls/fixtures where possible,
- instance repeated stadium elements in Three.js when practical,
- remove hidden geometry,
- merge static meshes when it reduces draw calls without destroying material reuse,
- avoid subdivision that does not affect silhouette at expected camera distance,
- use LOD for large complex objects only when profiling justifies it.

---

## Materials
Keep material count low.

Suggested material families:
- court surface,
- white line paint,
- net,
- metal/plastic stadium hardware,
- dark stadium shell,
- player clothing A/B,
- skin/hair simplified,
- racket frame/strings,
- ball felt.

Prefer texture atlases for related static props if they materially reduce draw calls.

---

## Texture budget
Start conservative:
- 2K only for visually important large surfaces when actually visible,
- 1K for most hero props/characters,
- 512 or lower for distant props,
- no 4K texture without a documented reason.

Use KTX2/Basis for production GPU texture compression once the material pipeline is stable.

---

## Export rules
Export glTF/GLB with:
- transforms applied when safe,
- animations only for animated assets,
- unused cameras/lights excluded unless intentionally consumed,
- mesh names preserved,
- tangent data only where needed,
- material setup verified in a test browser scene.

---

## Optimization pipeline
Add CLI tooling so optimization is reproducible, not manual.

Suggested pipeline:

```text
Blender export
   ↓
source GLB
   ↓
gltf-transform inspect
   ↓
prune / dedup / weld where appropriate
   ↓
meshopt compression
   ↓
texture resize/compression
   ↓
production GLB
```

Keep source exports separate from optimized public assets.

Suggested folders:

```text
assets-source/
public/models/
scripts/optimize-assets.*
```

Never hand-edit the optimized artifact as the source of truth.

---

## Loading strategy
Priorities:
1. court + ball + basic player silhouettes,
2. hero character animation essentials,
3. scoreboard / important props,
4. stadium detail,
5. decorative assets.

Use Suspense/progressive loading rather than blocking the entire page on decorative geometry.

---

## Acceptance criteria
- [x] Blender coordinates align with prototype court.
- [x] Stable naming convention documented.
- [x] Environment split into sensible GLBs.
- [x] Optimization script is reproducible.
- [x] Texture dimensions follow budgets.
- [x] Decorative assets do not block initial interaction.
- [x] No obvious visual downgrade from optimization at expected camera distance.
