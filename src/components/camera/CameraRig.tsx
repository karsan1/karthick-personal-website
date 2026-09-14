"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type MutableRefObject } from "react";
import { PerspectiveCamera, Vector3 } from "three";
import {
  getActiveShot,
  getCameraComposition,
  getCameraKeyframePair,
  sampleCamera,
  sampleMatchState,
  type NarrativeProgress,
} from "@/animations/prototypeMotion";

type CameraRigProps = {
  progress: MutableRefObject<NarrativeProgress>;
  debug?: boolean;
  reducedMotion?: boolean;
};

const cameraPosition = new Vector3();
const lookAtTarget = new Vector3();

export function CameraRig({ progress, debug = false, reducedMotion = false }: CameraRigProps) {
  const readout = useRef<HTMLElement | null>(null);
  const lastReadoutProgress = useRef(-1);
  const lastReadoutChapter = useRef("");
  const lastReadoutComposition = useRef("");

  useFrame(({ camera, size }) => {
    const fov = sampleCamera(
      progress.current.value,
      cameraPosition,
      lookAtTarget,
      size.width / size.height,
      reducedMotion,
    );
    camera.position.copy(cameraPosition);
    camera.lookAt(lookAtTarget);

    if (camera instanceof PerspectiveCamera && Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    if (debug) {
      const value = progress.current.value;
      const aspect = size.width / size.height;
      const state = sampleMatchState(value);
      const composition = getCameraComposition(aspect, reducedMotion);
      const readoutChanged =
        Math.abs(value - lastReadoutProgress.current) > 0.005 ||
        state.chapter !== lastReadoutChapter.current ||
        composition !== lastReadoutComposition.current;
      if (!readoutChanged) return;

      readout.current ??= document.querySelector<HTMLElement>("[data-camera-readout]");
      const output = readout.current;
      if (!output) {
        return;
      }

      const { previous, next } = getCameraKeyframePair(value, aspect, reducedMotion);
      const shot = getActiveShot(value);
      const { x, y, z } = camera.position;
      output.textContent = [
        `p ${value.toFixed(2)} · ${state.chapter} · ${state.scoreboard}`,
        `camera ${composition} ${previous.progress.toFixed(2)}→${next.progress.toFixed(2)} · ${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)}`,
        `ball ${shot?.id ?? state.ballState} · player ${state.playerState}`,
      ].join("\n");
      lastReadoutProgress.current = value;
      lastReadoutChapter.current = state.chapter;
      lastReadoutComposition.current = composition;
    }
  });

  return null;
}
