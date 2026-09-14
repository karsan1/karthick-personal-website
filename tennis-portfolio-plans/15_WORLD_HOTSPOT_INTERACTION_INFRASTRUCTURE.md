# Phase 15 — World Hotspot Interaction Infrastructure

## Objective

Make the existing persistent R3F scene safely interactive without creating a second navigation system.

This phase establishes reusable hotspot behavior only. Do not redesign every stadium object yet.

---

## Primary agents

- Owner: `scene_engineer`
- Navigation/timeline support: `motion_engineer`
- DOM/accessibility equivalent: `ui_engineer`
- Review: `qa_reviewer`

---

## Required behavior

Create a small world-interaction layer that lets scene objects advertise a portfolio destination.

Preferred contract:

```ts
export type WorldHotspotId =
  | "about-player"
  | "experience-bench"
  | "research-chair"
  | "projects-scoreboard"
  | "capabilities-rack"
  | "contact-tunnel"
  | "resume-clipboard";

type WorldHotspotConfig = {
  id: WorldHotspotId;
  chapterId: ChapterId;
  label: string;
  enabledOnTouch?: boolean;
};
```

Do not encode camera coordinates in hotspot config.

---

## Pointer policy change

The current global CSS disables pointer events for the Canvas. Replace that blanket rule with intentional layering.

Requirements:

- the Canvas can receive pointer events in explore mode,
- DOM navigation and visible panels remain fully clickable,
- open modal/detail surfaces take precedence,
- reading mode can temporarily suppress world clicks where necessary,
- no invisible full-screen DOM layer should block the scene unintentionally.

Use CSS stacking and `pointer-events` deliberately rather than toggling many ad-hoc elements.

---

## Hotspot component

Create a reusable primitive such as:

```tsx
<WorldHotspot
  id="projects-scoreboard"
  chapterId="projects"
  label="Projects"
>
  <Scoreboard />
</WorldHotspot>
```

or a hook if wrapping scene hierarchy is impractical.

Responsibilities:

- pointer enter/leave,
- click/tap,
- optional larger invisible hit mesh,
- setting coarse hover state,
- invoking the shared navigation target function,
- cursor ownership,
- cleanup on unmount.

Do not put visual styling policy inside the generic interaction component beyond minimal state propagation.

---

## Navigation convergence

Introduce one shared navigation action used by:

- top DOM nav,
- hotspot click,
- compact world-menu equivalents,
- hash navigation,
- future scoreboard/project selectors.

Expected behavior:

1. destination resolves to a chapter/progress target,
2. the page scrolls to the canonical semantic section/anchor,
3. existing ScrollTrigger updates narrative progress,
4. camera responds through the normal timeline,
5. active chapter updates through existing coarse state.

Do not directly tween the R3F camera from the click handler.

---

## Hover/focus visual language

Hotspots should feel like a retro game selection, not a modern neon outline.

Allowed cues:

- small emissive/material lift,
- subtle scale or pose accent,
- floating short label,
- blinking court-side marker,
- limited accent-color edge cue.

Avoid:

- constant glow,
- huge bounding boxes,
- particles around every target,
- cursor-follow camera movement,
- long floating descriptions in WebGL.

---

## Player hotspot constraints

The Karthick player will eventually map to About.

For this phase:

- prove hit targeting on the player root or a generous invisible proxy,
- do not attach handlers independently to every limb,
- hover state must not fight animation transforms,
- clicking while a rally contact pose is active must remain deterministic,
- the interaction must survive replacement of calibration art in Phase 19.

---

## Touch behavior

Desktop hover cannot be required.

For coarse pointers:

- tap should activate directly or use one clear tap-to-select behavior,
- use larger invisible hit geometry,
- no double-tap requirement,
- no tooltip that must be dismissed before navigation,
- if target density is too high on mobile, defer some scene targets to DOM chips.

---

## Accessibility contract

Canvas meshes themselves are not the only accessible controls.

Create/maintain a DOM list of equivalent destinations, visually compact but semantically complete.

Each destination must expose a normal button or anchor with a clear accessible name.

World hover may mirror DOM hover state when useful, but keyboard users must never have to tab into raw WebGL internals.

---

## State ownership

Allowed Zustand additions:

- `hoveredHotspot`,
- `selectedHotspot`,
- `interactionMode`.

Not allowed:

- pointer coordinates,
- raycaster results,
- object transforms,
- camera position,
- animation frame values.

---

## Suggested files

- `src/components/scene/interactions/WorldHotspot.tsx`
- `src/components/scene/interactions/worldHotspots.ts`
- `src/hooks/usePortfolioNavigation.ts`
- `src/store/experienceStore.ts`
- `src/components/ui/Navigation.tsx`
- `src/components/experience/ExperienceCanvas.tsx`
- `src/app/globals.css`

Reuse existing structures if CodeGraph identifies a cleaner ownership location.

---

## Validation

Test at minimum:

- mouse hover/click,
- trackpad/scroll then click,
- keyboard equivalent navigation,
- touch-sized viewport,
- reverse scroll after hotspot jump,
- project dialog open/closed,
- reduced motion,
- non-WebGL fallback,
- no accidental camera divergence.

---

## Acceptance criteria

- [x] Canvas can receive intentional pointer interactions.
- [x] DOM controls are not blocked by Canvas interaction.
- [x] One shared navigation path handles DOM and 3D selections.
- [x] At least two representative hotspots work end to end, including the About player target and one environment target.
- [x] Hotspot clicks move narrative state through scroll/progress rather than direct camera mutation.
- [x] Touch interaction is usable.
- [x] Equivalent semantic DOM controls exist.
- [x] No per-frame Zustand/React interaction writes are introduced.
- [x] Existing deterministic rally and reverse-scroll behavior remain intact.

Stop after infrastructure acceptance. Do not yet build all venue stations.
