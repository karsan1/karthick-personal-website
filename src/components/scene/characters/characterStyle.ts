export type CharacterPoseStepping = 12 | 15 | 18 | "smooth";

/**
 * Character posing is intentionally sampled at a lower rate than the master
 * scroll. During Phase 06 review, try 12, 15, 18, and "smooth" here; 18 fps
 * retains a deliberate stepped feel while keeping both authored hit beats close
 * enough to their racket-contact poses.
 */
export const CHARACTER_POSE_STEPPING: CharacterPoseStepping = 18;

export const CHARACTER_STYLE = {
  playerA: {
    clothing: "#f0ead8",
    accent: "#743746",
    hair: "#2f241e",
  },
  playerB: {
    clothing: "#e5eee4",
    accent: "#465e8d",
    hair: "#413027",
  },
  skin: "#bd825f",
  shoes: "#202923",
  racket: "#c95b3f",
  racketGrip: "#303731",
} as const;

export function sampleCharacterPoseProgress(progress: number) {
  if (CHARACTER_POSE_STEPPING === "smooth") {
    return progress;
  }

  return Math.round(progress * CHARACTER_POSE_STEPPING) / CHARACTER_POSE_STEPPING;
}
