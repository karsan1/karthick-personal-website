import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { MeshLambertMaterial, type AnimationClip, type Group, type Mesh, type Object3D } from "three";
import { clone } from "three/addons/utils/SkeletonUtils.js";
import { CHARACTER_ASSETS, CHARACTER_NODE_CONTRACT, type CharacterSide } from "./characterAssetContract";

export type RetroPlayerAsset = {
  scene: Group;
  root: Object3D;
  racketSocket: Object3D;
  animations: AnimationClip[];
};

type MaterialRole = "kit" | "skin" | "hair" | "shoes" | "racket" | "strings" | "accent";

const PLAYER_PALETTES = {
  a: { kit: "#eee6d4", skin: "#b87958", hair: "#30231e", shoes: "#d9d3c2", racket: "#783d45", strings: "#f1e5ca", accent: "#70455e" },
  b: { kit: "#742d43", skin: "#a66c4f", hair: "#211e1b", shoes: "#c9c4b5", racket: "#b4965b", strings: "#eee2c9", accent: "#d1ad73" },
} as const satisfies Record<CharacterSide, Record<MaterialRole, string>>;

function materialRole(name: string): MaterialRole {
  if (/Hair/.test(name)) return "hair";
  if (/Shoe/.test(name)) return "shoes";
  if (/Racket_Strings/.test(name)) return "strings";
  if (/Racket_(Frame|Handle)/.test(name)) return "racket";
  if (/Head|Arm|Leg_.*_Lower/.test(name)) return "skin";
  if (/Torso|ShirtSleeve|Shorts|Leg_.*_Upper/.test(name)) return "kit";
  if (/AccentBand/.test(name)) return "accent";
  return "accent";
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
    const materials = Object.fromEntries(
      (Object.keys(palette) as MaterialRole[]).map((role) => [
        role,
        new MeshLambertMaterial({ color: palette[role], flatShading: true }),
      ]),
    ) as Record<MaterialRole, MeshLambertMaterial>;
    instance.traverse((object) => {
      if ((object as Mesh).isMesh) (object as Mesh).material = materials[materialRole(object.name)];
    });
    instance.userData.phase19Materials = Object.values(materials);
    return { scene: instance, root, racketSocket, animations };
  }, [animations, scene, side]);

  useEffect(() => () => {
    for (const material of asset.scene.userData.phase19Materials as MeshLambertMaterial[]) material.dispose();
  }, [asset.scene]);

  return asset;
}
