"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { usePrototypeTimeline } from "@/animations/usePrototypeTimeline";
import type { NarrativeProgress } from "@/animations/prototypeMotion";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { useRallyAudio } from "@/audio/useRallyAudio";
import { useExperienceStore } from "@/store/experienceStore";
import { WebGLGuard } from "./WebGLGuard";

const ExperienceCanvas = dynamic(
  () =>
    import("./ExperienceCanvas").then((module) => module.ExperienceCanvas),
  { ssr: false },
);

export function ExperienceShell() {
  const [debug, setDebug] = useState(false);
  const [legacyEnvironment, setLegacyEnvironment] = useState(false);
  const scope = useRef<HTMLDivElement>(null);
  const progress = useRef<NarrativeProgress>({ value: 0 });
  const reducedMotion = useReducedMotion();

  usePrototypeTimeline({ scope, progress, debug, reducedMotion });
  useRallyAudio(progress, reducedMotion);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      setDebug(params.get("debug") === "1");
      // Explicit QA escape hatch: ?environment=legacy exercises the accepted
      // Phase 04 GLB loader and its primitive fallback without touching assets.
      setLegacyEnvironment(params.get("environment") === "legacy");
      // Start narrow/mobile layouts at the balanced tier so their separately
      // authored camera composition is paired with simpler venue detail. The
      // visible preference control can still override this coarse default.
      const state = useExperienceStore.getState();
      if (window.matchMedia("(max-width: 44rem)").matches && state.qualityTier === "high") {
        state.setQualityTier("medium");
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={scope} className="experience-shell" aria-hidden="true">
      <WebGLGuard>
        <ExperienceCanvas
          debug={debug}
          legacyEnvironment={legacyEnvironment}
          progress={progress}
          reducedMotion={reducedMotion}
        />
        <LoadingOverlay />
      </WebGLGuard>
    </div>
  );
}
