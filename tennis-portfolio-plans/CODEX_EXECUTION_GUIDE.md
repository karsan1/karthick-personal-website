# Codex Execution Guide — Retro Tennis Portfolio

## Purpose

Use this guide with the revised retro phases after the accepted Phase 04 implementation.

The goal is to keep Codex from:

- redoing completed architecture,
- deleting working Phase 04 assets too early,
- reverting to smooth/capsule characters,
- treating "retro" as permission for unreadable UI,
- using Blender-first assumptions after the pipeline migration,
- overusing agents/tokens.

---

## Per-phase workflow

For each phase:

1. Start with `orchestrator` only when decomposition/integration is genuinely needed.
2. Read `AGENTS.md`.
3. Read `docs/CURRENT_STATE.md`.
4. Read `tennis-portfolio-plans/00_MASTER_ROADMAP.md`.
5. Read `tennis-portfolio-plans/CODEX_EXECUTION_GUIDE.md`.
6. Read exactly one current phase file.
7. Use CodeGraph before broad file reads.
8. Delegate narrow specialist tasks with exact file/symbol anchors.
9. Use one implementation owner for overlapping files.
10. Run validation.
11. Perform visual review where required.
12. Update `docs/CURRENT_STATE.md` only after acceptance.
13. Stop; do not start a subsequent phase without a new explicit request.

---

## Standard Codex prompt

```text
Implement the next incomplete work in the current retro-redesign phase.

Read:
- AGENTS.md
- docs/CURRENT_STATE.md
- tennis-portfolio-plans/00_MASTER_ROADMAP.md
- tennis-portfolio-plans/CODEX_EXECUTION_GUIDE.md
- the current phase file only

Use CodeGraph first for repository orientation and change impact.

Preserve these contracts:
- one persistent R3F Canvas,
- semantic portfolio content stays in DOM,
- GSAP/ScrollTrigger owns master narrative progress,
- useFrame/refs own high-frequency transforms,
- Zustand is coarse state only,
- deterministic authored ball trajectories,
- camera has one owner,
- reduced-motion and non-WebGL fallbacks stay functional,
- completed Phase 01–04 architecture is not rewritten without an explicit current-phase requirement.

Retro-specific constraints:
- do not reintroduce capsule/sphere balloon characters as the target design,
- Blockbench is preferred for new low-poly authored assets after Phase 05,
- Phase 04 Blender environment assets remain valid migration fallbacks until explicitly retired,
- character animation may be stepped, but ball/camera/master scroll must remain smooth,
- keep main DOM UI modern/readable rather than turning the entire site into pixel art.

Before finishing:
- run relevant targeted checks,
- run lint,
- run typecheck,
- run production build,
- run asset validation for asset-related phases,
- summarize files changed,
- state manual visual/Blockbench actions still required,
- list unchecked acceptance criteria.
```

---

## Agent routing

### `repo_explorer`
Use for:
- CodeGraph ownership discovery,
- locating timeline/loader/asset references,
- impact analysis.

Do not use it to implement broad features.

### `scene_engineer`
Use for:
- low-poly R3F prototype,
- materials,
- GLB rendering,
- player fallback,
- scoreboard/environment scene behavior,
- lighting.

### `motion_engineer`
Use for:
- normalized progress mapping,
- character clip scrubbing,
- animation stepping,
- camera keyframes,
- hit/bounce synchronization,
- navigation-to-scroll choreography.

### `asset_pipeline_engineer`
Use for:
- Blockbench export contract,
- stable nodes/bones/clips,
- optimization,
- asset manifest,
- Meshopt/KTX2 decisions,
- budgets/validation.

### `ui_engineer`
Use for:
- DOM navigation,
- project panels,
- focus management,
- modern/retro UI boundary,
- mobile DOM layout,
- non-WebGL experience.

### `performance_engineer`
Use only after a measurable performance question exists.

### `qa_reviewer`
Use at phase gates and final milestone validation, not after every tiny edit.

### `release_engineer`
Use for preview/prod/Vercel/build release work.

---

## Token-efficiency rules

- Do not have multiple agents independently rediscover the same scene architecture.
- Pass concise handoffs with exact symbols/files.
- Do not ask the orchestrator and specialist to both fully inspect the repo.
- Do not preload all future phase files.
- Do not run broad research for choices already documented in `docs/DECISIONS.md`.
- Prefer one specialist implementation pass followed by one targeted review.
- Use visual QA only at meaningful checkpoints.

---

## Manual-authoring boundary

Codex can implement loaders, contracts, validation, animation controllers, and fallback logic.

Human visual work is still required for:

- approving character proportions,
- creating/refining `.bbmodel` assets,
- judging tennis pose readability,
- reviewing Blockbench pivots/weights,
- deciding whether animation stepping feels good,
- camera composition,
- final color/palette taste.

If an agent cannot actually perform a manual Blockbench operation, it must provide exact steps and stop at the verifiable code boundary.
