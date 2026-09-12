# Performance Budget

These are starting targets, not excuses to game metrics. Adjust only with evidence
and record the change.

## Experience priorities

1. Input/scroll responsiveness
2. Stable frame pacing
3. Fast first usable HTML
4. Progressive 3D readiness
5. Controlled GPU/memory pressure

## Initial targets

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

### Runtime
- No continuous React/Zustand state updates from `useFrame`
- No avoidable object allocations inside hot frame loops
- No duplicate ScrollTriggers after remount/resize
- Dispose runtime-created Three.js resources
- Keep shadow and post-processing passes intentional

## Measurement log

| Date | Device/browser | Scenario | FPS/frame time | JS | 3D assets | Notes |
|---|---|---|---|---|---|---|
| | | | | | | |
