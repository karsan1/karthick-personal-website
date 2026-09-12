# Codex Execution Guide — 3D Tennis Portfolio

## Purpose
Use this guide when implementing the phase files with Codex or another coding agent. It keeps the agent from over-scoping, rewriting stable systems, or optimizing the wrong things too early.

---

## Recommended workflow
For each phase:
1. give Codex `00_MASTER_ROADMAP.md`, this guide, and **one** phase file,
2. ask it to inspect the repository before editing,
3. implement only unchecked requirements from that phase,
4. require validation commands,
5. manually review the Vercel preview for animation/art changes,
6. mark criteria complete only after review,
7. commit/merge,
8. move to the next phase.

---

## Standard prompt

```text
Read plans/00_MASTER_ROADMAP.md, plans/CODEX_EXECUTION_GUIDE.md, and plans/XX_PHASE.md.

Inspect the current repository first. Implement only the next incomplete items from XX_PHASE.md. Do not begin later phases and do not replace established architecture unless the current phase explicitly requires it.

Important constraints:
- keep one persistent R3F Canvas,
- keep semantic portfolio content in HTML,
- never push per-frame transforms/scroll progress through React state,
- GSAP/ScrollTrigger owns master scroll choreography,
- R3F refs/useFrame own high-frequency transforms,
- Zustand is only for coarse application state,
- preserve reduced-motion and WebGL fallback paths,
- avoid unnecessary dependencies.

Before finishing:
- run lint,
- run typecheck,
- run tests relevant to the change,
- run production build,
- explain any validation you could not perform,
- summarize files changed,
- list remaining unchecked acceptance criteria.
```

---

## Prompt for visual bugs

```text
Treat this as a visual/timeline bug, not a reason to redesign the architecture.
Reproduce it first. Identify whether the owner is:
1. master GSAP timeline,
2. camera rig,
3. ball trajectory,
4. animation mixer/clip timing,
5. DOM overlay,
6. responsive matchMedia configuration,
7. asset transform/origin.

Fix the smallest responsible subsystem and regression-check adjacent chapter labels.
```

---

## Prompt for performance work

```text
Profile before changing visual quality. Report the likely bottleneck category: network, GLB decode, texture/VRAM, draw calls, GPU frame cost, main-thread JS, React rerenders, raycasting, or GSAP/scroll work.

Do not lower quality until you can explain what cost the change removes. Prefer resource reuse, instancing, compression, right-sized textures, reduced render work, and eliminating per-frame React updates before visibly degrading hero assets.
```

---

## Agent guardrails
Reject or question changes that introduce:
- a second full-screen Canvas,
- React `setState` in `useFrame`,
- global Zustand scroll progress updated each frame,
- new animation library without clear justification,
- physics engine just for deterministic tennis shots,
- giant monolithic GLB with no loading rationale,
- 4K textures by default,
- desktop camera coordinates reused unchanged on mobile,
- critical links implemented only inside WebGL,
- autoplay audible sound,
- huge refactors while fixing one scene bug.

---

## What Codex is good for here
- scaffolding React/R3F components,
- typed data models,
- GSAP timeline plumbing,
- curve helpers,
- deterministic progress mapping,
- GLB optimization scripts,
- responsive configuration structures,
- tests around timeline math,
- Vercel/Next.js configuration,
- accessibility/fallback DOM.

## What still needs human visual judgment
- camera composition,
- tennis swing credibility,
- lighting quality,
- exact material feel,
- whether motion feels nauseating,
- whether the design looks tacky,
- timing of reading pauses,
- whether character style looks uncanny.

Do not let an agent's "technically complete" status replace visual review.
