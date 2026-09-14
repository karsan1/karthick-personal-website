# Retro Art Direction

## Purpose and current target

The portfolio combines a crisp, professional DOM interface with an interactive retro 3D tennis world.

The current target has evolved from a general PS1/N64 low-poly look toward a more specific **16-bit / early-console sports-game presentation translated into real-time 3D**.

The world should evoke classic tennis-game composition and color discipline without reproducing a specific commercial game's characters, branding, sprites, signs, court texture, or interface.

The visual goal is now:

```text
REAL 3D WORLD
+ elevated gameplay camera
+ low-poly / sprite-like forms
+ limited palette
+ warm clay court
+ dark green venue walls
+ colorful crowd blocks
+ stepped character animation
+ optional controlled low-resolution WebGL presentation
= pixel-sports tennis diorama
```

The semantic DOM remains modern, crisp, readable, and full-resolution.

For the detailed court/stadium target beginning in Phase 16, also read:

- `docs/PIXEL_SPORTS_COURT_ART_DIRECTION.md`

That file is the more specific source of truth for court palette, venue composition, crowd/signage treatment, and opening-frame review.

---

## Visual hierarchy

The 3D tennis world is now the primary visual/navigation surface.

Opening hierarchy:

1. court + players,
2. net + venue walls,
3. stands/crowd/signage,
4. contextual portfolio UI.

Do not let oversized DOM content hide the court.

The scene should read as a deliberate game screen rather than a generic WebGL background.

---

## Character silhouette

- Build recognizable head, torso, shoulder/hip structure, upper/lower limbs, and shoes.
- Simplified hands/faces are preferred over fragile detail.
- Use angular, tapered, planar, or sprite-like silhouettes rather than round capsule construction.
- Make joints readable throughout serve, ready, forehand, return, recovery, and idle poses.
- Exaggerate poses when it improves gameplay-camera readability.
- Make racket head, handle, orientation, and hand attachment readable in the full-court composition.
- Judge character proportions in the application camera, not only in Blockbench.

The new court/camera direction should make final players feel closer to compact classic tennis sprites even though they remain true 3D assets.

---

## Geometry and rig budgets

Initial budget per player:

- 500–1,500 triangles preferred,
- 2,500 triangles hard review threshold unless a visible application-camera benefit is demonstrated,
- one skeleton per character,
- few meshes/material slots,
- stable/documented root, node, bone, clip, racket-socket, and material names.

Spend geometry on silhouette, articulation, and racket readability before sub-pixel detail.

---

## Texture and palette budgets

Textures remain optional.

Prefer:

- vertex/material colors,
- small palette maps,
- low-resolution sprite/card textures for crowds or selected signage where justified.

Recommended character/environment texture scale when raster detail is actually needed:

- 32×32,
- 64×64,
- 128×128,
- 256×256 maximum for ordinary retro assets unless review proves a larger source is needed.

Use nearest-neighbor magnification for deliberately pixelated textures.

Avoid:

- realistic skin/hair maps,
- 1K/2K environment detail by default,
- 4K textures,
- fragmented atlases and many material slots.

KTX2/Basis remains optional until texture count/size justifies it.

---

## Court and venue palette

The Phase 16+ default visual family is:

- warm clay/brown play surface,
- bright cream/white court lines,
- dark saturated green perimeter walls,
- dark net mesh with light top tape,
- colorful compact crowd palette,
- simple original sign panels.

The previous green court should remain only as historical/fallback work unless a later visual comparison intentionally restores it.

---

## Shading and materials

Prefer:

- flat/faceted shading,
- stepped value separation,
- restrained or absent specular response,
- simple shared materials,
- clear silhouettes over realism.

Avoid:

- glossy toy/plastic materials,
- photoreal clay,
- HDR/cinematic stadium lighting,
- bloom,
- atmospheric fog that weakens court-line readability,
- excessive soft shadow gradients.

Lighting should separate forms rather than advertise rendering sophistication.

---

## Pixel / low-resolution scene presentation

The previous blanket rule against global scene pixelation is superseded by a more precise rule:

> **Controlled pixelation is allowed for the WebGL world if it strengthens the pixel-sports presentation and does not degrade DOM readability, interaction accuracy, or performance.**

Experiment in this order:

1. limited palette and flat materials,
2. stepped animation,
3. sprite/card crowd treatment,
4. reduced Canvas DPR or internal render resolution,
5. antialiasing changes,
6. render-target pixelation only if simpler methods are insufficient.

Do not add a post-processing dependency without a measured need.

The DOM itself must never be rasterized or intentionally blurred/pixelated.

---

## Crowd and signage

Crowds should read as colorful packed stands from the gameplay camera, not individual people.

Preferred:

- instanced silhouettes,
- billboard/sprite cards,
- repeated palette variants,
- stepped seating slabs.

Signage should use original/generic motifs or portfolio labels.

Do not copy commercial sponsor logos, text, sign layouts, or fonts from the user's visual reference.

---

## Motion contract

The master scroll, ball, and camera remain deterministic and reversible.

Character clips may intentionally use stepped playback. The new visual target favors comparison around roughly **12–18 fps**, with the final value chosen by application-camera review and hit-contact stability.

Only character posing is stepped unless a later phase explicitly proves another choice.

Ball, camera, and master scroll remain smooth.

No physics engine is introduced for rally synchronization.

Reduced-motion mode retains stable readable compositions without cinematic movement.

---

## Camera language

The default presentation now favors classic gameplay/broadcast composition:

- elevated baseline view,
- near-centered court,
- limited horizon,
- restrained perspective distortion,
- longer focal length / narrower FOV than a cinematic wide-angle view,
- limited camera orbiting.

Phase 17 owns the full choreography.

The first implementation attempt should preserve the current PerspectiveCamera architecture. Orthographic projection is only considered after a visual prototype proves it materially improves the target without creating a second camera-ownership path.

---

## DOM and WebGL boundary

- Portfolio, résumé, project, research, experience, and contact copy remains semantic HTML.
- Never rasterize meaningful copy into textures.
- Never require raw WebGL interaction to reach important content.
- Do not use pixel fonts for long-form body copy.
- Retro styling is appropriate for short labels, scoreboard text, station markers, tiny status copy, and restrained accents.
- DOM focus indicators and navigation remain crisp and accessible.

---

## Authoring and migration boundary

Blockbench remains preferred for new characters and appropriate small/medium retro assets.

GLB remains the runtime interchange format.

The Phase 04 Blender court/stadium/prop/scoreboard sources and optimized GLBs remain a supported fallback while runtime/build references still depend on them.

Do not delete legacy assets merely because the primary procedural court changes appearance.

---

## Phase 06 prototype decision retained

The accepted direct-R3F prototype established the technical character contract: articulated angular players, wrist-attached rackets, deterministic ref-driven posing, and stepped animation.

Those contracts remain valid.

The visual benchmark changes: later phases must judge those characters against the new clay court, green venue walls, colorful stands, and elevated game-camera composition rather than the former modern green stadium presentation.

---

## Review checklist

- The scene reads as an original old-console tennis game translated into interactive 3D.
- The opening frame is court-first.
- The court is warm clay/brown and framed by green venue walls.
- Crowd/signage create colorful retro stadium density without detailed realism.
- Net, both players, and racket silhouettes read immediately.
- Character animation feels intentionally stepped rather than broken.
- Any pixelation affects WebGL only and preserves pointer/DOM quality.
- The professional portfolio content remains semantic and readable.
- No authored asset copies a specific commercial tennis game's protected art/branding.
