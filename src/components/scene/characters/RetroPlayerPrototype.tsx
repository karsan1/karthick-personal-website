import { useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { COURT_DIMENSIONS, PROTOTYPE_LABELS, type NarrativeProgress } from "@/animations/prototypeMotion";
import { useRetroPlayerMaterials } from "./RetroCharacterMaterials";
import { RetroRacketPrototype } from "./RetroRacketPrototype";
import { sampleCharacterPoseProgress } from "./characterStyle";

type RetroPlayerPrototypeProps = {
  progress: MutableRefObject<NarrativeProgress>;
  side: "a" | "b";
};

const CONTACT_WINDOW = 0.024;
const FOLLOW_THROUGH_WINDOW = 0.085;
const PREPARATION_WINDOW = 0.095;

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function setRotation(group: Group | null, x: number, y: number, z: number) {
  group?.rotation.set(x, y, z);
}

/**
 * Phase 06's direct-R3F style proof. Its transform hierarchy mirrors a future
 * rig, but uses only primitive geometry and direct frame-time pose sampling.
 */
export function RetroPlayerPrototype({ progress, side }: RetroPlayerPrototypeProps) {
  const playerRoot = useRef<Group>(null);
  const hips = useRef<Group>(null);
  const torso = useRef<Group>(null);
  const head = useRef<Group>(null);
  const leftUpperArm = useRef<Group>(null);
  const leftLowerArm = useRef<Group>(null);
  const rightUpperArm = useRef<Group>(null);
  const rightLowerArm = useRef<Group>(null);
  const leftUpperLeg = useRef<Group>(null);
  const leftLowerLeg = useRef<Group>(null);
  const rightUpperLeg = useRef<Group>(null);
  const rightLowerLeg = useRef<Group>(null);
  const racket = useRef<Group>(null);

  const materials = useRetroPlayerMaterials(side);
  const baseline = side === "a" ? -COURT_DIMENSIONS.playerBaselineZ : COURT_DIMENSIONS.playerBaselineZ;
  const direction = side === "a" ? 1 : -1;
  const returnBeat = side === "a" ? PROTOTYPE_LABELS.playerAReturn : PROTOTYPE_LABELS.playerBReturn;

  useFrame(() => {
    const root = playerRoot.current;
    if (!root) {
      return;
    }

    const rawProgress = progress.current.value;
    const poseProgress = sampleCharacterPoseProgress(rawProgress);
    const distanceToReturn = Math.abs(rawProgress - returnBeat);
    const activeReturn = Math.max(0, 1 - distanceToReturn / 0.08);
    const preparation = clamp01((poseProgress - (returnBeat - PREPARATION_WINDOW)) / PREPARATION_WINDOW)
      * (1 - clamp01((poseProgress - returnBeat) / CONTACT_WINDOW));
    const contact = Math.max(0, 1 - Math.abs(poseProgress - returnBeat) / CONTACT_WINDOW);
    const followThrough = clamp01((poseProgress - returnBeat) / CONTACT_WINDOW)
      * (1 - clamp01((poseProgress - (returnBeat + FOLLOW_THROUGH_WINDOW)) / FOLLOW_THROUGH_WINDOW));
    const recovering = clamp01((poseProgress - (returnBeat + 0.04)) / 0.08);
    // The timeline intentionally rests at contentPause for reduced motion.
    const resting = rawProgress >= PROTOTYPE_LABELS.contentPause ? 1 : 0;
    const activePose = 1 - resting;
    const prepared = preparation * activePose;
    const contacted = contact * activePose;
    const followedThrough = followThrough * activePose;
    const contactPose = contacted > 0;
    const poseWeight = Math.max(prepared, contacted, followedThrough * (1 - recovering));
    const lean = poseWeight * (0.12 + contacted * 0.13);
    const steppedReturn = Math.max(0, 1 - Math.abs(poseProgress - returnBeat) / 0.08) * activePose;

    root.position.x = side === "a" ? -0.12 + activeReturn * 0.52 : 0.14 - activeReturn * 0.5;
    root.position.y = 0;
    root.position.z = baseline - direction * activeReturn * 0.28;
    root.rotation.y = side === "a" ? 0.12 - activeReturn * 0.38 : Math.PI + 0.12 + activeReturn * 0.38;
    root.rotation.z = direction * activeReturn * 0.1;
    root.scale.y = 1 - activeReturn * 0.1;

    if (resting) {
      setRotation(hips.current, 0, 0, 0);
      setRotation(torso.current, 0, 0, 0);
      setRotation(head.current, 0, 0, 0);
      setRotation(leftUpperArm.current, -0.78, 0.12, -0.52);
      setRotation(leftLowerArm.current, -0.82, 0.05, 0.1);
      setRotation(rightUpperArm.current, -0.58, -0.12, 0.58);
      setRotation(rightLowerArm.current, -0.68, 0, -0.12);
      setRotation(leftUpperLeg.current, 0.12, 0, -0.12);
      setRotation(leftLowerLeg.current, -0.16, 0, 0);
      setRotation(rightUpperLeg.current, -0.12, 0, 0.14);
      setRotation(rightLowerLeg.current, 0.18, 0, 0);
      setRotation(racket.current, 0.12, 0, -0.08);
      return;
    }

    setRotation(hips.current, 0, -lean * 0.55, -direction * lean * 0.3);
    setRotation(torso.current, -lean * 0.35, -direction * lean * 1.3, direction * lean * 0.22);
    setRotation(head.current, lean * 0.12, direction * lean * 0.55, 0);

    // Racket arm: preparation draws back, contact reaches forward, then swings across.
    setRotation(leftUpperArm.current, -0.78 - poseWeight * 0.38 + contacted * 0.48, 0.12 - prepared * 0.72 + followedThrough * 1.35, -0.52 - contacted * 0.16);
    if (contactPose) {
      // These contact rotations bring the actual racket frame near the authored
      // ball point while retaining the arm-to-wrist hierarchy. They were
      // measured against sampleBallPosition at both existing return beats.
      if (side === "a") {
        setRotation(leftLowerArm.current, -0.358, -0.832, 0.889);
        setRotation(racket.current, 2.339, -0.451, 0.489);
      } else {
        setRotation(leftLowerArm.current, -0.384, 0.976, -0.504);
        setRotation(racket.current, 1.342, -1.491, -1.52);
      }
    } else {
      setRotation(leftLowerArm.current, -0.82 + prepared * 0.42, 0.05, 0.1 + followedThrough * 0.24);
      setRotation(racket.current, 0.12, prepared * -0.24 + followedThrough * 0.4, -0.08);
    }
    setRotation(rightUpperArm.current, -0.58 + poseWeight * 0.3, -0.12 + prepared * 0.36, 0.58 - contacted * 0.2);
    setRotation(rightLowerArm.current, -0.68 + contacted * 0.28, 0, -0.12);
    setRotation(leftUpperLeg.current, 0.12 + steppedReturn * 0.22, 0, -0.12 - direction * lean * 0.42);
    setRotation(leftLowerLeg.current, -0.16 - steppedReturn * 0.24, 0, 0);
    setRotation(rightUpperLeg.current, -0.12 - steppedReturn * 0.22, 0, 0.14 + direction * lean * 0.42);
    setRotation(rightLowerLeg.current, 0.18 + steppedReturn * 0.22, 0, 0);
  });

  return (
    <group ref={playerRoot} position={[0, 0, baseline]}>
      <group ref={hips} position={[0, 0.82, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.56, 0.25, 0.34]} />
          <primitive object={materials.accent} attach="material" dispose={null} />
        </mesh>
        <group ref={torso} position={[0, 0.14, 0]}>
          <mesh castShadow position={[0, 0.42, 0]} rotation={[0, Math.PI / 4, 0]}>
            <cylinderGeometry args={[0.38, 0.29, 0.84, 5]} />
            <primitive object={materials.clothing} attach="material" dispose={null} />
          </mesh>
          <group ref={head} position={[0, 0.96, 0]}>
            <mesh castShadow>
              <dodecahedronGeometry args={[0.25, 0]} />
              <primitive object={materials.skin} attach="material" dispose={null} />
            </mesh>
            <mesh castShadow position={[0, 0.13, -0.01]} scale={[1.02, 0.46, 1.02]}>
              <dodecahedronGeometry args={[0.255, 0]} />
              <primitive object={materials.hair} attach="material" dispose={null} />
            </mesh>
          </group>
          <group ref={leftUpperArm} position={[-0.38, 0.69, 0]}>
            <mesh castShadow position={[0, -0.27, 0]}>
              <boxGeometry args={[0.18, 0.56, 0.18]} />
              <primitive object={materials.clothing} attach="material" dispose={null} />
            </mesh>
            <group ref={leftLowerArm} position={[0, -0.55, 0]}>
              <mesh castShadow position={[0, -0.25, 0]}>
                <boxGeometry args={[0.15, 0.5, 0.15]} />
                <primitive object={materials.skin} attach="material" dispose={null} />
              </mesh>
              <RetroRacketPrototype racket={racket} materials={materials} />
            </group>
          </group>
          <group ref={rightUpperArm} position={[0.38, 0.69, 0]}>
            <mesh castShadow position={[0, -0.27, 0]}>
              <boxGeometry args={[0.18, 0.56, 0.18]} />
              <primitive object={materials.clothing} attach="material" dispose={null} />
            </mesh>
            <group ref={rightLowerArm} position={[0, -0.55, 0]}>
              <mesh castShadow position={[0, -0.25, 0]}>
                <boxGeometry args={[0.15, 0.5, 0.15]} />
                <primitive object={materials.skin} attach="material" dispose={null} />
              </mesh>
            </group>
          </group>
        </group>
        <group ref={leftUpperLeg} position={[-0.2, -0.02, 0]}>
          <mesh castShadow position={[0, -0.19, 0]}>
            <boxGeometry args={[0.23, 0.38, 0.25]} />
            <primitive object={materials.accent} attach="material" dispose={null} />
          </mesh>
          <group ref={leftLowerLeg} position={[0, -0.38, 0]}>
            <mesh castShadow position={[0, -0.15, 0]}>
              <boxGeometry args={[0.19, 0.3, 0.21]} />
              <primitive object={materials.skin} attach="material" dispose={null} />
            </mesh>
            <mesh castShadow position={[0, -0.33, 0.08]}>
              <boxGeometry args={[0.25, 0.12, 0.42]} />
              <primitive object={materials.shoes} attach="material" dispose={null} />
            </mesh>
          </group>
        </group>
        <group ref={rightUpperLeg} position={[0.2, -0.02, 0]}>
          <mesh castShadow position={[0, -0.19, 0]}>
            <boxGeometry args={[0.23, 0.38, 0.25]} />
            <primitive object={materials.accent} attach="material" dispose={null} />
          </mesh>
          <group ref={rightLowerLeg} position={[0, -0.38, 0]}>
            <mesh castShadow position={[0, -0.15, 0]}>
              <boxGeometry args={[0.19, 0.3, 0.21]} />
              <primitive object={materials.skin} attach="material" dispose={null} />
            </mesh>
            <mesh castShadow position={[0, -0.33, 0.08]}>
              <boxGeometry args={[0.25, 0.12, 0.42]} />
              <primitive object={materials.shoes} attach="material" dispose={null} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
