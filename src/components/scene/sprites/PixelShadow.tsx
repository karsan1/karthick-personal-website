"use client";

import { useTexture } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { NearestFilter, NoColorSpace } from "three";
import { VENUE_PIXEL_SPRITES } from "./pixelSpriteAtlas";

export function PixelShadow({ width = 1.1, depth = 0.42, opacity = 0.56 }: { width?: number; depth?: number; opacity?: number }) {
  const sourceTexture = useTexture(VENUE_PIXEL_SPRITES.shadow);
  const texture = useMemo(() => {
    const clone = sourceTexture.clone();
    clone.magFilter = NearestFilter;
    clone.minFilter = NearestFilter;
    clone.generateMipmaps = false;
    clone.colorSpace = NoColorSpace;
    clone.needsUpdate = true;
    return clone;
  }, [sourceTexture]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh position={[0, 0.016, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[width, depth, 1]} renderOrder={-1}>
    <planeGeometry args={[1, 1]} />
    <meshBasicMaterial map={texture} transparent alphaTest={0.05} opacity={opacity} depthWrite={false} toneMapped={false} fog={false} />
  </mesh>;
}
