import { Component, Suspense, useRef, type MutableRefObject, type ReactNode } from "react";
import type { Group } from "three";
import { COURT_DIMENSIONS, type NarrativeProgress } from "@/animations/prototypeMotion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { type CharacterSide } from "./characterAssetContract";
import { useCharacterAnimationController } from "./CharacterAnimationController";
import { RetroPlayerPrototype } from "./RetroPlayerPrototype";
import { useRetroPlayerAsset } from "./useRetroPlayerAsset";

type RetroPlayerProps = { progress: MutableRefObject<NarrativeProgress>; side: CharacterSide; smoothReference?: boolean };
type AnimatedCharacterProps = RetroPlayerProps & { reducedMotion: boolean };

class CharacterBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function AnimatedCharacter({ progress, side, smoothReference = false, reducedMotion }: AnimatedCharacterProps) {
  const { scene, animations } = useRetroPlayerAsset(side);
  const applicationRoot = useRef<Group>(null);
  const baseline = side === "a" ? -COURT_DIMENSIONS.playerBaselineZ : COURT_DIMENSIONS.playerBaselineZ;
  const initialPosition: [number, number, number] = [side === "a" ? -0.12 : 0.14, 0, baseline];
  const initialRotation: [number, number, number] = [0, side === "a" ? 0.12 : Math.PI + 0.12, 0];
  useCharacterAnimationController({
    scene,
    animations,
    applicationRoot,
    progress,
    side,
    reducedMotion,
    smoothReference,
  });
  return (
    <group ref={applicationRoot} position={initialPosition} rotation={initialRotation}>
      <primitive object={scene as Group} />
    </group>
  );
}

/** Authored player runtime with a retained Phase 06 fallback while assets stream or fail. */
export function RetroPlayer({ progress, side, smoothReference }: RetroPlayerProps) {
  const reducedMotion = useReducedMotion();
  const fallback = <RetroPlayerPrototype progress={progress} side={side} reducedMotion={reducedMotion} />;

  return (
    <CharacterBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <AnimatedCharacter progress={progress} side={side} smoothReference={smoothReference} reducedMotion={reducedMotion} />
      </Suspense>
    </CharacterBoundary>
  );
}
