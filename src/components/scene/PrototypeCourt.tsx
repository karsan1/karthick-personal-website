import { useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { type Mesh, Vector3 } from "three";
import {
  COURT_DIMENSIONS,
  sampleBallPosition,
  type NarrativeProgress,
} from "@/animations/prototypeMotion";
import { RetroPlayerPrototype } from "./characters/RetroPlayerPrototype";

type PrototypeCourtProps = {
  progress: MutableRefObject<NarrativeProgress>;
};

const ballPosition = new Vector3();

function CourtLines() {
  const lineMaterial = <meshStandardMaterial color="#edf3e8" roughness={0.72} />;

  return (
    <group position={[0, 0.015, 0]}>
      <mesh position={[0, 0, -5.8]}>{/* baseline */}
        <boxGeometry args={[7.7, 0.025, 0.07]} />
        {lineMaterial}
      </mesh>
      <mesh position={[0, 0, 5.8]}>
        <boxGeometry args={[7.7, 0.025, 0.07]} />
        {lineMaterial}
      </mesh>
      <mesh position={[-3.85, 0, 0]}>
        <boxGeometry args={[0.07, 0.025, 11.6]} />
        {lineMaterial}
      </mesh>
      <mesh position={[3.85, 0, 0]}>
        <boxGeometry args={[0.07, 0.025, 11.6]} />
        {lineMaterial}
      </mesh>
      <mesh position={[0, 0, -2.1]}>
        <boxGeometry args={[5.0, 0.025, 0.055]} />
        {lineMaterial}
      </mesh>
      <mesh position={[0, 0, 2.1]}>
        <boxGeometry args={[5.0, 0.025, 0.055]} />
        {lineMaterial}
      </mesh>
      <mesh position={[0, 0, -1.05]}>
        <boxGeometry args={[0.055, 0.025, 2.1]} />
        {lineMaterial}
      </mesh>
      <mesh position={[0, 0, 1.05]}>
        <boxGeometry args={[0.055, 0.025, 2.1]} />
        {lineMaterial}
      </mesh>
    </group>
  );
}

function Net() {
  return (
    <group>
      <mesh position={[0, COURT_DIMENSIONS.netHeight, 0]}>
        <boxGeometry args={[8, 0.06, 0.06]} />
        <meshStandardMaterial color="#edf3e8" roughness={0.68} />
      </mesh>
      <mesh position={[0, COURT_DIMENSIONS.netHeight / 2, 0]}>
        <boxGeometry args={[7.9, COURT_DIMENSIONS.netHeight, 0.025]} />
        <meshStandardMaterial color="#cdd7ca" wireframe transparent opacity={0.5} />
      </mesh>
      {[-4, 4].map((x) => (
        <mesh key={x} position={[x, COURT_DIMENSIONS.netHeight / 2, 0]}>
          <cylinderGeometry args={[0.045, 0.045, COURT_DIMENSIONS.netHeight * 1.1, 8]} />
          <meshStandardMaterial color="#26372e" roughness={0.75} />
        </mesh>
      ))}
    </group>
  );
}

function UmpireChair() {
  return (
    <group position={[4.65, 0, 0.35]}>
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[0.55, 0.18, 0.45]} />
        <meshStandardMaterial color="#24312a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.55, 0.17]} rotation={[0.18, 0, 0]}>
        <boxGeometry args={[0.55, 0.7, 0.09]} />
        <meshStandardMaterial color="#24312a" roughness={0.8} />
      </mesh>
      {[-0.2, 0.2].map((x) => (
        <mesh key={x} position={[x, 0.52, 0]} rotation={[0, 0, x * 0.28]}>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
          <meshStandardMaterial color="#9ba89a" roughness={0.72} />
        </mesh>
      ))}
    </group>
  );
}

function TennisBall({ progress }: PrototypeCourtProps) {
  const ball = useRef<Mesh>(null);

  useFrame(() => {
    const mesh = ball.current;
    if (!mesh) {
      return;
    }

    const value = progress.current.value;
    sampleBallPosition(value, ballPosition);
    mesh.position.copy(ballPosition);
    mesh.rotation.x = value * Math.PI * 32;
    mesh.rotation.z = value * Math.PI * 20;
  });

  return (
    <mesh ref={ball} castShadow>
      <sphereGeometry args={[0.13, 20, 20]} />
      <meshStandardMaterial color="#d8ff39" roughness={0.5} />
    </mesh>
  );
}

export function PrimitiveCourtFallback() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.13, 0]}>
        <boxGeometry args={[8.2, 0.25, 12.4]} />
        <meshStandardMaterial color="#245a3d" roughness={0.92} />
      </mesh>
      <CourtLines />
      <Net />
      <UmpireChair />
    </group>
  );
}

export function RallyActors({ progress }: PrototypeCourtProps) {
  return (
    <group>
      <RetroPlayerPrototype progress={progress} side="a" />
      <RetroPlayerPrototype progress={progress} side="b" />
      <TennisBall progress={progress} />
    </group>
  );
}

/**
 * Retained for an explicit primitive-only fallback. Production scene composition
 * uses `ProductionEnvironment` plus `RallyActors` so the court GLB can stream
 * without changing the Phase 02 animation coordinate system.
 */
export function PrototypeCourt({ progress }: PrototypeCourtProps) {
  return (
    <>
      <PrimitiveCourtFallback />
      <RallyActors progress={progress} />
    </>
  );
}
