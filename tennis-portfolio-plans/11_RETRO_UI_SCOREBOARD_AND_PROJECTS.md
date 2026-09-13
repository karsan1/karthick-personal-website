# Phase 11 — Modern Portfolio UI + Retro Scoreboard & Project Interactions

## Objective

Blend the new retro 3D world with a professional, highly readable portfolio interface.

The UI must feel intentional: **modern website outside the game world, retro game flavor inside it**.

---

## Primary agents

- Owner: `ui_engineer`
- In-world scoreboard support: `scene_engineer`
- Narrative state support: `motion_engineer`
- Review: `qa_reviewer`

---

## Core visual rule

Do not restyle the entire DOM into pixel art.

Use:

### Modern DOM
- clean typography,
- high contrast,
- generous spacing,
- restrained panels,
- accessible controls,
- professional résumé/project presentation.

### Retro accents
- scoreboard,
- chapter/point indicator,
- tiny status labels,
- simple border/tick motifs,
- optional monospace/pixel-inspired display face for short labels only.

Long-form copy remains normal readable web typography.

---

## Navigation

Global navigation must work with Canvas hidden.

Include at minimum:

- About
- Experience
- Research
- Projects
- Contact
- Resume

Navigation should drive narrative scroll position and chapter state.

Do not make users aim at the 3D scoreboard to use the site.

---

## Scoreboard behavior

The scoreboard should mirror narrative state.

Possible mapping:

```text
ABOUT       → SET 1 / ABOUT
EXPERIENCE  → SET 2 / EXPERIENCE
RESEARCH    → SET 3 / RESEARCH
PROJECTS    → SET 4 / PROJECTS
CONTACT     → MATCH POINT / CONTACT
```

Keep wording short and tasteful.

Scoreboard updates should be data-driven from the same chapter source as DOM navigation.

---

## Scoreboard interaction

Pointer-capable devices may allow scoreboard selection.

Rules:

- large enough hit areas,
- focus/hover feedback,
- keyboard-accessible DOM equivalent,
- clicking sets the narrative/scroll destination,
- no direct camera manipulation,
- disabled or simplified where mobile targeting would be frustrating.

---

## Project interaction model

Preserve and enhance the accepted Phase 03 DOM project-detail interaction and existing navigation/hash contracts. Do not rebuild the information architecture merely to add retro presentation.

Preferred pattern:

1. Enter Projects chapter.
2. Court/stadium settles into a stable project-gallery composition.
3. Courtside panels or scoreboard-like tiles represent featured projects.
4. DOM list/cards remain available and keyboard accessible.
5. Selecting a project opens a DOM detail panel/drawer/modal.
6. Background 3D motion reduces while detail is open.
7. Escape/close restores focus to the triggering control.

Do not fly the camera into every project card.

---

## Project cards in the 3D world

If in-world cards/panels are used:

- keep text extremely short,
- show project name + small category/icon only,
- defer details to DOM,
- reuse geometry/materials,
- avoid rendering complex live websites inside WebGL.

---

## Portfolio detail content

DOM detail panel may include:

- project title,
- problem/goal,
- role/ownership,
- architecture/technical decisions,
- outcome/impact,
- technologies,
- image/video where useful,
- GitHub/live demo links.

The retro wrapper must never reduce professional content quality.

---

## Hero treatment

Keep the first impression understandable before a visitor learns the tennis metaphor.

Hero should clearly expose:

- name,
- role/identity,
- short value proposition,
- primary CTA(s),
- obvious indication that scrolling explores the portfolio.

Retro game flavor may appear as a small "PRESS / SCROLL TO START"-style accent if tasteful, but do not hide essential copy behind it.

---

## Contact ending

Use match-point/scoreboard language as a small thematic payoff.

DOM contact content remains direct:

- email,
- GitHub,
- LinkedIn,
- resume,
- optional short invitation.

No forced game interaction is required to contact the user.

---

## Focus/pointer policy

- Canvas must not trap keyboard focus,
- DOM controls need visible focus styling,
- 3D hover state should mirror DOM state where practical,
- project modal/drawer manages focus correctly,
- Escape closes overlays,
- scroll lock does not break the GSAP narrative state.

---

## Acceptance criteria

Phase boundary: stop after Phase 11 UI and accessibility acceptance. Do not begin
Phase 12 polish/performance work without a new explicit request.

- [ ] Main UI remains professional and readable rather than full pixel-art styling.
- [ ] Global navigation works independently of Canvas.
- [ ] Scoreboard mirrors active narrative chapter.
- [ ] Scoreboard interaction is optional, not required.
- [ ] Project details are fully accessible in DOM.
- [ ] Project selection reduces distracting background motion.
- [ ] Resume/contact remain easy to find at all times.
- [ ] Keyboard/focus behavior is correct.
- [ ] Retro flavor feels integrated rather than gimmicky.
