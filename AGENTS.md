<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Tennis Portfolio — Codex Repository Instructions

These instructions apply to the entire repository unless a deeper `AGENTS.md`
overrides them.

## 1. Product goal

Build a premium interactive personal portfolio centered on a deliberately
low-poly early-console/retro 3D tennis match. The 3D world should evoke
PS1/N64/early-2000s sports-game visual language without copying a particular
game. The tennis environment is the navigation/storytelling system, not a
decorative background; the DOM interface remains modern and professional.

Primary stack:
- Next.js App Router
- React + TypeScript
- React Three Fiber
- Three.js
- Drei
- GSAP + ScrollTrigger
- Zustand for coarse UI/application state
- Blockbench preferred for new retro character assets; Blender supported for
  existing Phase 04 assets and optional legacy/specialized work
- glTF / GLB for runtime delivery
- Vercel for deployment

## 2. Context and token discipline

Before implementation, the root/coordinating agent:

1. Read `docs/CURRENT_STATE.md`.
2. Read only the current implementation phase under `tennis-portfolio-plans/`.
3. Check `docs/DECISIONS.md` before revisiting an architecture choice.
4. Use CodeGraph to find the smallest relevant code surface.
5. Read only the files needed for the task.

Delegated specialists should use the root's bounded task packet as their primary
context. They should not reread the master roadmap, execution guide, decision log,
full conversation, or documents already summarized in that packet unless a named
contract is missing or the delegated task explicitly requires verification against
the source document.

Never begin by reading all of:
- `src/`
- `tennis-portfolio-plans/`
- `public/`
- `docs/`

Do not dump entire files, build logs, dependency trees or diffs into agent handoffs.

### CodeGraph-first discovery

When CodeGraph MCP/tooling is available, use it before broad filesystem exploration.

Prefer:
- repository orientation for unfamiliar areas;
- symbol/file search for concrete targets;
- dependency/caller/callee/impact queries before cross-cutting edits;
- bounded packets/explanations instead of opening many files.

CLI fallback examples:

```bash
codegraph orient --root . --budget small
codegraph search "<literal-or-symbol>" --json
codegraph explore "<specific repository question>" --root .
codegraph explain <file-or-symbol>
```

Use `rg` / `git grep` when searching an exact string is cheaper.

Do not generate exhaustive CodeGraph reports unless the task actually requires them.

## 3. Agent routing

Use the smallest capable specialist set.

- Default to one specialist implementation agent per phase.
- Let the root use CodeGraph directly when the change surface is already clear;
  spawn `repo_explorer` only for a concrete unresolved discovery task.
- Use `orchestrator` only when work crosses at least three ownership domains or an
  unresolved architecture decision requires coordination. Skip it for
  documentation-only and decision-complete single-subsystem phases.
- Reuse the same specialist for corrections instead of spawning a replacement.
- Run one independent QA review after root static review, targeted checks, required
  math/contract validation, and visual inspection are complete.

- Architecture / cross-cutting design -> `orchestrator`
- File/symbol/dependency discovery -> `repo_explorer`
- R3F / Three.js / Drei / scene graph -> `scene_engineer`
- GSAP / ScrollTrigger / camera / ball / timeline -> `motion_engineer`
- Next.js / DOM / portfolio UI / metadata -> `ui_engineer`
- Blockbench + legacy Blender / GLB / glTF / KTX2 / Meshopt -> `asset_pipeline_engineer`
- Rendering / bundle / memory / loading performance -> `performance_engineer`
- Current framework/API verification -> `docs_researcher`
- Milestone review -> `qa_reviewer`
- Build / preview / production / Vercel -> `release_engineer`

Do not spawn multiple agents when one specialist can finish the task.

Prefer sequential implementation when two agents would edit overlapping files.

Parallelize only independent read-heavy work such as:
- performance audit;
- accessibility audit;
- documentation verification;
- final QA.

### Delegation packet

Use `fork_turns: "none"` or the smallest recent-turn window that contains unique
context. Every delegated packet must state:

- objective and acceptance criteria;
- exact owned files or symbols;
- protected architecture and out-of-scope work;
- current validation status;
- expected concise output format.

Do not send full logs, source files, roadmaps, or conversation history when a
bounded packet provides the necessary context.

## 4. Core architecture rules

### Persistent Canvas
Use one persistent React Three Fiber Canvas for the primary experience.
Do not create a separate WebGL context per portfolio section.

### Animation ownership
- GSAP / ScrollTrigger owns narrative timeline progress.
- `useFrame`, refs and Three.js objects own per-frame transforms.
- Zustand stores coarse states such as active section, quality tier,
  menu state, audio preference and experience mode.
- Never write 60-fps transforms into React or Zustand state.

### DOM vs WebGL
Important portfolio text stays semantic HTML.
Do not rasterize résumé text into textures merely for visual effect.

### Motion
Motion must be deterministic and reversible when scroll direction reverses.
Avoid arbitrary `setTimeout` choreography.

### Accessibility
Respect `prefers-reduced-motion`.
Keyboard navigation and semantic content must work without completing the 3D animation.
Never make critical content available only through hover or WebGL.

### Visual direction
Avoid:
- gratuitous bloom;
- neon gradients everywhere;
- glassmorphism overload;
- fake HUD aesthetics;
- excessive particles;
- constant cursor-driven camera motion.

Prefer:
- intentional typography;
- deliberately low-poly/faceted 3D silhouettes and restrained materials;
- strong lighting and composition;
- restrained post-processing;
- subtle physical ambience.

Keep long-form portfolio and résumé content in clean, readable DOM typography.
Concentrate retro styling in the 3D world, scoreboard and small accents.

## 5. React / R3F performance rules

- Never allocate avoidable `Vector3`, `Quaternion`, `Euler`, `Color`, arrays or objects
  inside `useFrame`.
- Reuse temporary math objects.
- Avoid per-frame React state updates.
- Reuse geometry and materials where practical.
- Use instancing for repeated props when justified.
- Dispose dynamically created Three.js resources.
- Do not add post-processing without measuring the cost.
- Keep device pixel ratio bounded.
- Avoid unnecessary shadow casters/receivers.
- Lazy-load secondary 3D assets.
- Prefer compressed GPU-friendly textures and optimized GLBs.

## 6. Implementation discipline

Before changing code:
1. Identify the requested behavior.
2. Use CodeGraph to identify owners, dependents and likely impact.
3. Confirm whether an existing architecture decision applies.
4. Make the smallest coherent change.

After meaningful changes:
1. Run the narrowest relevant tests/checks.
2. Run TypeScript/typecheck if types changed.
3. Run lint when applicable.
4. Run a production build before milestone completion.
5. Update `docs/CURRENT_STATE.md` if project state materially changed.
6. Add to `docs/DECISIONS.md` only for durable architecture decisions.

### Validation ownership

- Implementation agents run only the narrow checks needed for their changed
  surface and report results to the root.
- The root runs the complete phase-required suite once after all edits: lint,
  typecheck, asset validation when relevant, then the production build.
- Once required checks pass, do not repeat them unless subsequent changes can
  affect their result.
- After a correction, rerun affected checks only. Repeat the production build only
  when runtime/build inputs changed after the previous build.
- Start browser verification after static checks pass and use one server session
  for desktop, reverse-scroll, reduced-motion, and narrow-viewport checks.

## 7. Output discipline for subagents

Return concise summaries only.

Preferred handoff:

```text
Scope:
Files inspected:
Files changed:
Behavior:
Verification:
Risks / follow-up:
```

Keep handoffs to these six fields and approximately 150–250 words.

Do not return:
- complete source files;
- full terminal logs;
- full `git diff`;
- repeated repository architecture;
- speculative redesigns outside task scope.

## 8. Plans

Implement only the requested/current phase.

Do not opportunistically implement future visual polish, character assets,
audio, mobile redesign or deployment while earlier interaction architecture is
still being proven.

## 9. Safety around dependencies

Do not add a dependency solely because it is convenient.

Before adding one:
- confirm existing stack cannot reasonably solve the problem;
- check bundle/runtime implications;
- prefer maintained packages;
- state why it is necessary.

Do not upgrade major framework versions during unrelated feature work.

## 10. Completion standard

A task is not complete merely because code was written.

Completion means:
- requested behavior works;
- relevant checks pass;
- no obvious lifecycle/resource leak is introduced;
- responsive/accessibility implications are considered;
- project state is updated when appropriate.
