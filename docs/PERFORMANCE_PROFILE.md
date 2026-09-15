# Phase 12 Performance Profile

## Phase 16 venue reframe — static budget update

**Evidence:** `RetroEnvironment` now uses procedural grass bands and wear strips,
deep-green surrounds, seven station silhouettes, and high-tier far-side seating/
crowd. Static source accounting records 32 environment draw submissions against a
34-call ceiling, eleven shared material instances, eleven instanced groups, and
125 high-tier instances. Medium retains 32 crowd instances; low removes seating
and crowd but keeps every station and the grass/net/surround identity.

**Impact:** the previous 14-call Phase 09 environment figure is superseded for the
active venue. No raster grass texture, additional Canvas, or post-processing was
introduced. Runtime-created materials still dispose on unmount.

**Verification:** capture `renderer.info.render.calls`, triangles, geometries,
textures, and programs after staged mount at high/medium/low. Confirm the opening
frame keeps players, lines, net, scoreboard, and every station readable before
accepting the increased structural budget.

**Profile date:** 2026-09-13  
**Scope:** current shared-worktree Phase 12 scene; source and asset-manifest audit.  
**Status:** static facts below are verified from source/manifest. No browser performance trace, `renderer.info`, or fresh production-bundle measurement was captured for this profile, so FPS, frame time, final draw calls, triangles, GPU memory, and JS transfer remain pending rather than estimated.

## Finding: initial 3D asset transfer is small, and the default scene does not request the legacy environment GLBs

**Evidence:** `public/models/asset-manifest.json` reports 31,920 bytes across all six optimized GLBs: court 8,544 B, props 5,044 B, scoreboard 3,076 B, stadium 3,224 B, player A 6,144 B, and player B 5,888 B. All are below their 60–100 KB individual budgets. The current `RetroEnvironment` is procedural; the four legacy environment GLBs are requested only by the explicit `legacyEnvironment` fallback path. Authored player GLBs total 12,032 B. All files require `EXT_meshopt_compression` and `KHR_mesh_quantization`; `useGLTF(path, false, true)` explicitly enables Drei's Meshopt decoder.

**Impact:** low network and decode pressure for the current default scene. The fully resident manifest is only about 31 KB on disk before HTTP compression, but byte size is not a substitute for measured decode time on low-end mobile devices.

**Change:** no runtime change recommended. `ExperienceCanvas` is dynamically imported with `ssr: false`, and `ScrollTrigger` is dynamically imported on demand, keeping the initial HTML path independent of WebGL and the scroll plugin.

**Expected effect:** the Canvas/Three runtime is deferred from SSR; decorative procedural detail mounts over three animation frames after the court rather than blocking the initial scene mount.

**Verification:** in a production browser run, record a Network export with cache disabled for first and repeat load, and report Canvas chunk, GSAP/ScrollTrigger chunk, Meshopt decoder, GLB request count, transfer size, response end, and decode completion.

## Finding: texture and shader pressure are intentionally minimal

**Evidence:** the manifest declares no raster textures in any current export, so texture GPU allocation from GLBs is 0 bytes. The active procedural environment creates six shared `MeshStandardMaterial` instances and disposes them on unmount. Source search found no `EffectComposer`, post-processing package/API, custom shader material, or texture loader in the active scene. Lighting is two directional lights plus one hemisphere light; only the warm directional light can cast shadows.

**Impact:** no texture-memory risk is demonstrated. The main GPU-risk proxy is fill/shadow cost: high tier permits DPR 2 (up to 4x DPR-1 pixels), antialiasing, one 1024² shadow map, standard-material lighting, and a transparent wireframe net.

**Change:** no change recommended without a GPU trace. Keep the current low-poly material palette; replacing standard materials or removing the net would trade away the intended visual language without evidence.

**Expected effect:** current quality tiers deterministically reduce this risk: high = DPR cap 2 / 1024² shadow / full detail; medium = 1.5 / 512² / no stadium; low = 1 / shadows off / court plus courtside props. Relative maximum render-target pixel work is 4 : 2.25 : 1, while shadow-map texels are 1,048,576 : 262,144 : 0.

**Verification:** capture `renderer.info.memory.textures`, renderer program count, and GPU frame time per tier at an identical viewport and chapter. Capture a screenshot with transparent net and cast shadows to ensure tier changes preserve acceptable contrast and composition.

## Finding: environment draw-call control is present, but total renderer draw calls and triangles are not yet measured

**Evidence:** `RETRO_ENVIRONMENT_METRICS` documents 14 environment draw calls against a ceiling of 15, six shared materials, eight instanced groups, and 97 instances at full detail. Court lines, props, scoreboard digits, stadium seats/crowd/lights use `InstancedMesh`; their matrices are initialized in layout effects, not every frame. The live scene also contains two authored players, ball/shadow, camera, and lights, so the environment metric is not the whole-frame draw count. `gltf-transform inspect` confirms the six optimized GLBs have no textures and Meshopt/quantization extensions, but the profile intentionally does not convert static asset table data into a claimed live triangle count.

**Impact:** the current source demonstrates a controlled environment-call budget, but actual draw calls, triangles, geometries, materials, and shader programs are browser/driver-dependent and must be captured at runtime.

**Change:** no change recommended. Instancing is already used where repeated geometry materially benefits it.

**Expected effect:** low tier omits scoreboard and stadium groups; medium omits stadium; high mounts all three deferred detail stages.

**Verification:** after the third staged frame and after GLB players resolve, log `renderer.info.render.calls`, `triangles`, `points`, `lines`, `renderer.info.memory.geometries`, `textures`, and `renderer.info.programs.length` for all tiers. Compare against the 15-call environment ceiling separately from whole-scene totals.

## Finding: frame-loop work follows ref ownership and avoids continuous React/Zustand writes

**Evidence:** `CameraRig`, ball presentation, both character controllers, and scoreboard emphasis update Three.js refs in `useFrame`. The hot character controller retains its mixer/actions/sample objects in refs and calls `mixer.update(0)` after setting deterministic scrub time; it allocates no vectors, colors, arrays, or React state in the frame callback. Camera vectors are module-scoped reusable `Vector3`s. The animation master progress is a mutable ref written by GSAP, not React or Zustand. The only scoreboard store subscription is `activeChapter`; timeline code updates it only when a sampled chapter differs. Debug DOM readout is gated by `debug` and a progress/chapter/composition-change threshold.

**Impact:** no source-evidenced per-frame React rerender or Zustand store churn is present. CPU cost still needs a Performance-panel trace, particularly during scroll because GSAP drives progress with `scrub: 0.45` and all frame subscribers sample it.

**Change:** no change recommended. The ref-based deterministic architecture is the protected design and avoids reverse-scroll reconciliation work.

**Expected effect:** scroll sampling should be bounded to normal animation/frame work; DOM chapter changes should occur only at chapter boundaries.

**Verification:** use React Profiler while continuously forward/reverse scrolling and confirm Canvas subtree commits are limited to explicit quality, loading-stage, visibility, and chapter changes. Record a Chrome Performance trace, inspect scripting/self time for GSAP and `useFrame` subscribers, and report 50th/95th/99th frame duration plus count of frames above 16.7 ms and 33.3 ms.

## Finding: lifecycle and hidden-tab behavior are handled; browser confirmation is still required

**Evidence:** `ExperienceCanvas` listens for `visibilitychange`, removes the listener on cleanup, and sets R3F `frameloop="never"` while hidden. `useRallyAudio` cancels its requestAnimationFrame and suspends its `AudioContext` while hidden; it removes the visibility listener, unsubscribes Zustand, cancels frames, and closes audio on cleanup. The GSAP hook removes its document/window listeners, disconnects `ResizeObserver`, cancels pending animation frames, and calls `context.revert()`. Character mixers stop actions and uncache their scene. Procedural palette materials are disposed on unmount.

**Impact:** no obvious listener, audio, mixer, or material lifecycle leak is demonstrated statically. GLTF cache/resource ownership and WebGL-context release require a remount test.

**Change:** no change recommended.

**Expected effect:** background tabs stop Canvas rendering and audio sampling instead of consuming continuous CPU/GPU work.

**Verification:** toggle tab visibility for 30 seconds and confirm `useFrame`/audio activity stops, then resumes once. Repeatedly mount/unmount the experience and verify listener counts, WebGL contexts, heap, and `renderer.info.memory` return to a stable plateau.

## Measurement matrix still required

Run a fresh production build and one browser session per row; do not reuse stale `.next` output as a bundle measurement.

| Scenario | Required capture | Acceptance signal |
| --- | --- | --- |
| Desktop high, mid-rally | Performance trace + `renderer.info` | stable pacing near the 60 FPS target; no sustained avoidable frames over 16.7 ms |
| Mobile low, mid-rally | Performance trace + `renderer.info` | stable 30–60 FPS preference; DPR 1, shadows disabled |
| Tier switch high → medium → low | screenshot + renderer stats | deterministic detail/shadow/DPR deltas above; no context loss or runaway resources |
| Initial uncached load | Network/Performance export | dynamic Canvas and ScrollTrigger chunks defer correctly; asset/decode waterfall recorded |
| Hidden then visible | trace/listener inspection | Canvas frameloop and audio pause while hidden, resume once |
| Forward/reverse scroll | React Profiler + Performance trace | no continuous React commits from scene transforms; GSAP/scroll work has no duplicate triggers |

## Bottlenecks and follow-up priority

No meaningful regression is demonstrated by the static audit. The only credible unmeasured risks are high-tier DPR/shadow fill cost, device-specific standard-material shader cost, and scroll-time CPU pacing. Measure those first before lowering quality or adding adaptive logic. If a target is missed, prefer the existing deterministic tier controls (DPR, shadow map/off, environment detail) and document the visual tradeoff with the captured delta.
