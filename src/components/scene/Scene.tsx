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
};

export function Scene({ debug, legacyEnvironment = false, progress }: SceneProps) {
  return (
    <>
      <color attach="background" args={["#07120f"]} />
      <fog attach="fog" args={["#07120f", 12, 26]} />
      <Lighting />
      <CameraRig progress={progress} debug={debug} />
      {legacyEnvironment ? <ProductionEnvironment /> : (
        <AssetBoundary fallback={<ProductionEnvironment />}>
          <RetroEnvironment />
        </AssetBoundary>
      )}
      <RallyActors progress={progress} calibration={debug} />

      {debug ? <DebugScene /> : null}
    </>
  );
}
