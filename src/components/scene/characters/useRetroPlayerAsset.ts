import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { MeshBasicMaterial, type AnimationClip, type Group, type Mesh, type Object3D } from "three";
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
  a: {
    kit: "#eee9d8",
    skin: "#b97a58",
    hair: "#2b211d",
    shoes: "#f0ebdc",
    racket: "#713a44",
    strings: "#e8dcc3",
    accent: "#70455e",
  },
  b: {
    kit: "#dedfd4",
    skin: "#a66c4f",
    hair: "#211e1b",
    shoes: "#eee9dc",
    racket: "#465e8d",
    strings: "#e9dec7",
    accent: "#465e8d",
  },
} as const satisfies Record<CharacterSide, Record<MaterialRole, string>>;

function materialRole(name: string): MaterialRole {
  if (/Hair/.test(name)) return "hair";
  if (/Shoe/.test(name)) return "shoes";
  if (/Racket_Strings/.test(name)) return "strings";
  if (/Racket_(Frame.*|Handle)/.test(name)) return "racket";
  if (/Head|Arm|Leg_.*_Lower/.test(name)) return "skin";
  if (/Torso|Shorts|Leg_.*_Upper/.test(name)) return "kit";
  if (/AccentBand/.test(name)) return "accent";
  return "accent";
}

/**
 * The v5 players intentionally use unlit palette materials.
 *
 * The authored Blockbench cubes are triangulated in GLB. Flat Lambert shading
 * can expose the triangle diagonal on otherwise planar box faces, producing an
 * "origami/paper shard" look. MeshBasicMaterial keeps the characters visually
 * closer to a 16-bit / early-console sports sprite while the modeled silhouette
 * and projected court shadow provide depth.
 */
export function useRetroPlayerAsset(side: CharacterSide): RetroPlayerAsset {
  const { scene, animations } = useGLTF(CHARACTER_ASSETS[side], false, true);

  const asset = useMemo(() => {
    const instance = clone(scene) as Group;
    const contract = CHARACTER_NODE_CONTRACT[side];
    const root = instance.getObjectByName(contract.root);
    const racketSocket = instance.getObjectByName(contract.racketSocket);

    if (!root || !racketSocket) {
      throw new Error(`Invalid ${side} character GLB: required root/socket nodes are missing.`);
    }

    const palette = PLAYER_PALETTES[side];
    const materials = Object.fromEntries(
      (Object.keys(palette) as MaterialRole[]).map((role) => [
        role,
        new MeshBasicMaterial({
          color: palette[role],
          toneMapped: false,
          fog: true,
        }),
      ]),
    ) as Record<MaterialRole, MeshBasicMaterial>;

    instance.traverse((object) => {
      if (!(object as Mesh).isMesh) return;
      const mesh = object as Mesh;
      mesh.material = materials[materialRole(mesh.name)];
      mesh.castShadow = true;
      mesh.receiveShadow = false;
    });

    instance.userData.phase19Materials = Object.values(materials);
    return { scene: instance, root, racketSocket, animations };
  }, [animations, scene, side]);

  useEffect(
    () => () => {
      for (const material of asset.scene.userData.phase19Materials as MeshBasicMaterial[]) {
        material.dispose();
      }
    },
    [asset.scene],
  );

  return asset;
}
