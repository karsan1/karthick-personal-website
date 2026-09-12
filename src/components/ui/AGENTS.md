# UI Scope Instructions

Applies to files under `src/components/ui/`.

- Portfolio information must remain semantic HTML.
- Maintain keyboard navigation and visible focus states.
- Critical content cannot depend on hover or WebGL.
- Mobile layout should be intentionally composed, not merely scaled down.
- Keep client components minimal.
- Avoid a second animation system without an ADR in `docs/DECISIONS.md`.
- Prefer restrained editorial styling over glassmorphism/HUD aesthetics.
- Use CodeGraph to identify consumers before changing shared component APIs.
