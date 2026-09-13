# Architecture Decision Log

Keep durable decisions here so future agents do not spend tokens reopening settled
architecture questions.

---

## ADR-001 — One persistent React Three Fiber Canvas

**Status:** Accepted

**Decision:** The primary experience uses one persistent R3F Canvas.

**Why:** Preserves WebGL resources and makes scene transitions/camera choreography
continuous.

**Do not:** Create a Canvas per portfolio section.

---

## ADR-002 — Animation state ownership

**Status:** Accepted

**Decision:**
- GSAP/ScrollTrigger owns high-level narrative timeline progress.
- R3F `useFrame` and refs apply per-frame transforms.
- Zustand stores only coarse application/UI state.

**Do not:** Write continuous scroll/position/rotation values into React or Zustand
state every frame.

---

## ADR-003 — Portfolio content stays in the DOM

**Status:** Accepted

**Decision:** Important résumé/project/about/contact content remains semantic HTML.

**Why:** Accessibility, SEO, selection, responsiveness, maintainability and graceful
fallback behavior.

---

## ADR-004 — GSAP is the primary motion system

**Status:** Accepted

**Decision:** Use GSAP/ScrollTrigger plus Three.js/R3F animation facilities.

**Do not:** Add Framer Motion or another general animation framework unless a
specific requirement cannot reasonably be solved with the existing stack and a new
ADR is approved.

---

## ADR-005 — Stylized realism over photoreal humans

**Status:** Superseded by ADR-007

**Decision:** Players/umpire use clean stylized-realistic proportions/materials and
believable tennis animation without attempting uncanny photoreal faces.

**Historical note:** This governed the pre-retro roadmap and remains useful
context for the completed Phase 04 environment baseline. It no longer defines
future character or environment art direction.

---

## ADR-006 — CodeGraph-first repository discovery

**Status:** Accepted

**Decision:** Agents use CodeGraph for cross-file orientation, dependency/impact and
symbol discovery before broad source reads.

**Why:** Reduces duplicate repository scans and token use while preserving exact
compiler/test validation.

**Do not:** Use CodeGraph as a replacement for typecheck, tests, runtime validation
or profiling.

---

## ADR-007 — Retro low-poly art direction beginning at Phase 05

**Status:** Accepted

**Context:** Phases 01–04 established and validated the application architecture,
deterministic rally, semantic portfolio, and optimized Blender environment. Before
Phase 05, the intended stylized-realistic character direction was replaced with a
more distinctive retro visual target.

**Decision:** Adopt a deliberately low-poly early-console tennis-game visual
direction beginning at Phase 05. It may evoke PS1/N64/early-2000s sports-game
visual language but must not copy a particular copyrighted game. Keep the main
DOM portfolio UI modern, professional, semantic, and readable. Prefer Blockbench
and `.bbmodel` sources for new low-poly character assets; Blender is optional for
new work and remains supported for Phase 04 assets and legacy migration. Runtime
delivery remains glTF/GLB regardless of authoring tool.

**Preserve:**
- one persistent R3F Canvas and the existing React/Three.js ownership boundaries,
- GSAP/ScrollTrigger narrative progress and `useFrame`/refs for per-frame mutation,
- deterministic ball, player, camera, and scroll choreography contracts,
- semantic DOM content, reduced-motion behavior, and WebGL fallbacks,
- the functional Phase 04 Blender environment until validated replacements ship,
- glTF Transform, Meshopt, manifests, validation, and optional KTX2/Basis where appropriate.

**Change:**
- character visual language from stylized realism/capsules to intentional low-poly forms,
- character authoring preference from Blender-first to Blockbench-first,
- later environment geometry, palette, materials, and presentation toward the retro direction.

**Consequences:** Character animation may use intentionally stepped sampling while
the ball, camera, master scroll, and DOM remain smooth. The existing Phase 04
environment is a transitional baseline, not obsolete work. Its assets and sources
may be retired only after later retro replacements are integrated and validated.

**Do not:** Add a physics engine for the deterministic rally, rasterize important
portfolio content into WebGL, apply retro effects to DOM readability, require
Blender for new character work, or delete Phase 04 assets during migration setup.

---

## ADR template

### ADR-XXX — <title>

**Status:** Proposed | Accepted | Superseded

**Context:**

**Decision:**

**Consequences:**

**Do not:**
