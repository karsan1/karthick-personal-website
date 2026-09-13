import { Component, Suspense, type MutableRefObject, type ReactNode } from "react";
import type { Group } from "three";
import { COURT_DIMENSIONS, type NarrativeProgress } from "@/animations/prototypeMotion";
import { type CharacterSide } from "./characterAssetContract";
import { RetroPlayerPrototype } from "./RetroPlayerPrototype";
import { useRetroPlayerAsset } from "./useRetroPlayerAsset";

type RetroPlayerProps = { progress: MutableRefObject<NarrativeProgress>; side: CharacterSide };

class CharacterBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function StaticCharacter({ side }: Pick<RetroPlayerProps, "side">) {
  const { scene } = useRetroPlayerAsset(side);
  const baseline = side === "a" ? -COURT_DIMENSIONS.playerBaselineZ : COURT_DIMENSIONS.playerBaselineZ;
  const rotation: [number, number, number] = side === "a" ? [0, 0, 0] : [0, Math.PI, 0];
  return <primitive object={scene as Group} position={[0, 0, baseline]} rotation={rotation} />;
}

/** Phase 07 calibration-only authored GLB mount. Phase 08 owns animated clip use. */
export function RetroPlayer({ progress, side }: RetroPlayerProps) {
  return (
    <CharacterBoundary fallback={<RetroPlayerPrototype progress={progress} side={side} />}>
      <Suspense fallback={<RetroPlayerPrototype progress={progress} side={side} />}>
        <StaticCharacter side={side} />
      </Suspense>
    </CharacterBoundary>
  );
}
