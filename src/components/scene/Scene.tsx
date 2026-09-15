import { DebugScene } from "./DebugScene";
import { Lighting } from "./Lighting";
import { ProductionEnvironment } from "./ProductionEnvironment";
import { AssetBoundary } from "./ProductionEnvironment";
import { RetroEnvironment } from "./RetroEnvironment";
import { RallyActors } from "./PrototypeCourt";
import { CameraRig } from "@/components/camera/CameraRig";
import type { MutableRefObject } from "react";
import type { NarrativeProgress } from "@/animations/prototypeMotion";
import type { QualityTier } from "@/store/experienceStore";

type SceneProps = {
  debug: boolean;
  legacyEnvironment?: boolean;
  progress: MutableRefObject<NarrativeProgress>;
  qualityTier: QualityTier;
  reducedMotion: boolean;
};

export function Scene({ debug, legacyEnvironment = false, progress, qualityTier, reducedMotion }: SceneProps) {
  return (
    <>
      <color attach="background" args={["#0c1f18"]} />
      <fog attach="fog" args={["#0c1f18", 17, 34]} />
      <Lighting qualityTier={qualityTier} />
      <CameraRig progress={progress} debug={debug} reducedMotion={reducedMotion} />
      {legacyEnvironment ? <ProductionEnvironment /> : (
        <AssetBoundary fallback={<ProductionEnvironment />}>
          <RetroEnvironment progress={progress} qualityTier={qualityTier} reducedMotion={reducedMotion} />
        </AssetBoundary>
      )}
      <RallyActors progress={progress} calibration={debug} reducedMotion={reducedMotion} />

      {debug ? <DebugScene /> : null}
    </>
  );
}
