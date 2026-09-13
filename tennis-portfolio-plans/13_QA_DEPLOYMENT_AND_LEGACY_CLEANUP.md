# Phase 13 — QA, Deployment & Legacy Pipeline Cleanup

## Objective

Regression-test the redesigned portfolio, deploy it safely, and retire obsolete Blender-first workflow pieces only after the retro replacements are proven.

---

## Primary agents

- QA owner: `qa_reviewer`
- Release owner: `release_engineer`
- Integration: `orchestrator`
- Targeted fixes: route back to the specialist owner.

Do not let QA become an excuse for broad redesign.

---

## Full regression matrix

### Narrative
- hero load,
- forward scroll through every chapter,
- reverse scroll through every chapter,
- rapid scrub,
- navigation jump to each chapter,
- reload mid-page,
- browser back/forward,
- direct hash entry if supported.

### Character/rally
- both players load,
- Phase 06 fallback works on forced asset failure,
- racket remains attached,
- all required clips work,
- contact timing remains believable,
- stepped character animation does not step ball/camera,
- reverse scroll restores valid poses.

### Environment
- court/net align,
- progressive partitions load in order,
- decorative failure does not block page,
- scoreboard state matches chapter,
- no legacy/retro asset overlap or z-fighting.

### UI
- keyboard navigation,
- visible focus,
- project open/close/focus restoration,
- Resume link,
- contact links,
- scoreboard DOM equivalent,
- no Canvas event swallowing.

### Accessibility/fallback
- reduced motion,
- WebGL failure,
- JS/runtime error boundary behavior where applicable,
- zoom/text resizing,
- contrast review,
- screen-reader semantics for primary content.

### Devices
- desktop Chromium,
- Safari/macOS,
- Firefox where practical,
- recent iPhone Safari,
- representative Android Chrome,
- narrow laptop/tablet widths.

---

## Performance release gate

Capture production/preview traces rather than relying only on local dev mode.

Document:

- critical asset transfer sizes,
- total scene asset transfer,
- key GLB sizes,
- texture dimensions/formats,
- draw calls in representative hero/gameplay/project states,
- observed frame behavior on representative desktop/mobile,
- any quality-tier triggers.

Do not claim a numerical FPS guarantee across all devices. Record tested hardware/browser context.

---

## Build/release validation

Run at minimum:

```bash
pnpm lint
pnpm typecheck
pnpm assets:validate
pnpm build
```

Run any newly added targeted tests.

Verify production asset URLs from the built/deployed application, not only dev server paths.

---

## Vercel preview review

Before production promotion, review the actual preview deployment for:

- asset caching/paths,
- GLB loading,
- mobile Safari behavior,
- initial loading transition,
- deep links,
- project links,
- reduced motion,
- console/network errors,
- analytics only if deliberately configured.

Visual approval must happen on the preview, not only local screenshots.

---

## Legacy Blender cleanup gate

Only after retro environment and characters are accepted:

1. confirm no runtime file references legacy-only source paths,
2. confirm optimization scripts do not require Blender exports for current production assets,
3. decide whether to archive or retain Phase 04 source files for history/fallback,
4. remove obsolete Blender-only instructions from active docs,
5. update asset manifest/source documentation,
6. preserve reproducibility of the currently shipped retro assets.

Recommended archive shape if desired:

```text
assets-source/legacy-blender-phase04/
```

Do not delete history simply to make the tree look clean if those sources are useful for rollback.

---

## Plan/document cleanup

Update:

- `docs/CURRENT_STATE.md`,
- `docs/DECISIONS.md`,
- `docs/PERFORMANCE_BUDGET.md`,
- `assets-source/README.md`,
- root/scene agent instructions if they still mention obsolete assumptions,
- master roadmap status.

Mark old pre-retro Phase 05+ plans as archived/superseded.

---

## Maintainability review

Confirm common future edits do **not** require a 3D authoring tool:

- résumé copy,
- experience entries,
- research entries,
- projects,
- links,
- contact details,
- navigation labels.

Only visual asset/animation changes should require Blockbench.

---

## Launch rollback

Before production release:

- know the last known-good production deployment,
- confirm Vercel rollback/promotion path,
- keep migration commits reasonably separable,
- avoid combining final visual redesign with unrelated dependency upgrades.

---

## Acceptance criteria

Phase boundary: Phase 13 is the final planned phase. Do not perform post-launch
cleanup beyond these accepted criteria without a new explicit request.

- [ ] Full forward/reverse narrative regression passes.
- [ ] Character/ball/contact synchronization passes visual review.
- [ ] Mobile and reduced-motion experiences are usable.
- [ ] Non-WebGL portfolio is complete.
- [ ] Production build and asset validation pass.
- [ ] Preview deployment has been visually reviewed.
- [ ] Performance measurements are documented.
- [ ] Legacy Blender workflow is archived/retained intentionally, not accidentally left half-active.
- [ ] Active docs/agents describe the actual Blockbench/retro workflow.
- [ ] Ordinary portfolio content edits do not require Blockbench.
- [ ] A known-good rollback path exists.
