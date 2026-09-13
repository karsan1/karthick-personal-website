import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { InstancedMesh } from "three";
import { Matrix4, MeshStandardMaterial } from "three";
import { COURT_DIMENSIONS } from "@/animations/prototypeMotion";

/**
 * Phase 09 environment contract: every position retains the accepted Phase 04
 * court coordinate system. The scene is deliberately procedural so the visible
 * court has no raster/GLB dependency; the legacy partition loader remains the
 * error fallback while this restyle is being reviewed.
 */
const COURT_WIDTH = 8.2;
const COURT_LENGTH = 12.4;
const NET_HEIGHT = COURT_DIMENSIONS.netHeight;

type RetroPalette = {
  court: MeshStandardMaterial;
  light: MeshStandardMaterial;
  net: MeshStandardMaterial;
  dark: MeshStandardMaterial;
  mid: MeshStandardMaterial;
  accent: MeshStandardMaterial;
};

type InstanceTransform = readonly [number, number, number, number, number, number];

const COURT_LINES: readonly InstanceTransform[] = [
  [0, 0.015, -5.8, 7.7, 0.025, 0.07],
  [0, 0.015, 5.8, 7.7, 0.025, 0.07],
  [-3.85, 0.015, 0, 0.07, 0.025, 11.6],
  [3.85, 0.015, 0, 0.07, 0.025, 11.6],
  [0, 0.015, -2.1, 5, 0.025, 0.055],
  [0, 0.015, 2.1, 5, 0.025, 0.055],
  [0, 0.015, -1.05, 0.055, 0.025, 2.1],
  [0, 0.015, 1.05, 0.055, 0.025, 2.1],
];

const PROP_BLOCKS: readonly InstanceTransform[] = [
  [4.65, 1.05, 0.35, 0.55, 0.18, 0.45],
  [4.65, 1.55, 0.52, 0.55, 0.7, 0.09],
  [-4.75, 0.38, -2.35, 1.2, 0.18, 0.42],
  [-4.75, 0.76, -2.35, 1.2, 0.5, 0.08],
  [4.82, 0.3, 2.4, 0.52, 0.42, 0.52],
];

const STAND_BLOCKS: readonly InstanceTransform[] = [
  [0, 1.1, -8.1, 13.8, 2.2, 1.4],
  [0, 1.1, 8.1, 13.8, 2.2, 1.4],
  [-7.15, 1, 0, 1.1, 2, 16.4],
  [7.15, 1, 0, 1.1, 2, 16.4],
];

const SCOREBOARD_SEGMENTS: readonly InstanceTransform[] = [
  [-1.25, 3.9, 7.5, 0.34, 0.1, 0.06], [-1.25, 3.3, 7.5, 0.34, 0.1, 0.06],
  [-1.45, 3.6, 7.5, 0.1, 0.56, 0.06], [-1.05, 3.6, 7.5, 0.1, 0.56, 0.06],
  [0.55, 3.9, 7.5, 0.34, 0.1, 0.06], [0.55, 3.3, 7.5, 0.34, 0.1, 0.06],
  [0.35, 3.6, 7.5, 0.1, 0.56, 0.06], [0.75, 3.6, 7.5, 0.1, 0.56, 0.06],
];

/** Static, deterministic instrumentation for the Phase 09 performance review. */
export const RETRO_ENVIRONMENT_METRICS = {
  drawCalls: 14,
  drawCallCeiling: 15,
  materialInstances: 6,
  instancedGroups: 8,
  instances: 8 + 2 + 5 + 8 + 4 + 32 + 24 + 8,
} as const;

function applyInstances(mesh: InstancedMesh, transforms: readonly InstanceTransform[]) {
  const matrix = new Matrix4();
  transforms.forEach(([x, y, z, width, height, depth], index) => {
    matrix.makeScale(width, height, depth);
    matrix.setPosition(x, y, z);
    mesh.setMatrixAt(index, matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
}

function CourtLines({ palette }: { palette: RetroPalette }) {
  const lines = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    if (lines.current) applyInstances(lines.current, COURT_LINES);
  }, []);

  return (
    <instancedMesh ref={lines} args={[undefined, undefined, COURT_LINES.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <primitive object={palette.light} attach="material" dispose={null} />
    </instancedMesh>
  );
}

function RetroNet({ palette }: { palette: RetroPalette }) {
  const posts = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    if (!posts.current) return;
    const matrix = new Matrix4();
    [-4, 4].forEach((x, index) => {
      matrix.makeScale(1, 1, 1);
      matrix.setPosition(x, NET_HEIGHT / 2, 0);
      posts.current?.setMatrixAt(index, matrix);
    });
    posts.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group>
      <mesh position={[0, NET_HEIGHT, 0]}>
        <boxGeometry args={[8, 0.07, 0.08]} />
        <primitive object={palette.light} attach="material" dispose={null} />
      </mesh>
      <mesh position={[0, NET_HEIGHT / 2, 0]}>
        <planeGeometry args={[7.9, NET_HEIGHT, 8, 2]} />
        <primitive object={palette.net} attach="material" dispose={null} />
      </mesh>
      <instancedMesh ref={posts} args={[undefined, undefined, 2]}>
        <cylinderGeometry args={[0.055, 0.065, NET_HEIGHT * 1.14, 6]} />
        <primitive object={palette.dark} attach="material" dispose={null} />
      </instancedMesh>
    </group>
  );
}

function CourtsideProps({ palette }: { palette: RetroPalette }) {
  const blocks = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    if (blocks.current) applyInstances(blocks.current, PROP_BLOCKS);
  }, []);

  return (
    <group>
      <instancedMesh ref={blocks} args={[undefined, undefined, PROP_BLOCKS.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={palette.dark} attach="material" dispose={null} />
      </instancedMesh>
      <mesh position={[4.65, 0.52, 0.35]} rotation={[0, 0, -0.08]}>
        <cylinderGeometry args={[0.045, 0.045, 1.2, 6]} />
        <primitive object={palette.mid} attach="material" dispose={null} />
      </mesh>
    </group>
  );
}

function RetroScoreboard({ palette }: { palette: RetroPalette }) {
  const digits = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    if (digits.current) applyInstances(digits.current, SCOREBOARD_SEGMENTS);
  }, []);

  return (
    <group>
      <mesh position={[0, 3.6, 7.7]}>
        <boxGeometry args={[4.3, 1.9, 0.32]} />
        <primitive object={palette.dark} attach="material" dispose={null} />
      </mesh>
      <mesh position={[0, 3.6, 7.54]}>
        <boxGeometry args={[3.72, 1.3, 0.08]} />
        <primitive object={palette.mid} attach="material" dispose={null} />
      </mesh>
      <instancedMesh ref={digits} args={[undefined, undefined, SCOREBOARD_SEGMENTS.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={palette.accent} attach="material" dispose={null} />
      </instancedMesh>
    </group>
  );
}

function StadiumShell({ palette }: { palette: RetroPalette }) {
  const stands = useRef<InstancedMesh>(null);
  const seats = useRef<InstancedMesh>(null);
  const crowd = useRef<InstancedMesh>(null);
  const lights = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    if (stands.current) applyInstances(stands.current, STAND_BLOCKS);
    const matrix = new Matrix4();
    const fillGrid = (mesh: InstancedMesh | null, columns: number, rows: number, z: number, y: number, sx: number, sy: number) => {
      if (!mesh) return;
      let index = 0;
      for (let row = 0; row < rows; row += 1) for (let column = 0; column < columns; column += 1) {
        matrix.makeScale(sx, sy, 0.32);
        matrix.setPosition((column - (columns - 1) / 2) * 0.58, y + row * 0.28, z);
        mesh.setMatrixAt(index, matrix);
        index += 1;
      }
      mesh.instanceMatrix.needsUpdate = true;
    };
    fillGrid(seats.current, 8, 4, -7.35, 1.55, 0.46, 0.16);
    fillGrid(crowd.current, 8, 3, 7.28, 1.72, 0.3, 0.34);
    if (lights.current) {
      for (let index = 0; index < 8; index += 1) {
        matrix.makeScale(1, 1, 1);
        matrix.setPosition(index < 4 ? -6.15 : 6.15, 3.2 + (index % 4) * 0.8, -4.2 + (index % 4) * 2.8);
        lights.current.setMatrixAt(index, matrix);
      }
      lights.current.instanceMatrix.needsUpdate = true;
    }
  }, []);

  return (
    <group>
      <instancedMesh ref={stands} args={[undefined, undefined, STAND_BLOCKS.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={palette.dark} attach="material" dispose={null} />
      </instancedMesh>
      <instancedMesh ref={seats} args={[undefined, undefined, 32]}>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={palette.mid} attach="material" dispose={null} />
      </instancedMesh>
      <instancedMesh ref={crowd} args={[undefined, undefined, 24]}>
        <dodecahedronGeometry args={[0.5, 0]} />
        <primitive object={palette.mid} attach="material" dispose={null} />
      </instancedMesh>
      <instancedMesh ref={lights} args={[undefined, undefined, 8]}>
        <octahedronGeometry args={[0.13, 0]} />
        <primitive object={palette.accent} attach="material" dispose={null} />
      </instancedMesh>
    </group>
  );
}

function RetroCourt({ palette }: { palette: RetroPalette }) {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.13, 0]}>
        <boxGeometry args={[COURT_WIDTH, 0.25, COURT_LENGTH]} />
        <primitive object={palette.court} attach="material" dispose={null} />
      </mesh>
      <CourtLines palette={palette} />
      <RetroNet palette={palette} />
    </group>
  );
}

/** Court is immediate; noncritical details mount over successive frames. */
export function RetroEnvironment() {
  const [stage, setStage] = useState(0);
  const palette = useMemo<RetroPalette>(() => ({
    court: new MeshStandardMaterial({ color: "#2d6951", flatShading: true, roughness: 0.93 }),
    light: new MeshStandardMaterial({ color: "#e7e1c7", roughness: 0.78 }),
    net: new MeshStandardMaterial({ color: "#9eb5a2", wireframe: true, transparent: true, opacity: 0.52, roughness: 0.9 }),
    dark: new MeshStandardMaterial({ color: "#20312b", flatShading: true, roughness: 0.9 }),
    mid: new MeshStandardMaterial({ color: "#60756a", flatShading: true, roughness: 0.88 }),
    accent: new MeshStandardMaterial({ color: "#d8aa4a", emissive: "#5a3c0e", emissiveIntensity: 0.3, flatShading: true, roughness: 0.68 }),
  }), []);

  useEffect(() => () => {
    Object.values(palette).forEach((material) => material.dispose());
  }, [palette]);

  useLayoutEffect(() => {
    let nextFrame = window.requestAnimationFrame(() => {
      setStage(1);
      nextFrame = window.requestAnimationFrame(() => {
        setStage(2);
        nextFrame = window.requestAnimationFrame(() => setStage(3));
      });
    });
    return () => window.cancelAnimationFrame(nextFrame);
  }, []);

  return (
    <group name="retro-environment">
      <RetroCourt palette={palette} />
      {stage >= 1 ? <CourtsideProps palette={palette} /> : null}
      {stage >= 2 ? <RetroScoreboard palette={palette} /> : null}
      {stage >= 3 ? <StadiumShell palette={palette} /> : null}
    </group>
  );
}
