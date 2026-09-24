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
The runtime consumes the same GLB contract whether an asset was authored in
Blockbench or Blender; it must not branch on authoring tool.

**Do not:** Add a physics engine for the deterministic rally, rasterize important
portfolio content into WebGL, apply a global pixel-art postprocess that damages DOM
readability, require Blender for new character work, or delete Phase 04 assets
during migration setup.

---

## ADR-008 — Retain the Phase 04 Blender fallback in Phase 13

**Status:** Accepted

**Context:** The procedural Phase 09 environment is the primary scene, but the
runtime can still select or fall back to the staged Phase 04 environment GLBs. The
default asset build also consumes the corresponding Blender source exports.

**Decision:** Retain `assets-source/blender/`, `assets-source/blender-exports/`,
their reproduction instructions, and the optimized environment GLBs in their
current supported locations. Treat them as an intentional legacy fallback rather
than an unfinished primary authoring workflow. Reconsider archival only after the
runtime fallback and build dependency have been deliberately replaced and the
Phase 13 environment regression gate passes without them.

**Consequences:** New character work remains Blockbench-first, while legacy
environment recovery stays reproducible. Ordinary portfolio content edits require
neither 3D authoring tool. Phase 13 cleanup removes obsolete claims, not recoverable
sources that are still live dependencies.

**Do not:** Move or delete the Phase 04 source/export directories, remove their
optimizer path, or claim the fallback is retired while runtime/build references
remain.

---

## ADR-009 — Make the tennis world the primary portfolio navigation surface

**Status:** Accepted

**Context:** The accepted Phase 10–13 presentation uses the retro tennis world as
a persistent visual backdrop while large DOM sections remain the dominant
experience. Phase 14 intentionally reverses that hierarchy. The existing chapter
and navigation data remain the canonical destination owners; the reframe does not
justify a parallel route model or new chapter identifiers by itself.

**Decision:** Treat the court, players, and stadium as the primary visual and
navigation surface. Exploration uses authored scrolling plus selectable world
objects; free-roam controls are out of scope. Scroll, semantic navigation, hashes,
deep links, project selection, and world selections must resolve through the same
chapter destination behavior. A world selection requests a chapter/scroll target;
it never controls the camera independently of the GSAP narrative timeline.

Accept five canonical world stations:

- Karthick player -> About
- courtside bench and kit bag -> Experience
- umpire chair / strategy station -> Research
- main scoreboard -> Projects
- player tunnel / stadium exit -> Contact

Intentionally classify two additional objects as contextual actions, not new
narrative chapters: the equipment rack opens the capabilities/toolkit content
within About, and the clipboard / resume placard exposes the semantic resume view
or download from Experience. They may receive stable hotspot identifiers, but
Phase 14 does not expand the chapter schema for them.

**Consequences:** The opening identity UI and active content surfaces become
restrained contextual DOM layers so the court remains visually dominant. Every
world interaction requires an equivalent semantic DOM control and must remain
reachable by keyboard, screen reader, reduced-motion mode, and the non-WebGL
fallback. Important copy and project details remain HTML. The single persistent
Canvas, coarse Zustand ownership, deterministic motion, quality/audio/performance
controls, and Phase 04 Blender fallback remain intact.

**Do not:** Add direct camera mutation from hotspots, a second navigation state
machine, WASD/free-flight controls, WebGL-only content or actions, continuous
pointer/camera data in Zustand, or Phase 15 runtime code as part of this decision.

---

### ADR-010 — Use pixel sprites for production tennis characters

**Status:** Accepted

**Context:** The V8 Blockbench players and venue cast were replaced by the
pixel-sprite feature branch and selected for the `main` production experience.

**Decision:** Render the two rally players, audience, four ball kids, and chair
umpire from PNG atlases in the existing R3F scene. Keep GSAP master progress,
deterministic rally sampling, one Canvas, semantic navigation, reduced-motion
behavior, and the Phase 04 environment fallback. Do not continue Blockbench
character production for this experience.

**Consequences:** Historical Blockbench sources and GLBs may remain for recovery,
but normal scene rendering must not request character GLBs. The sprite cast is the
current visual baseline for future venue work.

---

## ADR template

### ADR-XXX — <title>

**Status:** Proposed | Accepted | Superseded

**Context:**

**Decision:**

**Consequences:**

**Do not:**
