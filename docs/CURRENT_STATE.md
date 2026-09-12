# Current Project State

## Current phase

Phase 01 foundation is complete. Phase 02 (`02_INTERACTION_PROTOTYPE.md`) is the next incomplete phase.

## Current objective

- Prove the scroll-controlled serve/rally and independent camera choreography with primitives.

## Completed

- Next.js App Router shell with one persistent, client-only R3F Canvas and semantic portfolio content.
- Coarse Zustand state, browser-safe GSAP/ScrollTrigger registration, WebGL fallback, loading state, and `?debug=1` helpers.

## In progress / known gaps

- The scene is foundation/debug geometry only; no scroll-driven ball or camera timeline is wired yet.
- Phase 02 acceptance criteria remain unchecked, and no runtime performance measurements are recorded.

## Current architecture facts

- One persistent R3F Canvas; semantic portfolio content remains in the DOM.
- GSAP/ScrollTrigger owns narrative progress; `useFrame`/refs own realtime transforms; Zustand is coarse state only.
- CodeGraph is configured and is the first choice for cross-file discovery.
- Canvas DPR is bounded to 1–2; production models, textures, and measured desktop/mobile quality tiers do not exist yet.

## Do not work on yet

- Production Blender assets, character animation, visual polish, audio, or deployment work before the interaction proof is accepted.

## Next milestone

Gate A: a reversible primitive rally with independent camera motion, readable content pauses, and resize-safe behavior.
