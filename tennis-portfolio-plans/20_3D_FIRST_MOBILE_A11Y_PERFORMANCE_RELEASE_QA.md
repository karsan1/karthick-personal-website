# Phase 20 — 3D-First Mobile, Accessibility, Performance & Release QA

## Objective

Harden the final 3D-first portfolio and release it only after the world-navigation model, pixel-sports court direction, player art, responsive behavior, accessibility, and performance all work across real device/input conditions.

This phase is the final release target for the redesigned product direction.

Read the final visual sources of truth:

- `docs/RETRO_ART_DIRECTION.md`
- `docs/PIXEL_SPORTS_COURT_ART_DIRECTION.md`

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

## Pixel-sports visual regression

The final site must not drift back toward the pre-Phase-16 modern green low-poly stadium look.

Capture and review at least:

1. desktop Hero full-court frame,
2. tablet Hero,
3. mobile Hero,
4. About/player station,
5. Experience/bench station,
6. Research/umpire station,
7. Projects/scoreboard station,
8. Contact/end-match station,
9. reduced-motion Hero,
10. low-quality-tier Hero.

### Hero visual assertions

The opening frame must clearly show:

- warm clay/brown court as the dominant surface,
- bright readable court lines,
- dark green perimeter walls,
- darker net + light top tape,
- near and far players,
- colorful far-side crowd/stands,
- scoreboard/signage context,
- compact portfolio UI that does not hide the match.

Reject release if the Hero primarily reads as:

- modern green tennis court,
- generic low-poly stadium,
- photoreal venue,
- giant foreground website typography with tennis behind it.

### Originality check

Confirm no final asset reproduces:

- a commercial game character/sprite,
- real or copied sponsor signs from the supplied reference,
- copied court texture,
- copied UI layout/branding.

The site should evoke a period/style, not clone a game.

---

## WebGL resolution / pixelation QA

If Phase 16–19 uses controlled lower-resolution WebGL rendering, test:

- scene clarity on Retina/high-DPI displays,
- court-line crawl/shimmer while scrolling,
- net aliasing,
- crowd-card shimmer,
- player/racket readability,
- pointer-hit alignment,
- projected label stability,
- resize behavior,
- screenshots at each quality tier.

The DOM must stay crisp at all times.

Do not solve late visual problems by adding a heavy post-processing stack during Phase 20.

---

## World interaction QA

Verify every hotspot:

- has a usable hit region,
- routes to the correct destination,
- does not trigger through blocking DOM overlays,
- has a semantic DOM equivalent,
- produces stable retro-appropriate hover/selected feedback,
- works after forward and reverse scroll,
- works after hotspot jumps,
- clears stale hover state.

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

The camera must never diverge from canonical narrative progress.

Also verify that the Phase 17 elevated gameplay-camera identity survives every input path. A direct hash or hotspot jump must not accidentally initialize an old cinematic camera state.

---

## Content readability QA

Confirm:

- active station remains visible around contextual panels where intended,
- body copy line lengths remain readable,
- no panel clips important content,
- internal scrolling is obvious when needed,
- bottom sheets are usable on short mobile viewports,
- projects remain understandable without the scoreboard,
- contact and résumé remain easy to find,
- UI colors remain legible over clay/green/crowd backgrounds.

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
- touch target sizing.

The website must remain a complete portfolio when WebGL is unavailable.

---

## Performance QA

Measure the redesigned experience rather than only static asset size.

Record:

- initial JS payload impact,
- GLB/model bytes,
- texture bytes if any,
- crowd/signage sprite bytes if any,
- draw submissions/material counts by quality tier,
- DPR/internal resolution/antialias settings,
- shadow settings,
- idle frame cost,
- rally frame cost,
- hotspot hover/click cost,
- project-overlay cost,
- mobile thermal/jank observations,
- memory stability after repeated navigation.

If the pixel-sports look uses lower scene resolution, document whether that reduces or increases GPU cost compared with the old rendering path.

---

## Quality-tier assertions

### High

May include full crowd/signage density and accepted scene-resolution treatment.

### Medium

Must retain:

- clay court,
- green walls,
- readable net,
- players,
- all stations,
- recognizable crowd band.

### Low

May remove decorative spectators/signs first, but must retain:

- court identity,
- both players,
- net,
- scoreboard/projects destination,
- required station silhouettes,
- navigation functionality.

Do not make the low tier visually revert to the legacy environment unless an actual error fallback is being exercised.

---

## Loading behavior

Verify:

- compact identity/DOM navigation is usable before full scene readiness where practical,
- loading overlay does not hang,
- asset failure reaches the accepted fallback chain,
- player failure uses the retained prototype fallback,
- legacy environment escape hatch remains available for diagnostics if retained,
- scene-ready state cleans up correctly.

---

## Release evidence

Before promotion:

1. run lint/typecheck/build,
2. run asset validation,
3. record the visual regression screenshots listed above,
4. capture production-browser performance evidence,
5. review preview deployment on desktop and mobile,
6. verify all chapter hashes/deep links,
7. verify production rollback path,
8. update `docs/CURRENT_STATE.md`,
9. update `docs/PERFORMANCE_PROFILE.md`,
10. update `docs/RELEASE_READINESS.md`,
11. document intentionally retained legacy assets/pipelines.

---

## Legacy cleanup

Only remove old runtime/UI paths when the new 3D-first pixel-sports route has passed regression.

Candidates may include:

- obsolete giant-hero styles,
- superseded chapter cue elements,
- old noninteractive pointer-event assumptions,
- unused calibration-only environment code,
- stale green-court palette constants no longer used by primary runtime,
- legacy plan references that claim background-first presentation is final.

Do not delete Blender fallback assets while runtime/build tooling still references them.

---

## Acceptance criteria

- [ ] The 3D world is the primary experience on desktop and remains usable on mobile.
- [ ] The opening frame unmistakably reads as an original old-console tennis game translated into 3D.
- [ ] Warm clay court + green walls + colorful crowd remain consistent across quality tiers.
- [ ] Both final players and rackets read at the elevated gameplay-camera distance.
- [ ] Any WebGL pixelation/resolution treatment is stable and leaves DOM/pointer behavior intact.
- [ ] Every in-world hotspot has a complete accessible DOM equivalent.
- [ ] Scroll, nav clicks, hotspot clicks, and deep links all produce coherent deterministic state.
- [ ] Reverse navigation is stable.
- [ ] Reduced motion and non-WebGL experiences are complete.
- [ ] Mobile bottom sheets and scene interaction do not conflict.
- [ ] Project detail focus behavior is correct.
- [ ] Performance is measured and acceptable across quality tiers.
- [ ] Final retro characters are production assets, not calibration fixtures.
- [ ] No specific commercial-game assets/branding are copied.
- [ ] Preview/release/rollback evidence is recorded.
- [ ] Current-state and performance documentation reflects the shipped architecture.

The redesign is launch-ready only when all critical criteria above pass.
