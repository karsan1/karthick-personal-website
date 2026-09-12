# Phase 03 — Portfolio Content & Information Architecture

## Objective
Map the real portfolio into the match before visual production locks the camera and timing.

## Deliverable
A typed content model, final section order, section copy, navigation model, and match beat map.

---

## Recommended top-level narrative
1. **Hero / Serve** — identity + professional positioning
2. **About / First bounce** — concise personal introduction
3. **Experience / Rally** — major roles, one exchange per role/chapter
4. **Research / Change of rhythm** — research and technical depth
5. **Projects / Sideline sequence** — interactive project selection
6. **Capabilities / Between points** — technologies, methods, domains
7. **Contact / Match point** — links, email, résumé, closing sequence

Do not put every résumé bullet on the cinematic route. Use concise summaries with optional expansion.

---

## Typed content schema
Create data in `src/data/portfolio.ts` or split by domain.

Suggested interfaces:

```ts
interface ExperienceItem {
  id: string
  organization: string
  role: string
  period: string
  location?: string
  summary: string
  highlights: string[]
  technologies?: string[]
}

interface ProjectItem {
  id: string
  title: string
  summary: string
  technologies: string[]
  href?: string
  repoHref?: string
  image?: string
  featured: boolean
}

interface ResearchItem {
  id: string
  title: string
  institution: string
  summary: string
  methods: string[]
  href?: string
}
```

Content should be editable without touching scene code.

---

## Story-to-match beat sheet
Create a single source of truth like:

```ts
const chapters = [
  { id: 'hero', start: 0.00, end: 0.10 },
  { id: 'about', start: 0.10, end: 0.22 },
  { id: 'experience', start: 0.22, end: 0.52 },
  { id: 'research', start: 0.52, end: 0.66 },
  { id: 'projects', start: 0.66, end: 0.84 },
  { id: 'contact', start: 0.84, end: 1.00 },
]
```

Exact numbers will evolve, but chapter metadata should become centralized.

---

## Writing constraints
For cinematic overlays:
- headline: 2–7 words,
- subheading: one sentence,
- body: ideally 30–80 words visible at once,
- highlights: 2–4 concise bullets,
- deeper information via expandable drawer/modal/detail route.

Do not make users read dense résumé paragraphs while the camera is moving.

---

## Navigation semantics
Global navigation should support:
- About
- Experience
- Research
- Projects
- Contact
- Resume

Clicking a scene chapter should smoothly navigate to that section's scroll position. The URL may optionally update with hashes.

Keyboard users must be able to use the same navigation without touching the 3D world.

---

## Project interaction model
Choose one primary presentation technique; do not create a different gimmick per project.

Recommended:
- courtside boards / stadium panels represent featured projects,
- selecting one opens a DOM detail panel,
- 3D board reacts subtly on hover/focus,
- links remain DOM anchors.

Alternative ball-rack interaction may be added later only if it tests better.

---

## Accessibility content pass
For every 3D metaphor ask:
> If the tennis visualization disappeared, is the information still understandable?

Provide semantic headings in proper order, meaningful link labels, and visible focus states.

---

## Acceptance criteria
- [x] All real portfolio sections have production content.
- [x] Content data is separated from rendering logic.
- [x] Each chapter has a defined match/camera beat.
- [x] Global navigation reaches every section.
- [x] Projects have a consistent interaction model.
- [x] Full portfolio remains comprehensible without WebGL.
