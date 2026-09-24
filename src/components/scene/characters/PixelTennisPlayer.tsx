"use client";

import { useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { COURT_DIMENSIONS, sampleCharacterNarrative, sampleCharacterRootTransform, sampleReducedMotionCharacterPose, sampleReducedMotionCharacterRootTransform, type CharacterNarrativeSample, type CharacterRootTransformSample, type NarrativeProgress } from "@/animations/prototypeMotion";
import { type CharacterSide } from "./characterAssetContract";
import { PLAYER_PIXEL_ATLAS, PLAYER_PIXEL_SPRITES, frameForProgress } from "../sprites/pixelSpriteAtlas";
import { PixelAtlasSprite, type PixelAtlasSpriteHandle } from "../sprites/PixelAtlasSprite";
import { PixelShadow } from "../sprites/PixelShadow";

type PixelTennisPlayerProps = { progress: MutableRefObject<NarrativeProgress>; side: CharacterSide; reducedMotion: boolean };
const PLAYER_WIDTH = 1.62;
const PLAYER_HEIGHT = 2.28;
const PLAYER_TRANSPARENT_BOTTOM_ROWS = 5;
const PLAYER_SPRITE_Y = 0.025 - (PLAYER_TRANSPARENT_BOTTOM_ROWS / PLAYER_PIXEL_ATLAS.frameHeight) * PLAYER_HEIGHT;

/** Maps the existing master progress samples to discrete player atlas frames. */
export function PixelTennisPlayer({ progress, side, reducedMotion }: PixelTennisPlayerProps) {
  const root = useRef<Group>(null);
  const sprite = useRef<PixelAtlasSpriteHandle>(null);
  const pose = useRef<CharacterNarrativeSample>({ clip: "idle_ready", localProgress: 0, contactLocalProgress: undefined, active: false });
  const transform = useRef<CharacterRootTransformSample>({ positionX: side === "a" ? -0.12 : 0.14, positionY: 0, positionZ: side === "a" ? -COURT_DIMENSIONS.playerBaselineZ : COURT_DIMENSIONS.playerBaselineZ, rotationY: side === "a" ? 0.12 : Math.PI + 0.12, rotationZ: 0, scaleY: 1 });
  const previousCell = useRef({ column: -1, row: -1 });
  useFrame(() => {
    const group = root.current;
    if (!group) return;
    const rootSample = reducedMotion ? sampleReducedMotionCharacterRootTransform(side, transform.current) : sampleCharacterRootTransform(progress.current.value, side, transform.current);
    group.position.set(rootSample.positionX, rootSample.positionY, rootSample.positionZ);
    group.rotation.set(0, 0, 0);
    group.scale.set(1, rootSample.scaleY, 1);
    sprite.current?.setLean(rootSample.rotationZ * 0.55);
    const narrative = reducedMotion ? sampleReducedMotionCharacterPose(pose.current) : sampleCharacterNarrative(progress.current.value, side, pose.current);
    const clip = PLAYER_PIXEL_ATLAS.clips[narrative.clip];
    const column = frameForProgress(narrative.localProgress, clip.frames);
    const row = clip.row;
    if (column !== previousCell.current.column || row !== previousCell.current.row) {
      sprite.current?.setCell(column, row);
      previousCell.current.column = column;
      previousCell.current.row = row;
    }
  });
  return <group ref={root} name={`pixel-player-${side}`}>
    <PixelShadow width={1.08} depth={0.44} opacity={0.56} />
    <PixelAtlasSprite ref={sprite} name={`pixel-player-${side}-sprite`} src={PLAYER_PIXEL_SPRITES[side]} columns={PLAYER_PIXEL_ATLAS.columns} rows={PLAYER_PIXEL_ATLAS.rows} width={PLAYER_WIDTH} height={PLAYER_HEIGHT} position={[0, PLAYER_SPRITE_Y, 0]} alphaTest={0.42} renderOrder={4} />
  </group>;
}
