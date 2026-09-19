import { mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = resolve(import.meta.dirname, "..");
const useFixture = process.argv.includes("--fixture");
const characterSourceKindArg = process.argv.find((argument) => argument.startsWith("--character-source-kind="));
const characterSourceKind = characterSourceKindArg?.split("=", 2)[1] ?? "blockbench-calibration-fixture";
if (!["blockbench-calibration-fixture", "blockbench-export"].includes(characterSourceKind)) {
  throw new Error("--character-source-kind must be blockbench-calibration-fixture or blockbench-export.");
}
const destination = resolve(root, "public/models");
const transform = resolve(root, "node_modules/.bin/gltf-transform");
const sourceDirectories = useFixture
  ? [
    { path: resolve(root, "assets-source/fixtures/calibration-glb"), sourceKind: "calibration-fixture", assetKind: "environment" },
    { path: resolve(root, "assets-source/blockbench-exports"), sourceKind: "blockbench-calibration-fixture", assetKind: "character" },
  ]
  : [
    { path: resolve(root, "assets-source/blender-exports"), sourceKind: "blender-export", assetKind: "environment" },
    { path: resolve(root, "assets-source/blockbench-exports"), sourceKind: characterSourceKind, assetKind: "character" },
  ];
const budgetBytes = { "court.glb": 100_000, "stadium-shell.glb": 100_000, "props.glb": 100_000, "scoreboard.glb": 60_000, "player-a.glb": 80_000, "player-b.glb": 80_000 };

async function transformAsset(input, output, workspace, assetKind) {
  await run(transform, ["inspect", input], { cwd: root });
  // Weld can alter vertex ordering/weights at a skinned seam. Character assets
  // intentionally stop at prune + dedup + Meshopt until a reviewed export proves
  // it safe; static Phase 04 environment partitions retain their established path.
  const stages = assetKind === "character" ? ["prune", "dedup", "meshopt"] : ["prune", "dedup", "weld", "meshopt"];
  let current = input;
  for (const [index, command] of stages.entries()) {
    const next = index === stages.length - 1 ? output : join(workspace, `${basename(input, ".glb")}-${command}.glb`);
    const args = command === "meshopt"
      ? [command, current, next, "--level", "high", "--quantize-position", "14", "--quantize-normal", "10"]
      : [command, current, next];
    await run(transform, args, { cwd: root });
    current = next;
  }
}

async function inspectTexturePolicy(path, sourceKind) {
  const buffer = await readFile(path);
  const json = JSON.parse(buffer.subarray(20, 20 + buffer.readUInt32LE(12)).toString("utf8").trim());
  if (!json.images?.length) return "No raster textures; PBR base-color materials only.";
  if (sourceKind !== "blockbench-export") throw new Error(`${basename(path)} has textures but is not a reviewed blockbench-export.`);
  return "Reviewed palette atlas only: 64/128/256px, nearest-or-linear sampler, base-color/emissive sRGB use.";
}

async function inspectAnimationClips(path) {
  const buffer = await readFile(path);
  const json = JSON.parse(buffer.subarray(20, 20 + buffer.readUInt32LE(12)).toString("utf8").trim());
  return (json.animations ?? []).map((animation) => animation.name);
}

/**
 * `--character-source-kind=blockbench-export` is a provenance assertion, not a
 * convenient label switch. Keep the deliberately generated calibration pair
 * from being promoted by accident while still allowing a human-authored source
 * to use the same deterministic build path.
 *
 * This is intentionally a narrow, inspectable gate rather than an attempt to
 * prove artistic quality in code. Visual approval remains a human review step.
 */
async function assertReviewedCharacterSources(sources) {
  if (characterSourceKind !== "blockbench-export") return;

  for (const source of sources.filter((candidate) => candidate.assetKind === "character")) {
    const modelPath = resolve(root, "assets-source/blockbench", `${basename(source.file, ".glb")}.bbmodel`);
    const [modelText, glb] = await Promise.all([readFile(modelPath, "utf8"), readFile(resolve(source.path, source.file))]);
    const model = JSON.parse(modelText);
    const json = JSON.parse(glb.subarray(20, 20 + glb.readUInt32LE(12)).toString("utf8").trim());
    const modelName = String(model.name ?? "");
    const generator = String(json.asset?.generator ?? "");

    if (/calibration|fixture/i.test(modelName) || !Array.isArray(model.elements) || model.elements.length === 0) {
      throw new Error(`${source.file} cannot be promoted: ${basename(modelPath)} is still a calibration template. Replace it with the approved authored .bbmodel first.`);
    }
    if (/calibration|fixture/i.test(generator)) {
      throw new Error(`${source.file} cannot be promoted: its GLB generator identifies it as a calibration fixture. Export the approved Blockbench source directly.`);
    }
  }
}

await mkdir(destination, { recursive: true });
const workspace = await mkdtemp(join(tmpdir(), "tennis-assets-"));
try {
  const sources = (await Promise.all(sourceDirectories.map(async (source) => (await readdir(source.path))
    .filter((file) => file.endsWith(".glb"))
    .map((file) => ({ ...source, file })))))
    .flat()
    .sort((left, right) => left.file.localeCompare(right.file));
  await assertReviewedCharacterSources(sources);
  const assets = [];
  for (const source of sources) {
    const sourcePath = resolve(source.path, source.file);
    const targetPath = resolve(destination, source.file);
    const before = await stat(sourcePath);
    const budget = budgetBytes[source.file];
    if (!budget) throw new Error(`No byte budget for ${source.file}.`);
    await transformAsset(sourcePath, targetPath, workspace, source.assetKind);
    const after = await stat(targetPath);
    if (after.size > budget) throw new Error(`${source.file} exceeds its ${budget} byte budget after optimization.`);
    assets.push({ file: source.file, sourceKind: source.sourceKind, assetKind: source.assetKind, sourceBytes: before.size, optimizedBytes: after.size, budgetBytes: budget, texturePolicy: await inspectTexturePolicy(targetPath, source.sourceKind), ...(source.assetKind === "character" ? { animationClips: await inspectAnimationClips(targetPath), rootMotion: "in-place; CHAR_*_Root and SOCKET_Racket are not animation targets" } : {}), optimization: source.assetKind === "character" ? ["inspect", "prune", "dedup", "meshopt"] : ["inspect", "prune", "dedup", "weld", "meshopt"] });
  }
  await writeFile(resolve(destination, "asset-manifest.json"), `${JSON.stringify({
    schemaVersion: 4,
    sourceKinds: [...new Set(assets.map((asset) => asset.sourceKind))],
    coordinateSystem: "Y-up glTF; court center [0, 0, 0]; +Z is north baseline; 8.2m x 12.4m outer court.",
    optimization: "Per-asset; character assets never run weld automatically.",
    compression: { meshopt: true, encoder: "@gltf-transform/cli 4.5.0", level: "high", runtime: "Drei useGLTF MeshoptDecoder" },
    textureWorkflow: assets.some((asset) => asset.texturePolicy.startsWith("Reviewed palette atlas"))
      ? { ktx2: false, rasterTextures: "Reviewed 64/128/256px PNG palette atlases on genuine blockbench-export player assets only.", reason: "KTX2/Basis remains disabled pending a visual comparison." }
      : { ktx2: false, rasterTextures: "None; all current exports are texture-free.", reason: "Add KTX2/Basis only with an authored texture and visual comparison." },
    assets,
  }, null, 2)}\n`);
  console.log(`Optimized ${assets.length} asset(s); character exports use conservative prune, dedup, and Meshopt without weld.`);
} finally {
  await rm(workspace, { recursive: true, force: true });
}
