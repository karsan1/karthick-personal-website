# Phase 14 — 3D-First Interactive Tennis World Reframe

## Why this phase exists

The retro migration is technically far along, but the current presentation still behaves like a conventional portfolio with a 3D tennis scene behind it. That is no longer the target.

The new product direction is:

> **The retro tennis court, stadium, and players are the portfolio.**
>
> Scrolling moves the visitor through authored areas of the venue. Clicking recognizable world objects opens or focuses the corresponding portfolio content. The DOM remains semantic, readable, keyboard-accessible, and available without WebGL, but visually it becomes a contextual layer around the game world rather than the dominant full-screen surface.

This is a user-directed product reframe. It supersedes the **background-first visual hierarchy** of the current Phase 10–13 presentation, but it does **not** discard the accepted foundation:

- one persistent React Three Fiber Canvas,
- deterministic GSAP/ScrollTrigger narrative progress,
- semantic HTML for important portfolio content,
- Zustand only for coarse state,
- reduced-motion and non-WebGL fallbacks,
- deterministic tennis motion,
- existing quality/audio/performance infrastructure,
- Blockbench-first character direction,
- procedural retro environment and legacy Blender fallback.

Phase 13 remains useful as a regression baseline, not as the final launch target.

---

## Current mismatch to correct

The existing runtime intentionally makes the 3D world non-interactive and visually subordinate:

- `.experience-shell` is fixed behind the DOM portfolio layer,
- `.experience-shell` / `.experience-canvas` currently disable pointer events,
- large hero/section typography and panels occupy most of the viewport,
- chapter transitions primarily reveal conventional website sections,
- the scoreboard and environment mirror state but are not the main navigation system,
- current player GLBs are generated calibration fixtures rather than final human-authored retro characters.

The redesign must invert that hierarchy without sacrificing accessibility.

---

## Target experience

### First load

The visitor lands inside a full-screen retro tennis stadium.

The visual priority is:

1. players,
2. court,
3. stadium,
4. world interaction cues,
5. concise identity UI.

Do **not** cover the opening court with the current giant name treatment.

The initial DOM layer should be compact, for example:

```text
KARTHICK SANKAR
Software Engineer · Product Builder

SCROLL TO EXPLORE
or click highlighted objects
```

The name should still be immediately understandable, but the court must dominate the composition.

### Exploration model

The experience uses two complementary inputs:

1. **Scroll narrative** — scroll through authored court/stadium stations.
2. **World selection** — click/tap an interactive object to jump to its station/content.

Do not introduce WASD/free-flight navigation. The site should feel game-like, not become a game that visitors must learn to control.

### Content model

Important copy remains HTML.

When a world station is active, its content appears as a restrained contextual panel, drawer, card, or bottom sheet while the court remains clearly visible.

Long-form content must never be rendered as WebGL text or texture atlases.

---

## Canonical world-to-portfolio mapping

Use this mapping unless a later implementation review finds a strong spatial reason to adjust it:

| World object / area | Portfolio destination | Interaction |
|---|---|---|
| **Karthick player** | About | Click player / scroll to player close-up |
| **Courtside bench + kit bag** | Experience | Camera settles courtside; work history panel appears |
| **Umpire chair / strategy station** | Research | Camera shifts to analytical sideline composition |
| **Main scoreboard** | Projects | Scoreboard becomes the visual project index; project details remain DOM |
| **Racket / equipment rack** | Capabilities | Skills/toolkit displayed as concise grouped DOM content |
| **Player tunnel / stadium exit** | Contact | End-of-match contact state |
| **Clipboard / résumé placard near bench** | Résumé | Direct DOM/download action; never WebGL-only |

The opponent remains part of the tennis narrative and should not become a forced portfolio metaphor unless there is a clear content reason.

---

## Interaction principles

### 1. World objects are real navigation targets

Interactive meshes should provide:

- hover/focus-equivalent visual feedback,
- generous invisible hit geometry where needed,
- cursor feedback on pointer devices,
- tap support,
- deterministic destination mapping,
- no per-frame React state writes.

### 2. DOM always mirrors the route

Every WebGL hotspot must have an equivalent semantic DOM control.

A user must be able to reach every destination using:

- keyboard,
- standard navigation links,
- screen reader navigation,
- non-WebGL fallback,
- reduced-motion mode.

### 3. World interaction drives the same chapter system

Do not create a second navigation model.

All of these must converge on the same chapter destination function:

```text
scroll
nav click
3D hotspot click
project selection
hash/deep link
```

### 4. Camera remains authored

Clicking a hotspot sets a navigation target / scroll destination. It must **not** directly mutate camera state independently of the narrative timeline.

### 5. The scene stays visually alive

While reading content:

- player idle motion may continue subtly,
- the ball may settle or loop only when intentional,
- distracting rally motion should reduce when a detail panel is open,
- the environment should never look frozen unless reduced motion requires it.

---

## Coarse state additions

Extend the existing Zustand store only with low-frequency interaction state when implementation begins.

Suggested shape:

```ts
type WorldHotspotId =
  | "about-player"
  | "experience-bench"
  | "research-chair"
  | "projects-scoreboard"
  | "capabilities-rack"
  | "contact-tunnel"
  | "resume-clipboard";

hoveredHotspot: WorldHotspotId | null;
selectedHotspot: WorldHotspotId | null;
interactionMode: "explore" | "reading";
```

Do not store hover ray coordinates, camera transforms, animation values, or other frame-rate data in Zustand.

---

## Visual hierarchy requirements

Desktop target:

- 65–80% of the viewport should remain visually attributable to the 3D court/stadium during ordinary exploration.
- Contextual content should usually occupy no more than ~32–38vw.
- Project detail may temporarily use more space, but the transition should clearly originate from the scoreboard/court.
- Hero copy must no longer dominate the court.

Mobile target:

- full-screen scene remains the visual base,
- active content opens as a bottom sheet,
- tap targets must not require precision,
- scroll remains the primary path,
- world hotspots may be simplified or augmented by visible DOM chips.

---

## Core files likely affected in later phases

Do not change all of these in Phase 14; this is the architecture boundary for following phases.

- `src/components/experience/ExperienceShell.tsx`
- `src/components/experience/ExperienceCanvas.tsx`
- `src/components/scene/Scene.tsx`
- `src/components/scene/RetroEnvironment.tsx`
- `src/components/scene/characters/RetroPlayer.tsx`
- `src/components/ui/PortfolioLayer.tsx`
- `src/components/ui/Navigation.tsx`
- `src/components/camera/CameraRig.tsx`
- `src/animations/prototypeMotion.ts`
- `src/animations/usePrototypeTimeline.ts`
- `src/store/experienceStore.ts`
- `src/app/globals.css`

---

## Implementation sequence after this reframe

1. Phase 15 — interaction/hotspot infrastructure.
2. Phase 16 — world stations and venue information architecture.
3. Phase 17 — scroll/camera choreography for the new exploration model.
4. Phase 18 — contextual DOM content layer and navigation redesign.
5. Phase 19 — final retro player art plus player-specific interaction polish.
6. Phase 20 — mobile, accessibility, performance, regression, and release QA.

---

## Acceptance criteria

Phase 14 is complete when the team agrees on the new contract before writing cross-cutting runtime changes.

- [ ] The 3D tennis world is explicitly the primary visual/navigation surface.
- [ ] The giant foreground hero/section treatment is no longer the desired final hierarchy.
- [ ] Scroll + world click are the primary exploration inputs.
- [ ] Free-roam controls are explicitly out of scope.
- [ ] Every world interaction has a DOM/keyboard/non-WebGL equivalent.
- [ ] Important text remains semantic HTML.
- [ ] Camera ownership remains timeline-driven.
- [ ] Existing performance, fallback, reduced-motion, quality, and audio infrastructure is retained.
- [ ] The canonical world-to-content mapping is accepted or intentionally revised before Phase 16.

Stop after architecture acceptance. Do not opportunistically implement Phase 15 interaction code while still changing the product mapping.
