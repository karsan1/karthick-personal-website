# 3D Tennis Portfolio — Master Implementation Roadmap

## Product vision
Build a premium interactive personal website presented as a stylized-realistic tennis match. The tennis court is not decorative background art: it is the site's spatial navigation and storytelling system. Scroll progression drives a choreographed match while accessible HTML overlays communicate the actual portfolio content.

The finished experience should feel closer to an editorial sports campaign / interactive product launch than a game or typical "3D developer portfolio".

## Non-negotiable design principles
1. **Portfolio first.** Visitors must be able to understand who you are, what you do, and what you built even if WebGL fails.
2. **One persistent 3D world.** Use one long-lived R3F Canvas. Do not mount a different Canvas for every section.
3. **HTML for meaningful content.** Resume text, links, project descriptions, contact details, navigation, accessibility labels, and SEO content stay in the DOM.
4. **3D for storytelling.** Court, ball, players, umpire, scoreboard, camera, lighting, props, and environmental motion belong in R3F/Three.js.
5. **Motion is authored, not random.** Camera and ball movement are choreographed around the narrative.
6. **Stylized realism, not photorealism.** Real proportions and convincing motion; restrained materials and faces.
7. **Performance is a feature.** Every asset has a performance budget before it enters production.
8. **Mobile is a separate composition.** Same story and content, reduced scene complexity and different camera choreography.
9. **Reduced motion is first-class.** Never force cinematic movement on users who request reduced motion.
10. **No tacky WebGL defaults.** Avoid excessive bloom, neon gradients, glass cards, particle spam, cursor gimmicks, constant camera parallax, and giant 3D typography.

---

## Recommended stack

### Core
- Next.js App Router
- React 19
- TypeScript
- React Three Fiber 9
- Three.js
- Drei
- GSAP + ScrollTrigger
- Zustand
- CSS Modules or Tailwind CSS for DOM UI
- Blender for modeling, lighting references, rig cleanup, and animation editing
- GLB / glTF for 3D delivery
- glTF Transform for optimization
- Meshopt preferred for general GLB compression; KTX2/Basis for production texture compression
- Vercel for deployment, previews, production hosting, analytics
- GitHub for source control and preview-deployment workflow

### Optional, only when justified
- Mixamo or mocap source for base tennis animations, edited in Blender
- postprocessing package for subtle AO/DOF, only after performance gates pass
- Howler/Web Audio for opt-in ambience if native audio management becomes cumbersome
- Sentry only if runtime error telemetry becomes useful

### Explicitly avoid at the start
- Spline as the main scene authoring/runtime
- Framer Motion in addition to GSAP unless a later DOM-only use case clearly needs it
- smooth-scroll libraries before native scroll + ScrollTrigger has been proven insufficient
- physics engine for the tennis ball; use authored trajectories for deterministic scroll scrubbing
- CMS before portfolio content actually becomes hard to maintain

---

## System architecture

```text
Browser document
├── Persistent fixed R3F Canvas
│   ├── Court / stadium
│   ├── Player A / Player B
│   ├── Ball
│   ├── Umpire
│   ├── Scoreboard
│   ├── Props
│   ├── Camera rig
│   └── Lighting / atmosphere
│
├── Scroll narrative DOM
│   ├── Hero
│   ├── About
│   ├── Experience chapters
│   ├── Research
│   ├── Projects
│   ├── Skills / capabilities
│   └── Contact
│
└── Global UI
    ├── Navigation
    ├── Sound toggle
    ├── Reduced-motion / fallback handling
    └── Resume / GitHub / LinkedIn links
```

### State ownership
- **GSAP timeline:** master scroll choreography and DOM transition timing.
- **R3F refs/useFrame:** high-frequency mesh transforms, interpolation, camera damping, procedural motion.
- **AnimationMixer/actions:** character skeletal clips.
- **Zustand:** coarse state only — active chapter, quality tier, sound setting, navigation intent, loaded state.
- **React state:** ordinary UI state that does not update every frame.

Never write scroll progress or 60 FPS transforms into React state.

---

## Phase order

| Phase | File | Outcome |
|---|---|---|
| 0 | `01_FOUNDATION_ARCHITECTURE.md` | Production-ready app shell and architectural contracts |
| 1 | `02_INTERACTION_PROTOTYPE.md` | Ugly but convincing court + ball + camera scroll prototype |
| 2 | `03_CONTENT_AND_INFORMATION_ARCHITECTURE.md` | Real portfolio story mapped to tennis beats |
| 3 | `04_BLENDER_ASSET_PIPELINE.md` | Optimized production court/environment pipeline |
| 4 | `05_CHARACTERS_AND_ANIMATION.md` | Players + umpire with clean reusable clips |
| 5 | `06_SCROLL_CAMERA_CHOREOGRAPHY.md` | Master match timeline, camera, ball, section synchronization |
| 6 | `07_UI_NAVIGATION_AND_PROJECT_INTERACTIONS.md` | Usable portfolio overlay, scoreboard nav, projects |
| 7 | `08_LIGHTING_MATERIALS_AUDIO_POLISH.md` | Art direction and premium presentation |
| 8 | `09_PERFORMANCE_OPTIMIZATION.md` | Stable performance across device classes |
| 9 | `10_MOBILE_ACCESSIBILITY_FALLBACKS.md` | Mobile composition + reduced-motion + non-WebGL fallback |
| 10 | `11_TESTING_QA.md` | Cross-browser/device and regression gates |
| 11 | `12_VERCEL_DEPLOYMENT_AND_ANALYTICS.md` | Preview/prod deployment, monitoring, launch workflow |
| 12 | `13_POST_LAUNCH_CONTENT_MAINTENANCE.md` | Maintainable content and safe iteration model |

---

## Milestone gates

### Gate A — Interaction proof
Do not model detailed characters yet. The primitive prototype must already feel good when:
- scrolling throws a ball over the net,
- the camera responds smoothly,
- content becomes readable at intentional pauses,
- reverse scrolling behaves correctly,
- resizing does not break the timeline.

If Gate A fails, fix choreography before adding art.

### Gate B — Content proof
Before detailed assets:
- all real About / Experience / Research / Projects / Contact content exists,
- every major section has a narrative purpose,
- a visitor can reach any section directly through navigation,
- the site remains understandable with Canvas hidden.

### Gate C — Asset proof
Before visual polish:
- no single hero GLB is unreasonably large,
- all repeated geometry/materials can be reused,
- animation clip names and skeletons are stable,
- texture dimensions and compression plan are documented.

### Gate D — Launch performance
Before production:
- desktop maintains smooth interaction on a representative laptop,
- mobile remains usable on a representative recent iPhone/Android class device,
- reduced-motion version is fully functional,
- no core navigation depends on audio or WebGL,
- production bundle and asset waterfall have been inspected.

---

## Suggested Git branching

```text
main                    production
└── develop             integration
    ├── feat/foundation
    ├── feat/scroll-prototype
    ├── feat/content
    ├── feat/assets
    ├── feat/characters
    ├── feat/choreography
    ├── feat/ui
    ├── perf/scene
    └── fix/mobile-qa
```

Prefer small PRs that complete one acceptance criterion. Vercel preview deployments should be used for visual review.

---

## Codex execution rule
When handing a phase to Codex, use only that phase file plus the master roadmap. Do not ask Codex to "build the entire site". Each phase defines its own completion gate.

Recommended prompt:

> Implement the next incomplete checklist items in `plans/XX_PHASE.md` while respecting `plans/00_MASTER_ROADMAP.md`. Do not begin later phases. Preserve existing architecture unless the phase explicitly authorizes a refactor. Run the project's validation commands before finishing, summarize changed files, and mark completed checklist items only when their acceptance criteria are met.

---

## Definition of done
The site is complete when it is simultaneously:
- memorable as an interactive tennis experience,
- easy to read as a professional portfolio,
- performant enough not to punish visitors,
- accessible without motion/audio/WebGL,
- maintainable without reopening Blender for ordinary résumé edits,
- safely deployable through Vercel preview → production promotion.
