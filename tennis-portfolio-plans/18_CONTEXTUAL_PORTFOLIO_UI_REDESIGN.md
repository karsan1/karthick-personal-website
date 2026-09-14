# Phase 18 — Contextual Portfolio UI Redesign

## Objective

Replace the current large foreground portfolio sections with a contextual content layer that supports the 3D world instead of covering it.

The semantic DOM remains the source of truth for portfolio content and accessibility.

---

## Primary agents

- Owner: `ui_engineer`
- Motion integration: `motion_engineer`
- World-state support: `scene_engineer`
- Review: `qa_reviewer`

---

## Core hierarchy change

Current model:

```text
large DOM section
  over
3D background
```

Target model:

```text
3D world is the visual experience
  plus
compact contextual DOM content
```

Do not remove semantic sections from the document merely to make the site look immersive.

---

## Hero redesign

Replace the oversized opening typography with a compact identity block.

Target content:

- Karthick Sankar,
- concise role/identity,
- one-sentence value proposition at most,
- “scroll to explore” / interaction hint,
- résumé/contact availability through navigation.

The opening court, players, and stadium must remain unobscured.

---

## Chapter content surfaces

Each chapter should use a contextual surface sized to its content.

### About

Small/medium card adjacent to the player-focused camera composition.

### Experience

Scrollable side panel with career entries. Keep the court/bench visible.

### Research

Side panel or restrained card stack. Keep readable scientific detail in DOM.

### Projects

Scoreboard is the world selector; selected project opens an accessible DOM detail drawer/modal.

### Capabilities

Compact grouped panel rather than a full viewport takeover.

### Contact

End-state card at the tunnel composition with direct links.

---

## Desktop layout

Preferred panel behavior:

- approximately 28–38vw for reading surfaces,
- left/right placement chosen to preserve the active station,
- max readable line lengths,
- content may internally scroll if necessary,
- do not create giant blurred rectangles spanning the court,
- transitions are restrained and reversible.

The active 3D station should remain visible whenever practical.

---

## Mobile layout

Use a bottom-sheet pattern:

- collapsed state leaves most of the scene visible,
- expanded state exposes readable chapter content,
- user can drag/tap only if implemented accessibly; standard buttons are sufficient,
- sheet state must not break document scroll/chapter progress,
- project detail can use a taller sheet,
- provide visible DOM destination chips if 3D tap targeting becomes crowded.

Do not require precise world tapping on mobile.

---

## Navigation redesign

Keep a clear global escape hatch.

Desktop navigation may become more compact than the current full row, but must keep direct access to:

- About,
- Experience,
- Research,
- Projects,
- Capabilities,
- Contact,
- Résumé.

Possible presentation:

- compact top strip,
- menu button + current chapter,
- small match/program menu.

Do not hide navigation so deeply that a recruiter must learn the 3D interaction model first.

---

## World interaction labels

Short world labels may be rendered in DOM projected near objects if that improves clarity/performance.

If using projected labels:

- labels remain short,
- prevent overlap,
- hide when occluded/offscreen if practical,
- no long portfolio copy,
- keyboard equivalent remains in navigation/menu.

---

## Project interaction

Projects should feel connected to the scoreboard without moving professional detail into WebGL.

Flow:

1. enter Projects station,
2. scoreboard exposes short project options,
3. selecting via scoreboard or DOM list sets `activeProjectId`,
4. accessible DOM drawer/modal opens,
5. world motion attenuates,
6. closing restores focus and station composition.

Preserve the existing good focus-trap/Escape/restoration behavior unless implementation review identifies a bug.

---

## Typography and visual style

Keep long-form typography modern.

Retro accents can appear in:

- small headings,
- station labels,
- score/index markers,
- thin borders,
- monospace microcopy,
- chapter indicator.

Avoid turning body copy into pixel text.

---

## CSS architecture

Refactor `globals.css` so interaction layers are explicit.

Suggested conceptual layers:

```text
z0  persistent 3D canvas
z5  projected/world labels
z10 compact global nav/status
z15 contextual chapter panel
z20 project/detail overlays
z30 skip links / critical focus UI
```

Pointer ownership must be deliberate at each layer.

---

## Accessibility

- preserve semantic headings and landmark structure,
- skip link targets meaningful portfolio content,
- keyboard users can use all navigation without WebGL,
- focus order follows the active content surface,
- content is not `aria-hidden` merely because it visually overlays the scene,
- color contrast remains strong,
- reduced motion avoids unnecessary panel/camera transitions,
- screen reader users do not receive redundant decorative game labels.

---

## Acceptance criteria

- [ ] The 3D court/stadium is visually dominant in ordinary desktop exploration.
- [ ] The giant hero typography no longer covers the opening scene.
- [ ] Each chapter uses a contextual rather than full-screen content surface.
- [ ] Important portfolio text remains semantic HTML.
- [ ] Global navigation is always understandable without interacting with WebGL.
- [ ] Projects retain accessible DOM details connected to the scoreboard interaction.
- [ ] Mobile uses a usable bottom-sheet/content model.
- [ ] Keyboard, focus, screen-reader, reduced-motion, and non-WebGL paths remain complete.
- [ ] Pointer layering allows both world and DOM interaction without conflicts.

Stop after the new portfolio hierarchy is accepted. Final character art and presentation polish belong to Phase 19.
