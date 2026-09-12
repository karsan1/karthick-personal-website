# Phase 02 — Interaction Prototype

## Objective
Prove the core idea with primitive geometry before spending time on Blender assets.

This is the most important phase. If the primitive version is not satisfying, production models will not rescue it.

## Deliverable
A scroll-controlled tennis serve and short rally using only simple geometry, with a camera that responds cinematically and reversible scroll behavior.

---

## Prototype scene
Create only:
- green court plane,
- white court lines,
- simple net,
- capsule Player A,
- capsule Player B,
- sphere tennis ball,
- simple umpire-chair placeholder,
- one perspective camera,
- directional light + ambient/environment light.

No detailed stadium. No realistic people. No postprocessing.

---

## Court coordinate contract
Lock a world coordinate convention now.

Recommended:
- court center = `(0, 0, 0)`
- X = court width
- Y = vertical
- Z = court length
- net centered at Z = 0
- Player A baseline = negative Z
- Player B baseline = positive Z
- meters or a consistent proportional unit system

Document the exact court dimensions used so Blender assets match later.

---

## Scroll narrative v0
Create one long scroll range with timeline labels:

```text
0.00  hero_idle
0.08  serve_toss
0.14  serve_contact
0.24  first_bounce
0.33  player_b_return
0.45  second_bounce
0.55  player_a_return
0.68  content_pause
0.82  final_exchange
1.00  prototype_end
```

These are story percentages, not hard-coded pixels.

---

## Ball trajectory architecture
Do not use a physics engine.

Represent each shot as an authored curve:

```ts
type Shot = {
  id: string
  start: number
  end: number
  curve: THREE.Curve<THREE.Vector3>
  bounceAt?: number
}
```

Use Bezier or Catmull-Rom curves. Sampling timeline progress should deterministically place the ball at the same coordinate every time. This guarantees reverse scrolling works.

Add optional spin by rotating the ball from normalized shot progress.

---

## Camera prototype
The camera should react to match beats without literally attaching to the ball.

Create:
- position curve / keyframes,
- look-at target curve / keyframes,
- field-of-view keyframes if needed.

Prototype shots:
1. low broadcast angle behind server,
2. subtle crane as serve crosses net,
3. slight lateral move for return,
4. settle into near-static composition when content appears.

Important: content beats must reduce camera velocity.

---

## GSAP timeline
Create one master prototype timeline attached to ScrollTrigger.

Requirements:
- `scrub` enabled,
- labels for major beats,
- debug markers in debug mode only,
- reverse scroll behaves deterministically,
- no side effects that only work when scrolling forward.

Avoid callbacks that fire irreversible game logic. The scene is a scrubbed narrative, not a stateful match simulator.

---

## DOM proof
Add temporary HTML cards at two timeline beats:
- About placeholder
- Experience placeholder

They should fade/translate only when camera movement slows.

Test readable contrast over the 3D scene.

---

## Motion tuning rules
- Never rotate the camera aggressively around all three axes.
- Avoid direct mouse-look as a default.
- Use easing on camera interpolation even though scroll drives global progress.
- Keep horizon stable.
- Ball may move quickly; camera should move slowly.
- Avoid strong depth-of-field until the final art phase.

---

## Prototype performance target
Because geometry is trivial, the prototype should feel exceptionally smooth. If it does not, investigate architecture before adding assets.

Inspect:
- accidental React re-renders on scroll,
- state updates per frame,
- multiple competing RAF loops,
- unnecessary ScrollTriggers,
- event handlers that allocate objects continuously.

---

## Acceptance criteria
- [ ] Scroll controls serve toss, contact, ball flight, bounce, and at least one return.
- [ ] Reverse scroll exactly rewinds motion.
- [ ] Camera path is independent from ball path.
- [ ] About/Experience placeholders appear during quiet camera moments.
- [ ] Resize recalculates correctly.
- [ ] No React state is updated at animation-frame frequency.
- [ ] Interaction still feels compelling with primitives only.

## Stop condition
Do not begin detailed Blender work until you would willingly show this primitive prototype to someone as proof that the interaction itself works.
