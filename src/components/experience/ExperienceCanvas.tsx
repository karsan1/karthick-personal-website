"use client";

import { Suspense, useEffect, type MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "@/components/scene/Scene";
import { useExperienceStore } from "@/store/experienceStore";
import type { NarrativeProgress } from "@/animations/prototypeMotion";

type ExperienceCanvasProps = {
  debug: boolean;
  progress: MutableRefObject<NarrativeProgress>;
};

export function ExperienceCanvas({ debug, progress }: ExperienceCanvasProps) {
  useEffect(
    () => () => useExperienceStore.getState().setSceneReady(false),
    [],
  );

  return (
    <Canvas
      className="experience-canvas"
      camera={{ position: [7, 5.5, 8], fov: 42, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => useExperienceStore.getState().setSceneReady(true)}
    >
      <Suspense fallback={null}>
        <Scene debug={debug} progress={progress} />
      </Suspense>
    </Canvas>
  );
}
