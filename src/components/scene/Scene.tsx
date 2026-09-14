import { DebugScene } from "./DebugScene";
import { Lighting } from "./Lighting";
import { ProductionEnvironment } from "./ProductionEnvironment";
import { AssetBoundary } from "./ProductionEnvironment";
import { RetroEnvironment } from "./RetroEnvironment";
import { RallyActors } from "./PrototypeCourt";
import { CameraRig } from "@/components/camera/CameraRig";
import type { MutableRefObject } from "react";
import type { NarrativeProgress } from "@/animations/prototypeMotion";

type SceneProps = {
  debug: boolean;
  legacyEnvironment?: boolean;
  progress: MutableRefObject<NarrativeProgress>;
  reducedMotion: boolean;
};

export function Scene({ debug, legacyEnvironment = false, progress, reducedMotion }: SceneProps) {
  return (
    <>
      <color attach="background" args={["#07120f"]} />
      <fog attach="fog" args={["#07120f", 12, 26]} />
      <Lighting />
      <CameraRig progress={progress} debug={debug} reducedMotion={reducedMotion} />
      {legacyEnvironment ? <ProductionEnvironment /> : (
        <AssetBoundary fallback={<ProductionEnvironment />}>
          <RetroEnvironment progress={progress} reducedMotion={reducedMotion} />
        </AssetBoundary>
      )}
      <RallyActors progress={progress} calibration={debug} reducedMotion={reducedMotion} />

      {debug ? <DebugScene /> : null}
    </>
  );
}
