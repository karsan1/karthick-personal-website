"use client";

import { Component, Suspense, type MutableRefObject, type ReactNode } from "react";
import { COURT_DIMENSIONS, type NarrativeProgress } from "@/animations/prototypeMotion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { type CharacterSide } from "./characterAssetContract";
import { PixelTennisPlayer } from "./PixelTennisPlayer";

type RetroPlayerProps = { progress: MutableRefObject<NarrativeProgress>; side: CharacterSide; smoothReference?: boolean };

class PlayerSpriteBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function PlayerSpriteFallback({ side }: { side: CharacterSide }) {
  return <group name="pixel-player-loading" position={[side === "a" ? -0.12 : 0.14, 0, side === "a" ? -COURT_DIMENSIONS.playerBaselineZ : COURT_DIMENSIONS.playerBaselineZ]}><mesh position={[0, 0.9, 0]}><boxGeometry args={[0.68, 1.8, 0.22]} /><meshBasicMaterial color="#26372e" /></mesh></group>;
}

/** Keeps RallyActors' public player contract while using pixel sprites instead of GLBs. */
export function RetroPlayer({ progress, side }: RetroPlayerProps) {
  const reducedMotion = useReducedMotion();
  const fallback = <PlayerSpriteFallback side={side} />;
  return <PlayerSpriteBoundary fallback={fallback}><Suspense fallback={fallback}><PixelTennisPlayer progress={progress} side={side} reducedMotion={reducedMotion} /></Suspense></PlayerSpriteBoundary>;
}
