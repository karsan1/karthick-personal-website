export const CHARACTER_ASSETS = {
  a: "/models/player-a.glb",
  b: "/models/player-b.glb",
} as const;

export type CharacterSide = keyof typeof CHARACTER_ASSETS;

export const CHARACTER_NODE_CONTRACT = {
  a: { root: "CHAR_PlayerA_Root", racketSocket: "SOCKET_Racket" },
  b: { root: "CHAR_PlayerB_Root", racketSocket: "SOCKET_Racket" },
} as const;

export const REQUIRED_CHARACTER_NODES = [
  "BONE_Hips", "BONE_Spine", "BONE_Head", "BONE_Arm_L_Upper", "BONE_Arm_L_Lower",
  "BONE_Arm_R_Upper", "BONE_Arm_R_Lower", "SOCKET_Racket", "BONE_Leg_L_Upper",
  "BONE_Leg_L_Lower", "BONE_Leg_R_Upper", "BONE_Leg_R_Lower",
] as const;

/** Runtime clip names. The controller falls back to `idle_ready` if an optional clip is absent. */
export const CHARACTER_CLIP_NAMES = [
  "idle_ready",
  "serve",
  "forehand",
  "backhand",
  "recovery",
] as const;

export type CharacterClipName = (typeof CHARACTER_CLIP_NAMES)[number];

/** Phase 07 authoring-space contract; runtime placement never corrects export scale. */
export const CHARACTER_COORDINATE_CONTRACT = "Y-up glTF; root at [0, 0, 0] on the ground plane; Player A faces +Z and Player B faces -Z after placement.";
