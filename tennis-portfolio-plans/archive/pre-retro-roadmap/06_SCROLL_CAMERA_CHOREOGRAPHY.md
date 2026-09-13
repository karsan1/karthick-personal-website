# Phase 06 — Master Scroll, Camera & Match Choreography

## Objective
Turn the prototype and production assets into one deterministic cinematic portfolio timeline.

## Deliverable
A master chapter timeline that synchronizes camera, ball, character animation, scene emphasis, and DOM content.

---

## Core rule
**One master normalized narrative progress** drives the experience. Individual subsystems map ranges of that progress to local progress.

Avoid a pile of unrelated ScrollTriggers fighting each other.

---

## Timeline architecture
Recommended layers:

```text
Master narrative timeline
├── camera track
├── ball track
├── player A animation track
├── player B animation track
├── umpire track
├── DOM content track
├── scoreboard track
└── scene lighting/emphasis track
```

ScrollTrigger owns master progression. Subsystems consume that progression.

---

## Chapter labels
Example:

```text
hero
serve_start
serve_contact
about
experience_01
experience_02
experience_03
research
projects_intro
project_gallery
match_point
contact
```

Labels are navigation anchors and QA checkpoints.

---

## Camera rig architecture
Use a rig group rather than mutating camera from many components.

```text
CameraRig
├── rig position
├── camera local transform
└── target object / target vector
```

Centralize camera updates in one controller.

Camera track can interpolate:
- rig position,
- look target,
- FOV,
- optional roll kept near zero.

Never allow project cards or player components to independently take over the camera.

---

## Camera authoring process
For each chapter:
1. define content objective,
2. choose desired court composition,
3. place camera keyframe,
4. define look target,
5. preview movement from previous keyframe,
6. minimize motion during reading,
7. only then tune ball/player action around it.

Narrative readability beats flashy camera moves.

---

## Ball sequencing
Represent match as shot definitions:

```ts
interface MatchShot {
  id: string
  chapter: string
  start: number
  contact: number
  bounce?: number
  end: number
  trajectoryId: string
  hitter: 'A' | 'B'
  animation: string
}
```

This metadata lets you test timing independently from rendering.

---

## Navigation jumps
Scoreboard/nav clicks should map chapter → scroll position.

Requirements:
- smooth jump,
- respect reduced motion,
- update active chapter,
- keyboard accessible,
- avoid leaving GSAP timeline in inconsistent state.

Do not directly set camera transforms on nav click; move narrative scroll position and let the timeline resolve the scene.

---

## Responsive choreography
Use `gsap.matchMedia()` to maintain separate setups:
- desktop wide,
- tablet / narrow desktop,
- mobile,
- reduced motion.

Do not merely multiply desktop camera coordinates by screen width.

---

## Scroll restoration
Test:
- reload at mid-page,
- browser back/forward,
- direct `#projects` entry if hashes are supported,
- resize after navigation,
- orientation change.

Call ScrollTrigger refresh at controlled points after fonts/assets/layout settle rather than continuously.

---

## Motion-quality checklist
- camera never clips through characters/net,
- horizon remains comfortable,
- no large acceleration during reading,
- fast ball motion does not force fast camera motion,
- reverse scrolling makes visual sense,
- bounce points visually touch court,
- hit contact is believable,
- navigation jumps do not show intermediate broken frames.

---

## Acceptance criteria
- [ ] One master timeline coordinates the experience.
- [ ] All chapters have timeline labels.
- [ ] Camera has one owner/controller.
- [ ] Ball/player contact is synchronized.
- [ ] DOM content appears at low-motion windows.
- [ ] Chapter navigation uses scroll/timeline, not camera hacks.
- [ ] Desktop/mobile/reduced-motion choreography can diverge cleanly.
- [ ] Reverse scrolling works through the entire site.
