# Phase 10 — Mobile, Accessibility & Fallback Experiences

## Objective
Ensure the portfolio remains excellent for users who have smaller screens, weaker hardware, reduced-motion preferences, keyboard navigation, or unavailable WebGL.

## Deliverable
A separately authored mobile composition, reduced-motion choreography, semantic navigation, and robust static fallback.

---

## Mobile philosophy
Do not "shrink desktop." Recompose it.

### Mobile scene changes
- tighter camera framing,
- fewer visible stadium elements,
- simpler court surroundings,
- lower DPR and texture tier,
- fewer shadow casters,
- no unnecessary postprocessing,
- shorter camera moves,
- larger DOM tap targets,
- project interactions primarily through DOM.

The two players, ball, court, and match metaphor should remain recognizable.

---

## Breakpoint implementation
Use `gsap.matchMedia()` and CSS media queries.

Keep camera keyframes in separate configuration objects:

```text
camera.desktop.ts
camera.tablet.ts
camera.mobile.ts
camera.reducedMotion.ts
```

Or equivalent typed data modules.

Avoid large conditional branches spread across scene components.

---

## Reduced motion
For `prefers-reduced-motion: reduce`:
- drastically shorten or remove cinematic camera travel,
- no scroll-scrubbed rapid ball movement across the full viewport,
- use fade/crossfade/short transforms,
- allow static court compositions per section,
- no automatic ambience animation that is unnecessary,
- preserve all content and navigation.

Reduced motion can be visually beautiful; it does not need to be a degraded blank page.

---

## Keyboard
Verify:
- tab order follows semantic DOM,
- skip link exists,
- navigation reachable,
- project panels open/close via keyboard,
- Escape closes dialogs/drawers,
- focus restored after closing,
- Canvas is not accidentally tab-trapping.

---

## Screen readers
The 3D match is decorative/contextual unless an interaction is unique.

Do not expose dozens of mesh nodes as accessibility content. Instead:
- provide semantic section headings,
- announce active chapter only if useful and not noisy,
- label project/nav controls in DOM,
- ensure decorative Canvas does not duplicate all text.

---

## WebGL fallback
Trigger if:
- WebGL unsupported,
- renderer creation fails,
- serious runtime scene error occurs.

Fallback should show:
- high-quality static court image or lightweight CSS visual,
- normal HTML portfolio,
- all navigation/project/contact features.

Never show a raw "WebGL not supported" dead end.

---

## Touch behavior
- no interaction requires hover,
- avoid accidental raycasts while user scrolls,
- project selections use large DOM targets,
- tapping Canvas should not interfere with native page scrolling unless intentional,
- sound toggle explicit.

---

## Orientation
Support portrait first. Landscape mobile should not catastrophically break; it may use tablet choreography where appropriate.

Test mobile browser UI resizing and dynamic viewport units (`dvh`) rather than relying blindly on old `100vh` behavior.

---

## Acceptance criteria
- [ ] Mobile has authored camera composition rather than scaled desktop coordinates.
- [ ] Reduced-motion mode is complete and attractive.
- [ ] Keyboard can access all content/actions.
- [ ] WebGL failure preserves the complete portfolio.
- [ ] No feature depends on hover.
- [ ] Portrait/landscape changes do not break ScrollTrigger layout.
