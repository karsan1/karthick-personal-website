"use client";

import { useTexture } from "@react-three/drei";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef } from "react";
import { NearestFilter, NoColorSpace, SRGBColorSpace, type Sprite, type SpriteMaterial } from "three";

export type PixelAtlasSpriteHandle = { setCell: (column: number, row: number) => void; setLean: (radians: number) => void };
type PixelAtlasSpriteProps = { src: string; columns: number; rows: number; column?: number; row?: number; width: number; height: number; position?: readonly [number, number, number]; name?: string; alphaTest?: number; renderOrder?: number; colorSpace?: "srgb" | "none" };

/** A camera-facing, alpha-tested atlas sprite with independently mutable UVs. */
export const PixelAtlasSprite = forwardRef<PixelAtlasSpriteHandle, PixelAtlasSpriteProps>(function PixelAtlasSprite({ src, columns, rows, column = 0, row = 0, width, height, position = [0, 0, 0], name, alphaTest = 0.45, renderOrder = 0, colorSpace = "srgb" }, forwardedRef) {
  const sprite = useRef<Sprite>(null);
  const material = useRef<SpriteMaterial>(null);
  const sourceTexture = useTexture(src);
  const texture = useMemo(() => {
    const clone = sourceTexture.clone();
    clone.magFilter = NearestFilter;
    clone.minFilter = NearestFilter;
    clone.generateMipmaps = false;
    clone.colorSpace = colorSpace === "srgb" ? SRGBColorSpace : NoColorSpace;
    clone.repeat.set(1 / columns, 1 / rows);
    clone.needsUpdate = true;
    return clone;
  }, [colorSpace, columns, rows, sourceTexture]);
  const setCell = useCallback((nextColumn: number, nextRow: number) => {
    const safeColumn = Math.min(Math.max(Math.floor(nextColumn), 0), columns - 1);
    const safeRow = Math.min(Math.max(Math.floor(nextRow), 0), rows - 1);
    texture.offset.set(safeColumn / columns, 1 - (safeRow + 1) / rows);
  }, [columns, rows, texture]);
  const setLean = useCallback((radians: number) => { if (material.current) material.current.rotation = radians; }, []);
  useImperativeHandle(forwardedRef, () => ({ setCell, setLean }), [setCell, setLean]);
  useLayoutEffect(() => { sprite.current?.center.set(0.5, 0); setCell(column, row); }, [column, row, setCell]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <sprite ref={sprite} name={name} position={[position[0], position[1], position[2]]} scale={[width, height, 1]} renderOrder={renderOrder}>
    <spriteMaterial ref={material} map={texture} alphaTest={alphaTest} transparent={false} depthTest depthWrite toneMapped={false} fog={false} />
  </sprite>;
});
