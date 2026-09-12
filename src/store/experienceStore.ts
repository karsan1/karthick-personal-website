import { create } from "zustand";

export type QualityTier = "low" | "medium" | "high";

type ExperienceState = {
  activeChapter: string;
  qualityTier: QualityTier;
  sceneReady: boolean;
  soundEnabled: boolean;
  navigationTarget: string | null;
  setActiveChapter: (chapter: string) => void;
  setQualityTier: (tier: QualityTier) => void;
  setSceneReady: (ready: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setNavigationTarget: (target: string | null) => void;
};

export const useExperienceStore = create<ExperienceState>((set) => ({
  activeChapter: "home",
  qualityTier: "high",
  sceneReady: false,
  soundEnabled: false,
  navigationTarget: null,
  setActiveChapter: (activeChapter) => set({ activeChapter }),
  setQualityTier: (qualityTier) => set({ qualityTier }),
  setSceneReady: (sceneReady) => set({ sceneReady }),
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  setNavigationTarget: (navigationTarget) => set({ navigationTarget }),
}));
