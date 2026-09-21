import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { MeshStandardMaterial, type AnimationClip, type Group, type Mesh, type Object3D } from "three";
import { clone } from "three/addons/utils/SkeletonUtils.js";
import { CHARACTER_ASSETS, CHARACTER_NODE_CONTRACT, type CharacterSide } from "./characterAssetContract";

export type RetroPlayerAsset = {
  scene: Group;
  root: Object3D;
  racketSocket: Object3D;
  animations: AnimationClip[];
};

const PLAYER_PALETTES = {
  a: { kit: "#f2ead8", skin: "#a96847", accent: "#74558d" },
  b: { kit: "#7a2943", skin: "#875136", accent: "#d2a84b" },
} as const satisfies Record<CharacterSide, Record<"kit" | "skin" | "accent", string>>;

function materialRole(name: string) {
  if (/Head|Arm|Leg_.*_Lower/.test(name)) return "skin" as const;
  if (/Torso|ShirtSleeve|Shorts|Leg_.*_Upper/.test(name)) return "kit" as const;
  return "accent" as const;
}

/**
 * GLTFLoader caches its source scene. Clone it once per actor so mixers, including
 * future skinned exports, never share node transforms across Player A and B.
 */
export function useRetroPlayerAsset(side: CharacterSide): RetroPlayerAsset {
  const { scene, animations } = useGLTF(CHARACTER_ASSETS[side], false, true);

  const asset = useMemo(() => {
    const instance = clone(scene) as Group;
    const contract = CHARACTER_NODE_CONTRACT[side];
    const root = instance.getObjectByName(contract.root);
    const racketSocket = instance.getObjectByName(contract.racketSocket);
    if (!root || !racketSocket) throw new Error(`Invalid ${side} character GLB: required root/socket nodes are missing.`);
    const palette = PLAYER_PALETTES[side];
    const materials = {
      kit: new MeshStandardMaterial({ color: palette.kit, flatShading: true, roughness: 0.9, metalness: 0 }),
      skin: new MeshStandardMaterial({ color: palette.skin, flatShading: true, roughness: 0.92, metalness: 0 }),
      accent: new MeshStandardMaterial({ color: palette.accent, flatShading: true, roughness: 0.86, metalness: 0 }),
    };
    instance.traverse((object) => {
      if ((object as Mesh).isMesh) (object as Mesh).material = materials[materialRole(object.name)];
    });
    instance.userData.phase19Materials = Object.values(materials);
    return { scene: instance, root, racketSocket, animations };
  }, [animations, scene, side]);

  useEffect(() => () => {
    for (const material of asset.scene.userData.phase19Materials as MeshStandardMaterial[]) material.dispose();
  }, [asset.scene]);

  return asset;
}
