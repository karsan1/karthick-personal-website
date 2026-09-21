import { Component, Suspense, useRef, type MutableRefObject, type ReactNode } from "react";
import type { Group } from "three";
import type { NarrativeProgress } from "@/animations/prototypeMotion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { type CharacterSide } from "./characterAssetContract";
import { useCharacterAnimationController } from "./CharacterAnimationController";
import { RetroPlayerPrototype } from "./RetroPlayerPrototype";
import { useRetroPlayerAsset } from "./useRetroPlayerAsset";

type RetroPlayerProps = { progress: MutableRefObject<NarrativeProgress>; side: CharacterSide; smoothReference?: boolean };

type CharacterAssetBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

class CharacterAssetBoundary extends Component<CharacterAssetBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function AuthoredRetroPlayer({ progress, side, reducedMotion, smoothReference }: RetroPlayerProps & { reducedMotion: boolean }) {
  const applicationRoot = useRef<Group>(null);
  const asset = useRetroPlayerAsset(side);

  useCharacterAnimationController({
    scene: asset.scene,
    animations: asset.animations,
    applicationRoot,
    progress,
    side,
    reducedMotion,
    smoothReference: Boolean(smoothReference),
  });

  // The authored CHAR_* root and SOCKET_Racket remain in the GLB hierarchy.
  // The controller mutates only this outer application root for court placement.
  return (
    <group ref={applicationRoot}>
      <primitive object={asset.scene} dispose={null} />
    </group>
  );
}

/**
 * Uses the reviewed authored GLB by default. The primitive remains an explicit
 * loading/runtime-error fallback so a failed character asset cannot remove the
 * rally actors or Player A's surrounding world hotspot.
 */
export function RetroPlayer({ progress, side, smoothReference = false }: RetroPlayerProps) {
  const reducedMotion = useReducedMotion();
  const fallback = <RetroPlayerPrototype progress={progress} side={side} reducedMotion={reducedMotion} />;

  return (
    <CharacterAssetBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <AuthoredRetroPlayer
          progress={progress}
          side={side}
          reducedMotion={reducedMotion}
          smoothReference={smoothReference}
        />
      </Suspense>
    </CharacterAssetBoundary>
  );
}
