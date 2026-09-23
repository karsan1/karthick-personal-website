import { useGLTF } from "@react-three/drei";
import { Component, Suspense, useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import { BufferGeometry, Color, DoubleSide, Float32BufferAttribute, MeshBasicMaterial, Object3D, type InstancedMesh, type Mesh } from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { QualityTier } from "@/store/experienceStore";

type Kind = "audience-spectator-a" | "audience-spectator-b" | "audience-spectator-c" | "chair-umpire";
type Role = "seat" | "chair" | "shirt" | "pants" | "skin" | "hair" | "shoes" | "accent";
type Placement = readonly [number, number, number, number];
const ASSETS: Record<Kind, string> = { "audience-spectator-a": "/models/audience-spectator-a.glb", "audience-spectator-b": "/models/audience-spectator-b.glb", "audience-spectator-c": "/models/audience-spectator-c.glb", "chair-umpire": "/models/chair-umpire.glb" };
const PALETTES: Record<Kind, Record<Role, string>> = {
  "audience-spectator-a": { seat: "#294326", chair: "#294326", shirt: "#d8d0ba", pants: "#6e604b", skin: "#b78062", hair: "#29221f", shoes: "#e9e5d7", accent: "#8d6d47" },
  "audience-spectator-b": { seat: "#294326", chair: "#294326", shirt: "#c7d2c0", pants: "#48546a", skin: "#9c6b50", hair: "#1f1d1d", shoes: "#ebe7da", accent: "#8b8d47" },
  "audience-spectator-c": { seat: "#294326", chair: "#294326", shirt: "#d7cbc0", pants: "#5d5145", skin: "#c0906e", hair: "#302924", shoes: "#ece7da", accent: "#d6d6b0" },
  "chair-umpire": { seat: "#1e3422", chair: "#243d28", shirt: "#ddd9cd", pants: "#c3b79d", skin: "#b78062", hair: "#29221f", shoes: "#efe8d8", accent: "#d4d1a6" },
};
const AUDIENCE: Record<Exclude<Kind, "chair-umpire">, readonly Placement[]> = {
  "audience-spectator-a": [[-4.05, 1.06, 7.12, Math.PI], [-1.5, 1.35, 7.58, Math.PI], [1.42, 1.06, 7.12, Math.PI], [-5.67, 0.9, -3.25, Math.PI / 2]],
  "audience-spectator-b": [[-2.75, 1.06, 7.12, Math.PI], [2.72, 1.35, 7.58, Math.PI], [4.05, 1.06, 7.12, Math.PI], [5.67, 0.9, 3.2, -Math.PI / 2]],
  "audience-spectator-c": [[-1.42, 1.06, 7.12, Math.PI], [0, 1.35, 7.58, Math.PI], [2.75, 1.06, 7.12, Math.PI], [5.67, 0.9, -3.25, -Math.PI / 2]],
};
function role(name: string): Role {
  if (/Seat/.test(name)) return "seat";
  if (/Chair/.test(name)) return "chair";
  if (/Hair/.test(name)) return "hair";
  if (/Shoe/.test(name)) return "shoes";
  if (/Clipboard|Accent|Glasses/.test(name)) return "accent";
  if (/Head|Arm|Leg|Hips/.test(name)) return "skin";
  if (/Torso|Sleeve|Scarf|CapBrim/.test(name)) return "shirt";
  if (/Pants|Shorts/.test(name)) return "pants";
  throw new Error(`Unrecognized venue-cast mesh palette role: ${name}`);
}

/** Static resting poses are flattened to one vertex-colored draw per asset kind. */
function useCastGeometry(kind: Kind) {
  const { scene } = useGLTF(ASSETS[kind], false, true);
  const asset = useMemo(() => {
    scene.updateWorldMatrix(true, true);
    const parts: BufferGeometry[] = [];
    scene.traverse((object) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh) return;
      const source = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
      const geometry = new BufferGeometry();
      geometry.setAttribute("position", source.getAttribute("position").clone());
      const normal = source.getAttribute("normal");
      if (normal) geometry.setAttribute("normal", normal.clone());
      else geometry.computeVertexNormals();
      geometry.applyMatrix4(mesh.matrixWorld);
      const color = new Color(PALETTES[kind][role(mesh.name)]);
      const colors = new Float32Array(geometry.getAttribute("position").count * 3);
      for (let vertex = 0; vertex < colors.length; vertex += 3) {
        colors[vertex] = color.r; colors[vertex + 1] = color.g; colors[vertex + 2] = color.b;
      }
      geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
      source.dispose();
      parts.push(geometry);
    });
    if (!parts.length) throw new Error(`Venue cast GLB has no mesh: ${kind}`);
    const geometry = mergeGeometries(parts, false);
    parts.forEach((part) => part.dispose());
    if (!geometry) throw new Error(`Venue cast GLB cannot be merged: ${kind}`);
    const material = new MeshBasicMaterial({ vertexColors: true, toneMapped: false, fog: false, side: DoubleSide, transparent: false, depthWrite: true });
    return { geometry, material };
  }, [kind, scene]);
  useEffect(() => () => { asset.geometry.dispose(); asset.material.dispose(); }, [asset]);
  return asset;
}

class CastBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
function AudienceVariant({ kind, count }: { kind: Exclude<Kind, "chair-umpire">; count: number }) {
  const { geometry, material } = useCastGeometry(kind);
  const instances = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = instances.current;
    if (!mesh) return;
    const transform = new Object3D();
    AUDIENCE[kind].slice(0, count).forEach(([x, y, z, angle], index) => {
      transform.position.set(x, y, z);
      transform.rotation.set(0, angle, 0);
      transform.updateMatrix();
      mesh.setMatrixAt(index, transform.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [count, kind]);
  return <instancedMesh ref={instances} name={kind} args={[geometry, material, count]} />;
}

/** Cast loads after the stadium and never owns navigation or motion. */
export function VenueCastAudience({ qualityTier }: { qualityTier: QualityTier }) {
  const count = qualityTier === "high" ? 4 : qualityTier === "medium" ? 2 : 1;
  return <group name="venue-audience">{(["audience-spectator-a", "audience-spectator-b", "audience-spectator-c"] as const).map((kind) =>
    <CastBoundary key={kind} fallback={null}><Suspense fallback={null}><AudienceVariant kind={kind} count={count} /></Suspense></CastBoundary>,
  )}</group>;
}
function UmpireModel() {
  const { geometry, material } = useCastGeometry("chair-umpire");
  return <mesh name="chair-umpire" position={[4.85, 0, 0.4]} geometry={geometry} material={material} castShadow />;
}
export function VenueCastUmpire({ fallback, enabled }: { fallback: ReactNode; enabled: boolean }) {
  return enabled ? <CastBoundary fallback={fallback}><Suspense fallback={fallback}><UmpireModel /></Suspense></CastBoundary> : fallback;
}
