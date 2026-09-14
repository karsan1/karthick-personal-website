# Phase 17 — Scroll + Camera World-Tour Choreography

## Objective

Re-author the existing deterministic scroll/camera experience so scrolling feels like moving through a retro tennis venue rather than scrolling conventional full-screen website sections over a background scene.

The world stations created in Phase 16 become the visual anchors for each chapter.

---

## Primary agents

- Owner: `motion_engineer`
- Scene composition support: `scene_engineer`
- Review: `qa_reviewer`

---

## Narrative model

Keep one normalized master progress source.

Do not add a second timeline for world navigation.

Suggested chapter flow:

```text
00 HERO / MATCH INTRO
   full court + both players

01 ABOUT
   Karthick player medium composition

02 EXPERIENCE
   courtside bench composition

03 RESEARCH
   umpire / strategy composition

04 PROJECTS
   scoreboard composition

05 CAPABILITIES
   equipment rack composition

06 CONTACT
   player tunnel / match-end composition
```

Résumé is a direct action, not a mandatory scroll chapter.

---

## Scroll behavior

Scrolling should still feel natural on a normal webpage.

Requirements:

- each chapter has enough scroll range for reading,
- camera travel occurs primarily near chapter transitions,
- camera settles while reading long content,
- reverse scroll exactly reverses the authored experience,
- no time-based autoplay is required,
- no scroll hijacking that prevents normal trackpad/touch behavior,
- clicking a hotspot scrolls to the same chapter destination.

---

## Opening composition

The current large hero text should no longer determine the composition.

Opening view must prioritize:

- entire or near-entire court,
- both retro players,
- recognizable stadium architecture,
- scoreboard in the venue context,
- compact identity overlay.

The visitor should understand “retro tennis portfolio” within the first second or two.

---

## Camera language

Use a retro sports-broadcast / early-console-game vocabulary:

- elevated baseline view,
- restrained diagonal sideline views,
- medium courtside cuts,
- scoreboard-facing composition,
- player medium shot,
- tunnel/end-match composition.

Avoid:

- first-person walking,
- aggressive orbit controls,
- cinematic spins,
- repeated extreme dolly moves,
- camera clipping through stands,
- constant mouse parallax.

---

## Chapter settling

Each destination must have a stable reading frame.

Define explicit values for:

- camera position,
- look target,
- field of view if needed,
- content-safe screen region,
- world station visibility,
- player/ball resting state.

The DOM content panel position must be considered during camera framing so content does not cover the station it refers to.

---

## Rally integration

The tennis match should support the story, not compete with it.

Suggested behavior:

- Hero: serve/rally begins or is poised to begin.
- About: brief player-focused beat.
- Experience: one readable exchange then settle.
- Research: calmer between-point state.
- Projects: scoreboard/project state, ball settled.
- Capabilities: equipment/between-point state.
- Contact: match-point/end state.

Do not force a continuous high-motion rally behind every reading section.

Keep deterministic authored ball behavior and existing contact synchronization contracts.

---

## Hotspot jump behavior

When a user clicks an in-world station:

1. resolve target chapter,
2. scroll to the canonical chapter anchor/progress,
3. camera moves because the master timeline moved,
4. content contextual layer updates,
5. reverse scroll remains coherent after the jump.

Do not tween the camera separately and then patch scroll position afterward.

---

## Deep-link behavior

Hashes such as `#projects` should load into a valid narrative state.

On initial deep link:

- page content is immediately semantically available,
- scroll position resolves to the chapter,
- camera initializes/settles without a visible journey from Hero where practical,
- reduced motion avoids cinematic transition.

---

## Reduced motion

Reduced-motion mode should retain spatial meaning without animated travel.

Preferred behavior:

- snap or near-snap between stable station compositions,
- no ball squash/rapid camera cuts,
- player idle pose only,
- semantic content and all navigation remain complete.

---

## Responsive choreography

Do not derive mobile camera by simply changing desktop FOV.

Author at least:

- desktop landscape,
- tablet / narrow landscape,
- mobile portrait,
- reduced-motion composition set.

Mobile should use fewer, wider, steadier compositions.

---

## Likely implementation areas

- `src/animations/prototypeMotion.ts`
- `src/animations/usePrototypeTimeline.ts`
- `src/components/camera/CameraRig.tsx`
- chapter metadata in `src/data/portfolio.ts`
- station target metadata from Phase 16

Retain existing ownership rules: GSAP/ScrollTrigger owns normalized progress, `useFrame` owns realtime 3D transforms.

---

## Acceptance criteria

- [ ] The opening viewport is court-first, not text-first.
- [ ] Every portfolio chapter has a stable world-station camera composition.
- [ ] Scroll and hotspot selection converge on the same narrative progress.
- [ ] Reverse scroll remains deterministic.
- [ ] Long-content chapters settle rather than continuously moving the camera.
- [ ] Rally activity reduces when reading would otherwise be distracting.
- [ ] Desktop and mobile camera sets are intentionally authored.
- [ ] Reduced motion retains all spatial/navigation meaning with minimal travel.
- [ ] Deep links initialize into coherent camera/content states.

Stop after motion/composition acceptance. The DOM visual hierarchy is finalized in Phase 18.
