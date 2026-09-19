# Phase 25 — Final Visual Completion QA

## Objective

Perform the visual-completion gate after Phases 21–24 and the existing Phase 19 final-player work.

This phase exists because the repository's functional architecture is mostly complete, while the remaining risk is visual inconsistency: a technically working scene can still look unfinished if the court, stands, props, players, lighting, quality tiers, or DOM hierarchy do not read as one coherent retro grass-tournament game.

Phase 25 does not introduce new product features unless a failing acceptance gate requires a bounded correction.

## Required prerequisites

Before Phase 25 can pass:
- Phase 19 final human-authored players are accepted, or the site is explicitly declared not visually complete.
- Phase 21 court surface is accepted.
- Phase 22 stadium/crowd is accepted.
- Phase 23 props/scoreboard/stations are accepted.
- Phase 24 rendering/palette is accepted.

The current procedural Phase 06 player bridge is **not** sufficient for final acceptance.

## Owner

- Primary: `qa_reviewer`
- Fix routing:
  - scene geometry -> `scene_engineer`
  - player assets -> `asset_pipeline_engineer`
  - motion/camera -> `motion_engineer`
  - UI/a11y -> `ui_engineer`
  - performance -> `performance_engineer`
  - preview/release -> `release_engineer`

## Visual identity test

Without explanatory text, a reviewer should immediately read the opening frame as:

> an original retro tennis game on a traditional grass tournament court, with a complete crowd/stadium and an interactive portfolio layered around it.

Reject if the first impression is:
- generic green 3D court,
- dark modern stadium,
- unfinished low-poly prototype,
- empty venue,
- oversized website UI with tennis in the background,
- copied Wimbledon branding,
- copied commercial-game visuals.

## Required screenshot matrix

Capture and compare:

### Desktop
1. Hero full-court
2. About/player
3. Experience/bench
4. Research/umpire
5. Projects/scoreboard
6. Capabilities/rack
7. Contact/tunnel

### Quality
8. High Hero
9. Medium Hero
10. Low Hero

### Accessibility / alternate modes
11. Reduced-motion Hero
12. non-WebGL fallback
13. keyboard-focused World Menu
14. project dialog open

### Responsive
15. tablet Hero
16. mobile portrait Hero
17. mobile content sheet
18. mobile World Menu interaction

## Court assertions

Verify:
- grass apron exists beyond marked court,
- singles/doubles/service structure reads clearly,
- mowing bands remain visible but not panel-like,
- worn grass is subtle and believable,
- white/cream lines do not shimmer badly,
- net stays readable,
- grass and deep-green architecture remain distinct.

## Stadium assertions

Verify:
- far and side stands look stepped,
- crowd band exists on all tiers,
- crowd does not look like floating spheres,
- architecture is traditional/compact,
- no copied branding exists,
- scoreboard/tunnel integrate into the venue.

## Station assertions

Verify every world object can be recognized without the hover marker:
- player -> About,
- bench -> Experience,
- umpire chair -> Research,
- scoreboard -> Projects,
- equipment rack -> Capabilities,
- tunnel -> Contact,
- clipboard -> résumé action.

Then verify the marker/hover state still improves discoverability.

## Player assertions

Use the existing Phase 19 acceptance criteria:
- final human-authored assets,
- readable racket,
- distinct Karthick/opponent silhouettes,
- no balloon/capsule feel,
- correct rally contact,
- accepted 12/15/18fps comparison,
- stable About hotspot.

## Rendering assertions

Verify:
- no dark fog hides the venue,
- values feel like outdoor daylight,
- retro resolution treatment is stable,
- DOM remains crisp,
- pointer hit alignment is correct,
- focus states remain accessible,
- no excessive shimmer on net/court lines.

## Functional regression

Test:
- slow forward scroll,
- fast forward scroll,
- reverse scroll,
- hotspot jump,
- top-nav jump,
- hash/deep link,
- browser back/forward,
- project dialog open/close,
- quality change,
- sound on/off,
- resize/orientation change,
- reduced motion,
- WebGL fallback.

## Performance gate

Record:
- environment draw calls/materials/instances,
- player asset bytes,
- texture bytes,
- high/medium/low DPR,
- shadow settings,
- desktop idle/rally frame behavior,
- mobile jank/thermal observations,
- memory after repeated chapter navigation.

Do not accept a visually better stadium if it causes an obvious performance regression that could have been solved with instancing/quality-tier reduction.

## Documentation updates after acceptance

Update:
- `docs/CURRENT_STATE.md`
- `docs/PERFORMANCE_PROFILE.md`
- `docs/RELEASE_READINESS.md`
- `tennis-portfolio-plans/00_MASTER_ROADMAP.md`

Keep Phase 04 fallback documentation accurate.

## Final acceptance criteria

- [ ] Opening frame clearly reads as retro grass-court tennis.
- [ ] Court feels complete, not like a platform.
- [ ] Stadium feels populated, not empty.
- [ ] Props/stations feel authored, not placeholder boxes.
- [ ] Final players are production art, not calibration/procedural placeholders.
- [ ] Scoreboard reads as tennis and still supports Projects.
- [ ] Green/cream/purple tournament styling is cohesive and original.
- [ ] DOM remains professional and secondary to the world in the opening frame.
- [ ] High/medium/low all preserve the same core visual identity.
- [ ] Mobile remains understandable and interactive.
- [ ] Accessibility equivalents remain complete.
- [ ] No copied Wimbledon branding or commercial-game assets are present.
- [ ] Release preview and rollback evidence can be completed after this gate.

Only after this phase passes should the final Phase 20-style release checklist be considered complete for the polished visual direction.
