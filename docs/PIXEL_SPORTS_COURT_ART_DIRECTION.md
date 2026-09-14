# Pixel-Sports Tennis Court Art Direction

## Purpose

This document is the visual target for the court/stadium work beginning in Phase 16.

The user-provided reference shows the desired **overall court read**: an elevated retro tennis-game view with a warm clay/brown court, bright white markings, dark green perimeter walls, colorful packed stands, courtside officials/props, simple advertising/signage blocks, and clearly readable players.

The website must **evoke that era and composition without copying a specific commercial game, court texture, character sprite, brand, sign, logo, or exact layout**.

The target is therefore:

> **A real interactive 3D tennis diorama presented with the visual discipline of a 16-bit / early-console sports game.**

The court should feel like the primary game screen, not a realistic stadium and not a modern low-poly architecture render.

---

## Non-negotiable first impression

On initial load, before the user reads anything substantial, the scene should communicate:

1. retro tennis game,
2. full court,
3. two players,
4. stadium/crowd,
5. interactive portfolio world.

The court must dominate the viewport.

The visual hierarchy should read approximately:

```text
COURT + PLAYERS            strongest
PERIMETER WALLS / NET      strong
CROWD / STANDS / SIGNAGE   supporting
PORTFOLIO IDENTITY UI      restrained
```

Do not let large typography obscure the baseline, service boxes, players, or scoreboard.

---

## Court palette

### Court surface

Move away from the current green court as the primary target.

Preferred family:

- burnt sienna,
- terracotta,
- warm clay brown,
- muted orange-brown.

Use a small number of stepped tones rather than smooth realistic shading.

Suggested starting palette family, to be visually tuned in-browser rather than copied literally:

```text
base clay       #9A5E32
light clay      #B07143
shadow clay     #754526
court line      #F4E7D0
```

The exact colors are not contractual. The **warm brown court against green venue walls** is contractual unless visual review proves another nearby palette reads better.

### Perimeter walls / barriers

Use dark saturated greens similar to old sports-game venue walls:

```text
deep green      #0F4D3A
mid green       #17664B
shadow green    #09362A
```

The wall should visually frame the court and separate the play surface from the stands.

### Net

The net should read much darker than the white court lines.

Preferred:

- near-black / charcoal mesh,
- pale top tape,
- chunky posts,
- visibly simplified geometry.

Avoid the current light semi-transparent net becoming visually washed out.

### Crowd

The crowd should provide controlled color noise:

- red,
- yellow,
- blue,
- teal,
- white,
- orange,
- dark clothing blocks.

Do not model individual people in detail.

Use repeated sprite/card/instanced silhouettes with a small palette so the stands feel packed from the gameplay camera.

---

## Court geometry and framing

Preserve regulation-inspired application coordinates and the existing deterministic rally contract, but compose the visible venue like a classic game screen.

The opening composition should show:

- both baselines,
- singles/doubles sidelines,
- service boxes,
- center service line,
- net,
- near player below or just inside the near baseline,
- far player near the upper baseline,
- a clear band of court surround,
- back wall/signage,
- crowd rising behind the far side.

The court should feel slightly compressed in depth rather than dramatically cinematic.

### Camera impression

Target an **elevated baseline broadcast/gameplay view** with limited perspective distortion.

The first implementation attempt should keep the current PerspectiveCamera architecture and achieve the look with:

- higher camera elevation,
- near-centered baseline placement,
- longer focal length / narrower FOV than a dramatic wide-angle camera,
- restrained yaw,
- court centered in frame,
- minimal horizon.

Only consider switching a chapter composition to orthographic projection if a measured visual prototype proves the perspective camera cannot achieve the target without breaking existing camera ownership or interactions.

Do not introduce a second camera owner.

---

## Pixel / low-resolution presentation

The DOM must remain crisp and full-resolution.

The 3D scene may intentionally use a controlled low-resolution presentation to strengthen the 16-bit feel.

Preferred order of experiments:

1. flat materials + limited palette + stepped animation,
2. reduced Canvas DPR / rendering resolution on a dedicated visual mode,
3. disable or reduce antialiasing if visual review improves the look,
4. CSS `image-rendering` experiment only if browser behavior is stable,
5. custom render-target pixelation only if the first four options are insufficient and performance remains acceptable.

Do **not** add a post-processing dependency just to say the scene is pixelated.

Any scene pixelation must:

- affect only WebGL,
- preserve pointer hit accuracy,
- preserve DOM readability,
- preserve quality tiers,
- not introduce shimmering severe enough to hurt motion readability.

---

## Lighting and shading

Use lighting to separate forms, not to create realism.

Preferred treatment:

- mostly flat/faceted materials,
- very soft or simplified shadows,
- restrained specular response,
- no glossy court,
- no cinematic HDR look,
- no bloom,
- no atmospheric fog that obscures court markings.

The environment should look intentionally graphic.

If realistic shadow gradients fight the pixel-sports look, prefer simpler baked-looking value separation or reduced shadow quality over adding more lights.

---

## Stadium structure

The venue should be visually dense but geometrically cheap.

### Back wall

The far side should contain a readable green wall/barrier with:

- simple original sign panels,
- scoreboard/project destination integrated into the venue,
- no copied real-world sponsor names or logos.

### Side walls

Use green retaining walls/fences that guide the eye toward the court.

### Stands

Prefer stepped seating terraces or low-poly slabs.

The stands should be most visually populated behind the far baseline and along side bands rather than surrounding the camera with large realistic architecture.

### Crowd

Use one of:

- instanced low-poly silhouettes,
- low-resolution sprite cards,
- small palette billboard clusters,
- mixed cards + geometry.

Crowd movement should be minimal or absent during Phase 16.

### Officials / courtside props

The reference is effective partly because small recognizable court roles make the scene feel like a game venue.

Useful original props:

- umpire chair,
- courtside bench,
- ball basket / equipment stack,
- ball-person silhouette/card,
- towel / water container,
- rackets,
- line-official style silhouettes if performance permits.

These should also help support portfolio station metaphors from Phase 16.

---

## Signage

Use signage as atmosphere and portfolio affordance, not decoration copied from the reference.

Allowed:

- fictional sponsor-like color blocks,
- generic tennis motifs,
- project names on the project scoreboard,
- short labels like `PROJECTS`, `MATCH`, `PLAYER 01`, `RESEARCH`,
- simple original iconography.

Avoid:

- real sponsor logos unless explicitly licensed/desired,
- copying sign placement one-for-one,
- copying fonts, brand color combinations, or text from the supplied reference.

---

## Player presentation

The players must read from the gameplay camera as compact retro tennis figures.

The scene should make them feel closer to classic sprite silhouettes even if they remain 3D GLB characters.

Priorities:

1. pose,
2. racket silhouette,
3. shirt/shorts color blocking,
4. hair/head silhouette,
5. limb readability,
6. facial detail last.

Use stepped animation and limited material colors.

Do not chase realistic anatomy or skin shading.

Phase 19 remains the final human-authored character pass, but Phase 16 visual work must already test the existing players against the new court palette and gameplay camera.

---

## Relationship to portfolio stations

The venue stations must look like normal court/stadium elements first and navigation targets second.

Examples:

- Karthick player → About,
- bench → Experience,
- umpire/strategy area → Research,
- scoreboard → Projects,
- equipment rack → Capabilities,
- tunnel/exit → Contact,
- clipboard/placard → Résumé.

Do not add floating glowing holograms that break the 16-bit sports-game illusion.

Use small color/value changes, short labels, pointer cursor, or restrained projected DOM labels for interaction feedback.

---

## Quality tiers

### High

- full crowd density,
- complete venue signs,
- highest allowed court/prop detail,
- optional scene-resolution experiment if visually accepted.

### Medium

- slightly reduced crowd density,
- same court/walls/net readability,
- preserve all world stations.

### Low

- court, walls, net, players, scoreboard, and required station silhouettes remain,
- reduce crowd and decorative props first,
- never remove a required navigation destination.

---

## Visual review frames

Phase 16 and later visual reviews must capture at least:

1. initial full-court desktop view,
2. initial mobile portrait view,
3. About/player station,
4. Experience/bench station,
5. Research/umpire station,
6. Projects/scoreboard station,
7. Contact/end-state view.

The initial full-court view is the primary art-direction gate.

---

## Acceptance test for the supplied-reference direction

A reviewer who has seen the supplied reference should be able to say all of the following without being told:

- “This reads like an old console tennis game.”
- “The warm clay court is the main thing I see.”
- “The dark green court walls and colorful stands frame it.”
- “Both players and the net are immediately readable.”
- “It is clearly an original 3D website, not a screenshot or clone of a specific game.”

If the scene instead reads as a modern low-poly green tennis stadium, this art-direction goal has not been met.
