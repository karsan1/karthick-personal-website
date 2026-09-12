# Current Project State

## Current phase

Phases 01 foundation, 02 interaction prototype, and 03 content/information
architecture are complete.

## Current objective

- Use the accepted scroll-controlled primitive rally as the coordinate and timing
  reference for the next production phase.

## Completed

- Next.js App Router shell with one persistent, client-only R3F Canvas and semantic portfolio content.
- Coarse Zustand state, browser-safe GSAP/ScrollTrigger registration, WebGL fallback, loading state, and `?debug=1` helpers.
- Typed portfolio data, centralized chapter/match beats, production section copy, hash navigation, and a consistent DOM project-detail interaction.
- Semantic hero, about, experience, research, projects, capabilities, and contact sections that remain readable without WebGL.
- A scroll-scrubbed primitive serve/rally with deterministic curve sampling,
  independent camera keyframes, capsule-player response, quiet content cues,
  debug markers/readout, lifecycle cleanup, and a reduced-motion resting pose.

## In progress / known gaps

- No runtime performance measurements are recorded yet; production models,
  textures, and detailed character clips are still intentionally absent.

## Current architecture facts

- One persistent R3F Canvas; semantic portfolio content remains in the DOM.
- GSAP/ScrollTrigger owns narrative progress; `useFrame`/refs own realtime transforms; Zustand is coarse state only.
- CodeGraph is configured and is the first choice for cross-file discovery.
- Canvas DPR is bounded to 1–2; production models, textures, and measured desktop/mobile quality tiers do not exist yet.

## Do not work on yet

- Production Blender assets, character animation, visual polish, audio, or deployment work before the interaction proof is accepted.

## Next milestone

Phase 04 asset-pipeline work may now begin, using the prototype court coordinate
contract and motion labels as its integration reference.
