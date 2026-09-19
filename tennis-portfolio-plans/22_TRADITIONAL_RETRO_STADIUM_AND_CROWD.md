# Phase 22 — Traditional Retro Stadium & Crowd

## Objective

Replace the remaining “large green blocks + small far-side crowd” feeling with a compact, prestigious, traditional grass-tournament venue that still reads like an early-console sports game.

The target is **Wimbledon-inspired atmosphere**, not a Wimbledon copy:
- deep greens,
- cream trim,
- restrained purple accents,
- stepped seating,
- compact colorful crowd blocks,
- traditional courtside architecture,
- original signage,
- bright outdoor tournament mood.

Read first:
- `docs/PIXEL_SPORTS_COURT_ART_DIRECTION.md`
- `docs/RETRO_ART_DIRECTION.md`
- Phase 21 output
- `src/components/scene/RetroEnvironment.tsx`
- `src/components/scene/sceneQuality.ts`

## Owner

- Primary: `scene_engineer`
- Performance: `performance_engineer`
- Review: `qa_reviewer`

## Current blockers to fix

1. `STAND_BLOCKS` are three large rectangular masses, so the venue still reads as placeholder architecture.
2. Seats and crowd exist only as a small far-side block.
3. Crowd figures use dodecahedrons, which can read as floating/balloon-like dots rather than spectators.
4. Side stands are largely empty.
5. Low quality removes seats/crowd entirely, violating the intended requirement that every tier retain a recognizable crowd band.
6. There is little architectural layering between grass apron, walls, seating, concourse/tunnel, and background.
7. Generic purple sign blocks do not yet feel like a deliberate traditional tournament venue.

## Protected contracts

Preserve:
- one Canvas,
- Phase 21 court/rally geometry contract,
- all seven world stations,
- Phase 04 legacy fallback,
- quality-tier switching,
- current navigation semantics,
- current camera owner.

## Implementation tasks

### 1. Build stepped seating instead of slab stands

Replace or visually cover the monolithic stand slabs with 3–5 stepped terrace levels.

Use:
- instanced box steps,
- repeated low-poly seat rows,
- simple rail strips,
- deep-green structure with cream seating/trim.

Prioritize:
- far baseline stand,
- both side stands,
- clear central gap/tunnel/scoreboard composition.

Do not build a giant realistic bowl.

### 2. Replace balloon-like crowd geometry

Replace dodecahedron crowd dots with more intentional retro spectator silhouettes.

Preferred options:
- two-part instanced silhouettes (torso + head),
- low-poly cutout/card silhouettes,
- tiny billboard clusters,
- a mixed approach with one or two instanced draw groups.

The crowd should read as a **packed color band**, not individual detailed people.

Use a limited palette:
- cream/white,
- navy,
- burgundy,
- teal,
- muted yellow,
- restrained purple,
- dark green/charcoal.

### 3. Populate side stands

Add controlled crowd density to both side stands so the venue feels complete from:
- Hero,
- Experience,
- Research,
- Capabilities,
- Contact camera states.

Do not create dense geometry behind the camera where it does not contribute.

### 4. Add traditional tournament architecture cues

Add original, generic architectural details that evoke a classic grass-court event without reproducing Wimbledon assets.

Good candidates:
- cream railings,
- dark-green paneled barriers,
- simple stair openings,
- low canopy/court-entry framing,
- a small analog-style clock motif using original geometry,
- compact green pavilion/facade shape behind the far stand,
- cream trim lines,
- restrained purple accent strips.

Avoid:
- Wimbledon wordmarks,
- crossed-racket logos copied from Wimbledon,
- official sponsor board layouts,
- exact Centre Court architecture.

### 5. Improve signage

Replace plain accent rectangles with original sign panels.

Possible labels:
- `COURT 01`
- `MATCH`
- `PLAYER 01`
- `PROJECTS`
- `RESEARCH`
- short portfolio-specific labels

Use pixel-block/segment styling where practical.

Meaningful portfolio copy should remain in DOM; signs are atmosphere/navigation reinforcement only.

### 6. Add minimal officials / ball-person silhouettes

On medium/high tiers, add a few recognizable tennis-event silhouettes:
- one or two ball-person figures,
- one line-official style silhouette if composition allows.

Keep them:
- static or minimally animated,
- low-detail,
- small,
- clearly secondary to players.

Do not create additional interactive destinations.

### 7. Quality tiers must preserve venue identity

High:
- full far + side crowd,
- full seating rows,
- all signs/trim,
- optional officials.

Medium:
- reduced crowd count,
- same stands,
- recognizable color band,
- essential trim/signs.

Low:
- no detailed spectators required,
- but retain a simple crowd band/card strip,
- retain stands,
- retain scoreboard/tunnel,
- retain classic green/cream venue read.

The low tier must never become an empty stadium shell.

### 8. Keep draw-call growth bounded

Prefer:
- shared geometries,
- shared materials,
- instancing,
- palette variation through instance colors.

Target:
- stay near the existing environment budget,
- justify any material/draw-call increase with visible value,
- avoid one material per sign or spectator.

## Validation

Run:
- `corepack pnpm lint`
- `corepack pnpm typecheck`
- `corepack pnpm build`

Update:
- `RETRO_ENVIRONMENT_METRICS`
- `docs/PERFORMANCE_PROFILE.md` if counts change
- `docs/CURRENT_STATE.md` only after acceptance

## Visual review

Capture the same Hero frame at high/medium/low.

Also capture:
- Experience side view,
- Research side view,
- Projects far-side view,
- Contact end state,
- mobile Hero.

## Acceptance criteria

- [ ] Venue no longer reads as three rectangular stand blocks.
- [ ] Far and side stands have visible stepped seating structure.
- [ ] Crowd reads as intentional retro spectators, not colored spheres.
- [ ] Low quality retains a recognizable crowd/venue band.
- [ ] Traditional green/cream/purple atmosphere is visible without copied branding.
- [ ] Architecture feels prestigious but remains geometrically simple.
- [ ] Scoreboard/tunnel remain visible and navigable.
- [ ] No world hotspot becomes harder to use.
- [ ] Performance remains within documented bounds.

Stop after the venue shell and crowd pass review. Phase 23 owns the detailed courtside objects and scoreboard.
