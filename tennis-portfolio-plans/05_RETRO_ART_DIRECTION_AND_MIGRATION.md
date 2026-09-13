# Phase 05 — Retro Art Direction & Technical Migration

## Objective

Convert the project from the old "stylized editorial realism + future Blender characters" direction to a documented low-poly retro sports-game direction **without destabilizing the accepted Phase 01–04 implementation**.

This is a contract/documentation phase plus small supporting code changes. Do not author final character assets yet.

---

## Primary deliverable

A repository where every future-facing instruction agrees on the new direction:

- modern DOM portfolio + retro 3D world,
- Blockbench preferred for new low-poly authored assets,
- Blender Phase 04 assets treated as legacy-compatible temporary environment assets,
- existing R3F/GSAP architecture preserved,
- clear performance/style budgets defined before asset authoring.

---

## Primary agents

- Owner: `orchestrator`
- Support: `repo_explorer`
- Asset contract: `asset_pipeline_engineer`
- Review: `qa_reviewer`

Use CodeGraph first to identify all documents/scripts that assume Blender-only future authoring.

---

## Decisions to record

Add/update `docs/DECISIONS.md` with explicit decisions:

1. The product visual target is retro low-poly tennis, inspired by early 3D console sports games but not copying a specific title.
2. Main DOM UI remains modern/professional.
3. Blockbench is preferred for new characters and small/medium low-poly authored assets.
4. Existing Blender Phase 04 GLBs stay valid until replacements ship.
5. Runtime continues to consume GLB; runtime does not care whether the source came from Blender or Blockbench.
6. Character motion may use intentionally stepped clip playback while ball and camera remain smooth.
7. No physics engine is added.
8. No global pixel-art postprocess is allowed to damage DOM readability.

---

## Create a persistent visual design spec

Create `docs/RETRO_ART_DIRECTION.md`.

It should define:

### Target
- PS1/N64-era sports-game influence,
- low-poly/faceted rather than voxel/Minecraft,
- simplified anatomy rather than capsules,
- professional rather than novelty arcade page.

### Character silhouette rules
- distinct head, torso, upper/lower arm, upper/lower leg, shoe forms,
- visible shoulder/hip structure,
- racket reads clearly at normal camera distance,
- hands can be simplified,
- faces remain secondary,
- avoid round capsule limbs as the dominant form language.

### Geometry targets
Initial targets per player:
- 500–1,500 triangles preferred,
- 2,500 triangle hard review threshold unless justified,
- one skeleton per character,
- minimize separate material slots.

### Texture targets
If textures are used:
- prefer 64×64, 128×128, or 256×256 palette/character textures,
- nearest-neighbor magnification for intentionally pixelated maps,
- avoid 1K/2K character textures unless visual review proves necessary,
- no 4K textures.

### Shading
- flat/faceted character shading,
- restrained specular response,
- simple court/environment materials,
- limited palette,
- one main accent family.

### Motion
- smooth ball/camera,
- characters optionally stepped at a configurable target such as 12–18 animation fps,
- poses remain authored and deterministic.

### UI boundary
- semantic copy never rasterized into the 3D scene,
- no pixel font for long-form résumé/project text,
- retro elements may appear in scoreboard/chapter indicators/micro-labels.

---

## Update the asset-source contract

Revise `assets-source/README.md` so it no longer states that Blender is the universal authored source of truth for future assets.

Recommended structure:

```text
assets-source/
├── blender/                 # legacy Phase 04 authored sources
├── blender-exports/         # legacy Phase 04 source exports
├── blockbench/              # new authored .bbmodel sources
├── blockbench-exports/      # source GLB/glTF exports
└── fixtures/                # deterministic validation fixtures
```

Do **not** move/delete working Phase 04 assets during this phase.

---

## Update the asset agent

Update `.codex/agents/asset_pipeline_engineer.toml`:

- description should include Blockbench + legacy Blender,
- ownership should say "3D authoring/export contracts" rather than Blender-only,
- manual-action wording should support Blockbench,
- preserve glTF/GLB, Meshopt, KTX2, naming, animation, budget responsibilities,
- keep runtime rendering out of this agent's scope.

Do not create a new agent if the existing one can be generalized cleanly.

---

## Plan-file handling

The original `05_CHARACTERS_AND_ANIMATION.md` through `13_POST_LAUNCH_CONTENT_MAINTENANCE.md` are superseded by the retro redesign plans.

Choose one repository policy:

### Preferred
Move old future plans into:

```text
tennis-portfolio-plans/archive/pre-retro-roadmap/
```

or

### Acceptable
Leave them in place but add a prominent `SUPERSEDED` header pointing to the new phase files.

Do not alter completed 01–04 checklists.

---

## Optional development switch

Only if it materially helps visual comparison, add a development-only scene-art switch such as:

```text
?art=legacy
?art=retro
```

Rules:
- default should remain stable,
- do not create two separate application architectures,
- only scene rendering should vary,
- remove or simplify the switch once migration is complete.

This is optional; do not add it purely for abstraction.

---

## Documentation updates

Update `docs/CURRENT_STATE.md` only after this phase is accepted:

- Phases 01–04 remain complete.
- Phase 05 retro migration contract complete.
- next milestone = low-poly R3F character prototype.
- current Phase 04 environment GLBs remain accepted temporary assets.

---

## Validation

Run:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm assets:validate
```

If only docs/agent files changed, still run at least typecheck/build if practical because later agents will rely on the repository state.

---

## Acceptance criteria

Phase boundary: stop after Phase 05 validation and acceptance. Do not begin the
Phase 06 character prototype without a new explicit request.

- [ ] `docs/RETRO_ART_DIRECTION.md` exists and clearly defines the visual target.
- [ ] `docs/DECISIONS.md` records the new authoring/style decisions.
- [ ] `assets-source/README.md` supports Blockbench without invalidating existing Phase 04 assets.
- [ ] `asset_pipeline_engineer` no longer gives Blender-only future instructions.
- [ ] Old Phase 05+ plans are archived or clearly marked superseded.
- [ ] Completed Phase 01–04 behavior is unchanged.
- [ ] Build and existing asset validation still pass.
- [ ] `docs/CURRENT_STATE.md` points to Phase 06 as the next milestone.
