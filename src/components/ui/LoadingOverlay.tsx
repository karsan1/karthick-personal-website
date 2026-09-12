"use client";

import { useExperienceStore } from "@/store/experienceStore";

export function LoadingOverlay() {
  const sceneReady = useExperienceStore((state) => state.sceneReady);

  if (sceneReady) {
    return null;
  }

  return (
    <div className="loading-overlay" role="status">
      <span className="loading-mark" />
      <span className="sr-only">Loading the interactive tennis court</span>
    </div>
  );
}
