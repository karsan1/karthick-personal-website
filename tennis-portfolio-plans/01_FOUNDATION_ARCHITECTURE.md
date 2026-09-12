# Phase 01 — Foundation & Architecture

## Objective
Create a boring, stable foundation for the 3D experience before introducing production assets or complicated animation.

## Deliverable
A deployable Next.js application with a single persistent R3F Canvas, DOM content layer, state boundaries, loading shell, and project conventions.

---

## Decisions to lock
- Next.js App Router.
- React 19-compatible R3F 9.
- TypeScript strict mode.
- `pnpm` preferred for package management and deterministic lockfile.
- One full-screen Canvas mounted once on the main experience route.
- Canvas loaded client-side; semantic portfolio DOM must not depend on WebGL hydration.
- GSAP is the single primary animation/choreography library.
- Zustand stores only low-frequency application state.
- CSS Modules or Tailwind: choose one and stay consistent. Do not add a component framework unless needed.

---

## Initial dependencies

```bash
pnpm add three @react-three/fiber @react-three/drei gsap zustand
pnpm add -D @types/three
```

Add optimization tooling later in the asset phase rather than inflating the initial install.

---

## Target structure

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── error.tsx
│   └── not-found.tsx
├── components/
│   ├── experience/
│   │   ├── ExperienceShell.tsx
│   │   ├── ExperienceCanvas.tsx
│   │   └── WebGLGuard.tsx
│   ├── scene/
│   │   ├── Scene.tsx
│   │   ├── Lighting.tsx
│   │   └── DebugScene.tsx
│   ├── camera/
│   │   └── CameraRig.tsx
│   └── ui/
│       ├── PortfolioLayer.tsx
│       ├── Navigation.tsx
│       └── LoadingOverlay.tsx
├── data/
│   └── portfolio.ts
├── hooks/
│   ├── useReducedMotion.ts
│   └── useWebGLSupport.ts
├── store/
│   └── experienceStore.ts
├── lib/
│   └── gsap.ts
└── types/
    └── portfolio.ts
public/
├── models/
├── textures/
├── audio/
└── images/
```

---

## Implementation tasks

### 1. Create the application shell
- Configure metadata, title template, description, OG defaults, icons.
- Add a semantic `<main>` containing actual portfolio sections even while visually incomplete.
- Keep SEO-critical content server-rendered where possible.

### 2. Establish the client boundary
`ExperienceCanvas.tsx` should be a client component. Avoid marking the entire app tree `use client`.

The page should resemble:

```text
Server-rendered page
├── semantic content/data
├── client ExperienceShell
│   └── client Canvas
└── semantic section markup
```

### 3. Persistent Canvas
- Fixed to viewport.
- `pointer-events` controlled intentionally.
- no remount while scrolling between chapters.
- camera created once.
- production scene wrapped in Suspense boundaries.

### 4. State contract
Suggested Zustand shape:

```ts
type QualityTier = 'low' | 'medium' | 'high'

type ExperienceState = {
  activeChapter: string
  qualityTier: QualityTier
  sceneReady: boolean
  soundEnabled: boolean
  navigationTarget: string | null
}
```

Do **not** add `scrollProgress`, ball position, camera position, pointer coordinates, or animation frame data to Zustand.

### 5. GSAP integration contract
- Register ScrollTrigger only in browser-safe code.
- centralize plugin registration.
- every GSAP context/timeline must clean itself up on unmount.
- use `gsap.matchMedia()` later for desktop/mobile/reduced-motion choreography.

### 6. Debug controls
Development-only query flag or environment flag:

```text
?debug=1
```

Can enable:
- axes helper,
- camera coordinate readout,
- FPS/performance panel,
- ScrollTrigger markers,
- chapter/progress label.

Ensure debug utilities are disabled from normal production UX.

### 7. Baseline fallback
If WebGL cannot initialize:
- hide the Canvas,
- show an attractive static background,
- preserve full portfolio content and navigation.

---

## Architecture rules for future phases
1. No component may create a second full-screen Canvas.
2. No `setState()` inside `useFrame`.
3. Reuse geometry and materials when possible.
4. Avoid runtime mount/unmount churn for heavy 3D groups; prefer `visible` where appropriate.
5. All production models use consistent units and origin conventions.
6. Asset paths are centralized rather than scattered string literals.
7. Each phase must preserve non-WebGL content functionality.

---

## Validation
- `pnpm lint`
- `pnpm typecheck` (add script if absent)
- `pnpm build`
- app loads with JavaScript enabled.
- content still exists if Canvas is manually hidden.
- Canvas survives navigation/scroll without remounting.
- no hydration errors.
- resize/orientation change does not throw.

## Acceptance criteria
- [x] Next.js app boots and builds cleanly.
- [x] One persistent R3F Canvas exists.
- [x] DOM portfolio layer and Canvas are architecturally separate.
- [x] Zustand contains only coarse state.
- [x] GSAP integration has deterministic cleanup.
- [x] WebGL fallback exists.
- [x] Debug mode can be enabled without affecting production UI.

## Do not proceed until
A plain box/sphere can render in Canvas while ordinary HTML content remains usable above it.
