import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const outputDirectory = resolve(root, "assets-source/blockbench-exports");

const ALIGNMENT = 4;
const align = (value) => value + ((ALIGNMENT - (value % ALIGNMENT)) % ALIGNMENT);

function box() {
  const faces = [
    [[-0.22, -0.22, 0.22], [0.22, -0.22, 0.22], [0.22, 0.22, 0.22], [-0.22, 0.22, 0.22], [0, 0, 1]],
    [[0.22, -0.22, -0.22], [-0.22, -0.22, -0.22], [-0.22, 0.22, -0.22], [0.22, 0.22, -0.22], [0, 0, -1]],
    [[0.22, -0.22, 0.22], [0.22, -0.22, -0.22], [0.22, 0.22, -0.22], [0.22, 0.22, 0.22], [1, 0, 0]],
    [[-0.22, -0.22, -0.22], [-0.22, -0.22, 0.22], [-0.22, 0.22, 0.22], [-0.22, 0.22, -0.22], [-1, 0, 0]],
    [[-0.22, 0.22, 0.22], [0.22, 0.22, 0.22], [0.22, 0.22, -0.22], [-0.22, 0.22, -0.22], [0, 1, 0]],
    [[-0.22, -0.22, -0.22], [0.22, -0.22, -0.22], [0.22, -0.22, 0.22], [-0.22, -0.22, 0.22], [0, -1, 0]],
  ];
  return {
    positions: new Float32Array(faces.flatMap((face) => face.slice(0, 4).flat())),
    normals: new Float32Array(faces.flatMap((face) => Array(4).fill(face[4]).flat())),
    indices: new Uint16Array(faces.flatMap((_, index) => [index * 4, index * 4 + 1, index * 4 + 2, index * 4, index * 4 + 2, index * 4 + 3])),
  };
}

function makeGlb(playerName, color) {
  const geometry = box();
  const chunks = [];
  const bufferViews = [];
  let byteLength = 0;
  const append = (data, target) => {
    const padding = align(byteLength) - byteLength;
    if (padding) chunks.push(Buffer.alloc(padding));
    byteLength += padding;
    const bytes = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
    const index = bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.byteLength, target }) - 1;
    chunks.push(bytes);
    byteLength += bytes.byteLength;
    return index;
  };
  const position = append(geometry.positions, 34962);
  const normal = append(geometry.normals, 34962);
  const indices = append(geometry.indices, 34963);
  const root = `CHAR_${playerName}_Root`;
  const boneNodes = [
    { name: root, children: [1] },
    { name: "BONE_Hips", mesh: 0, translation: [0, 0.82, 0], children: [2, 9, 11] },
    { name: "BONE_Spine", mesh: 0, translation: [0, 0.42, 0], children: [3, 4, 6] },
    { name: "BONE_Head", mesh: 0, translation: [0, 0.62, 0] },
    { name: "BONE_Arm_L_Upper", mesh: 0, translation: [-0.42, 0.34, 0], children: [5] },
    { name: "BONE_Arm_L_Lower", mesh: 0, translation: [0, -0.48, 0], children: [8] },
    { name: "BONE_Arm_R_Upper", mesh: 0, translation: [0.42, 0.34, 0], children: [7] },
    { name: "BONE_Arm_R_Lower", mesh: 0, translation: [0, -0.48, 0] },
    { name: "SOCKET_Racket", mesh: 0, translation: [0, -0.44, 0.08], scale: [0.32, 0.92, 0.18] },
    { name: "BONE_Leg_L_Upper", mesh: 0, translation: [-0.2, -0.36, 0], children: [10] },
    { name: "BONE_Leg_L_Lower", mesh: 0, translation: [0, -0.4, 0.04] },
    { name: "BONE_Leg_R_Upper", mesh: 0, translation: [0.2, -0.36, 0], children: [12] },
    { name: "BONE_Leg_R_Lower", mesh: 0, translation: [0, -0.4, 0.04] },
  ];
  // Geometry remains explicit rather than relying on optimizer-created anonymous
  // children. The skeleton names remain the runtime contract; MESH_ nodes are
  // intentional, authored calibration geometry leaves.
  const nodes = boneNodes.map((node, index) => {
    if (node.mesh === undefined) return node;
    const bone = Object.fromEntries(Object.entries(node).filter(([key]) => key !== "mesh"));
    return { ...bone, children: [...(bone.children ?? []), boneNodes.length + index - 1] };
  }).concat(boneNodes.slice(1).map((node) => ({ name: `MESH_Calibration_${node.name}`, mesh: node.mesh })));
  const json = {
    asset: { version: "2.0", generator: "tennis-portfolio Phase 07 calibration-fixture generator" },
    scene: 0,
    scenes: [{ name: `${playerName}-calibration`, nodes: [0] }],
    nodes,
    meshes: [{ name: "MESH_Calibration_Block", primitives: [{ attributes: { POSITION: 0, NORMAL: 1 }, indices: 2, material: 0 }] }],
    materials: [{ name: "MAT_Calibration", pbrMetallicRoughness: { baseColorFactor: color, metallicFactor: 0, roughnessFactor: 0.9 } }],
    accessors: [
      { bufferView: position, componentType: 5126, count: 24, type: "VEC3", min: [-0.22, -0.22, -0.22], max: [0.22, 0.22, 0.22] },
      { bufferView: normal, componentType: 5126, count: 24, type: "VEC3" },
      { bufferView: indices, componentType: 5123, count: 36, type: "SCALAR" },
    ],
    bufferViews,
    buffers: [{ byteLength: align(byteLength) }],
  };
  const jsonChunk = Buffer.from(JSON.stringify(json));
  const jsonPadding = Buffer.alloc(align(jsonChunk.byteLength) - jsonChunk.byteLength, 0x20);
  const binary = Buffer.concat([...chunks, Buffer.alloc(align(byteLength) - byteLength)]);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4); header.writeUInt32LE(12 + 8 + jsonChunk.byteLength + jsonPadding.byteLength + 8 + binary.byteLength, 8);
  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonChunk.byteLength + jsonPadding.byteLength, 0); jsonHeader.writeUInt32LE(0x4e4f534a, 4);
  const binaryHeader = Buffer.alloc(8);
  binaryHeader.writeUInt32LE(binary.byteLength, 0); binaryHeader.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, jsonHeader, jsonChunk, jsonPadding, binaryHeader, binary]);
}

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(resolve(outputDirectory, "player-a.glb"), makeGlb("PlayerA", [0.78, 0.9, 0.18, 1])),
  writeFile(resolve(outputDirectory, "player-b.glb"), makeGlb("PlayerB", [0.9, 0.94, 0.88, 1])),
]);
console.log("Generated Phase 07 calibration fixtures. Replace these source exports with reviewed Blockbench exports before production-art approval.");
