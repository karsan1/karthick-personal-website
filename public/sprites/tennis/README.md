# Pixel tennis sprite assets

These are original placeholder/game-ready assets generated for the feature-branch experiment. They are **not copied from the reference screenshot**.

## Player atlases

- `player-a.png`: near-baseline player, intentionally reads as back-facing.
- `player-b.png`: far-baseline player, intentionally reads as front-facing.
- Native frame: **48 × 64 px**
- Atlas: **8 columns × 5 rows**

Rows:

1. `idle_ready` — 2 useful frames
2. `serve` — 8 frames
3. `forehand` — 6 frames
4. `backhand` — 6 frames
5. `recovery` — 4 frames

Unused cells repeat the final valid frame so runtime UV sampling remains safe.

## Venue assets

- `audience.png`: four 32 × 48 px spectator variants.
- `umpire.png`: 48 × 64 px umpire + chair.
- `shadow.png`: 24 × 10 px alpha shadow.

## Editing in Aseprite

You can replace the PNGs directly without changing TypeScript as long as the atlas dimensions and row meanings stay the same. Keep:

- transparent background,
- hard 1-pixel edges,
- no anti-aliasing,
- no semi-transparent character pixels,
- rackets deliberately oversized,
- feet/shoes visually dark enough to separate from the grass.

For a custom art pass, keep the frame dimensions fixed first. Once the motion reads well in-browser, you can change the dimensions and update `pixelSpriteAtlas.ts`.
