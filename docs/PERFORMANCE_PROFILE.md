# Performance Profile — Phase 21 baseline and V8 venue cast

**Profile date:** 2026-09-21
**Scope:** Phase 21 baseline with the local V8 cast addition. This is static/source accounting plus local visual review, not a production-browser benchmark. No FPS, frame-time, GPU-memory, renderer-info, transfer-waterfall, or React Profiler result is claimed below.

## V8 venue cast update — 2026-09-22

The active scene now adds one authored chair umpire and up to 12 authored
spectators, loaded after the court and stadium. The resting-pose geometry of each
spectator variant is merged at load and drawn as one instanced mesh; the umpire is
one merged mesh. The new umpire replaces four procedural chair meshes, so its one
draw plus three spectator draws leaves the prior 33 high-tier structural draws
unchanged. It adds four basic materials, yielding 15 materials,
16 instanced groups, and 173/151/84 instances at high/medium/low. The low tier
retains three authored spectators. These are source counts, not measured renderer
calls or frame timings. Source GLB animations remain present but venue figures
currently hold static poses. The four direct venue GLBs total approximately
139 KB on disk and retain one authored 32px PNG atlas each. The runtime merged
geometry uses vertex colors instead of those atlases; encoded transfer, decoded
texture-cache memory, and GPU costs have not been measured.

The Phase 21 findings below remain the baseline before this addition.

## Finding: active venue source accounting is controlled, but it is not a whole-frame measurement

**Evidence:** `RetroEnvironment` exports `RETRO_ENVIRONMENT_METRICS` with 33 structural draw submissions against a 34-call ceiling, 11 shared `MeshStandardMaterial` instances, 13 instanced groups, and 161 high-detail instances. The Phase 21 source accounts for 81 instances at low detail (court/venue instancing only), 145 at medium (32 seats + 32 crowd), and 161 at high (32 seats + 48 crowd). The draw-submission count is 31/33/33 for low/medium/high: low omits seats and crowd; medium/high retain the same submissions but vary crowd instance count. Court, seven station silhouettes, and stadium structural blocks remain in every tier.

**Impact:** instancing and shared materials bound the known repeated-geometry cost. These figures exclude players, ball/shadow, lights, debug content, and browser/driver work, so they must not be reported as final renderer draw calls or triangle counts.

**Change:** Phase 21 replaces the transparent wireframe net plane with two instanced opaque cord groups and expands the instanced court-line/wear geometry. It adds one structural draw submission and 36 high-detail instances without adding a material or texture. The previous Phase 09 14-call/six-material baseline is obsolete for the active venue and is not used here.

**Expected effect:** deterministic tier changes remove 80 repeated seat/crowd instances on low while retaining navigation landmarks and the court identity.

**Verification:** after the staged environment mount and after both player GLBs resolve, capture `renderer.info.render.calls`, `triangles`, `points`, `lines`, `memory.geometries`, `memory.textures`, and `programs.length` at the same viewport and chapter for each tier. Record the environment source accounting separately from whole-scene renderer values.

## Finding: the checked-in GLB set is small and within every declared asset budget

**Evidence:** `assets:build:reviewed-characters` and `assets:validate` passed on 2026-09-21 for all six production GLBs, including exact manifest/provenance, Meshopt, environment contracts, and in-place character clips. `asset-manifest.json` and on-disk byte counts total 68,604 B: court 8,544 B; props 5,044 B; scoreboard 3,076 B; stadium shell 3,224 B; Player A 25,736 B; Player B 22,980 B. Each environment partition is below its 100 KB budget (scoreboard 60 KB); each player is below 80 KB. The manifest requires Meshopt and declares no raster textures or KTX2 payloads. Both players are reviewed `blockbench-export` assets.

**Impact:** static asset-transfer and texture-content pressure are low. Disk bytes are not HTTP transfer, decode time, runtime geometry memory, or GPU texture memory; all of those remain unmeasured. The default venue is procedural, so legacy environment GLBs load only through the explicit legacy or error-fallback path; both player GLBs still stream for rally actors.

**Change:** the reviewed player GLBs now load as the ordinary match actors through `useGLTF(path, false, true)`. Three flat runtime palette materials per player replace the exports' non-visible default material without adding textures; the materials are created once per cloned actor and disposed on unmount.

**Expected effect:** no raster texture allocation is introduced by current GLBs. KTX2/Basis remains unnecessary until authored raster textures exist and a visual/performance comparison justifies it.

**Verification:** use a cache-disabled production-browser Network export to record actual request count, encoded/decoded transfer, response end, Meshopt decoder cost, and player readiness. Test both normal and `?environment=legacy` paths.

## Finding: quality controls provide deterministic, documented GPU-cost levers

**Evidence:** `SCENE_QUALITY` caps DPR at high/medium/low = 2/1.5/1; it sets the single shadow-map size to 1024/512/256 and enables shadows at high/medium only. `Lighting` has a hemisphere fill, a single shadow-capable directional key, and a non-shadow directional fill. `ExperienceCanvas` applies the selected DPR and shadow flag directly. No active `EffectComposer`, post-processing API, custom shader material, or texture loader was found in `src`.

**Impact:** relative maximum render-target pixel work is 4 : 2.25 : 1 versus DPR 1. Shadow-map texels are 1,048,576 : 262,144 : 0 because the low tier disables shadow casting (the retained 256 setting is inactive). The Phase 21 net uses opaque instanced cords rather than a transparent wireframe plane; standard-material lighting and expanded shadow-receiving grass still require a measured GPU trace.

**Change:** no quality reduction without measured need; it would alter the intended lighting and court readability.

**Expected effect:** the existing tiers are deterministic and testable: high/medium/low map exactly to their DPR, shadow, environment-detail, and seat/crowd deltas above.

**Verification:** at a fixed viewport, capture GPU/frame time, renderer program count, and screenshots per tier. Confirm tier switches do not lose context, leak resources, or compromise net/shadow contrast.

## Finding: hot-path transforms remain ref-owned; no demonstrated continuous React/Zustand churn

**Evidence:** `CameraRig`, `TennisBall`, both character controllers, and scoreboard emphasis mutate refs in `useFrame`. Camera and ball vectors are module-scoped; character mixer/actions/sample/root-transform objects live in refs; `mixer.update(0)` is deterministic scrub evaluation. The current `useFrame` callbacks do not allocate vectors, colors, arrays, or React/Zustand state. Environment `Matrix4` creation occurs in layout effects for static instance setup or chapter changes, not per frame. The animation timeline writes the mutable narrative-progress ref; the scoreboard subscribes only to coarse `activeChapter` changes.

**Impact:** no code-evidenced render-loop allocation or per-frame React store update calls for remediation. Scroll-time CPU and frame pacing remain browser measurements, especially while GSAP scrubs master progress.

**Change:** no runtime change.

**Expected effect:** reverse scroll retains deterministic transforms without a React reconciliation path for normal scene motion.

**Verification:** use React Profiler and a Performance trace during continuous forward/reverse scroll. Report 50th/95th/99th frame duration, frames above 16.7/33.3 ms, Canvas-subtree commits, and GSAP/`useFrame` self time.

## Finding: visibility, listener, animation, and material cleanup have static coverage

**Evidence:** `ExperienceCanvas` removes its `visibilitychange` listener and uses `frameloop="never"` while hidden. The GSAP timeline removes document/window listeners, cancels pending frames, disconnects its resize observer, and reverts its GSAP context. Rally audio removes its visibility listener, cancels frames, unsubscribes, and closes its audio context. Character cleanup stops actions and uncaches the scene; `RetroEnvironment` disposes all runtime-created palette materials on unmount.

**Impact:** no obvious static listener, audio, mixer, or runtime-material leak is demonstrated. GLTF cache ownership, WebGL context release, heap plateaus, and driver-side disposal remain browser-only observations.

**Change:** no runtime change.

**Expected effect:** hidden tabs avoid continuous Canvas frames and rally-audio sampling; remount cleanup releases locally created scene resources.

**Verification:** hide/show for 30 seconds, then repeatedly mount/unmount the experience. Confirm a single resume, stable listener/context counts, and a stable heap/`renderer.info.memory` plateau.

## Browser-only measurement matrix (pending)

Run a fresh production build before collecting these results; existing `.next` output must not be used as a bundle or runtime benchmark.

| Scenario | Required capture | Target / acceptance signal |
| --- | --- | --- |
| Desktop high, mid-rally | Performance trace + `renderer.info` | pursue 60 FPS; avoid sustained avoidable frames over 16.7 ms |
| Mobile low, mid-rally | Performance trace + `renderer.info` | prefer stable 30–60 FPS; DPR 1 and shadows off |
| High → medium → low | screenshots + renderer stats | exact deterministic tier deltas; no context loss/resource growth |
| Initial uncached load | Network + Performance export | actual Canvas/GSAP/Meshopt/GLB waterfall and usable DOM timing |
| Hidden → visible | trace + listener inspection | Canvas/audio pause hidden and resume once |
| Forward/reverse scroll | React Profiler + Performance trace | no continuous React commits from scene transforms |

## Audit conclusion

No meaningful performance regression is demonstrated by the current static evidence, so this phase makes no speculative rendering or quality change. The highest-value next evidence is a fresh production-browser trace at high desktop and low mobile tiers; use the existing deterministic DPR, shadow, and detail controls only if those captures identify a real pacing or GPU-pressure issue.
