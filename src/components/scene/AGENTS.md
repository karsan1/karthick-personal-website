# Scene Scope Instructions

Applies to files under `src/components/scene/`.

- This directory owns scene rendering, not portfolio information architecture.
- Avoid React/Zustand writes in `useFrame`.
- Reuse temporary Three.js math objects outside render loops.
- Keep GLTF node/clip assumptions explicit and typed where practical.
- Reuse materials/geometries where meaningful.
- Avoid unnecessary shadow casters.
- Dispose runtime-created resources.
- Scene components should accept normalized/high-level animation inputs rather than
  independently interpreting page scroll.
- Do not create additional `<Canvas>` roots.
- Coordinate narrative timing through the animation layer.
- Use CodeGraph to inspect consumers before changing component interfaces.
