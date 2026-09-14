import { SCENE_QUALITY } from "./sceneQuality";
import type { QualityTier } from "@/store/experienceStore";

export function Lighting({ qualityTier }: { qualityTier: QualityTier }) {
  const quality = SCENE_QUALITY[qualityTier];

  return (
    <>
      <hemisphereLight args={["#dce5d5", "#18342c", 1.15]} />
      <directionalLight
        castShadow={quality.shadows}
        color="#fff2d4"
        intensity={2.25}
        position={[5, 8, 4]}
        shadow-bias={-0.0003}
        shadow-camera-bottom={-12}
        shadow-camera-far={28}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-mapSize={[quality.shadowMapSize, quality.shadowMapSize]}
      />
      <directionalLight color="#8fb9c6" intensity={0.65} position={[-4, 3, -2]} />
    </>
  );
}
