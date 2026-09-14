import { create } from "zustand";

export type QualityTier = "low" | "medium" | "high";

type ExperienceState = {
  activeChapter: string;
  qualityTier: QualityTier;
  sceneReady: boolean;
  soundEnabled: boolean;
  navigationTarget: string | null;
  activeProjectId: string | null;
  projectDetailOpen: boolean;
  setActiveChapter: (chapter: string) => void;
  setQualityTier: (tier: QualityTier) => void;
  setSceneReady: (ready: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setNavigationTarget: (target: string | null) => void;
  setActiveProjectId: (projectId: string | null) => void;
  setProjectDetailOpen: (open: boolean) => void;
};

export const useExperienceStore = create<ExperienceState>((set) => ({
  activeChapter: "hero",
  qualityTier: "high",
  sceneReady: false,
  soundEnabled: false,
  navigationTarget: null,
  activeProjectId: null,
  projectDetailOpen: false,
  setActiveChapter: (activeChapter) => set({ activeChapter }),
  setQualityTier: (qualityTier) => set({ qualityTier }),
  setSceneReady: (sceneReady) => set({ sceneReady }),
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  setNavigationTarget: (navigationTarget) => set({ navigationTarget }),
  setActiveProjectId: (activeProjectId) => set({ activeProjectId }),
  setProjectDetailOpen: (projectDetailOpen) => set({ projectDetailOpen }),
}));
