import { useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshBasicMaterial, type Mesh, Vector3 } from "three";
import {
  COURT_DIMENSIONS,
  sampleBallPresentation,
  sampleBallPosition,
  sampleReducedMotionBallPosition,
  type NarrativeProgress,
} from "@/animations/prototypeMotion";
import { RetroPlayer } from "./characters/RetroPlayer";

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

type TennisBallProps = PrototypeCourtProps & { reducedMotion: boolean };

function TennisBall({ progress, reducedMotion }: TennisBallProps) {
  const ball = useRef<Mesh>(null);
  const shadow = useRef<Mesh>(null);
  const shadowMaterial = useRef<MeshBasicMaterial>(null);
  const presentation = useRef({
    shadowScale: 1,
    shadowOpacity: 0.3,
    ballScaleX: 1,
    ballScaleY: 1,
    ballScaleZ: 1,
    impact: 0,
  });

  useFrame(() => {
    const mesh = ball.current;
    const shadowMesh = shadow.current;
    if (!mesh || !shadowMesh) {
      return;
    }

    const value = progress.current.value;
    if (reducedMotion) sampleReducedMotionBallPosition(ballPosition);
    else sampleBallPosition(value, ballPosition);
    mesh.position.copy(ballPosition);
    if (reducedMotion) {
      mesh.rotation.set(0, 0, 0);
      mesh.scale.setScalar(1);
      shadowMesh.position.set(ballPosition.x, 0.012, ballPosition.z);
      shadowMesh.scale.setScalar(0.65);
      if (shadowMaterial.current) shadowMaterial.current.opacity = 0.32;
      return;
    }

    const sampled = sampleBallPresentation(value, ballPosition, presentation.current);
    mesh.rotation.x = value * Math.PI * 32;
    mesh.rotation.z = value * Math.PI * 20;
    mesh.scale.set(sampled.ballScaleX, sampled.ballScaleY, sampled.ballScaleZ);
    shadowMesh.position.set(ballPosition.x, 0.012, ballPosition.z);
    shadowMesh.scale.set(sampled.shadowScale, sampled.shadowScale, 1);
    if (shadowMaterial.current) shadowMaterial.current.opacity = sampled.shadowOpacity;
  });

  return (
    <>
      <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.24, 12]} />
        <meshBasicMaterial ref={shadowMaterial} color="#0b1712" transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <mesh ref={ball} castShadow>
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshStandardMaterial color="#d8ff39" roughness={0.5} />
      </mesh>
    </>
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

type RallyActorsProps = PrototypeCourtProps & { calibration?: boolean; reducedMotion?: boolean };

export function RallyActors({ progress, calibration = false, reducedMotion = false }: RallyActorsProps) {
  return (
    <group>
      <RetroPlayer progress={progress} side="a" smoothReference={calibration} />
      <RetroPlayer progress={progress} side="b" smoothReference={calibration} />
      <TennisBall progress={progress} reducedMotion={reducedMotion} />
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
