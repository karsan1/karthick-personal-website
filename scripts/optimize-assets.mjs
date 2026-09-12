import { mkdir, mkdtemp, readdir, rm, stat, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = resolve(import.meta.dirname, "..");
const useFixture = process.argv.includes("--fixture");
const source = resolve(root, useFixture ? "assets-source/fixtures/calibration-glb" : "assets-source/blender-exports");
const destination = resolve(root, "public/models");
const transform = resolve(root, "node_modules/.bin/gltf-transform");
const budgetBytes = { "court.glb": 100_000, "stadium-shell.glb": 100_000, "props.glb": 100_000, "scoreboard.glb": 60_000 };

async function transformAsset(input, output, workspace) {
  await run(transform, ["inspect", input], { cwd: root });
  const stages = ["prune", "dedup", "weld", "meshopt"];
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

await mkdir(destination, { recursive: true });
const workspace = await mkdtemp(join(tmpdir(), "tennis-assets-"));
try {
  const files = (await readdir(source)).filter((file) => file.endsWith(".glb")).sort();
  const assets = [];
  for (const file of files) {
    const sourcePath = resolve(source, file);
    const targetPath = resolve(destination, file);
    const before = await stat(sourcePath);
    const budget = budgetBytes[file];
    if (!budget) throw new Error(`No byte budget for ${file}.`);
    await transformAsset(sourcePath, targetPath, workspace);
    const after = await stat(targetPath);
    if (after.size > budget) throw new Error(`${file} exceeds its ${budget} byte budget after optimization.`);
    assets.push({ file, sourceBytes: before.size, optimizedBytes: after.size, budgetBytes: budget, texturePolicy: "No raster textures; PBR base-color materials only." });
  }
  await writeFile(resolve(destination, "asset-manifest.json"), `${JSON.stringify({
    schemaVersion: 2,
    sourceKind: useFixture ? "calibration-fixture" : "blender-export",
    coordinateSystem: "Y-up glTF; court center [0, 0, 0]; +Z is north baseline; 8.2m x 12.4m outer court.",
    optimization: ["inspect", "prune", "dedup", "weld", "meshopt"],
    compression: { meshopt: true, encoder: "@gltf-transform/cli 4.5.0", level: "high", runtime: "Drei useGLTF MeshoptDecoder" },
    textureWorkflow: { ktx2: false, reason: "This phase contains no raster textures. Add KTX2/Basis only with an authored texture and visual comparison." },
    assets,
  }, null, 2)}\n`);
  console.log(`Optimized ${assets.length} ${useFixture ? "calibration fixture" : "Blender export"} asset(s) with prune, dedup, weld, and Meshopt.`);
} finally {
  await rm(workspace, { recursive: true, force: true });
}
