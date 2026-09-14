"use client";

import { Suspense, useEffect, useState, type MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "@/components/scene/Scene";
import { useExperienceStore } from "@/store/experienceStore";
import type { NarrativeProgress } from "@/animations/prototypeMotion";
import { SCENE_QUALITY } from "@/components/scene/sceneQuality";

type ExperienceCanvasProps = {
  debug: boolean;
  legacyEnvironment?: boolean;
  progress: MutableRefObject<NarrativeProgress>;
  reducedMotion: boolean;
};

export function ExperienceCanvas({ debug, legacyEnvironment = false, progress, reducedMotion }: ExperienceCanvasProps) {
  const qualityTier = useExperienceStore((state) => state.qualityTier);
  const [documentVisible, setDocumentVisible] = useState(true);

  useEffect(
    () => () => useExperienceStore.getState().setSceneReady(false),
    [],
  );

  useEffect(() => {
    const updateVisibility = () => setDocumentVisible(document.visibilityState === "visible");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return (
    <Canvas
      className="experience-canvas"
      camera={{ position: [7, 5.5, 8], fov: 42, near: 0.1, far: 100 }}
      dpr={SCENE_QUALITY[qualityTier].dpr}
      frameloop={documentVisible ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => useExperienceStore.getState().setSceneReady(true)}
      shadows={SCENE_QUALITY[qualityTier].shadows}
    >
      <Suspense fallback={null}>
        <Scene debug={debug} legacyEnvironment={legacyEnvironment} progress={progress} qualityTier={qualityTier} reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
