import { DebugScene } from "./DebugScene";
import { Lighting } from "./Lighting";
import { CameraRig } from "@/components/camera/CameraRig";

type SceneProps = {
  debug: boolean;
};

export function Scene({ debug }: SceneProps) {
  return (
    <>
      <color attach="background" args={["#07120f"]} />
      <fog attach="fog" args={["#07120f", 12, 26]} />
      <Lighting />
      <CameraRig />

      <group rotation={[0, Math.PI / 12, 0]}>
        <mesh receiveShadow position={[0, -0.2, 0]}>
          <boxGeometry args={[7.4, 0.25, 4]} />
          <meshStandardMaterial color="#245a3d" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[0.05, 1.85, 4.05]} />
          <meshStandardMaterial color="#d8e0d4" wireframe opacity={0.55} transparent />
        </mesh>
        <mesh position={[-1.9, 0.42, 0.7]}>
          <sphereGeometry args={[0.34, 32, 32]} />
          <meshStandardMaterial color="#d8ff39" roughness={0.55} />
        </mesh>
      </group>

      {debug ? <DebugScene /> : null}
    </>
  );
}
