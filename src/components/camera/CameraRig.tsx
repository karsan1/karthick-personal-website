"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type MutableRefObject } from "react";
import { PerspectiveCamera, Vector3 } from "three";
import { sampleCamera, type NarrativeProgress } from "@/animations/prototypeMotion";

type CameraRigProps = {
  progress: MutableRefObject<NarrativeProgress>;
  debug?: boolean;
};

const cameraPosition = new Vector3();
const lookAtTarget = new Vector3();

export function CameraRig({ progress, debug = false }: CameraRigProps) {
  const readout = useRef<HTMLElement | null>(null);
  const lastReadoutProgress = useRef(-1);

  useFrame(({ camera, size }) => {
    const fov = sampleCamera(
      progress.current.value,
      cameraPosition,
      lookAtTarget,
      size.width / size.height,
    );
    camera.position.copy(cameraPosition);
    camera.lookAt(lookAtTarget);

    if (camera instanceof PerspectiveCamera && Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    if (debug && Math.abs(progress.current.value - lastReadoutProgress.current) > 0.005) {
      readout.current ??= document.querySelector<HTMLElement>("[data-camera-readout]");
      const output = readout.current;
      if (!output) {
        return;
      }

      const { x, y, z } = camera.position;
      output.textContent = `p ${progress.current.value.toFixed(2)} · camera ${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)}`;
      lastReadoutProgress.current = progress.current.value;
    }
  });

  return null;
}
