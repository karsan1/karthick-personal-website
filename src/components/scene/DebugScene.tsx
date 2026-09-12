export function DebugScene() {
  return (
    <>
      <axesHelper args={[3]} />
      <gridHelper args={[16, 16, "#d8ff39", "#3c5b4a"]} />
    </>
  );
}
