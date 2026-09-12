import { CameraRig } from "@/components/camera/CameraRig";

export function DebugScene() {
  return (
    <>
      <axesHelper args={[3]} />
      <CameraRig debug />
    </>
  );
}
