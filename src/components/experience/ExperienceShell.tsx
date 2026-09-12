"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { usePrototypeTimeline } from "@/animations/usePrototypeTimeline";
import type { NarrativeProgress } from "@/animations/prototypeMotion";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { WebGLGuard } from "./WebGLGuard";

const ExperienceCanvas = dynamic(
  () =>
    import("./ExperienceCanvas").then((module) => module.ExperienceCanvas),
  { ssr: false },
);

export function ExperienceShell() {
  const [debug, setDebug] = useState(false);
  const scope = useRef<HTMLDivElement>(null);
  const progress = useRef<NarrativeProgress>({ value: 0 });
  const reducedMotion = useReducedMotion();

  usePrototypeTimeline({ scope, progress, debug, reducedMotion });

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setDebug(new URLSearchParams(window.location.search).get("debug") === "1");
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={scope} className="experience-shell" aria-hidden="true">
      <WebGLGuard>
        <ExperienceCanvas debug={debug} progress={progress} />
        <LoadingOverlay />
      </WebGLGuard>
    </div>
  );
}
