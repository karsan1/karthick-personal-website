# Phase 19 — Final Retro Player Art & Interaction Polish

## Objective

Replace the generated/calibration-feeling players with final human-authored retro tennis characters and make the Karthick-side player a polished About interaction target.

This phase exists because the current repository explicitly notes that the checked-in animated GLBs are calibration fixtures pending human-authored visual approval. The 3D-first redesign will fail visually if the characters remain obviously placeholder/blocky.

---

## Primary agents

- Owner: `asset_pipeline_engineer`
- Runtime integration: `scene_engineer`
- Animation sync: `motion_engineer`
- Review: `qa_reviewer`

---

## Art direction

Target:

- PS1/N64/early-2000s sports-game influence,
- clearly human tennis silhouettes,
- angular low-poly anatomy,
- faceted shading,
- deliberate proportions,
- expressive pose readability,
- chunky but recognizable racket,
- simple face/hair/clothing details,
- no balloon/capsule construction in the final visible asset.

Do not copy a specific game character or branded uniform.

---

## Tooling

Use Blockbench as the preferred authoring tool for final character work.

Keep:

- GLB runtime format,
- existing stable node/socket/clip contract where practical,
- Meshopt optimization,
- asset validation,
- application-owned court placement,
- existing fallback prototypes during load/failure.

Blender is not required for this character phase unless a specific technical blocker is documented.

---

## Karthick-side visual identity

The portfolio-owner player should be distinct through simple design choices:

- shirt/shorts palette,
- hair silhouette,
- wristband/headband/trim if tasteful,
- slightly different racket or shoe accent,
- coherent silhouette at camera distance.

Do not make the character photorealistic and do not rely on facial likeness.

The visitor only needs to understand: “this player represents Karthick.”

---

## Opponent design

The opponent should complement the scene and remain visually subordinate to the portfolio-owner player.

Requirements:

- contrasting palette,
- similarly polished low-poly construction,
- no villain cliché,
- no portfolio destination unless intentionally added later.

---

## Animation requirements

Retain or re-author the required clip set for deterministic timeline scrubbing.

At minimum:

- `idle_ready`,
- serve/receive-ready behavior,
- forehand/return beats used by the rally,
- recovery,
- between-point idle.

Animation should read at the existing stepped sampling style while preserving contact timing.

Ball and camera remain smooth.

---

## About interaction polish

The Karthick player hotspot must work with the final character asset.

Requirements:

- invisible interaction proxy at player-root level,
- hover cue does not distort or interrupt the animation,
- selected About state can add a restrained acknowledgement pose or material cue,
- camera remains timeline-owned,
- no clickable individual limbs,
- touch target remains generous.

A short projected label such as `ABOUT / PLAYER 01` is acceptable on hover/selection.

---

## Material/texture policy

Prefer:

- vertex colors,
- flat/faceted material colors,
- very small palette textures only if they materially improve the result.

Avoid large character textures and realistic skin/hair maps.

If textures are introduced, update optimization/validation and performance documentation accordingly.

---

## Asset validation

Update the pipeline so final assets validate:

- expected roots/nodes,
- racket socket/pivot stability,
- exact required clips,
- nonzero clip durations,
- root-motion constraints,
- triangle/byte budgets,
- Meshopt payload,
- material count,
- texture policy,
- manifest source kind.

Do not label calibration fixtures as final art.

---

## Visual review gates

Review the final characters from:

1. opening full-court view,
2. About medium shot,
3. rally contact frame,
4. Experience/Research side compositions,
5. mobile portrait view,
6. reduced-motion idle state.

The player must read well from the actual website cameras, not only inside Blockbench.

---

## Acceptance criteria

- [ ] Final production player assets are human-authored and visually approved.
- [ ] The balloon/capsule-placeholder feeling is gone.
- [ ] Karthick and opponent are clearly distinguishable.
- [ ] Tennis pose/racket silhouette reads at normal camera distance.
- [ ] Existing rally contacts remain synchronized.
- [ ] Player hotspot remains stable across clips.
- [ ] Final assets pass the optimization and validation pipeline.
- [ ] Performance remains within documented budgets.
- [ ] Calibration fixtures are clearly archived/reclassified and not presented as production art.

Stop after final player art and interaction acceptance. Release hardening belongs to Phase 20.
