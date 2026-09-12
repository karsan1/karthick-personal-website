# Phase 05 — Characters, Rigging & Tennis Animation

## Objective
Create believable tennis players and umpire without chasing photoreal digital humans.

## Deliverable
Three optimized rigged characters with stable skeletons, named animation clips, and R3F playback controls.

---

## Character visual direction
Use stylized realism:
- realistic body proportions,
- simplified facial features,
- strong clothing silhouettes,
- clean hair shapes,
- limited skin detail,
- no requirement for facial closeups,
- outfit colors consistent with portfolio art direction.

Expected camera distance should allow faces to remain secondary.

---

## Player animation set
Minimum Player A:
- `idle_ready`
- `ball_bounce`
- `serve_toss`
- `serve_swing`
- `forehand`
- `backhand`
- `recovery`
- `walk_net`

Minimum Player B:
- `idle_ready`
- `forehand`
- `backhand`
- `recovery`
- `walk_net`

Umpire:
- `idle`
- `look_left`
- `look_right`
- optional `announce`

Do not build dozens of animations before the master timeline proves they are needed.

---

## Animation sourcing
Efficient approach:
1. obtain legally usable base mocap / Mixamo-like animations,
2. retarget to your skeleton,
3. correct tennis-specific arm/racket mechanics in Blender,
4. trim clips tightly,
5. ensure looping clips loop cleanly,
6. bake only required animation channels,
7. export clips with stable names.

Tennis motions often need manual correction because generic mocap will not correctly handle racket face, serve toss, or weight transfer.

---

## Ball handoff problem
The ball is a separate scene object, not permanently attached to a player skeleton.

For serve:
- before toss: align ball to hand anchor,
- toss phase: release from hand and follow authored toss curve,
- contact phase: transition to serve shot curve.

Do not dynamically solve full physics/collision.

---

## Racket attachment
Recommended:
- racket is either skinned/parented in Blender or attached to a named hand bone/socket in R3F,
- grip origin standardized,
- avoid per-frame searching through object hierarchy.

Cache bone references after load.

---

## R3F animation controller
Create an abstraction that exposes actions without making UI components know AnimationMixer internals.

Conceptual API:

```ts
playerAController.setClipProgress('serve_swing', progress)
playerBController.setClipProgress('forehand', progress)
```

For scrubbed sequences, animation clip time should be derived from timeline progress rather than relying only on `action.play()` forward playback.

Use conventional playback for ambient idles when not tied to scroll.

---

## Animation synchronization events
Create documented contact frames:

```ts
const contacts = {
  serve: 0.73,
  forehandA: 0.48,
  forehandB: 0.52,
}
```

These normalized clip positions synchronize racket contact, ball trajectory transition, impact audio, and optional micro camera response.

Tune visually; do not assume source animation labels are precise.

---

## Ambient motion
When scrolling stops:
- players may breathe/shift slightly,
- umpire may make very subtle idle motion,
- avoid the whole scene feeling frozen,
- but pause expensive unnecessary animation on hidden/offscreen contexts.

---

## Acceptance criteria
- [ ] Player A/B and umpire load from production GLBs.
- [ ] Required clips have stable names.
- [ ] Serve contact visually lines up with ball release.
- [ ] Return contact visually lines up with ball trajectory.
- [ ] Scroll can scrub relevant character actions backward without exploding poses.
- [ ] Rackets remain correctly attached.
- [ ] Character visuals do not depend on facial realism.
