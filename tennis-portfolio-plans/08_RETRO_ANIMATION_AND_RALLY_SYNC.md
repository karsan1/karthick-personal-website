# Phase 08 — Retro Character Animation & Rally Synchronization

## Objective

Replace prototype joint posing with final low-poly Blockbench character animation while preserving the deterministic scroll-driven tennis rally.

The result should feel like a deliberately animated retro sports game, not motion-capture realism.

---

## Primary agents

- Motion owner: `motion_engineer`
- Character/runtime owner: `scene_engineer`
- Asset/clip contract: `asset_pipeline_engineer`
- Review: `qa_reviewer`

Use one implementation owner per overlapping file. The orchestrator should split asset-authoring, runtime playback, and narrative synchronization into separate task packets.

---

## Minimum animation set

Do not over-author.

### Player A
- `idle_ready`
- `serve` if the current narrative requires serve animation
- `forehand`
- `backhand`
- `recovery`

### Player B
- `idle_ready`
- `forehand`
- `backhand`
- `recovery`

Optional only after required beats work:
- shuffle left/right,
- victory/match-point pose,
- walk-to-net.

No facial animation is required.

---

## Clip authoring style

Favor strong readable key poses:

```text
ready
→ anticipation
→ wind-up
→ contact
→ follow-through
→ recovery
```

Guidelines:

- fewer stronger key poses are better than dense noisy curves,
- exaggerate racket preparation and follow-through slightly,
- preserve balance/foot placement enough to read as tennis,
- avoid uncanny mocap foot sliding,
- no need for perfect professional-player biomechanics.

If mocap is used as a reference, simplify it rather than preserving high-frequency motion.

---

## Clip naming and contact metadata

Define stable normalized contacts in data, not scattered magic numbers.

Recommended structure:

```ts
export const PLAYER_CLIP_CONTACTS = {
  serve: 0.72,
  forehand: 0.50,
  backhand: 0.48,
} as const;
```

Better: attach contact metadata to shot definitions so clip timing and ball trajectory are reviewed together.

Do not duplicate the same contact values in multiple components.

---

## Playback architecture

Use Three.js `AnimationMixer` / actions behind a small controller.

The controller should expose deterministic scrubbing, for example:

```ts
setCharacterPose({
  clip: 'forehand',
  localProgress: 0.52,
  stepped: true,
})
```

For narrative-driven clips:

- derive clip time from normalized narrative progress,
- set animation time deterministically,
- support forward and reverse scroll,
- do not depend on `action.play()` wall-clock progression for scroll-scrubbed sequences.

Ambient idle can use conventional playback only when not tied to a chapter scrub.

---

## Retro stepped-animation system

Implement a single character-animation stepping helper.

Concept:

```ts
function quantizeClipTime(time: number, fps: number) {
  return Math.floor(time * fps) / fps;
}
```

Use a documented default selected from Phase 06 visual review, likely in the 12–18 fps range.

Rules:

- quantize **character clip sampling**, not master scroll progress,
- ball remains smooth,
- camera remains smooth,
- DOM transitions remain smooth,
- allow smooth playback as a debug/reference mode,
- reduced-motion can use static representative poses.

Do not implement a global low-FPS render loop.

---

## Ball synchronization

Keep the ball as its own scene object.

For every hit:

1. map master narrative progress to the local shot range,
2. map the same shot range to the correct character clip range,
3. tune the clip contact position against ball position,
4. document the accepted contact progress,
5. verify reverse scrolling.

Do not add collision physics to detect a hit.

---

## Racket attachment

Preferred:

- racket is part of the character asset or attached to `SOCKET_Racket`,
- references are cached once after load,
- no scene traversal every frame,
- grip pivot is standardized in source asset.

Check both forehand and backhand orientations.

---

## Root motion policy

Prefer animation-in-place.

The narrative/motion system should continue to own player root court position so scroll reversal is deterministic.

If a source clip includes root translation:

- remove/bake it in the asset authoring step, or
- explicitly subtract it during integration.

Do not allow animation root motion to fight the existing baseline positioning.

---

## Ambient behavior

When the narrative is parked:

- subtle stepped idle may loop if motion preference allows,
- avoid constant large racket/body movement during content reading,
- pause/reduce work when document is hidden.

---

## Visual QA checkpoints

Check:

- racket/ball contact from production camera,
- feet do not visibly float through court,
- no severe limb inversion,
- transition into/out of clips is stable,
- reverse scrolling does not produce undefined mixer state,
- stepped sampling looks intentional,
- Player A/B are visually distinguishable.

---

## Acceptance criteria

Phase boundary: stop after Phase 08 synchronization and visual acceptance. Do not
begin the environment restyle in Phase 09 without a new explicit request.

- [ ] Final Player A/B GLBs contain the required stable clips.
- [ ] Narrative-driven clips are scrubbed deterministically from master progress.
- [ ] Character animation uses the chosen retro stepping strategy.
- [ ] Ball and camera remain smooth.
- [ ] Rackets remain attached and oriented correctly.
- [ ] Contact frames visually line up with deterministic ball paths.
- [ ] Root motion does not fight application positioning.
- [ ] Forward/reverse scrolling works through every character hit.
- [ ] Reduced-motion uses stable representative poses.
- [ ] Phase 06 prototype remains a reliable load failure fallback.
