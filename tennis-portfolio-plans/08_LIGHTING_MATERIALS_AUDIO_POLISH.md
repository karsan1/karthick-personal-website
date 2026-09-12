# Phase 08 — Lighting, Materials, Audio & Art Polish

## Objective
Make the site feel expensive through composition, lighting, sound, and restraint rather than GPU-heavy effects.

## Deliverable
Final art direction pass with stable materials, environment lighting, restrained postprocessing, and opt-in synchronized audio.

---

## Lighting direction
Choose one clear scenario. Recommended:
- late-afternoon outdoor court or softly lit modern indoor venue,
- directional key light,
- soft environmental fill,
- restrained shadow softness,
- darkened/de-emphasized stadium background.

The court and players should read immediately; background detail should not compete with copy.

---

## Lighting hierarchy
1. player + ball readability,
2. court geometry,
3. relevant navigation props,
4. environment atmosphere,
5. decorative background.

Avoid many shadow-casting lights.

---

## Material tuning
Court:
- subtle roughness variation,
- avoid giant high-resolution texture if procedural/simple maps suffice.

Ball:
- recognizable yellow felt response without literal fiber geometry.

Net:
- optimize carefully; dense physical net geometry can be expensive.

Characters:
- simplified skin shader/material,
- clothing roughness variation,
- avoid photoreal subsurface scattering unless profiling shows it affordable and visually necessary.

---

## Postprocessing budget
Start with **none**.

Add only after profiling, in this order of justification:
1. subtle ambient occlusion if scene lacks grounding,
2. extremely subtle depth of field for select static compositions,
3. restrained tone/color adjustment.

Avoid:
- heavy bloom,
- chromatic aberration,
- glitch,
- excessive film grain,
- motion blur tied to scroll,
- stylized effects that reduce text legibility.

Effects should be disabled or reduced in lower quality tiers.

---

## Sound design
Audio is opt-in.

Potential sounds:
- ball bounce,
- racket impact,
- quiet shoe movement,
- subtle crowd/venue ambience,
- final match-point cue.

Do not autoplay audible sound before user interaction.

### Synchronization
Impact sounds should trigger from deterministic timeline/contact crossings. Guard against repeated spam while rapidly scrubbing back/forth.

Use a small cooldown/crossing detector rather than playing audio every animation frame near the contact point.

---

## Visual review checklist
Ask:
- Does this still look good in a static screenshot?
- Would removing bloom make it better?
- Is the player silhouette readable?
- Is the content still the visual priority during reading beats?
- Does any material look like generic game-engine plastic?
- Does anything scream "AI-generated 3D portfolio"?

If yes, simplify.

---

## Acceptance criteria
- [ ] Lighting has one coherent artistic direction.
- [ ] Materials remain believable at intended camera distances.
- [ ] Postprocessing is optional and quality-tiered.
- [ ] Sound is opt-in and synchronized.
- [ ] Site still looks polished with postprocessing disabled.
- [ ] Text contrast remains strong throughout all chapters.
