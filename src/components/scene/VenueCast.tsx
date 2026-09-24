"use client";

import { Component, Suspense, type ReactNode } from "react";
import type { QualityTier } from "@/store/experienceStore";
import { PixelAtlasSprite } from "./sprites/PixelAtlasSprite";
import { PixelShadow } from "./sprites/PixelShadow";
import { VENUE_PIXEL_SPRITES } from "./sprites/pixelSpriteAtlas";

type Placement = { position: readonly [number, number, number]; variant: 0 | 1 | 2 | 3; scale?: number };
const AUDIENCE: readonly Placement[] = [
  { position: [-4.05, 1, 7.12], variant: 0 }, { position: [-2.75, 1, 7.12], variant: 1 },
  { position: [-1.5, 1.3, 7.58], variant: 2, scale: 0.95 }, { position: [0, 1.3, 7.58], variant: 3, scale: 0.95 },
  { position: [1.42, 1, 7.12], variant: 1 }, { position: [2.72, 1.3, 7.58], variant: 0, scale: 0.95 },
  { position: [4.05, 1, 7.12], variant: 2 }, { position: [-5.67, 0.86, -3.25], variant: 3, scale: 0.92 },
  { position: [-5.67, 0.86, 3.2], variant: 1, scale: 0.92 }, { position: [5.67, 0.86, -3.25], variant: 0, scale: 0.92 },
  { position: [5.67, 0.86, 3.2], variant: 3, scale: 0.92 }, { position: [3.4, 1, 7.12], variant: 2 },
] as const;

class CastSpriteBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function audienceCount(qualityTier: QualityTier) {
  if (qualityTier === "high") return 12;
  if (qualityTier === "medium") return 8;
  return 4;
}

function AudienceSprites({ qualityTier }: { qualityTier: QualityTier }) {
  return <group name="pixel-venue-audience">{AUDIENCE.slice(0, audienceCount(qualityTier)).map(({ position, variant, scale = 1 }, index) => (
    <group key={`pixel-spectator-${index}`} position={[position[0], position[1], position[2]]} name={`pixel-spectator-${index}`}>
      <PixelShadow width={0.55 * scale} depth={0.24 * scale} opacity={0.36} />
      <PixelAtlasSprite src={VENUE_PIXEL_SPRITES.audience} columns={4} rows={1} column={variant} row={0} width={0.78 * scale} height={1.18 * scale} position={[0, 0.01, 0]} alphaTest={0.42} renderOrder={1} />
    </group>
  ))}</group>;
}

/** Flat, optional venue sprites stay outside all player and station hotspot bounds. */
export function VenueCastAudience({ qualityTier }: { qualityTier: QualityTier }) {
  return <CastSpriteBoundary fallback={null}><Suspense fallback={null}><AudienceSprites qualityTier={qualityTier} /></Suspense></CastSpriteBoundary>;
}

function PixelUmpire() {
  return <group name="pixel-chair-umpire" position={[4.85, 0.02, 0.4]}>
    <PixelShadow width={1.1} depth={0.52} opacity={0.42} />
    <PixelAtlasSprite src={VENUE_PIXEL_SPRITES.umpire} columns={1} rows={1} width={1.45} height={2.55} position={[0, 0, 0]} alphaTest={0.42} renderOrder={3} />
  </group>;
}

export function VenueCastUmpire({ fallback, enabled }: { fallback: ReactNode; enabled: boolean }) {
  return enabled ? <CastSpriteBoundary fallback={fallback}><Suspense fallback={fallback}><PixelUmpire /></Suspense></CastSpriteBoundary> : fallback;
}
