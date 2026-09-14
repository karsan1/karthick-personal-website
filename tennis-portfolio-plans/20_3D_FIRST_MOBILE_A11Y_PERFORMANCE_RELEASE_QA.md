# Phase 20 — 3D-First Mobile, Accessibility, Performance & Release QA

## Objective

Harden the new 3D-first portfolio experience for real users and release it only after the interactive-world model works across input methods, device classes, fallbacks, and performance tiers.

This phase replaces the old Phase 13 launch gate as the final release target for the redesigned product direction.

---

## Primary agents

- Owner: `qa_reviewer`
- Performance: `performance_engineer`
- UI/mobile/accessibility fixes: `ui_engineer`
- 3D/runtime fixes: `scene_engineer`
- Navigation/camera fixes: `motion_engineer`
- Release: `release_engineer`

---

## Regression matrix

Validate at minimum:

### Desktop
- Chromium-based browser,
- Safari,
- Firefox where feasible,
- mouse,
- trackpad,
- keyboard-only.

### Mobile / tablet
- iPhone-sized portrait,
- wider phone,
- iPad/tablet,
- touch interaction,
- orientation change if supported.

### Experience modes
- high / medium / low quality,
- sound disabled/enabled,
- reduced motion,
- WebGL unavailable/failure fallback,
- direct deep link to each chapter,
- project detail open/close,
- browser back/forward where applicable.

---

## World interaction QA

Verify every hotspot:

- has a usable hit region,
- uses the correct destination,
- does not trigger while a blocking DOM overlay is active,
- can be reached through a semantic DOM equivalent,
- produces stable hover/selected feedback,
- works after forward and reverse scroll,
- works after a hotspot jump from another chapter,
- does not leave stale hover state after navigation.

No destination may exist only in WebGL.

---

## Camera / scroll QA

Test:

- slow scroll,
- rapid scroll,
- reverse scroll,
- scrollbar drag,
- trackpad momentum,
- hash navigation,
- hotspot jump,
- top navigation jump,
- browser resize mid-chapter,
- mobile address-bar viewport changes.

Camera must never diverge from the canonical narrative progress.

---

## Content readability QA

Confirm:

- active station remains visible around contextual panels where intended,
- body copy line lengths remain readable,
- no panel clips important content,
- internal scrolling is obvious when needed,
- bottom sheets are usable on short mobile viewports,
- projects remain understandable without the scoreboard,
- contact and résumé remain easy to find.

---

## Accessibility QA

Required:

- semantic heading hierarchy,
- skip link,
- visible focus states,
- keyboard-only chapter navigation,
- keyboard-accessible project details,
- focus trap/restoration for modal/sheet states,
- Escape behavior,
- no keyboard focus lost behind Canvas,
- appropriate `aria-hidden` only for decorative elements,
- screen-reader labels do not duplicate decorative projected labels,
- prefers-reduced-motion respected,
- sufficient contrast,
- target sizing appropriate for touch.

The website must remain a complete portfolio if WebGL is unavailable.

---

## Performance QA

Measure the redesigned experience, not only static asset size.

Record:

- initial JS payload impact,
- GLB/model bytes,
- texture bytes if any,
- draw submissions/material counts by quality tier,
- DPR/shadow settings,
- idle frame cost,
- rally frame cost,
- hotspot hover/click cost,
- project-overlay cost,
- mobile thermal/jank observations,
- memory stability after repeated chapter navigation.

Do not add post-processing to solve visual issues discovered late in QA.

---

## Loading behavior

Verify:

- compact identity/DOM navigation is usable before full scene readiness where practical,
- loading overlay does not hang,
- asset failure reaches the accepted fallback chain,
- player failure uses the retained prototype fallback,
- legacy environment escape hatch remains available for diagnostics if still retained,
- scene-ready state is cleaned up correctly.

---

## Release evidence

Before promotion:

1. run lint/typecheck/build,
2. run asset validation,
3. capture production-browser performance evidence,
4. review a preview deployment on desktop and mobile,
5. verify all chapter hashes/deep links,
6. verify production rollback path,
7. update `docs/CURRENT_STATE.md`,
8. update `docs/PERFORMANCE_PROFILE.md`,
9. update `docs/RELEASE_READINESS.md`,
10. document any intentionally retained legacy assets/pipelines.

---

## Legacy cleanup

Only remove old runtime/UI paths when the new 3D-first route has passed regression.

Candidates may include:

- obsolete giant-hero styles,
- superseded chapter cue elements,
- old noninteractive pointer-event assumptions,
- unused environment/character calibration code,
- legacy plan references that claim background-first presentation is final.

Do not delete Blender fallback assets merely for aesthetic cleanliness while runtime/build tooling still references them.

---

## Acceptance criteria

- [ ] The 3D world is the primary experience on desktop and still usable on mobile.
- [ ] Every in-world hotspot has a complete accessible DOM equivalent.
- [ ] Scroll, nav clicks, hotspot clicks, and deep links all produce coherent deterministic state.
- [ ] Reverse navigation is stable.
- [ ] Reduced motion and non-WebGL experiences are complete.
- [ ] Mobile bottom sheets and scene interaction do not conflict.
- [ ] Project detail focus behavior is correct.
- [ ] Performance is measured and acceptable across quality tiers.
- [ ] Final retro characters are production assets, not calibration fixtures.
- [ ] Preview/release/rollback evidence is recorded.
- [ ] Current-state and performance documentation reflects the actual shipped architecture.

The redesign is launch-ready only when all critical criteria above pass.
