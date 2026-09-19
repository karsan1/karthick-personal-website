# Performance Budget

These are starting targets, not excuses to game metrics. Adjust only with evidence
and record the change.

## Experience priorities

1. Input/scroll responsiveness
2. Stable frame pacing
3. Fast first usable HTML
4. Progressive 3D readiness
5. Controlled GPU/memory pressure

## Release targets

### Desktop
- Target rendering: 60 FPS on a modern integrated/discrete GPU
- Avoid sustained long frames > 16.7 ms when practical
- DPR should be bounded rather than blindly matching high-density displays

### Mobile
- Prefer stable 30–60 FPS over visual parity with desktop
- Lower DPR/texture/shadow/post-processing quality deliberately
- Use a simplified camera/scene composition when appropriate

### Assets
- Keep initial critical 3D payload intentionally small
- Lazy-load stadium detail and secondary props
- Use optimized GLB/glTF assets
- Prefer KTX2/Basis or another GPU-friendly compressed texture strategy where
  supported by the chosen pipeline
- Avoid oversized textures whose texel density is never visible
- Keep the current environment partitions at or below 100KB each, except the
  scoreboard at 60KB; keep each player GLB at or below 80KB

### Runtime
- No continuous React/Zustand state updates from `useFrame`
- No avoidable object allocations inside hot frame loops
- No duplicate ScrollTriggers after remount/resize
- Dispose runtime-created Three.js resources
- Keep shadow and post-processing passes intentional

## Accepted static baseline

The Phase 20 static profile records 31,920 bytes across the six checked-in GLBs,
with Meshopt/quantization and no raster textures. The active Phase 16 procedural
environment has a 34-draw-submission ceiling, 11 shared materials, 11 instanced
groups, and 30/32/32 accounted submissions with 45/109/125 instances at
low/medium/high. Every tier retains the grass court, scoreboard, station
silhouettes, and venue structure; low removes seats/crowd and medium reduces the
crowd. High/medium/low cap DPR at 2/1.5/1 and use 1024/512/disabled shadows.

These static facts do not substitute for Phase 20 production-browser traces. Add
measured rows below with tested hardware/browser context; do not state a universal
FPS guarantee.

## Measurement log

| Date | Device/browser | Scenario | FPS/frame time | JS | 3D assets | Notes |
|---|---|---|---|---|---|---|
| Pending | Production/preview desktop | Hero, gameplay, project detail | Pending | Pending | 31,920 B checked-in GLBs | Capture quality tier and draw calls |
| Pending | Production/preview mobile | Hero, gameplay, project sheet | Pending | Pending | 31,920 B checked-in GLBs | Capture viewport, DPR tier, and thermal context |
