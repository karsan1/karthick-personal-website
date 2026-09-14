# Phase 19 — Final Pixel-Sports Player Art & Interaction Polish

## Objective

Replace the generated/calibration-feeling players with final human-authored retro tennis characters that visually belong in the Phase 16 clay-court pixel-sports venue, while keeping the Karthick-side player a polished About interaction target.

The repository still treats the checked-in animated GLBs as calibration fixtures pending human visual approval. The 3D-first redesign is not visually complete until the players read like intentional old-console tennis characters from the actual gameplay camera.

Read before implementation:

- `docs/RETRO_ART_DIRECTION.md`
- `docs/PIXEL_SPORTS_COURT_ART_DIRECTION.md`

---

## Primary agents

- Owner: `asset_pipeline_engineer`
- Runtime integration: `scene_engineer`
- Animation sync: `motion_engineer`
- Review: `qa_reviewer`

---

## Updated art direction

The previous broad PS1/N64 target is narrowed.

Target now:

> **A compact 3D tennis character whose silhouette and color blocking read like a classic 16-bit sports-game sprite from the elevated gameplay camera.**

This does **not** mean replacing the runtime with a copied sprite sheet from a commercial game.

Prefer:

- chunky readable silhouette,
- limited color blocks,
- simple hair/head shape,
- clear shirt/shorts/shoe separation,
- racket that reads strongly at full-court distance,
- stepped animation,
- very little facial detail,
- flat/faceted materials,
- subtle asymmetry to avoid mannequin feel.

Avoid:

- balloon/capsule bodies,
- realistic skin shading,
- glossy toy-like materials,
- detailed face textures,
- modern AAA proportions/detail,
- Minecraft/voxel proportions,
- direct reproduction of any game character or sprite.

---

## Tooling

Blockbench remains the preferred authoring tool for final characters.

Keep:

- GLB runtime format,
- stable root/node/socket/clip contract where practical,
- Meshopt optimization,
- asset validation,
- application-owned court placement,
- Phase 06 prototype fallback during load/failure.

Blender is not required unless a documented technical blocker appears.

---

## Design for the actual gameplay camera

The final player must be authored against the Phase 17 camera, not a close-up authoring viewport.

Primary review distance is the full-court elevated baseline composition.

At that distance, prioritize:

1. head/hair silhouette,
2. torso color block,
3. shorts/legs separation,
4. racket orientation,
5. pose exaggeration,
6. facial detail last.

If a detail disappears at the gameplay camera, remove/simplify it instead of adding more polygons.

---

## Karthick-side visual identity

The portfolio-owner player should be recognizable through simple original styling:

- distinctive shirt/shorts palette,
- hair silhouette,
- optional wristband/headband/trim,
- subtle shoe or racket accent,
- consistent palette across all clips.

Do not rely on facial likeness.

The visitor only needs to understand that Player 01 represents Karthick.

The palette must contrast clearly against:

- warm clay court,
- dark green walls,
- colorful crowd.

---

## Opponent design

The opponent should use a contrasting but harmonious limited palette.

Requirements:

- same quality bar,
- different silhouette/color read,
- no villain styling,
- no portfolio destination unless intentionally added later,
- remains readable against both court and wall backgrounds.

---

## Animation requirements

Retain or re-author the deterministic clip set.

At minimum:

- `idle_ready`,
- serve/receive-ready behavior,
- forehand/return beats used by the rally,
- recovery,
- between-point idle.

### Sampling style

The new visual target favors an explicit comparison among:

- 12 fps,
- 15 fps,
- 18 fps.

Choose the lowest rate that still preserves readable contact poses and does not make the player feel broken.

Do not step the ball or camera merely to imitate old hardware.

Ball and camera remain smooth.

---

## Sprite-like illusion without replacing 3D

The goal is to make a 3D character **read** like a sprite at gameplay distance.

Preferred methods:

- limited palette,
- flat lighting,
- stepped pose sampling,
- simplified silhouette,
- controlled low-resolution WebGL presentation from Phase 16,
- low-detail materials.

Do not switch to billboard-only player sprites unless a later explicit prototype proves that the 3D approach cannot achieve the target. Billboard sprites would complicate side compositions, About interaction, and animation/camera consistency, so they are not the default plan.

---

## About interaction polish

The Karthick player hotspot must remain stable across the final asset.

Requirements:

- invisible generous root-level proxy,
- hover cue does not deform/interfere with animation,
- selected About state may use a tiny palette/value lift or short acknowledgement pose,
- camera remains timeline-owned,
- no clickable limbs,
- touch target remains generous,
- projected label such as `ABOUT / PLAYER 01` is acceptable on hover/selection.

The interaction cue must not break the old-console sports-game illusion with neon outlines or modern holographic effects.

---

## Material / texture policy

Prefer:

- vertex colors,
- flat material colors,
- tiny palette textures only if necessary.

If a character texture is used, start at 32×32 or 64×64 and increase only if the application-camera comparison proves it necessary.

Nearest-neighbor treatment is appropriate for deliberately pixelated maps.

Avoid:

- large skin/hair textures,
- realistic normal maps,
- multiple high-resolution material atlases.

If textures are introduced, update optimization/validation and performance documentation.

---

## Asset validation

Final assets must validate:

- expected roots/nodes,
- racket socket/pivot stability,
- exact required clips,
- positive clip durations,
- root-motion constraints,
- triangle/byte budgets,
- Meshopt payload,
- material count,
- texture policy,
- manifest source kind.

Calibration fixtures must not be labeled as final art.

---

## Visual review gates

Review at minimum:

1. full-court Hero gameplay view,
2. About medium crop,
3. rally contact frame,
4. Experience sideline composition,
5. Projects/scoreboard composition,
6. mobile portrait Hero,
7. reduced-motion idle state.

For each frame verify:

- player does not disappear into clay court,
- racket is visible,
- limbs read clearly,
- Karthick/opponent are distinguishable,
- character feels consistent with crowd/walls/signage palette.

---

## Acceptance criteria

- [ ] Final production player assets are human-authored and visually approved.
- [ ] Balloon/capsule placeholder feeling is gone.
- [ ] Players read like compact old-console tennis characters from the elevated gameplay camera.
- [ ] Karthick and opponent are immediately distinguishable by silhouette/color.
- [ ] Racket and tennis pose read at full-court distance.
- [ ] Stepped animation rate is chosen by visual/contact comparison.
- [ ] Existing rally contacts remain synchronized.
- [ ] Player hotspot remains stable across clips.
- [ ] Final assets pass optimization/validation.
- [ ] Player materials/textures respect the pixel-sports palette policy.
- [ ] Performance remains within documented budgets.
- [ ] No commercial game character/sprite is copied.

Stop after final player art and interaction acceptance. Release hardening belongs to Phase 20.
