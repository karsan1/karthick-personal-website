import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import type { Group, Object3D } from "three";
import { CHARACTER_ASSETS, CHARACTER_NODE_CONTRACT, type CharacterSide } from "./characterAssetContract";

export type RetroPlayerAsset = {
  scene: Group;
  root: Object3D;
  racketSocket: Object3D;
};

/** Loads the cached GLTF once and resolves runtime-consumed nodes exactly once per scene. */
export function useRetroPlayerAsset(side: CharacterSide): RetroPlayerAsset {
  const { scene } = useGLTF(CHARACTER_ASSETS[side], false, true);

  return useMemo(() => {
    const contract = CHARACTER_NODE_CONTRACT[side];
    const root = scene.getObjectByName(contract.root);
    const racketSocket = scene.getObjectByName(contract.racketSocket);
    if (!root || !racketSocket) throw new Error(`Invalid ${side} character GLB: required root/socket nodes are missing.`);
    return { scene, root, racketSocket };
  }, [scene, side]);
}
