"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { WebGLGuard } from "./WebGLGuard";

const ExperienceCanvas = dynamic(
  () =>
    import("./ExperienceCanvas").then((module) => module.ExperienceCanvas),
  { ssr: false },
);

export function ExperienceShell() {
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setDebug(new URLSearchParams(window.location.search).get("debug") === "1");
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="experience-shell" aria-hidden="true">
      <WebGLGuard>
        <ExperienceCanvas debug={debug} />
        <LoadingOverlay />
      </WebGLGuard>
    </div>
  );
}
