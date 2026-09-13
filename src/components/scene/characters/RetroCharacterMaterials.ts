import { useEffect, useMemo } from "react";
import { MeshStandardMaterial } from "three";
import { CHARACTER_STYLE } from "./characterStyle";

export type RetroPlayerMaterials = {
  clothing: MeshStandardMaterial;
  accent: MeshStandardMaterial;
  hair: MeshStandardMaterial;
  skin: MeshStandardMaterial;
  shoes: MeshStandardMaterial;
  racket: MeshStandardMaterial;
  racketGrip: MeshStandardMaterial;
  racketStrings: MeshStandardMaterial;
};

function createMaterial(color: string, roughness: number, transparent = false, opacity = 1) {
  return new MeshStandardMaterial({ color, roughness, flatShading: true, transparent, opacity });
}

/** One compact, disposable material palette per mounted prototype player. */
export function useRetroPlayerMaterials(side: "a" | "b") {
  const materials = useMemo<RetroPlayerMaterials>(() => {
    const player = side === "a" ? CHARACTER_STYLE.playerA : CHARACTER_STYLE.playerB;

    return {
      clothing: createMaterial(player.clothing, 0.9),
      accent: createMaterial(player.accent, 0.92),
      hair: createMaterial(player.hair, 0.94),
      skin: createMaterial(CHARACTER_STYLE.skin, 0.88),
      shoes: createMaterial(CHARACTER_STYLE.shoes, 0.94),
      racket: createMaterial(CHARACTER_STYLE.racket, 0.8),
      racketGrip: createMaterial(CHARACTER_STYLE.racketGrip, 0.88),
      racketStrings: createMaterial("#dbe7c8", 0.9, true, 0.42),
    };
  }, [side]);

  useEffect(() => () => Object.values(materials).forEach((material) => material.dispose()), [materials]);

  return materials;
}
