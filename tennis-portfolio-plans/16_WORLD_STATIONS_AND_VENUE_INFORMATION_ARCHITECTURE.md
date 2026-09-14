# Phase 16 — Pixel-Sports Court Reframe + World Stations

## Objective

Phase 15 proved the shared world-hotspot/navigation infrastructure. Phase 16 now has **two ordered responsibilities**:

1. re-author the visible court/stadium so the opening scene reads like an original 16-bit / early-console tennis game,
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

The current procedural environment is still a modern dark-green low-poly stadium. The new target is visually closer to an old console tennis-game screen:

- warm clay/brown court,
- bright white lines,
- dark green perimeter walls,
- darker net,
- colorful packed stands,
- original sign panels,
- compact courtside officials/props,
- elevated baseline gameplay framing,
- reduced depth exaggeration,
- strong graphic color blocks.

If stations are laid out against the current green court and then the environment is changed afterward, transforms, silhouettes, contrast, and camera-safe regions will all need unnecessary rework. Therefore the court restyle is the first Phase 16 gate.

---

## Phase 16A implementation targets

### Court surface

Replace the visible green playing surface with a restrained warm clay family.

Starting family from the art-direction spec:

```text
base clay       #9A5E32
light clay      #B07143
shadow clay     #754526
court line      #F4E7D0
```

These are starting values, not mandatory exact hex colors. Tune in browser.

Requirements:

- white/cream court markings must be extremely legible,
- court should occupy the dominant visual area of the opening frame,
- surface must remain simple and graphic,
- no photoreal clay texture is needed,
- if texture variation is used later, it must be extremely low-resolution and intentional.

### Perimeter walls

Add/reshape visible dark-green court walls or retaining barriers around the gameplay area.

Target qualities:

- saturated green,
- simple planar/stepped geometry,
- visually separates court from crowd,
- supports signage,
- visually frames the far player and scoreboard.

Do not use a realistic chain-link stadium fence as the dominant look.

### Net

Restyle the net so it reads more like a classic game-screen net:

- darker mesh,
- light top tape,
- chunky posts,
- strong silhouette,
- still aligned to `z = 0` and existing rally contract.

The net must not disappear against the court.

### Stands and crowd

The far side of the opening view should feel populated.

Use cheap repeated visual forms:

- instanced cards,
- low-poly silhouettes,
- sprite-like billboard clusters,
- stepped seating slabs.

Crowd colors should create controlled retro visual noise using a small palette of reds, yellows, blues, teals, whites, oranges, and dark tones.

Do not model detailed individual spectators.

### Signage

Add a band of original sign panels along plausible wall/stand surfaces.

Rules:

- signs may use fictional/generic marks,
- portfolio labels can appear where appropriate,
- no copied sponsors/logos/text from the user's reference,
- signs should be geometry/very small textures/DOM-projected labels rather than detailed image assets when possible.

### Courtside life

Add enough recognizable venue context that the stadium reads as an old sports-game scene rather than an empty architectural model.

Useful props include:

- umpire chair,
- bench,
- equipment stack,
- ball basket,
- towel/water prop,
- simple ball-person or line-official silhouette/card if performance allows.

Several of these become portfolio stations later in this same phase.

---

## Pixel-sports rendering proof

Do not begin with a new post-processing dependency.

Test the visual stack in this order:

1. limited palette,
2. flat/faceted shading,
3. simple crowd cards/silhouettes,
4. stepped character animation already available,
5. narrower-FOV elevated gameplay composition,
6. reduced scene resolution / DPR experiment if needed,
7. antialiasing reduction if visually beneficial.

The DOM stays crisp.

If a true render-target pixelation pass is proposed, it requires a measured before/after performance and interaction review before acceptance.

---

## Opening-frame proof required inside Phase 16

Before placing every station, validate one desktop composition that shows:

- full or near-full court,
- near player,
- far player,
- net,
- clay surface,
- dark green wall band,
- colorful far-side crowd,
- scoreboard/signage context.

This is not the final Phase 17 camera system. It is a composition proof that the environment itself is being judged from the intended gameplay angle.

The visual should feel **closer to a 16-bit sports game than to the current modern green low-poly stadium**.

---

# Part B — World station information architecture

Once the court restyle passes its visual gate, extend the Phase 15 hotspot infrastructure into the complete venue map.

## Required station map

Use the accepted Phase 14 mapping:

1. **About — Karthick player**
2. **Experience — courtside bench + kit bag**
3. **Research — umpire chair / strategy station**
4. **Projects — main scoreboard**
5. **Capabilities — racket/equipment rack**
6. **Contact — player tunnel / stadium exit**
7. **Résumé — clipboard / placard near the bench**

The visitor should be able to infer that these objects matter without turning the stadium into a collection of glowing floating buttons.

---

## Spatial composition goals

The court must remain a believable playable tennis environment.

Stations should:

- sit in plausible venue locations,
- preserve existing court dimensions and rally clearance,
- remain readable from the new elevated gameplay composition,
- avoid overlapping each other in screen space,
- use the pixel-sports palette/material language,
- use shared materials/geometry where practical,
- respect existing quality-tier budgets.

Do not put floating portfolio panels on the playing surface.

---

## About station — Karthick player

The Karthick-side player remains the most important world interaction.

Requirements:

- preserve the accepted Phase 15 generous root proxy,
- distinguish the owner player through simple color blocking/silhouette,
- make the player readable at the new gameplay camera distance,
- keep hover/select effects graphic and restrained,
- no permanent floating nameplate,
- final human-authored character art remains Phase 19.

The Phase 16 job is to ensure the current production/fallback character does not disappear against the new clay court and green walls.

---

## Experience station — bench

Build a compact courtside preparation area:

- bench,
- kit/duffel,
- optional towel/water/racket details,
- résumé clipboard/placard nested nearby but visually distinct.

Use forms that resemble retro sports-game sideline props rather than office furniture.

---

## Research station — umpire / strategy area

Use the umpire chair or an adjacent tactical board as the research metaphor.

Preferred cues:

- elevated chair silhouette,
- small tactics/clipboard surface,
- optional tiny diagram motif,
- no long scientific text in WebGL.

The chair should also strengthen the classic tennis-game venue composition.

---

## Projects station — scoreboard

The scoreboard is the strongest environmental destination after the player.

Requirements:

- visually integrate into the far-side wall/stand zone,
- preserve the accepted Phase 15 hotspot path,
- make it visible from the gameplay opening frame,
- support a later project-index state,
- use short labels only,
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

Possible visual grouping:

- rackets,
- ball tubes/baskets,
- equipment cases,
- cones/markers.

---

## Contact station — tunnel / exit

Create a compact far-side or side-court exit/tunnel element that reads as the end of the match.

Requirements:

- simple green/dark architectural opening,
- space for an original `MATCH POINT` / `CONTACT` cue later,
- visually compatible with the retro stadium walls,
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
- subtle accent tick/stripe if needed.

Avoid:

- neon outlines,
- holograms,
- particle halos,
- large floating labels,
- seven unrelated hover styles.

The interaction system should feel like an old game menu embedded in a tennis scene, not a sci-fi HUD.

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

Preserve Phase 09/12 discipline, but do not treat the old 14-call environment measurement as sacred if the new court needs a small justified increase.

Rules:

- measure before/after draw submissions,
- prefer instancing for crowd and repeated signage,
- share materials,
- reduce crowd/decorative props before removing required stations on lower tiers,
- avoid large raster textures,
- no second Canvas,
- no unmeasured post-processing,
- update `docs/PERFORMANCE_PROFILE.md` if the budget changes.

If a unique prop needs authored geometry, Blockbench is preferred.

---

## Phase gates

### Gate 16A — Court look

Pass before full station placement:

- clay/brown court clearly replaces the current green visual read,
- dark green walls frame the play area,
- net is clearly readable,
- far-side crowd/signage makes the venue feel populated,
- two-player full-court screenshot reads as an old console tennis game,
- no copied assets/branding from the supplied reference.

### Gate 16B — Station integration

Pass before Phase 17:

- every portfolio destination has a plausible court/stadium station,
- stations use the same palette/material language,
- station silhouettes are readable from the gameplay composition,
- all destinations still resolve through the accepted Phase 15 navigation path,
- no station obstructs rally/player movement.

---

## Acceptance criteria

- [ ] `docs/PIXEL_SPORTS_COURT_ART_DIRECTION.md` is treated as the court visual source of truth.
- [ ] The opening venue now reads as warm-clay, dark-green-wall, colorful-crowd retro tennis.
- [ ] The court—not portfolio UI—is the dominant opening visual.
- [ ] Net, court lines, near player, and far player are immediately legible.
- [ ] About maps to the Karthick player.
- [ ] Experience maps to a courtside bench/kit area.
- [ ] Research maps to umpire/strategy area.
- [ ] Projects maps to the scoreboard.
- [ ] Capabilities maps to equipment.
- [ ] Contact maps to a tunnel/exit.
- [ ] Résumé remains directly available in DOM and gains an in-world affordance.
- [ ] Important text remains semantic HTML.
- [ ] No copied commercial-game signs, logos, sprites, or textures are introduced.
- [ ] Performance and quality-tier behavior are measured and documented if changed.

Stop after court/station visual acceptance. Phase 17 owns the full scroll/camera choreography.
