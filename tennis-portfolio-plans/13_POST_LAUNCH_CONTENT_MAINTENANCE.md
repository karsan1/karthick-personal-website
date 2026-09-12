# Phase 13 — Post-Launch Content & Maintenance

## Objective
Make future résumé/project edits cheap and keep visual additions from degrading performance or design quality.

## Deliverable
A maintenance workflow in which most content changes require only typed data edits, while 3D changes follow asset/performance review gates.

---

## Content ownership
All normal professional updates should live in data modules or Markdown/MDX if later justified.

Examples:
- new role,
- changed job dates,
- project description,
- new GitHub URL,
- publication/research link,
- contact information.

None of these should require opening Blender.

---

## When to add a CMS
Do not add one merely because it is common.

Consider a CMS only if:
- updates become frequent,
- non-developers need to edit content,
- case studies become numerous,
- publication/blog content becomes substantial.

Until then, typed repository content is faster and safer.

---

## Adding a new project
Checklist:
1. add typed project data,
2. add optimized image/video,
3. decide whether it is featured in 3D courtside gallery,
4. if featured, reuse existing panel interaction — do not invent a new mechanic,
5. test focus/navigation,
6. check mobile layout,
7. preview on Vercel.

---

## Adding a new 3D asset
Every new production asset must answer:
- Is it visible enough to justify cost?
- Can existing geometry/material be reused?
- Does it create new draw calls/materials?
- What is its transfer size?
- What texture memory does it add?
- Does low-quality/mobile mode need it?

Decorative novelty is not automatically worth runtime cost.

---

## Dependency upgrades
Upgrade intentionally:
- Next.js/React together with compatibility awareness,
- R3F major version must match React major compatibility,
- Three.js changes may affect materials/loaders/color behavior,
- GSAP timeline behavior should be regression tested at chapter checkpoints.

After major upgrades run full Phase 11 QA.

---

## Visual regression policy
Before changing camera paths, court coordinate system, skeletons, or master timeline:
- create/keep before screenshots/video,
- change one subsystem at a time,
- check all chapter labels,
- test reverse scrolling,
- test mobile separately.

---

## Portfolio evolution
Future optional additions should reuse the tennis world rather than clutter it:
- publications as scoreboard/stat cards,
- talks as tournament-board entries,
- résumé PDF as official match sheet,
- blog only if content volume justifies a separate route.

Do not turn every new content type into a new 3D gimmick.

---

## Acceptance criteria
- [ ] Normal résumé edits are data-only.
- [ ] New projects reuse established UI patterns.
- [ ] New 3D assets require performance review.
- [ ] Major dependency upgrades trigger regression QA.
- [ ] Visual language stays coherent as content grows.
