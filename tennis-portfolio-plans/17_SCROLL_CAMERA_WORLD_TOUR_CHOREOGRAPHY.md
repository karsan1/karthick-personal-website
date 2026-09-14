# Phase 17 — Scroll + Camera World-Tour Choreography

## Objective

Re-author the deterministic scroll/camera experience around the Phase 16 pixel-sports venue so the site feels like moving through an old console tennis game rather than orbiting around a generic 3D stadium.

The visual source of truth is:

- `docs/PIXEL_SPORTS_COURT_ART_DIRECTION.md`

The Phase 16 court/station layout is assumed accepted before this phase begins.

---

## Primary agents

- Owner: `motion_engineer`
- Scene composition support: `scene_engineer`
- Review: `qa_reviewer`

---

## Core camera principle

The default visual identity should come from a **stable elevated baseline gameplay camera**, not from constant cinematic movement.

The supplied visual direction is strongest because the court geometry, players, net, walls, stands, and crowd all read at once from one recognizable game-screen angle.

Therefore:

> Use one strong gameplay camera family as the visual anchor, then derive chapter views as restrained crops/shifts from that family.

Avoid turning each portfolio section into a completely unrelated cinematic shot.

---

## Perspective target

First implementation attempt must keep the existing PerspectiveCamera architecture.

Approximate the classic 16-bit gameplay view with:

- elevated camera height,
- position close to the near baseline centerline,
- downward pitch,
- restrained left/right yaw,
- longer focal length / narrower FOV than the current dramatic wide-angle feel,
- minimal visible horizon,
- both baselines visible in Hero,
- near player in the lower portion of the frame,
- far player in the upper portion,
- crowd/signage visible above the far wall.

Do not switch the entire application to orthographic projection by default.

If PerspectiveCamera cannot achieve the desired compressed-depth game-screen look, create a **single bounded visual prototype** comparing perspective vs orthographic for the same Hero composition. Only adopt orthographic if it preserves:

- one camera owner,
- hotspot projection/hit accuracy,
- responsive behavior,
- reverse-scroll determinism,
- reduced-motion behavior.

No dual-camera narrative system.

---

## Narrative model

Keep one normalized master progress source.

Do not add a second navigation clock.

Suggested chapter flow:

```text
00 HERO / MATCH INTRO
   iconic full-court gameplay view

01 ABOUT
   restrained crop toward Karthick player

02 EXPERIENCE
   sideline shift toward bench

03 RESEARCH
   sideline/upper-court shift toward umpire/strategy area

04 PROJECTS
   far-wall / scoreboard emphasis

05 CAPABILITIES
   equipment-side crop

06 CONTACT
   end-match/tunnel composition
```

Résumé remains a direct action rather than a required narrative chapter.

---

## Hero composition — primary art-direction gate

The Hero camera is the single most important shot in the site.

Required visual contents:

- near and far baselines,
- service boxes,
- net,
- both players,
- warm clay surface dominating the frame,
- dark green perimeter walls,
- far-side stands/crowd,
- scoreboard/signage in venue context,
- compact identity UI that does not obscure gameplay.

The court should feel centered and slightly compressed in depth.

Avoid:

- dramatic diagonal perspective,
- low court-level camera,
- exaggerated wide-angle distortion,
- huge empty foreground,
- camera positioned so close that only half the court is visible.

A reviewer should immediately read “retro tennis game” before reading the portfolio copy.

---

## Camera language for later chapters

Use restrained variations of the gameplay view:

### About

- move slightly closer/lower toward the Karthick-side player,
- preserve enough court/net context to keep the tennis-game identity,
- avoid face-level portrait cinematography.

### Experience

- shift toward the bench/kit area,
- keep part of the court visible,
- treat it like a game between-point camera cut.

### Research

- frame umpire/strategy station from a clear sideline angle,
- retain wall/court geometry as context.

### Projects

- elevate/shift gaze toward the far-side scoreboard,
- preserve enough of the court below it to show that Projects lives inside the stadium.

### Capabilities

- use a restrained equipment-side crop,
- avoid close-up object spins.

### Contact

- use a calm end-of-match composition near tunnel/exit,
- retain court or scoreboard in the background when possible.

---

## Transition style

Prefer **short reversible sports-broadcast cuts / eased reframes** over long cinematic travel.

Use:

- short soft-cut windows,
- position/look-target interpolation,
- minimal roll,
- restrained FOV changes,
- no camera orbit for its own sake.

The visitor should feel like the game camera is selecting a new match context, not like a drone is flying around a stadium.

---

## Scroll behavior

Scrolling remains normal webpage scrolling.

Requirements:

- enough chapter scroll range for content,
- major camera motion concentrated near chapter transitions,
- stable reading frames,
- deterministic reverse scroll,
- no autoplay requirement,
- no scroll hijacking,
- hotspot click resolves to canonical chapter progress,
- keyboard/DOM navigation resolves through the same destination path.

---

## Rally integration

The tennis action should resemble an authored game sequence rather than continuous ambient chaos.

Suggested pacing:

- Hero: poised serve / first rally beat,
- About: player-focused ready/recovery beat,
- Experience: one readable exchange or between-point state,
- Research: calm between-point state,
- Projects: ball settled and scoreboard active,
- Capabilities: equipment/between-point state,
- Contact: match-point/end state.

Ball and camera remain smooth.

Character animation remains stepped.

Do not introduce physics.

---

## Pixel-sports motion considerations

The scene may use lower-resolution WebGL presentation from Phase 16.

Camera motion must be reviewed for:

- pixel shimmer,
- line crawling on court markings,
- unstable sprite/card crowd edges,
- net aliasing,
- hotspot label jitter.

If motion causes excessive shimmer, first reduce camera travel and simplify transitions before adding post-processing.

---

## Hotspot jump behavior

When a user selects an in-world station:

1. resolve the target chapter,
2. scroll to the canonical chapter anchor/progress,
3. camera updates because master progress changed,
4. contextual content updates,
5. reverse scroll remains coherent afterward.

Never tween the camera independently and then repair scroll state.

---

## Deep-link behavior

Hashes such as `#projects` must initialize into coherent station framing.

On initial deep link:

- semantic content is immediately available,
- scroll position resolves to the chapter,
- camera initializes directly near the destination rather than visibly touring from Hero when practical,
- reduced motion uses immediate/near-immediate settling.

---

## Reduced motion

Reduced-motion mode preserves the same venue geography with minimal travel.

Preferred:

- direct cuts or near-snaps among stable station compositions,
- no ball squash,
- no rapid camera moves,
- player idle pose,
- complete semantic content/navigation.

---

## Responsive choreography

Author separate composition sets for:

- desktop landscape,
- tablet / narrow landscape,
- mobile portrait,
- reduced motion.

### Desktop

Preserve the iconic baseline game-screen view as much as possible.

### Mobile portrait

Do not merely increase FOV.

Instead:

- show a wider vertical court slice,
- keep both players readable when possible,
- reduce crowd density rather than shrinking the court too far,
- use fewer camera destinations,
- let contextual UI use a bottom sheet.

The mobile Hero must still communicate retro tennis immediately.

---

## Likely implementation areas

- `src/animations/prototypeMotion.ts`
- `src/animations/usePrototypeTimeline.ts`
- `src/components/camera/CameraRig.tsx`
- chapter metadata in `src/data/portfolio.ts`
- Phase 16 station target metadata

Retain ownership rules: GSAP/ScrollTrigger owns normalized progress; `useFrame`/refs own per-frame 3D transforms.

---

## Visual review evidence

Capture at minimum:

1. desktop Hero full-court frame,
2. tablet Hero,
3. mobile Hero,
4. About frame,
5. Experience frame,
6. Research frame,
7. Projects/scoreboard frame,
8. Contact frame,
9. reduced-motion Hero,
10. one reverse-scroll transition sequence.

The desktop Hero should be compared against the Phase 16 pixel-sports art-direction checklist, not against the old green low-poly scene.

---

## Acceptance criteria

- [ ] Hero uses an elevated baseline gameplay composition with restrained perspective.
- [ ] Warm clay court remains the dominant visual in the opening frame.
- [ ] Green walls, crowd, scoreboard/signage, net, and both players remain readable together.
- [ ] Chapter views feel like variations/cuts from one game-camera language.
- [ ] No chapter becomes an unrelated cinematic orbit shot.
- [ ] Scroll and hotspot selection converge on the same narrative progress.
- [ ] Reverse scroll remains deterministic.
- [ ] Reading frames settle.
- [ ] Pixel shimmer/aliasing is acceptable at the chosen render settings.
- [ ] Desktop/tablet/mobile compositions are intentionally authored.
- [ ] Reduced motion retains all spatial meaning with minimal travel.
- [ ] Deep links initialize coherently.

Stop after camera/motion acceptance. Phase 18 owns contextual DOM presentation.
