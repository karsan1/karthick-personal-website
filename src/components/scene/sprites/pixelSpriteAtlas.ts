import type { CharacterClip } from "@/animations/prototypeMotion";

export const PLAYER_PIXEL_ATLAS = {
  columns: 8,
  rows: 5,
  frameWidth: 48,
  frameHeight: 64,
  clips: {
    idle_ready: { row: 0, frames: 2 },
    serve: { row: 1, frames: 8 },
    forehand: { row: 2, frames: 6 },
    backhand: { row: 3, frames: 6 },
    recovery: { row: 4, frames: 4 },
  } satisfies Record<CharacterClip, { row: number; frames: number }>,
} as const;

export const PLAYER_PIXEL_SPRITES = { a: "/sprites/tennis/player-a.png", b: "/sprites/tennis/player-b.png" } as const;
export const VENUE_PIXEL_SPRITES = { audience: "/sprites/tennis/audience.png", umpire: "/sprites/tennis/umpire.png", shadow: "/sprites/tennis/shadow.png" } as const;

export function frameForProgress(localProgress: number, frameCount: number) {
  const clamped = Math.min(Math.max(localProgress, 0), 1);
  return Math.min(frameCount - 1, Math.floor(clamped * frameCount));
}
