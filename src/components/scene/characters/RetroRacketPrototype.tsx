import type { Group } from "three";
import type { RefObject } from "react";
import type { RetroPlayerMaterials } from "./RetroCharacterMaterials";

type RetroRacketPrototypeProps = {
  racket: RefObject<Group | null>;
  materials: RetroPlayerMaterials;
};

/** A chunky, low-segment racket kept under the wrist pivot for contact proofing. */
export function RetroRacketPrototype({ racket, materials }: RetroRacketPrototypeProps) {
  return (
    <group ref={racket} position={[0, -0.5, 0]} rotation={[0.12, 0, -0.08]}>
      <mesh castShadow position={[0, -0.2, 0]}>
        <boxGeometry args={[0.075, 0.43, 0.075]} />
        <primitive object={materials.racketGrip} attach="material" dispose={null} />
      </mesh>
      <mesh castShadow position={[0, -0.58, 0]} scale={[0.86, 1.3, 1]}>
        <torusGeometry args={[0.22, 0.035, 6, 8]} />
        <primitive object={materials.racket} attach="material" dispose={null} />
      </mesh>
      <mesh position={[0, -0.58, 0]} scale={[0.2, 0.48, 1]}>
        <boxGeometry args={[1, 1, 0.02]} />
        <primitive object={materials.racketStrings} attach="material" dispose={null} />
      </mesh>
    </group>
  );
}
