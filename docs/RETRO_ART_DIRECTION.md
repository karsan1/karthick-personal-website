# Retro Art Direction

## Purpose and target

The portfolio combines a crisp, professional DOM interface with a deliberately
low-poly 3D tennis world. The world may evoke the broad visual language of
PS1/N64-era and early-2000s sports games, but it must not reproduce a specific
game's characters, branding, court, interface, or other protected design.

The target is faceted early-3D form, not voxel art, Minecraft-like construction,
literal pixel art, photorealism, or a novelty arcade page. Tennis must remain
immediately recognizable at the normal authored camera distances. The visual
hierarchy is silhouette first, pose second, lighting and palette third, with
surface detail last.

## Character silhouette

- Build recognizable head, torso, shoulder/hip structure, upper and lower arms,
  upper and lower legs, and shoe forms.
- Simplified hands and faces are acceptable; faces remain secondary at gameplay
  distance.
- Use angular, tapered, or planar forms. Round capsule limbs must not dominate
  the final visual language.
- Keep joints readable throughout serve, ready, forehand, backhand, and recovery
  poses. Exaggeration is welcome when it improves pose recognition.
- Make the racket head, handle, orientation, and hand attachment readable in the
  normal court compositions. A chunky silhouette is preferable to fragile detail.
- Judge proportions and poses in the application camera, not only in an authoring
  tool close-up.

## Geometry and rig budgets

Initial budget per player:

- 500–1,500 triangles preferred;
- 2,500 triangles is a hard review threshold and requires a demonstrated visual
  benefit at the real camera distance;
- one skeleton per character;
- as few separate meshes and material slots as practical;
- stable, documented node, bone, clip, racket-socket, and root names.

Geometry should spend triangles on the outer silhouette, joint articulation, and
racket readability before hidden or sub-pixel detail. Mirrored/reused geometry is
encouraged when it does not harm authored asymmetry or animation.

## Texture and palette budgets

Textures are optional. Prefer material colors or a small palette/atlas when they
are sufficient.

- Prefer 64×64, 128×128, or 256×256 palette or character textures.
- Use nearest-neighbor magnification only for maps intended to look pixelated;
  visually review minification and mip behavior at gameplay distance.
- A 1K or 2K character texture requires an explicit visual comparison proving
  that smaller maps are insufficient.
- Do not use 4K character textures.
- Keep the palette limited and coherent, with one principal accent family.
- Minimize material slots and avoid small, fragmented textures.

KTX2/Basis remains optional until raster textures exist and a visual comparison
shows it is justified. Runtime derivatives continue through the established glTF
Transform and Meshopt pipeline.

## Shading and materials

- Characters use flat or intentionally faceted shading.
- Keep specular response restrained; avoid glossy toy/plastic surfaces unless a
  specific prop calls for them.
- Court and environment materials should be simple, readable, and shared where
  practical.
- Prefer strong shape, composition, and controlled lighting over texture detail.
- Post-processing must be restrained. Do not use a global pixel-art treatment to
  disguise unclear geometry or degrade the surrounding interface.

## Motion contract

The master scroll, tennis ball, and camera remain smooth, deterministic, and
reversible. Character clips may be sampled intentionally at a configurable
12–18 animation frames per second while their placement remains synchronized to
the smooth master timeline. Stepping is an aesthetic treatment, not permission
for timing drift.

All tennis poses and hit moments remain authored. Do not add a physics engine for
rally synchronization. Reduced-motion mode must retain a readable resting
composition without requiring cinematic movement.

## DOM and WebGL boundary

- Portfolio, résumé, project, and contact copy remains semantic HTML.
- Never rasterize meaningful copy into the scene or require WebGL interaction to
  reach it.
- Do not use pixel fonts for long-form résumé or project text.
- Retro treatments may appear in the in-world scoreboard, chapter indicators,
  micro-labels, and restrained accents.
- Global pixelation, low-resolution rendering, or post-processing must not reduce
  DOM readability, focus visibility, or accessibility.

## Authoring and migration boundary

Blockbench and committed `.bbmodel` sources are preferred for new characters and
appropriate small/medium low-poly assets. GLB remains the runtime contract, so
runtime loaders do not depend on the authoring application.

The Phase 04 Blender court, stadium, prop, and scoreboard sources, exports, and
optimized GLBs remain accepted transitional production assets. Preserve their
stable names, coordinate system, progressive loading, fallbacks, Meshopt decoding,
validation, and budgets until a later phase supplies and validates replacements.
Phase 05 does not replace assets or alter the runtime scene.

## Review checklist

- The scene reads as retro early-3D tennis rather than voxel art or photorealism.
- Character and racket silhouettes read at the real application camera distance.
- Geometry, material-slot, and texture budgets are met or exceptions are recorded.
- Ball/camera motion remains smooth and character stepping does not change hits.
- The professional DOM interface remains crisp, semantic, and accessible.
- No visual or authored asset copies a specific commercial tennis game.
