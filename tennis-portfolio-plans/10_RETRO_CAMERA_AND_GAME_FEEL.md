# Phase 10 — Retro Camera, Match Choreography & Game Feel

## Objective

Retune the existing scroll/camera/rally choreography so it feels like an authored retro tennis game while remaining comfortable to navigate as a portfolio.

This phase does not invent a second timeline. It refines the existing normalized narrative system.

---

## Primary agents

- Owner: `motion_engineer`
- Scene hooks: `scene_engineer`
- UI chapter coordination: `ui_engineer`
- Review: `qa_reviewer`

---

## Preserve the master architecture

One normalized narrative progress continues to drive:

```text
master progress
├── camera
├── ball
├── Player A clip
├── Player B clip
├── scoreboard
├── scene emphasis
└── DOM chapter transitions
```

Do not introduce independent competing ScrollTriggers for each character/effect.

---

## Retro sports-game camera language

Prefer compositions inspired by classic sports presentation:

- elevated baseline game camera,
- slightly compressed perspective,
- occasional courtside angle,
- scoreboard/stadium establishing shot,
- restrained close-up only for major narrative beats,
- stable reading compositions.

Avoid:

- constant orbiting,
- first-person camera,
- excessive roll,
- camera shake during scrolling,
- huge cinematic fly-throughs between every portfolio section.

---

## Camera transitions

Use two modes:

### Gameplay interpolation
Longer smooth interpolation during rally movement.

### Soft cuts
Short deliberate transition windows between clearly different compositions.

A "soft cut" should feel like a game camera switching angle, but remain deterministic and tolerable when scrubbed backward.

Do not use literal discontinuous teleports unless visual QA proves they work while scrolling.

---

## Reading windows

During About/Experience/Research/Project copy:

- camera movement should nearly stop,
- ball motion should pause or settle into a visually meaningful state,
- character animation should reduce to ready/idle pose,
- background should remain supportive rather than distracting.

The retro game exists to frame the portfolio, not compete with it.

---

## Game-feel effects

Add only effects that improve readability/impact.

Candidates:

### Ball shadow
A simple projected/blob shadow under the ball can strongly improve trajectory readability.

### Contact squash/impact
Very subtle one- or two-frame scale/pose emphasis at racket contact.

### Impact flash
A tiny restrained effect at hit contact if needed. Avoid anime-style explosions.

### Court bounce cue
A small shadow/scale/audio synchronization cue at bounce.

### Scoreboard state change
Chapter changes can feel like a game set/point update.

All effects must be derived from deterministic progress crossings, not random timers.

---

## Retro character stepping vs smooth world motion

Maintain the intentional contrast:

- camera = smooth,
- ball = smooth,
- character clip sample = stepped,
- DOM = smooth,
- scoreboard text/state = discrete chapter-driven updates.

This is the core "retro character in a modern interaction" feel.

---

## Chapter mapping

Review every existing content chapter and assign a court/game composition.

For each chapter document:

- narrative label,
- camera position,
- look target,
- player state,
- ball state,
- scoreboard state,
- allowed motion amount,
- DOM readability requirement.

Keep this data centralized where practical.

---

## Navigation jumps

DOM navigation continues to set the scroll/narrative target, not direct camera transforms.

Requirements:

- forward/back jump stable,
- reduced motion respected,
- hash/deep link restoration works,
- chapter state and scoreboard agree after jump,
- no broken intermediate character clip state.

---

## Responsive choreography

This phase owns the authored camera and narrative compositions for each viewport. Phase 12 validates and optimizes the complete mobile experience; it must not replace this camera ownership with a second choreography system.

Author separate compositions for:

- desktop wide,
- tablet/narrow desktop,
- mobile portrait,
- reduced motion.

Do not simply reuse desktop camera coordinates with a smaller FOV.

Mobile should favor:

- fewer angle changes,
- more stable court framing,
- less background detail,
- larger readable player silhouettes when helpful.

---

## Debug tooling

Extend current debug helpers rather than inventing a separate editor.

Useful values:

- master progress,
- chapter label,
- camera keyframe pair,
- shot id,
- local shot progress,
- active player clip,
- quantized clip time,
- contact delta.

Keep debug-only UI out of production by default.

---

## Acceptance criteria

Phase boundary: stop after Phase 10 choreography acceptance. Do not begin Phase 11
UI or scoreboard work without a new explicit request.

- [ ] One master narrative progress still owns choreography.
- [ ] Camera language feels intentionally like a retro sports game.
- [ ] Reading chapters settle into low-motion compositions.
- [ ] Ball/player/contact/scoreboard states stay synchronized.
- [ ] Retro character stepping does not make camera/ball movement choppy.
- [ ] Reverse scroll works through all camera transitions.
- [ ] Navigation jumps land in valid visual states.
- [ ] Mobile choreography is separately authored.
- [ ] Reduced-motion composition does not rely on cinematic transitions.
