"use client";

import { useFrame } from "@react-three/fiber";

type CameraRigProps = {
  debug?: boolean;
};

export function CameraRig({ debug = false }: CameraRigProps) {
  useFrame(({ camera }) => {
    camera.lookAt(0, 0, 0);

    if (debug) {
      const output = document.querySelector<HTMLElement>("[data-camera-readout]");
      if (output) {
        const { x, y, z } = camera.position;
        output.textContent = `camera ${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)}`;
      }
    }
  });

  return null;
}
