import type { MutableRefObject } from "react";
import type { NarrativeProgress } from "@/animations/prototypeMotion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { type CharacterSide } from "./characterAssetContract";
import { RetroPlayerPrototype } from "./RetroPlayerPrototype";

type RetroPlayerProps = { progress: MutableRefObject<NarrativeProgress>; side: CharacterSide; smoothReference?: boolean };

/**
 * Production bridge until original authored Blockbench players pass visual review.
 * Calibration GLBs remain available only in the explicit debug/review surface;
 * they must never replace the readable procedural match actors in ordinary view.
 */
export function RetroPlayer({ progress, side }: RetroPlayerProps) {
  const reducedMotion = useReducedMotion();
  return <RetroPlayerPrototype progress={progress} side={side} reducedMotion={reducedMotion} />;
}
