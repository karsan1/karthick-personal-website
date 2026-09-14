# Phase 16 — Pixel-Sports Grass Court Reframe + World Stations

## Objective

Phase 15 proved the shared world-hotspot/navigation infrastructure. Phase 16 now has **two ordered responsibilities**:

1. re-author the visible court/stadium so the opening scene reads like an original 16-bit / early-console **grass-court tournament** game,
2. place the portfolio world stations inside that venue so they feel native to the tennis environment.

The court visual target is defined in:

- `docs/PIXEL_SPORTS_COURT_ART_DIRECTION.md`

Read that document before implementing this phase.

This phase is not final camera choreography. Phase 17 still owns the finished scroll/camera world tour, but Phase 16 must establish a convincing gameplay-style opening composition so station placement is validated against the correct visual language.

---

## Primary agents

- Owner: `scene_engineer`
- Art/palette + source assets: `asset_pipeline_engineer` only when a unique authored prop is justified
- Content mapping: `ui_engineer`
- Camera composition support: `motion_engineer` only for the minimum opening framing needed to validate the court reframe
- Review: `qa_reviewer`

Use the fewest agents necessary and avoid overlapping edits to `RetroEnvironment.tsx`.

---

# Part A — Reframe the court before adding more stations

## Why this is first

The current procedural environment already uses green, but it still reads as a modern dark-green low-poly stadium rather than a classic grass-court tennis game.

The new target is:

- lighter natural grass play surface,
- alternating mowing bands / subtle grass-striping cues,
- crisp white lines,
- deep-green perimeter walls and court furniture,
- optional restrained purple/cream accent details,
- darker net with white top tape,
- colorful packed stands,
- original sign panels,
- compact courtside officials/props,
- elevated baseline gameplay framing,
- reduced depth exaggeration,
- strong graphic color blocks.

This means Phase 16 is **not** satisfied by merely keeping the current court green. The court must unmistakably read as a traditional grass surface.

If stations are laid out against the current environment before this reframe, contrast, transforms, silhouettes, and camera-safe regions will need unnecessary rework. Therefore the grass-court restyle is the first Phase 16 gate.

---

## Phase 16A implementation targets

### Grass court surface

Replace the current flat/dark green court read with a brighter traditional grass family.

Starting family from the art-direction spec:

```text
grass base         #557A3D
grass light stripe #668A49
grass dark stripe  #476B35
worn grass         #8B8A5A
court line         #F4F1E7
```

These are starting values, not mandatory exact hex colors. Tune in browser.

Requirements:

- white/cream court markings must be extremely legible,
- alternating broad mowing bands or stepped grass-value zones should communicate the surface at gameplay distance,
- optional worn baseline/service-area patches may use muted olive/tan,
- court should occupy the dominant visual area of the opening frame,
- surface must remain simple and graphic,
- no photoreal grass texture or individual blades,
- avoid artificial-turf neon green.

Prefer material bands, vertex colors, or tiny palette maps over large raster textures.

### Perimeter walls and tournament surround

Use/reshape visible **deep-green** court walls, barriers, and furniture around the brighter grass surface.

Target qualities:

- clearly darker than the playing grass,
- simple planar/stepped geometry,
- visually separates court from crowd,
- supports signage and stations,
- frames the far player and scoreboard,
- evokes a traditional grass-tournament venue without copying Wimbledon branding.

A restrained purple or cream accent may appear on small sign trim or selected venue details, but green remains dominant.

### Net

Restyle the net so it reads like a classic game-screen tennis net:

- black/charcoal mesh,
- white/cream top tape,
- chunky dark posts,
- strong silhouette,
- still aligned to `z = 0` and the existing rally contract.

The net must not disappear against the grass.

### Stands and crowd

The far side of the opening view should feel populated and prestigious without becoming a realistic stadium model.

Use cheap repeated visual forms:

- instanced cards,
- low-poly silhouettes,
- sprite-like billboard clusters,
- stepped seating slabs.

Crowd colors can use controlled retro visual noise: whites/cream, navy, burgundy, muted red, teal, yellow accents, restrained purple, and dark tones.

Do not model detailed individual spectators.

### Signage

Add a band of original sign panels along plausible wall/stand surfaces.

Rules:

- green/cream/purple blocks are acceptable,
- portfolio labels can appear where appropriate,
- no Wimbledon logos/wordmarks,
- no copied sponsor panels or official sign layouts,
- signs should be geometry, very small textures, or projected DOM labels where practical.

### Courtside life

Add enough recognizable traditional venue context that the stadium reads as a classic tennis game rather than an empty architecture model.

Useful props include:

- umpire chair,
- courtside bench,
- equipment stack,
- ball basket,
- towel/water prop,
- simple ball-person or line-official silhouette/card if performance allows.

Several of these become portfolio stations later in this same phase.

---

## Pixel-sports rendering proof

Do not begin with a new post-processing dependency.

Test the visual stack in this order:

1. grass/surround color separation,
2. mowing-band / worn-grass cues,
3. flat/faceted shading,
4. simple crowd cards/silhouettes,
5. stepped character animation already available,
6. narrower-FOV elevated gameplay composition,
7. reduced scene resolution / DPR experiment if needed,
8. antialiasing reduction if visually beneficial.

The DOM stays crisp.

If a true render-target pixelation pass is proposed, it requires measured before/after performance and interaction review before acceptance.

---

## Opening-frame proof required inside Phase 16

Before placing every station, validate one desktop composition that shows:

- full or near-full court,
- near player,
- far player,
- net,
- brighter striped grass surface,
- deep-green wall/surround band,
- colorful far-side crowd,
- scoreboard/signage context.

This is not the final Phase 17 camera system. It is a composition proof that the environment itself is being judged from the intended gameplay angle.

The visual should feel **closer to an old-console grass-court tournament game than to the current modern dark-green low-poly stadium**.

---

# Part B — World station information architecture

Once the grass-court restyle passes its visual gate, extend the Phase 15 hotspot infrastructure into the complete venue map.

## Required station map

Use the accepted Phase 14 mapping:

1. **About — Karthick player**
2. **Experience — courtside bench + kit bag**
3. **Research — umpire chair / strategy station**
4. **Projects — main scoreboard**
5. **Capabilities — racket/equipment rack**
6. **Contact — player tunnel / stadium exit**
7. **Résumé — clipboard / placard near the bench**

The visitor should infer that these objects matter without turning the stadium into glowing floating UI.

---

## Spatial composition goals

The court must remain a believable playable grass-court environment.

Stations should:

- sit in plausible venue locations,
- preserve existing court dimensions and rally clearance,
- remain readable from the new elevated gameplay composition,
- avoid overlapping each other in screen space,
- use the grass-tournament pixel-sports palette/material language,
- use shared materials/geometry where practical,
- respect existing quality-tier budgets.

Do not put floating portfolio panels on the playing surface.

---

## About station — Karthick player

The Karthick-side player remains the most important world interaction.

Requirements:

- preserve the accepted Phase 15 generous root proxy,
- distinguish the owner player through simple color blocking/silhouette,
- make the player readable at the gameplay camera distance,
- keep hover/select effects graphic and restrained,
- no permanent floating nameplate,
- final human-authored character art remains Phase 19.

The Phase 16 job is to ensure the current production/fallback character does not disappear against the brighter grass court, deep-green surround, or crowd.

---

## Experience station — bench

Build a compact courtside preparation area:

- bench,
- kit/duffel,
- optional towel/water/racket details,
- résumé clipboard/placard nested nearby but visually distinct.

Use forms and colors consistent with traditional green courtside furniture rather than office furniture.

---

## Research station — umpire / strategy area

Use the umpire chair or an adjacent tactical board as the research metaphor.

Preferred cues:

- elevated chair silhouette,
- small tactics/clipboard surface,
- optional tiny diagram motif,
- no long scientific text in WebGL.

The chair should also strengthen the classic tournament composition.

---

## Projects station — scoreboard

The scoreboard is the strongest environmental destination after the player.

Requirements:

- visually integrate into the far-side wall/stand zone,
- preserve the accepted Phase 15 hotspot path,
- make it visible from the gameplay opening frame,
- support a later project-index state,
- use short labels only,
- use original green/cream/purple treatment rather than official tournament branding,
- no embedded live webpage or iframe texture.

Suggested later display language:

```text
PROJECTS
01 MARKETDECK
02 CITYBUS
03 ...
```

Full project content remains semantic DOM.

---

## Capabilities station — equipment rack

Use an equipment rack/case cluster near a plausible courtside area.

The station is a metaphor only. Do not create a physical object for every technology.

Possible grouping:

- rackets,
- ball tubes/baskets,
- equipment cases,
- cones/markers.

---

## Contact station — tunnel / exit

Create a compact side-court or far-side exit/tunnel element that reads as the end of the match.

Requirements:

- deep-green architectural opening,
- room for an original `MATCH POINT` / `CONTACT` cue later,
- visually compatible with the grass-tournament venue,
- no forced first-person walk-through.

---

## Résumé station

Résumé remains directly available through DOM navigation.

Add a small courtside world affordance near Experience:

- clipboard,
- match sheet,
- credential placard.

Selecting it invokes the canonical résumé action. Do not add a new narrative camera owner.

---

## Visual affordance system

Use one consistent interaction language across stations.

Preferred:

- slight value/palette lift,
- small projected DOM label when hovered/selected,
- pointer cursor,
- stronger selected state,
- subtle cream or purple accent tick/stripe if needed.

Avoid:

- neon outlines,
- holograms,
- particle halos,
- large floating labels,
- seven unrelated hover styles.

The interaction system should feel like an old sports-game menu embedded in a grass-court tournament scene, not a sci-fi HUD.

---

## Data-driven station registry

Keep one station registry rather than duplicating destination metadata.

Suggested shape:

```ts
{
  id: "projects-scoreboard",
  chapterId: "projects",
  label: "Projects",
  shortLabel: "PROJECTS",
  stationKind: "scoreboard"
}
```

Semantic metadata should remain centralized; transforms remain close to the scene owner.

---

## Performance constraints

Preserve Phase 09/12 discipline, but do not treat the old 14-call environment measurement as sacred if the new venue needs a small justified increase.

Rules:

- measure before/after draw submissions,
- prefer instancing for crowd and repeated signage,
- share materials,
- implement grass bands/wear cheaply,
- reduce crowd/decorative props before removing required stations on lower tiers,
- avoid large raster textures,
- no second Canvas,
- no unmeasured post-processing,
- update `docs/PERFORMANCE_PROFILE.md` if the budget changes.

If a unique prop needs authored geometry, Blockbench is preferred.

---

## Phase gates

### Gate 16A — Grass-court look

Pass before full station placement:

- the court clearly reads as a lighter traditional grass surface rather than generic flat green,
- alternating grass bands and/or subtle wear cues are visible at gameplay distance,
- crisp white lines are highly readable,
- deep-green walls/furniture frame the play area,
- dark net + white top tape are clearly readable,
- far-side crowd/signage makes the venue feel populated,
- two-player full-court screenshot reads as an old-console grass-court tournament game,
- no Wimbledon branding or copied commercial-game assets are introduced.

### Gate 16B — Station integration

Pass before Phase 17:

- every portfolio destination has a plausible court/stadium station,
- stations use the same green/cream/purple tournament palette language,
- station silhouettes are readable from the gameplay composition,
- all destinations still resolve through the accepted Phase 15 navigation path,
- no station obstructs rally/player movement.

---

## Acceptance criteria

- [ ] `docs/PIXEL_SPORTS_COURT_ART_DIRECTION.md` is treated as the court visual source of truth.
- [ ] The opening venue now reads as a traditional grass-court tournament rendered like an old console tennis game.
- [ ] The grass court—not portfolio UI—is the dominant opening visual.
- [ ] Mowing/value bands, white lines, dark net, near player, and far player are immediately legible.
- [ ] Deep-green surrounds and restrained cream/purple accents establish the tournament character without copied branding.
- [ ] About maps to the Karthick player.
- [ ] Experience maps to a courtside bench/kit area.
- [ ] Research maps to umpire/strategy area.
- [ ] Projects maps to the scoreboard.
- [ ] Capabilities maps to equipment.
- [ ] Contact maps to a tunnel/exit.
- [ ] Résumé remains directly available in DOM and gains an in-world affordance.
- [ ] Important text remains semantic HTML.
- [ ] No copied commercial-game or Wimbledon signs, logos, sprites, or textures are introduced.
- [ ] Performance and quality-tier behavior are measured and documented if changed.

Stop after court/station visual acceptance. Phase 17 owns the full scroll/camera choreography.
