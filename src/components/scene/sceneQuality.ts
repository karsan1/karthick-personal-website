import type { QualityTier } from "@/store/experienceStore";

export type SceneQuality = {
  dpr: [number, number];
  shadowMapSize: number;
  shadows: boolean;
  environmentDetail: 1 | 2 | 3;
};

/**
 * Rendering knobs intentionally stay coarse. They are read on quality changes,
 * never on the animation path, so per-frame scene mutation remains ref-driven.
 */
export const SCENE_QUALITY: Record<QualityTier, SceneQuality> = {
  high: { dpr: [1, 2], shadowMapSize: 1024, shadows: true, environmentDetail: 3 },
  medium: { dpr: [1, 1.5], shadowMapSize: 512, shadows: true, environmentDetail: 2 },
  low: { dpr: [1, 1], shadowMapSize: 256, shadows: false, environmentDetail: 1 },
};
