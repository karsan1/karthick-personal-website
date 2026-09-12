export function Lighting() {
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 8, 4]} intensity={2.4} color="#fff6df" />
      <directionalLight position={[-4, 3, -2]} intensity={1.2} color="#8fb9ff" />
    </>
  );
}
