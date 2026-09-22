import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { Box3, Matrix4, Quaternion, Vector3 } from "three";

const root = resolve(import.meta.dirname, "..");
const files = ["player-a.glb", "player-b.glb"];

function inspectGlb(buffer) {
  if (buffer.readUInt32LE(0) !== 0x46546c67 || buffer.readUInt32LE(4) !== 2) {
    throw new Error("Not a GLB 2.0 file.");
  }
  const jsonLength = buffer.readUInt32LE(12);
  return JSON.parse(buffer.subarray(20, 20 + jsonLength).toString("utf8").trim());
}

function decodedBounds(accessor) {
  if (!accessor.normalized) return [accessor.min, accessor.max];
  const divisor =
    accessor.componentType === 5122 ? 32767 :
    accessor.componentType === 5120 ? 127 :
    accessor.componentType === 5123 ? 65535 :
    accessor.componentType === 5121 ? 255 : 1;
  return [
    accessor.min.map((value) => value / divisor),
    accessor.max.map((value) => value / divisor),
  ];
}

function localMatrix(node) {
  if (node.matrix) return new Matrix4().fromArray(node.matrix);
  const position = new Vector3().fromArray(node.translation ?? [0, 0, 0]);
  const quaternion = new Quaternion().fromArray(node.rotation ?? [0, 0, 0, 1]);
  const scale = new Vector3().fromArray(node.scale ?? [1, 1, 1]);
  return new Matrix4().compose(position, quaternion, scale);
}

function primitiveBox(json, primitive) {
  const accessor = json.accessors?.[primitive.attributes?.POSITION];
  if (!accessor?.min || !accessor?.max) return null;
  const [min, max] = decodedBounds(accessor);
  return new Box3(new Vector3(...min), new Vector3(...max));
}

function transformedBox(box, matrix) {
  const out = new Box3();
  for (const x of [box.min.x, box.max.x]) {
    for (const y of [box.min.y, box.max.y]) {
      for (const z of [box.min.z, box.max.z]) {
        out.expandByPoint(new Vector3(x, y, z).applyMatrix4(matrix));
      }
    }
  }
  return out;
}

export function worldBounds(json) {
  const parent = new Map();
  json.nodes?.forEach((node, index) => node.children?.forEach((child) => parent.set(child, index)));

  const worldMatrices = new Map();
  function getWorld(index) {
    if (worldMatrices.has(index)) return worldMatrices.get(index);
    const local = localMatrix(json.nodes[index]);
    const p = parent.get(index);
    const world = p === undefined ? local : getWorld(p).clone().multiply(local);
    worldMatrices.set(index, world);
    return world;
  }

  const total = new Box3();
  json.nodes?.forEach((node, index) => {
    if (node.mesh === undefined) return;
    const mesh = json.meshes?.[node.mesh];
    for (const primitive of mesh?.primitives ?? []) {
      const box = primitiveBox(json, primitive);
      if (box) total.union(transformedBox(box, getWorld(index)));
    }
  });
  return total;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  for (const file of files) {
    const path = resolve(root, "public/models", file);
    const json = inspectGlb(await readFile(path));
    const box = worldBounds(json);
    const size = new Vector3();
    box.getSize(size);
    console.log(file);
    console.log(`  min: ${box.min.toArray().map((n) => n.toFixed(3)).join(", ")}`);
    console.log(`  max: ${box.max.toArray().map((n) => n.toFixed(3)).join(", ")}`);
    console.log(`  size: ${size.toArray().map((n) => n.toFixed(3)).join(" × ")}`);
    console.log(`  height: ${size.y.toFixed(3)} world units`);
  }
}
