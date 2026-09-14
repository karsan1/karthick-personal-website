import { create } from "zustand";
import type { WorldHotspotId } from "@/components/scene/interactions/worldHotspots";

export type QualityTier = "low" | "medium" | "high";

type ExperienceState = {
  activeChapter: string;
  qualityTier: QualityTier;
  sceneReady: boolean;
  soundEnabled: boolean;
  navigationTarget: string | null;
  activeProjectId: string | null;
  projectDetailOpen: boolean;
  hoveredHotspot: WorldHotspotId | null;
  selectedHotspot: WorldHotspotId | null;
  interactionMode: "explore" | "reading";
  setActiveChapter: (chapter: string) => void;
  setQualityTier: (tier: QualityTier) => void;
  setSceneReady: (ready: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setNavigationTarget: (target: string | null) => void;
  setActiveProjectId: (projectId: string | null) => void;
  setProjectDetailOpen: (open: boolean) => void;
  setHoveredHotspot: (hotspot: WorldHotspotId | null) => void;
  setSelectedHotspot: (hotspot: WorldHotspotId | null) => void;
  setInteractionMode: (mode: "explore" | "reading") => void;
};

export const useExperienceStore = create<ExperienceState>((set) => ({
  activeChapter: "hero",
  qualityTier: "high",
  sceneReady: false,
  soundEnabled: false,
  navigationTarget: null,
  activeProjectId: null,
  projectDetailOpen: false,
  hoveredHotspot: null,
  selectedHotspot: null,
  interactionMode: "explore",
  setActiveChapter: (activeChapter) => set({ activeChapter }),
  setQualityTier: (qualityTier) => set({ qualityTier }),
  setSceneReady: (sceneReady) => set({ sceneReady }),
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  setNavigationTarget: (navigationTarget) => set({ navigationTarget }),
  setActiveProjectId: (activeProjectId) => set({ activeProjectId }),
  setProjectDetailOpen: (projectDetailOpen) => set({ projectDetailOpen }),
  setHoveredHotspot: (hoveredHotspot) => set({ hoveredHotspot }),
  setSelectedHotspot: (selectedHotspot) => set({ selectedHotspot }),
  setInteractionMode: (interactionMode) => set({ interactionMode }),
}));
