# Phase 06 — Retro Character Style Prototype

## Objective

Prove the new player art direction directly in React Three Fiber **before** investing time in final Blockbench characters.

The phase succeeds when the existing capsule/sphere players are replaced by a deliberately low-poly prototype that reads as a retro tennis player at the real camera distances.

---

## Why this phase exists

The current player is fundamentally a capsule body plus sphere head. Authoring a full rig before validating the new silhouette would create unnecessary rework.

This phase is an art-direction proof, not the final character system.

---

## Primary agents

- Owner: `scene_engineer`
- Motion integration: `motion_engineer`
- Discovery: `repo_explorer`
- Review: `qa_reviewer`

The implementation owner for the scene files should remain singular to avoid conflicting edits.

---

## Preserve

Do not rewrite:

- `sampleBallPosition()` trajectory behavior,
- normalized narrative progress,
- current rally/contact beats,
- camera ownership,
- court coordinate system,
- Phase 04 environment loader,
- semantic DOM content,
- reduced-motion path.

The new prototype must consume the same `progress` contract as the current actors.

---

## New component structure

Recommended structure:

```text
src/components/scene/characters/
├── RetroPlayerPrototype.tsx
├── RetroRacketPrototype.tsx
├── RetroCharacterMaterials.ts
└── characterStyle.ts
```

Keep it small. Do not build a generalized character framework yet.

---

## Prototype modeling rules

Build the character from deliberately faceted primitives such as:

- low-segment box/wedge torso,
- low-segment poly head,
- separate upper/lower arms,
- separate upper/lower legs,
- simplified shoes,
- simple hair cap/wedge,
- simple racket frame/handle.

Avoid:
- capsule body,
- sphere-only head with no silhouette design,
- smooth cylinder limbs with many segments,
- realistic facial geometry,
- procedural complexity that will be thrown away when Blockbench arrives.

A prototype may use boxes, tapered boxes, low-segment cylinders, octahedra/dodecahedra, or custom tiny `BufferGeometry` wedges.

---

## Material direction

Use a very small material set:

- Player A clothing
- Player B clothing
- skin
- hair
- shoes
- racket

Use flat/faceted shading.

Where `MeshStandardMaterial` is used:

- `flatShading = true`,
- high roughness,
- restrained metalness,
- no expensive skin shader.

Do not add postprocessing in this phase.

---

## Pose hierarchy

Construct the prototype as transform groups that roughly mirror a future rig:

```text
playerRoot
├── hips
│   ├── torso
│   │   ├── head
│   │   ├── leftUpperArm
│   │   │   └── leftLowerArm
│   │   └── rightUpperArm
│   │       └── rightLowerArm
│   │           └── racket
│   ├── leftUpperLeg
│   │   └── leftLowerLeg
│   └── rightUpperLeg
│       └── rightLowerLeg
```

This lets the prototype prove actual tennis posing rather than moving one capsule as a whole.

---

## Prototype motion

Keep the existing player root movement, but add readable joint posing around return beats.

Minimum states:

- ready stance,
- forehand preparation,
- contact pose,
- follow-through,
- recovery.

For the other side, mirror or author a second variation.

Do not add skeletal `AnimationMixer` yet.

Use refs and direct transform mutation in `useFrame`.

No React state updates per frame.

---

## Racket-contact proof

The prototype racket must visibly pass near the deterministic ball at the defined hit beat.

Success criteria:
- racket is visible,
- contact pose reads at normal camera distance,
- hand/racket do not detach,
- reverse scroll restores previous poses predictably.

Exact sports biomechanics are not required yet.

---

## Retro stepping experiment

Add a local experimental constant/configuration for **character pose stepping only**.

Example concept:

```ts
const CHARACTER_ANIMATION_FPS = 15;
const stepped = Math.floor(progress * steps) / steps;
```

Rules:
- ball remains smooth,
- camera remains smooth,
- DOM remains smooth,
- only prototype character pose timing is quantized,
- make the stepping easy to toggle during visual review.

Compare roughly 12, 15, 18, and smooth playback. Choose a default only after review.

---

## Visual-review checklist

Review at actual chapter camera positions, not only in a free debug camera.

Ask:

- Does the body read immediately as human/athletic rather than balloon-like?
- Does the racket read without zooming in?
- Does the silhouette look intentionally retro rather than unfinished?
- Are limbs too blocky/Minecraft-like?
- Are proportions still usable for tennis poses?
- Is stepped animation charming or distracting?
- Does the character remain secondary enough for portfolio copy to be readable?

Record the chosen proportions/stepping decision in `docs/RETRO_ART_DIRECTION.md`.

---

## Reduced-motion behavior

Reduced-motion mode should:

- use a stable ready pose,
- not continuously cycle the joint animation,
- preserve a meaningful court composition.

---

## Cleanup

Once the prototype is accepted:

- remove `PlayerCapsule` from production `RallyActors`,
- retain only a minimal primitive fallback if it still serves a real failure mode,
- do not delete the deterministic ball system.

---

## Validation

Run:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Also manually verify:

- forward scroll,
- reverse scroll,
- reduced motion,
- desktop normal camera,
- narrow viewport,
- no console errors.

---

## Acceptance criteria

Phase boundary: stop after Phase 06 validation and visual acceptance. Do not begin
the Blockbench pipeline in Phase 07 without a new explicit request.

- [ ] Capsule/sphere players are no longer the production character representation.
- [ ] Low-poly prototype has articulated limb groups and a readable racket.
- [ ] Existing ball/rally timing remains deterministic.
- [ ] Contact poses visually line up well enough to validate the style.
- [ ] Character pose stepping has been evaluated and a target behavior documented.
- [ ] Ball and camera remain smooth.
- [ ] Reverse scrolling restores stable poses.
- [ ] Reduced-motion uses a stable non-cycling pose.
- [ ] No per-frame React/Zustand updates were introduced.
- [ ] Visual direction is approved before Phase 07 begins.
