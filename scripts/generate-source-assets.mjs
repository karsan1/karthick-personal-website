import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "..");
const sourceDirectory = resolve(repositoryRoot, "assets-source/fixtures/calibration-glb");

const MATERIALS = {
  court: [0.075, 0.255, 0.17, 1],
  line: [0.86, 0.91, 0.85, 1],
  net: [0.55, 0.63, 0.56, 1],
  hardware: [0.075, 0.11, 0.09, 1],
  seating: [0.15, 0.19, 0.17, 1],
  accent: [0.62, 0.78, 0.23, 1],
};

function align(bytes, alignment = 4) {
  return bytes + ((alignment - (bytes % alignment)) % alignment);
}

function boxVertices([width, height, depth]) {
  const x = width / 2;
  const y = height / 2;
  const z = depth / 2;
  const faces = [
    [[-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z], [0, 0, 1]],
    [[x, -y, -z], [-x, -y, -z], [-x, y, -z], [x, y, -z], [0, 0, -1]],
    [[x, -y, z], [x, -y, -z], [x, y, -z], [x, y, z], [1, 0, 0]],
    [[-x, -y, -z], [-x, -y, z], [-x, y, z], [-x, y, -z], [-1, 0, 0]],
    [[-x, y, z], [x, y, z], [x, y, -z], [-x, y, -z], [0, 1, 0]],
    [[-x, -y, -z], [x, -y, -z], [x, -y, z], [-x, -y, z], [0, -1, 0]],
  ];
  const positions = [];
  const normals = [];
  for (const [a, b, c, d, normal] of faces) {
    positions.push(...a, ...b, ...c, ...d);
    normals.push(...normal, ...normal, ...normal, ...normal);
  }
  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    indices: new Uint16Array(Array.from({ length: 6 }, (_, face) => {
      const offset = face * 4;
      return [offset, offset + 1, offset + 2, offset, offset + 2, offset + 3];
    }).flat()),
  };
}

function makeGlb({ name, objects }) {
  const chunks = [];
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const meshByKey = new Map();
  let byteLength = 0;

  const append = (typedArray, target) => {
    const padding = align(byteLength) - byteLength;
    if (padding) chunks.push(Buffer.alloc(padding));
    byteLength += padding;
    const data = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const index = bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: data.byteLength, target }) - 1;
    chunks.push(data);
    byteLength += data.byteLength;
    return index;
  };

  const getMesh = (object) => {
    const key = `${object.size.join("x")}:${object.material}`;
    if (meshByKey.has(key)) return meshByKey.get(key);
    const geometry = boxVertices(object.size);
    const positionView = append(geometry.positions, 34962);
    const normalView = append(geometry.normals, 34962);
    const indexView = append(geometry.indices, 34963);
    const position = accessors.push({ bufferView: positionView, componentType: 5126, count: 24, type: "VEC3", min: [-object.size[0] / 2, -object.size[1] / 2, -object.size[2] / 2], max: [object.size[0] / 2, object.size[1] / 2, object.size[2] / 2] }) - 1;
    const normal = accessors.push({ bufferView: normalView, componentType: 5126, count: 24, type: "VEC3" }) - 1;
    const indices = accessors.push({ bufferView: indexView, componentType: 5123, count: 36, type: "SCALAR" }) - 1;
    const mesh = meshes.push({ name: `MESH_${key}`, primitives: [{ attributes: { POSITION: position, NORMAL: normal }, indices, material: Object.keys(MATERIALS).indexOf(object.material) }] }) - 1;
    meshByKey.set(key, mesh);
    return mesh;
  };

  const nodes = objects.map((object) => ({
    name: object.name,
    mesh: getMesh(object),
    translation: object.position,
    ...(object.rotation ? { rotation: object.rotation } : {}),
  }));
  const json = {
    asset: { version: "2.0", generator: "tennis-portfolio deterministic source exporter" },
    scene: 0,
    scenes: [{ name: name.replace(".glb", ""), nodes: nodes.map((_, index) => index) }],
    nodes,
    meshes,
    materials: Object.entries(MATERIALS).map(([materialName, baseColorFactor]) => ({
      name: `MAT_${materialName.toUpperCase()}`,
      pbrMetallicRoughness: { baseColorFactor, metallicFactor: materialName === "hardware" ? 0.45 : 0, roughnessFactor: materialName === "accent" ? 0.55 : 0.78 },
    })),
    accessors,
    bufferViews,
    buffers: [{ byteLength: align(byteLength) }],
  };
  const jsonChunk = Buffer.from(JSON.stringify(json));
  const jsonPadding = Buffer.alloc(align(jsonChunk.byteLength) - jsonChunk.byteLength, 0x20);
  const binary = Buffer.concat([...chunks, Buffer.alloc(align(byteLength) - byteLength)]);
  const totalLength = 12 + 8 + jsonChunk.byteLength + jsonPadding.byteLength + 8 + binary.byteLength;
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(totalLength, 8);
  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonChunk.byteLength + jsonPadding.byteLength, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4);
  const binaryHeader = Buffer.alloc(8);
  binaryHeader.writeUInt32LE(binary.byteLength, 0);
  binaryHeader.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, jsonHeader, jsonChunk, jsonPadding, binaryHeader, binary]);
}

const courtLines = [
  ["LINE_BaselineSouth", [7.7, 0.025, 0.07], [0, 0.015, -5.8]],
  ["LINE_BaselineNorth", [7.7, 0.025, 0.07], [0, 0.015, 5.8]],
  ["LINE_SidelineWest", [0.07, 0.025, 11.6], [-3.85, 0.015, 0]],
  ["LINE_SidelineEast", [0.07, 0.025, 11.6], [3.85, 0.015, 0]],
  ["LINE_ServiceSouth", [5, 0.025, 0.055], [0, 0.015, -2.1]],
  ["LINE_ServiceNorth", [5, 0.025, 0.055], [0, 0.015, 2.1]],
  ["LINE_CenterSouth", [0.055, 0.025, 2.1], [0, 0.015, -1.05]],
  ["LINE_CenterNorth", [0.055, 0.025, 2.1], [0, 0.015, 1.05]],
].map(([objectName, size, position]) => ({ name: objectName, size, position, material: "line" }));

const assets = [
  ["court.glb", [
    { name: "ENV_Court_Surface", size: [8.2, 0.25, 12.4], position: [0, -0.13, 0], material: "court" },
    ...courtLines,
    { name: "ENV_Net_TopBand", size: [8, 0.06, 0.06], position: [0, 1.07, 0], material: "line" },
    { name: "ENV_Net_Mesh", size: [7.9, 1.07, 0.025], position: [0, 0.535, 0], material: "net" },
    { name: "ENV_Net_PostWest", size: [0.09, 1.18, 0.09], position: [-4, 0.59, 0], material: "hardware" },
    { name: "ENV_Net_PostEast", size: [0.09, 1.18, 0.09], position: [4, 0.59, 0], material: "hardware" },
  ]],
  ["stadium-shell.glb", [
    { name: "ENV_Stadium_BackdropNorth", size: [15, 3.4, 0.3], position: [0, 1.7, 8], material: "hardware" },
    { name: "ENV_Stadium_BackdropSouth", size: [15, 3.4, 0.3], position: [0, 1.7, -8], material: "hardware" },
    { name: "ENV_Stadium_RiserWest", size: [0.7, 1.1, 16], position: [-7.1, 0.55, 0], material: "seating" },
    { name: "ENV_Stadium_RiserEast", size: [0.7, 1.1, 16], position: [7.1, 0.55, 0], material: "seating" },
  ]],
  ["props.glb", [
    { name: "ENV_UmpireChair_Seat", size: [0.55, 0.18, 0.45], position: [4.65, 1.05, 0.35], material: "hardware" },
    { name: "ENV_UmpireChair_Back", size: [0.55, 0.7, 0.09], position: [4.65, 1.55, 0.52], material: "hardware" },
    { name: "ENV_UmpireChair_LegWest", size: [0.08, 1.2, 0.08], position: [4.45, 0.52, 0.35], material: "seating" },
    { name: "ENV_UmpireChair_LegEast", size: [0.08, 1.2, 0.08], position: [4.85, 0.52, 0.35], material: "seating" },
    { name: "ENV_Benches_North", size: [2.3, 0.4, 0.55], position: [-5.15, 0.35, 4.2], material: "seating" },
    { name: "ENV_Benches_South", size: [2.3, 0.4, 0.55], position: [-5.15, 0.35, -4.2], material: "seating" },
  ]],
  ["scoreboard.glb", [
    { name: "ENV_Scoreboard_Frame", size: [2.7, 1.45, 0.16], position: [0, 2.5, 7.76], material: "hardware" },
    { name: "ENV_Scoreboard_Display", size: [2.35, 1.08, 0.03], position: [0, 2.5, 7.64], material: "accent" },
  ]],
];

await mkdir(sourceDirectory, { recursive: true });
for (const [filename, objects] of assets) {
  const target = resolve(sourceDirectory, filename);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, makeGlb({ name: filename, objects }));
}
console.log(`Generated ${assets.length} calibration fixture GLBs in ${sourceDirectory}`);
