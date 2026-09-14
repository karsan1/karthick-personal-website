# Phase 16 — World Stations & Venue Information Architecture

## Objective

Turn the procedural retro venue into a spatial portfolio map. Each major portfolio section gets a recognizable in-world station that reads visually before the user clicks it.

This phase is about **where information lives in the stadium** and how those places look. Do not yet do the final scroll/camera timing polish.

---

## Primary agents

- Owner: `scene_engineer`
- Content mapping: `ui_engineer`
- Asset support: `asset_pipeline_engineer` only if a Blockbench prop is justified
- Review: `qa_reviewer`

---

## Required station map

Use the Phase 14 canonical mapping as the default:

1. **About — Karthick player**
2. **Experience — courtside bench + kit bag**
3. **Research — umpire chair / strategy station**
4. **Projects — main scoreboard**
5. **Capabilities — racket/equipment rack**
6. **Contact — player tunnel / stadium exit**
7. **Résumé — clipboard / placard near the bench**

The visitor should be able to visually infer that these objects are special without the entire stadium becoming a theme park of glowing buttons.

---

## Spatial composition goals

The court must remain a believable tennis environment.

Stations should:

- sit in plausible venue locations,
- preserve correct court dimensions and rally clearance,
- remain readable from authored camera positions,
- avoid overlapping each other in screen space,
- maintain retro low-poly style,
- use shared materials/geometry where practical,
- respect existing draw-call and quality-tier budgets.

Do not scatter arbitrary floating UI panels across the court.

---

## About station — player

The Karthick-side player is the most personal interaction in the site.

Design requirements:

- visually distinguish the portfolio-owner player from the opponent through attire/palette/silhouette, not a floating nameplate at all times,
- make the player readable from opening camera distance,
- hotspot proxy is generous but invisible,
- hover/select cue should preserve the character animation silhouette,
- About activation should eventually produce a close/medium hero composition, not an extreme face zoom.

No photoreal avatar requirement.

---

## Experience station — bench

Build a concise retro courtside work area:

- bench,
- duffel/kit bag,
- towel/bottle/racket props only if useful,
- résumé clipboard/placard nested nearby but visually distinct.

The area should communicate “career / history / preparation” without literal office furniture.

Reuse geometry/materials aggressively.

---

## Research station — umpire / strategy area

Use the umpire chair or adjacent tactical board as the research metaphor.

Preferred cues:

- elevated chair silhouette,
- small clipboard/tactics board,
- restrained chart/diagram motif on a short in-world panel if needed,
- no long scientific text inside WebGL.

Research details remain DOM content.

---

## Projects station — scoreboard

The scoreboard becomes the strongest environment destination after the player.

Requirements:

- make it clearly visible from multiple chapter compositions,
- reserve a project-index visual state,
- project names may be abbreviated in-world,
- selecting a project ultimately opens DOM detail,
- reuse existing segmented display/material structure where possible,
- no embedded iframe/webpage texture.

Suggested project mode:

```text
PROJECTS
01  MARKETDECK
02  CITYBUS
03  ...
```

Only short labels in-world. Full descriptions remain HTML.

---

## Capabilities station — equipment rack

Use a racket/equipment rack to represent tools and capabilities.

Possible visual grouping:

- rackets = software/product,
- balls/cones = data/AI,
- cases/tools = cloud/infrastructure.

Do not over-literalize every technology into an object. The station is just the entry point to the semantic skills panel.

---

## Contact station — tunnel / exit

Create a final venue destination that reads as the end of the match:

- player tunnel,
- exit arch,
- restrained “MATCH POINT” / “CONTACT” cue,
- room for a clean end-state camera composition.

No forced cinematic walk-through.

---

## Résumé station

The résumé must remain immediately available in DOM navigation, but also gets a small world affordance near Experience.

Recommended prop:

- clipboard,
- laminated match sheet,
- courtside credential placard.

Selection invokes the canonical résumé action. Do not make users enter Experience first.

---

## Visual affordance system

Create one consistent station language:

- subtle accent strip,
- one small hovering marker or icon when nearby/active,
- material lift on hover,
- short label only on hover/selection,
- selected state stronger than hover.

Do not use seven unrelated interaction styles.

---

## Performance constraints

Preserve Phase 09/12 discipline.

- prefer instancing for repeated seats/crowd/fixtures,
- station props should share material families,
- avoid raster textures unless clearly justified,
- no new post-processing,
- do not add a separate Canvas,
- retain low/medium/high detail tiers,
- update `docs/PERFORMANCE_PROFILE.md` if draw submissions materially change.

If a station needs a unique authored prop, Blockbench is preferred. Do not reopen Blender for ordinary low-poly prop work.

---

## Data-driven configuration

Create a central station registry rather than hard-coding labels in several components.

Suggested data:

```ts
{
  id: "projects-scoreboard",
  chapterId: "projects",
  label: "Projects",
  shortLabel: "PROJECTS",
  stationKind: "scoreboard"
}
```

Keep spatial transforms close to the scene owner, but keep semantic destination metadata centralized.

---

## Acceptance criteria

- [ ] All canonical portfolio destinations have a visually identifiable venue station.
- [ ] Stations look like part of one tennis stadium rather than separate UI widgets.
- [ ] About maps to the Karthick-side player.
- [ ] Projects maps to the main scoreboard.
- [ ] Résumé remains directly available both in DOM and in-world.
- [ ] No important long-form content is moved into WebGL.
- [ ] No station obstructs rally/player movement or court readability.
- [ ] Station visuals respect quality tiers and performance budgets.
- [ ] Interaction labels are short, consistent, and readable.

Stop after station placement and visual acceptance. Camera sequencing belongs to Phase 17.
