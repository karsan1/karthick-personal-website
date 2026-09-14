# Pixel-Sports Tennis Court Art Direction

## Purpose

This document is the visual target for the court/stadium work beginning in Phase 16.

The user-provided retro tennis reference still defines the desired **overall game-screen composition**: elevated baseline view, full-court readability, two players, net, packed stands, courtside officials/props, simple signage blocks, and a compact old-console sports-game presentation.

The **surface and venue color direction is intentionally different from that reference**. The target is now a **Wimbledon-inspired traditional grass-court look** rather than a clay court.

The website must evoke the atmosphere of a classic grass-court tournament without copying Wimbledon branding, logos, exact signage, fonts, protected marks, or a specific commercial game's assets.

The target is therefore:

> **A real interactive 3D grass-court tennis diorama presented with the visual discipline of a 16-bit / early-console sports game.**

The court should feel like the primary game screen, not a realistic stadium and not a modern low-poly architecture render.

---

## Non-negotiable first impression

On initial load, before the user reads anything substantial, the scene should communicate:

1. retro tennis game,
2. traditional grass court,
3. two players,
4. tournament venue/crowd,
5. interactive portfolio world.

The court must dominate the viewport.

The visual hierarchy should read approximately:

```text
GRASS COURT + PLAYERS       strongest
NET + DEEP-GREEN SURROUNDS  strong
CROWD / STANDS / SIGNAGE    supporting
PORTFOLIO IDENTITY UI       restrained
```

Do not let large typography obscure the baseline, service boxes, players, or scoreboard.

---

## Court palette

### Grass playing surface

Do not use the clay/brown palette from the supplied reference.

The primary court should read as a classic tournament grass surface using a limited family of natural greens.

Suggested starting palette family, to be tuned in-browser rather than copied literally:

```text
grass base         #557A3D
grass light stripe #668A49
grass dark stripe  #476B35
worn grass         #8B8A5A
court line         #F4F1E7
```

The exact colors are not contractual. The requirements are:

- grass must be visibly lighter and more natural than the current dark-green low-poly court,
- court lines must be crisp white/cream,
- alternating mowing bands should help communicate grass without requiring a realistic texture,
- optional worn baseline/service-area patches may use a muted olive/tan tone,
- the surface must remain graphic and readable from the gameplay camera.

Prefer geometry/material bands, vertex colors, or a tiny palette texture over a large photoreal grass map.

### Court surround / perimeter walls

Use deeper tournament greens around the brighter grass court so the playing surface remains distinct.

Suggested family:

```text
deep surround green #154734
mid surround green  #1E5A40
shadow green        #0B2F23
```

Use these for:

- retaining walls,
- courtside barriers,
- umpire/bench structures where appropriate,
- tunnel/exit architecture,
- selected scoreboard framing.

The surround should visually frame the court rather than blend into the grass.

### Purple accent

A restrained purple accent may be used to evoke a traditional grass-tournament color contrast without reproducing Wimbledon branding.

Suggested use:

- tiny sign trim,
- selected scoreboard accents,
- small station markers,
- subtle UI/world detail.

Suggested starting family:

```text
purple accent #5E3F77
purple light  #74558D
```

Purple is **supporting only**. Do not turn the stadium into a purple theme and do not copy official Wimbledon logo treatments or wordmarks.

### Net

The net should read darker than the court lines.

Preferred:

- black/charcoal mesh,
- crisp white or cream top tape,
- chunky dark posts,
- visibly simplified geometry.

Avoid a pale semi-transparent net disappearing against the court.

### Crowd

The crowd should provide controlled color noise while the venue architecture stays green-led.

Use a compact palette such as:

- white/cream,
- navy,
- burgundy,
- muted red,
- teal,
- yellow accents,
- restrained purple,
- dark clothing blocks.

Do not model individual spectators in detail.

---

## Grass-court visual cues

The court must read as grass even with retro graphics.

Use several of these cues together:

- alternating longitudinal or broad mowing bands,
- slightly softer green variation inside the court than the deep surround walls,
- subtle lighter wear near baselines and service areas,
- extremely crisp white lines,
- clean tournament-style court furniture,
- dark green walls/barriers around the playing area.

Avoid:

- photoreal grass blades,
- noisy procedural texture,
- glossy turf,
- bright artificial-turf neon green,
- clay dust or orange/brown surface coloring.

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
- a clear grass-court surround,
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

Only consider orthographic projection if a measured visual prototype proves the perspective camera cannot achieve the target without breaking existing camera ownership or interactions.

Do not introduce a second camera owner.

---

## Pixel / low-resolution presentation

The DOM must remain crisp and full-resolution.

The 3D scene may intentionally use a controlled low-resolution presentation to strengthen the old-console feel.

Preferred order of experiments:

1. flat materials + limited palette + stepped animation,
2. strong grass/surround color blocking,
3. reduced Canvas DPR / rendering resolution on a dedicated visual mode,
4. disable or reduce antialiasing if visual review improves the look,
5. CSS `image-rendering` experiment only if browser behavior is stable,
6. custom render-target pixelation only if simpler methods are insufficient and performance remains acceptable.

Do **not** add a post-processing dependency just to make the scene pixelated.

Any scene pixelation must:

- affect only WebGL,
- preserve pointer hit accuracy,
- preserve DOM readability,
- preserve quality tiers,
- not introduce shimmering severe enough to hurt line/net/player readability.

---

## Lighting and shading

Use lighting to separate forms, not to create realism.

Preferred treatment:

- mostly flat/faceted materials,
- bright daylight-like value separation,
- soft or simplified shadows,
- restrained specular response,
- no glossy grass,
- no cinematic HDR look,
- no bloom,
- no atmospheric fog that obscures court markings.

The environment should feel like an outdoor tournament game screen rather than a dark night stadium.

---

## Stadium structure

The venue should feel prestigious and traditional while remaining geometrically cheap and distinctly retro.

### Back wall

The far side should contain a readable deep-green wall/barrier with:

- simple original sign panels,
- scoreboard/project destination integrated into the venue,
- restrained purple/cream accents where useful,
- no copied real-world sponsor names, Wimbledon marks, or logos.

### Side walls

Use deep-green retaining walls/fences that guide the eye toward the grass court.

### Stands

Prefer stepped seating terraces or low-poly slabs.

The stands should be visually populated behind the far baseline and along side bands rather than becoming huge realistic architecture around the camera.

### Crowd

Use one of:

- instanced low-poly silhouettes,
- low-resolution sprite cards,
- small palette billboard clusters,
- mixed cards + geometry.

Crowd motion should be minimal or absent during Phase 16.

### Officials / courtside props

Use recognizable traditional tennis venue props:

- umpire chair,
- courtside bench,
- ball basket / equipment stack,
- ball-person silhouette/card,
- towel / water container,
- rackets,
- line-official style silhouettes if performance permits.

These should also support the portfolio station metaphors from Phase 16.

---

## Signage

Use signage as atmosphere and portfolio affordance, not as copied tournament branding.

Allowed:

- original green/cream/purple color blocks,
- generic tennis motifs,
- project names on the project scoreboard,
- short labels like `PROJECTS`, `MATCH`, `PLAYER 01`, `RESEARCH`,
- simple original iconography.

Avoid:

- Wimbledon logos/wordmarks,
- exact official sign layouts,
- copied sponsor panels,
- copying the supplied reference's sign placement one-for-one,
- using official tournament branding as decoration.

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

A classic white-dominant tennis outfit is visually compatible with the grass-court direction, but Player 01 and the opponent still need distinct trim/silhouette so they remain recognizable.

Use stepped animation and limited material colors.

Do not chase realistic anatomy or skin shading.

---

## Relationship to portfolio stations

The venue stations must look like normal grass-court tournament elements first and navigation targets second.

Examples:

- Karthick player → About,
- bench → Experience,
- umpire/strategy area → Research,
- scoreboard → Projects,
- equipment rack → Capabilities,
- tunnel/exit → Contact,
- clipboard/placard → Résumé.

Do not add floating glowing holograms that break the sports-game illusion.

---

## Quality tiers

### High

- full crowd density,
- complete venue signs,
- grass mowing/wear detail,
- highest allowed court/prop detail,
- optional accepted scene-resolution treatment.

### Medium

- slightly reduced crowd density,
- preserve grass bands, white lines, green surrounds, net, players, and all world stations.

### Low

- preserve grass-court identity, walls, net, players, scoreboard, and required station silhouettes,
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

## Acceptance test for the grass-court direction

A reviewer should be able to say all of the following without being told:

- “This reads like an old console tennis game.”
- “This is clearly a traditional grass-court tournament venue.”
- “The brighter striped grass court is framed by deep green surrounds.”
- “The white lines, dark net, both players, and crowd are immediately readable.”
- “There is a subtle classic green/cream/purple tournament feel without copied branding.”
- “It is clearly an original interactive 3D website, not a screenshot or clone.”

If the scene reads as clay, generic flat-green low-poly tennis, or a dark modern stadium, this art-direction goal has not been met.
