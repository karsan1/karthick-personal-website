import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import type { AnimationClip, Group, Object3D } from "three";
import { clone } from "three/addons/utils/SkeletonUtils.js";
import { CHARACTER_ASSETS, CHARACTER_NODE_CONTRACT, type CharacterSide } from "./characterAssetContract";

export type RetroPlayerAsset = {
  scene: Group;
  root: Object3D;
  racketSocket: Object3D;
  animations: AnimationClip[];
};

/**
 * GLTFLoader caches its source scene. Clone it once per actor so mixers, including
 * future skinned exports, never share node transforms across Player A and B.
 */
export function useRetroPlayerAsset(side: CharacterSide): RetroPlayerAsset {
  const { scene, animations } = useGLTF(CHARACTER_ASSETS[side], false, true);

  return useMemo(() => {
    const instance = clone(scene) as Group;
    const contract = CHARACTER_NODE_CONTRACT[side];
    const root = instance.getObjectByName(contract.root);
    const racketSocket = instance.getObjectByName(contract.racketSocket);
    if (!root || !racketSocket) throw new Error(`Invalid ${side} character GLB: required root/socket nodes are missing.`);
    return { scene: instance, root, racketSocket, animations };
  }, [animations, scene, side]);
}
