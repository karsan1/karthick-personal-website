import { DebugScene } from "./DebugScene";
import { Lighting } from "./Lighting";
import { PrototypeCourt } from "./PrototypeCourt";
import { CameraRig } from "@/components/camera/CameraRig";
import type { MutableRefObject } from "react";
import type { NarrativeProgress } from "@/animations/prototypeMotion";

type SceneProps = {
  debug: boolean;
  progress: MutableRefObject<NarrativeProgress>;
};

export function Scene({ debug, progress }: SceneProps) {
  return (
    <>
      <color attach="background" args={["#07120f"]} />
      <fog attach="fog" args={["#07120f", 12, 26]} />
      <Lighting />
      <CameraRig progress={progress} debug={debug} />
      <PrototypeCourt progress={progress} />

      {debug ? <DebugScene /> : null}
    </>
  );
}
