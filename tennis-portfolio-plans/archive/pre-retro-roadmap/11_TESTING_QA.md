# Phase 11 — Testing & QA

## Objective
Catch timeline, rendering, device, and accessibility regressions before launch.

## Deliverable
Repeatable automated and manual QA checklist covering functional behavior, visuals, performance, accessibility, and deployment previews.

---

## Automated checks
At minimum scripts should cover:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

If unit tests are initially minimal, add tests around deterministic non-visual logic:
- chapter progress mapping,
- shot local-progress mapping,
- route/hash → chapter mapping,
- quality tier selection,
- content schema validation.

---

## E2E targets
Use Playwright if adding browser automation.

Test:
- page loads,
- nav moves to target chapter,
- project panel opens/closes,
- Resume/GitHub/etc links exist,
- reduced-motion preference does not crash timeline,
- mobile viewport remains scrollable,
- WebGL fallback can be forced in test mode.

Do not attempt brittle pixel-perfect assertions of every 3D frame.

---

## Visual QA checkpoints
Use master timeline labels as screenshot checkpoints:
- hero,
- serve contact,
- about,
- each major experience,
- research,
- projects,
- match point/contact.

Review desktop and mobile at these labels.

---

## Browser matrix
At launch test latest stable versions of:
- Chrome desktop,
- Safari desktop,
- Firefox desktop,
- iOS Safari,
- Android Chrome.

Also verify common retina and non-retina DPR behavior.

---

## Device classes
At minimum:
- modern desktop/laptop with discrete/integrated GPU,
- Apple Silicon laptop,
- recent iPhone,
- recent Android device if available,
- throttled/low-power emulation for fallback quality behavior.

Avoid assuming your development machine represents visitor hardware.

---

## Scroll/timeline torture tests
- scroll extremely slowly,
- fling rapidly,
- reverse repeatedly around hit/contact points,
- drag scrollbar thumb,
- use keyboard PageDown/PageUp,
- resize during a chapter,
- mobile orientation change,
- browser back after chapter navigation,
- refresh midway down page.

Watch for duplicate audio, clip jumps, camera teleporting, and ScrollTrigger desynchronization.

---

## Asset failure tests
Simulate:
- player GLB failure,
- secondary stadium GLB failure,
- texture failure,
- audio denied/unavailable.

Critical content must remain usable.

---

## Accessibility QA
- keyboard-only session,
- `prefers-reduced-motion`,
- 200% browser zoom,
- high contrast checks where possible,
- screen-reader landmark/headings pass,
- focus after modal/project drawer close.

---

## Performance QA
Record representative traces for:
- initial load,
- hero-to-about scroll,
- project chapter,
- mobile mode.

Document:
- network asset totals,
- largest GLBs,
- largest textures,
- average/low FPS impressions,
- obvious long tasks,
- GPU/draw-call notes where measurable.

---

## Acceptance criteria
- [ ] Build/lint/typecheck pass.
- [ ] Core navigation E2E passes.
- [ ] No known scroll-direction-specific bug remains.
- [ ] Mobile Safari and desktop Safari manually tested.
- [ ] Reduced-motion and forced fallback manually tested.
- [ ] Performance trace reviewed before launch.
- [ ] Vercel preview is signed off before production promotion.
