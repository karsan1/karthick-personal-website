# Phase 09 — Retro Environment Restyle

## Objective

Bring the court, stadium, props, scoreboard, and background into the same low-poly retro visual language as the new characters while preserving the accepted Phase 04 coordinate/loading contracts.

This is a progressive replacement phase. Do not delete all legacy environment assets first.

---

## Primary agents

- Asset owner: `asset_pipeline_engineer`
- Runtime owner: `scene_engineer`
- Performance review: `performance_engineer`
- QA: `qa_reviewer`

---

## Strategy: replace from most visible to least visible

Recommended order:

1. court surface/lines/net material treatment,
2. umpire chair + benches + nearby props,
3. scoreboard,
4. stadium shell,
5. distant crowd/background decoration.

At every step, the last accepted environment remains the fallback.

---

## Decide asset ownership by object type

Not every object needs Blockbench.

### Prefer procedural/R3F geometry for
- court plane,
- court lines,
- simple posts,
- simple shadow blobs,
- basic debug/calibration geometry.

### Prefer Blockbench for
- stylized scoreboard shell,
- umpire chair,
- benches,
- ball cart,
- distinctive courtside props,
- low-poly stadium architectural chunks where authored silhouette matters.

### Prefer instancing/cards for
- repeated seats,
- crowd silhouettes,
- repeated light fixtures,
- repeated signage geometry.

Do not convert everything to Blockbench merely for consistency.

---

## Preserve the Phase 04 spatial contract

Do not change without an explicit migration decision:

- application court center = `[0, 0, 0]`,
- court outer footprint aligns to current accepted geometry,
- net runs along X at `z = 0`,
- player baseline positions remain compatible,
- ball curves remain valid,
- camera keyframes remain approximately valid.

Retro style is not permission to break the coordinate system.

---

## Court visual direction

Target a stylized game-court look:

- simplified matte surface,
- clear high-contrast lines,
- limited surface color variation,
- optional tiny repeating texture only if it materially improves the result,
- no photoreal roughness/normal map requirement.

The court must remain readable behind portfolio content.

---

## Net

Avoid expensive dense net geometry.

Options:

1. low-density grid geometry,
2. alpha-mask texture on a simple plane if visually stable,
3. simplified stylized band/grid.

Choose based on production camera distance and aliasing behavior.

---

## Scoreboard

The scoreboard should become a key retro visual anchor.

Requirements:

- low-poly shell,
- clear rectangular silhouette,
- chapter/match information can be driven by runtime data,
- use short strings only,
- do not make it the only navigation mechanism,
- text implementation can be texture/SDF/HTML overlay depending performance and legibility.

Do not embed long portfolio content into the scoreboard.

---

## Stadium and crowd

Keep background deliberately lower fidelity than players/court.

Recommended crowd approaches:

- billboard/card silhouettes,
- instanced low-poly busts,
- baked/simple palette clusters.

Avoid hundreds of individually animated people.

Use depth and lighting to imply a venue without modeling every seat.

---

## Palette/material policy

Keep material families small:

- court,
- line/net light material,
- stadium dark/mid material,
- prop neutral,
- accent,
- crowd palette groups.

Prefer flat/faceted response where geometry benefits from it.

Do not apply the exact same flat material to everything; court readability and character silhouette still need hierarchy.

---

## Optional pixel-texture treatment

If tiny textures are added:

- author at low resolution,
- use nearest magnification where intentional,
- inspect shimmer/aliasing at distance,
- keep mipmaps if needed for stability,
- avoid introducing texture compression complexity until textures actually justify it.

---

## Progressive loading

Preserve the current environment staging:

- critical court first,
- nearby props next,
- scoreboard next,
- stadium/decorative detail later.

A failed decorative load must never remove the initial interaction.

---

## Legacy fallback policy

During migration:

```text
retro asset
  ↓ if load/error failure
accepted Phase 04 asset
  ↓ if unavailable
primitive fallback
```

Once retro assets are stable and accepted, simplify the chain if the legacy middle layer is no longer useful.

---

## Performance budgets

The new retro direction should be **cheaper or equal**, not more expensive.

Targets:

- maintain low material counts,
- environment partitions should remain comfortably within current practical transfer budgets unless a documented reason exists,
- repeated stadium/crowd elements should be instanced/reused,
- avoid adding large raster textures just because the source tool supports them.

Profile draw calls and GPU time before declaring the restyle complete.

---

## Acceptance criteria

Phase boundary: stop after Phase 09 environment and fallback validation. Do not
begin Phase 10 camera/game-feel work without a new explicit request.

- [ ] Environment visually matches the accepted retro player direction.
- [ ] Court dimensions and net alignment remain compatible with existing motion/camera data.
- [ ] Scoreboard has a deliberate retro-game visual identity.
- [ ] Stadium/crowd complexity remains subordinate to the court/players.
- [ ] Progressive asset loading behavior still works.
- [ ] Repeated decorative geometry is reused/instanced where valuable.
- [ ] Retro assets meet or improve Phase 04 performance characteristics.
- [ ] Legacy Phase 04 assets remain available until replacement validation is complete.
