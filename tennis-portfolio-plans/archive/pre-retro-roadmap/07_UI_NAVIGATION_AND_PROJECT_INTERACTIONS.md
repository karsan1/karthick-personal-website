# Phase 07 — UI, Navigation & Project Interactions

## Objective
Make the experience function as an excellent professional portfolio, not merely an impressive WebGL scene.

## Deliverable
Polished DOM content, global navigation, scoreboard navigation, project detail interaction, resume/contact actions, focus states, and deep-link behavior.

---

## UI visual language
Use editorial sports presentation:
- restrained typography,
- strong alignment/grid,
- mostly opaque/solid surfaces instead of heavy glassmorphism,
- generous negative space,
- subtle court-inspired lines/ticks,
- one accent color,
- minimal icons.

Typography should remain calm while the 3D world provides spectacle.

---

## Global navigation
Must remain usable even when scene objects are not visible.

Desktop ideas:
- compact top-right menu,
- minimal match-score style chapter indicator.

Mobile:
- straightforward drawer/sheet,
- no tiny 3D click targets required.

Include:
- About
- Experience
- Research
- Projects
- Contact
- Resume

---

## Scoreboard as secondary navigation
The in-world scoreboard may mirror chapter state and be clickable on pointer-capable devices.

Rules:
- scoreboard is a convenience, not the only nav,
- clickable areas have cursor/focus feedback,
- DOM equivalent exists,
- in-world text should be short.

If 3D text becomes expensive or visually inconsistent, render scoreboard labels as carefully controlled textures/SDF text; profile before choosing.

---

## Project gallery interaction
Recommended model:
1. courtside panels show 3–5 featured projects,
2. hover/focus subtly changes panel material/scale,
3. selection opens a DOM project drawer/panel,
4. background timeline pauses or enters a stable chapter pose,
5. Escape/close returns focus to triggering project,
6. external links remain ordinary anchors.

Do not fly the camera wildly into every project card.

---

## Detail panel content
Each project can include:
- title,
- one-line problem statement,
- role / ownership,
- technical architecture,
- measurable outcome,
- technology tags,
- image/video if useful,
- live demo,
- GitHub link.

Optimize portfolio storytelling around decisions and outcomes rather than technology lists alone.

---

## Resume action
Resume should be available without completing the 3D experience.

Provide:
- prominent Resume link in navigation,
- downloadable/openable PDF route or static asset,
- meaningful filename,
- analytics event if desired.

---

## Contact ending
Match-point sequence settles into stable closing composition.

DOM contact UI includes:
- email,
- GitHub,
- LinkedIn,
- resume,
- optional short invitation line.

Do not hide contact behind a form unless a form serves a real purpose.

---

## Focus and pointer policy
- scene pointer interactions only where intentional,
- Canvas should not swallow wheel/keyboard events unnecessarily,
- keyboard users can reach every actionable DOM control,
- visible focus styling,
- 3D hover state mirrored by DOM focus when practical.

---

## Acceptance criteria
- [ ] Global DOM navigation works independently of Canvas.
- [ ] Scoreboard mirrors active chapter.
- [ ] Project details are readable, focus-managed, and closable.
- [ ] Resume/contact are always easy to find.
- [ ] UI styling is consistent and restrained.
- [ ] No critical action exists only as a small 3D target.
