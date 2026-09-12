# CodeGraph Workflow for Codex Agents

CodeGraph is used to reduce repository-discovery tokens, not to replace normal
engineering tools.

## Default sequence

### 1. Orient only when the area is unfamiliar

Use the CodeGraph MCP/skill if it is available.

CLI fallback:

```bash
codegraph orient --root . --budget small
```

Do not run a large orientation for every task.

### 2. Search the exact concept

```bash
codegraph search "CameraRig" --json
codegraph search "scroll progress" --json
```

For an exact literal, `rg` may be cheaper.

### 3. Expand only the promising result

```bash
codegraph explain src/path/to/file.ts
```

or use the installed CodeGraph MCP's bounded explanation/packet capability.

### 4. Ask a cross-file question only when necessary

```bash
codegraph explore "how does ScrollTrigger progress reach the tennis ball?" --root .
```

### 5. Before a cross-cutting change

Use dependency/impact/caller/callee features exposed by the installed CodeGraph
version to understand blast radius.

### 6. Verify with real engineering tools

After editing:
- TypeScript compiler/typecheck
- lint
- tests
- production build
- browser/performance profiling when relevant

## Token rules

- Do not paste full CodeGraph JSON into parent-agent messages.
- Distill findings to paths, symbols and edges.
- Do not have multiple agents run the same orientation.
- The parent should give specialists the discovered paths/symbols.
- Prefer handles/bounded packets where your CodeGraph version supports them.
- Use cached/auto-synced graph state rather than rebuilding manually unless the
  installed CodeGraph reports that its index is stale/broken.

## If your CodeGraph commands differ

There are multiple tools/projects named CodeGraph and versions evolve. The local
installation is authoritative.

Use:
```bash
codegraph --help
```

or the already configured MCP/skill interface.

Never invent unsupported flags.
