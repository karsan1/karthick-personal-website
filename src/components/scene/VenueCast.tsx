"use client";

import { Component, Suspense, type ReactNode } from "react";
import type { QualityTier } from "@/store/experienceStore";
import { PixelAtlasSprite } from "./sprites/PixelAtlasSprite";
import { PixelShadow } from "./sprites/PixelShadow";
import { VENUE_PIXEL_SPRITES } from "./sprites/pixelSpriteAtlas";

type Placement = { position: readonly [number, number, number]; variant: 0 | 1 | 2 | 3; scale?: number };
const BALL_KID_WIDTH = 0.78;
const BALL_KID_HEIGHT = 1.04;
const BALL_KID_TRANSPARENT_BOTTOM_ROWS = 14.5;
const BALL_KID_SPRITE_Y = -(BALL_KID_TRANSPARENT_BOTTOM_ROWS / 64) * BALL_KID_HEIGHT;
const UMPIRE_WIDTH = 1.86;
const UMPIRE_HEIGHT = 3.12;
const UMPIRE_TRANSPARENT_BOTTOM_ROWS = 3;
const UMPIRE_SPRITE_Y = -(UMPIRE_TRANSPARENT_BOTTOM_ROWS / 120) * UMPIRE_HEIGHT;
const REAR_AUDIENCE: readonly Placement[] = [
  { position: [-4.05, 1.02, 7.12], variant: 0 }, { position: [-3.1, 1.26, 7.5], variant: 1, scale: 0.94 },
  { position: [-2.15, 1.02, 7.12], variant: 2 }, { position: [-1.1, 1.28, 7.52], variant: 3, scale: 0.94 },
  { position: [0, 1.02, 7.12], variant: 1 }, { position: [1.1, 1.28, 7.52], variant: 0, scale: 0.94 },
  { position: [2.15, 1.02, 7.12], variant: 3 }, { position: [3.1, 1.26, 7.5], variant: 2, scale: 0.94 },
  { position: [4.05, 1.02, 7.12], variant: 1 },
] as const;

// Four ball kids stay outside the doubles alley, inside the venue walls, and
// clear of the Resume, Capabilities, Research, and Experience hotspot volumes.
const SIDELINE_OFFICIALS: readonly Placement[] = [
  { position: [-4.52, 0.02, -1.2], variant: 0, scale: 0.88 }, { position: [4.52, 0.02, -1.2], variant: 1, scale: 0.88 },
  { position: [-4.52, 0.02, 4.5], variant: 3, scale: 0.84 }, { position: [4.52, 0.02, 4.5], variant: 2, scale: 0.84 },
] as const;

class CastSpriteBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function rearCount(qualityTier: QualityTier) {
  if (qualityTier === "high") return 9;
  if (qualityTier === "medium") return 6;
  return 4;
}

function RearAudience({ qualityTier }: { qualityTier: QualityTier }) {
  return <group name="pixel-rear-audience">{REAR_AUDIENCE.slice(0, rearCount(qualityTier)).map(({ position, variant, scale = 1 }, index) => (
    <group key={`rear-${index}`} position={[position[0], position[1], position[2]]}>
      <PixelShadow width={0.58 * scale} depth={0.24 * scale} opacity={0.3} />
      <PixelAtlasSprite src={VENUE_PIXEL_SPRITES.audience} columns={4} rows={1} column={variant} row={0} width={0.9 * scale} height={1.26 * scale} position={[0, 0.01, 0]} alphaTest={0.42} renderOrder={1} />
    </group>
  ))}</group>;
}

function SidelineCrew() {
  return <group name="pixel-ball-kids">{SIDELINE_OFFICIALS.map(({ position, variant, scale = 1 }, index) => (
    <group key={`sideline-${index}`} position={[position[0], position[1], position[2]]}>
      <PixelShadow width={0.72 * scale} depth={0.3 * scale} opacity={0.38} />
      <PixelAtlasSprite src={VENUE_PIXEL_SPRITES.sideline} columns={4} rows={1} column={variant} row={0} width={BALL_KID_WIDTH * scale} height={BALL_KID_HEIGHT * scale} position={[0, BALL_KID_SPRITE_Y * scale, 0]} alphaTest={0.42} renderOrder={2} />
    </group>
  ))}</group>;
}

function AudienceSprites({ qualityTier }: { qualityTier: QualityTier }) {
  return <group name="pixel-venue-cast"><RearAudience qualityTier={qualityTier} /><SidelineCrew /></group>;
}

/** Flat venue sprites stay outside player and station hotspot bounds. */
export function VenueCastAudience({ qualityTier }: { qualityTier: QualityTier }) {
  return <CastSpriteBoundary fallback={null}><Suspense fallback={null}><AudienceSprites qualityTier={qualityTier} /></Suspense></CastSpriteBoundary>;
}

function PixelUmpire() {
  return <group name="pixel-chair-umpire" position={[4.85, 0.02, 0.4]}>
    <PixelShadow width={1.1} depth={0.52} opacity={0.42} />
    <PixelAtlasSprite src={VENUE_PIXEL_SPRITES.umpire} columns={1} rows={1} width={UMPIRE_WIDTH} height={UMPIRE_HEIGHT} position={[0, UMPIRE_SPRITE_Y, 0]} alphaTest={0.42} renderOrder={3} />
  </group>;
}

export function VenueCastUmpire({ fallback, enabled }: { fallback: ReactNode; enabled: boolean }) {
  return enabled ? <CastSpriteBoundary fallback={fallback}><Suspense fallback={fallback}><PixelUmpire /></Suspense></CastSpriteBoundary> : fallback;
}
