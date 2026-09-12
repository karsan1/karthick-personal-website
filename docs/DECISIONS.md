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

**Status:** Accepted

**Decision:** Players/umpire use clean stylized-realistic proportions/materials and
believable tennis animation without attempting uncanny photoreal faces.

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

## ADR template

### ADR-XXX — <title>

**Status:** Proposed | Accepted | Superseded

**Context:**

**Decision:**

**Consequences:**

**Do not:**
