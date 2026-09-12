# Current Project State

## Current phase

Phases 01 foundation, 02 interaction prototype, 03 content/information
architecture, and 04 Blender/3D asset pipeline are complete.

## Current objective

- Use the verified environment partitions and coordinate contract as the base for
  the next character and animation milestone.

## Completed

- Next.js App Router shell with one persistent, client-only R3F Canvas and semantic portfolio content.
- Coarse Zustand state, browser-safe GSAP/ScrollTrigger registration, WebGL fallback, loading state, and `?debug=1` helpers.
- Typed portfolio data, centralized chapter/match beats, production section copy, hash navigation, and a consistent DOM project-detail interaction.
- Semantic hero, about, experience, research, projects, capabilities, and contact sections that remain readable without WebGL.
- A scroll-scrubbed primitive serve/rally with deterministic curve sampling,
  independent camera keyframes, capsule-player response, quiet content cues,
  debug markers/readout, lifecycle cleanup, and a reduced-motion resting pose.
- Partitioned Blender-export GLBs for court, stadium shell, props, and
  scoreboard. The court streams with a primitive fallback; decorative partitions
  load independently after the initial interaction is available.
- A repeatable Blender Python source-generation/export workflow plus a Meshopt
  production-optimization and GLB-validation pipeline. Calibration fixtures remain
  available for fallback tests; the current static art has no raster textures.

## In progress / known gaps

- Detailed characters and animation clips are intentionally absent pending their
  dedicated phase. The current environment deliberately uses material factors
  instead of raster textures, so KTX2 is not yet applicable.

## Current architecture facts

- One persistent R3F Canvas; semantic portfolio content remains in the DOM.
- GSAP/ScrollTrigger owns narrative progress; `useFrame`/refs own realtime transforms; Zustand is coarse state only.
- CodeGraph is configured and is the first choice for cross-file discovery.
- Canvas DPR is bounded to 1–2. Static environment GLBs use PBR colors only,
  validate under 100KB per partition, and use Meshopt with an explicit decoder.
  The asset validator rejects unbudgeted raster textures; KTX2 will be introduced
  only when a later authored asset actually requires it.

## Do not work on yet

- Detailed character assets/clips, texture authoring, visual polish, audio, or
  deployment work before their respective phases are accepted.

## Next milestone

Begin the character and animation milestone using the accepted Blender naming,
origin, partition, and web-optimization contracts.
