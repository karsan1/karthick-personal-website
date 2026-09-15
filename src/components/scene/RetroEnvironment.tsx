import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { InstancedMesh } from "three";
import { Color, Matrix4, MeshStandardMaterial } from "three";
import { COURT_DIMENSIONS, NARRATIVE_CHAPTERS, sampleScoreboardEmphasis, type NarrativeChapter, type NarrativeProgress } from "@/animations/prototypeMotion";
import { useExperienceStore } from "@/store/experienceStore";
import type { QualityTier } from "@/store/experienceStore";
import { SCENE_QUALITY } from "./sceneQuality";
import { WorldHotspot } from "./interactions/WorldHotspot";
import { WORLD_HOTSPOTS } from "./interactions/worldHotspots";

/** Phase 16 keeps the Phase 04 court/rally coordinate contract; venue props stay outside its clearance. */
const COURT_WIDTH = 8.2;
const COURT_LENGTH = 12.4;
const NET_HEIGHT = COURT_DIMENSIONS.netHeight;
type RetroPalette = Record<"grass" | "grassLight" | "grassDark" | "worn" | "light" | "net" | "dark" | "mid" | "accent" | "purple" | "crowdCream", MeshStandardMaterial>;
type InstanceTransform = readonly [number, number, number, number, number, number];

const COURT_LINES: readonly InstanceTransform[] = [
  [0, 0.018, -5.8, 7.7, 0.025, 0.07], [0, 0.018, 5.8, 7.7, 0.025, 0.07],
  [-3.85, 0.018, 0, 0.07, 0.025, 11.6], [3.85, 0.018, 0, 0.07, 0.025, 11.6],
  [0, 0.018, -2.1, 5, 0.025, 0.055], [0, 0.018, 2.1, 5, 0.025, 0.055],
  [0, 0.018, -1.05, 0.055, 0.025, 2.1], [0, 0.018, 1.05, 0.055, 0.025, 2.1],
];
const GRASS_LIGHT_BANDS: readonly InstanceTransform[] = [[0, 0.002, -4.35, 7.98, 0.012, 1.7], [0, 0.002, -0.95, 7.98, 0.012, 1.7], [0, 0.002, 2.45, 7.98, 0.012, 1.7]];
const GRASS_DARK_BANDS: readonly InstanceTransform[] = [[0, 0.002, -2.65, 7.98, 0.012, 1.7], [0, 0.002, 0.75, 7.98, 0.012, 1.7], [0, 0.002, 4.15, 7.98, 0.012, 1.7]];
const WORN_GRASS: readonly InstanceTransform[] = [[0, 0.01, -5.18, 4.7, 0.014, 0.24], [0, 0.01, 5.18, 4.7, 0.014, 0.24], [0, 0.01, -2.1, 2.4, 0.014, 0.16], [0, 0.01, 2.1, 2.4, 0.014, 0.16]];
const SURROUND_BLOCKS: readonly InstanceTransform[] = [[0, 0.42, -6.95, 11.8, 0.84, 0.48], [0, 0.42, 6.95, 11.8, 0.84, 0.48], [-4.65, 0.42, 0, 0.48, 0.84, 13.4], [4.65, 0.42, 0, 0.48, 0.84, 13.4]];
const STAND_BLOCKS: readonly InstanceTransform[] = [[0, 1.15, 8.05, 13.6, 2.3, 1.55], [-6.2, 0.9, 0, 1.2, 1.8, 14.8], [6.2, 0.9, 0, 1.2, 1.8, 14.8]];
const SIGN_BLOCKS: readonly InstanceTransform[] = [[-3.2, 1.2, 6.7, 2.15, 0.42, 0.08], [3.2, 1.2, 6.7, 2.15, 0.42, 0.08], [-5.35, 1.28, 3.85, 0.08, 0.42, 1.8], [5.35, 1.28, -3.85, 0.08, 0.42, 1.8]];
const CROWD_COLORS = ["#e8e0c9", "#293d5c", "#703842", "#3f7670", "#d7bd65", "#5e3f77"] as const;
const crowdColor = new Color();
const SCOREBOARD_SEGMENT_COUNT = 14;
const DIGIT_SEGMENTS: readonly (readonly number[])[] = [[0, 1, 2, 4, 5, 6], [2, 5], [0, 2, 3, 4, 6], [0, 2, 3, 5, 6], [1, 2, 3, 5], [0, 1, 3, 5, 6], [0, 1, 3, 4, 5, 6], [0, 2, 5]] as const;

/** Static Phase 16 structural accounting, excluding loaded player GLBs and rally actors. */
export const RETRO_ENVIRONMENT_METRICS = { drawCalls: 32, drawCallCeiling: 34, materialInstances: 11, instancedGroups: 11, instances: 8 + 6 + 4 + 2 + 4 + 3 + 4 + SCOREBOARD_SEGMENT_COUNT + 32 + 48 } as const;

function applyInstances(mesh: InstancedMesh, transforms: readonly InstanceTransform[]) {
  const matrix = new Matrix4();
  transforms.forEach(([x, y, z, width, height, depth], index) => { matrix.makeScale(width, height, depth); matrix.setPosition(x, y, z); mesh.setMatrixAt(index, matrix); });
  mesh.instanceMatrix.needsUpdate = true;
}

function StaticBlocks({ transforms, material }: { transforms: readonly InstanceTransform[]; material: MeshStandardMaterial }) {
  const mesh = useRef<InstancedMesh>(null);
  useLayoutEffect(() => { if (mesh.current) applyInstances(mesh.current, transforms); }, [transforms]);
  return <instancedMesh ref={mesh} args={[undefined, undefined, transforms.length]}><boxGeometry args={[1, 1, 1]} /><primitive object={material} attach="material" dispose={null} /></instancedMesh>;
}

function RetroNet({ palette }: { palette: RetroPalette }) {
  const posts = useRef<InstancedMesh>(null);
  useLayoutEffect(() => { if (posts.current) applyInstances(posts.current, [[-4, NET_HEIGHT / 2, 0, 1, 1, 1], [4, NET_HEIGHT / 2, 0, 1, 1, 1]]); }, []);
  return <group>
    <mesh position={[0, NET_HEIGHT, 0]}><boxGeometry args={[8, 0.08, 0.1]} /><primitive object={palette.light} attach="material" dispose={null} /></mesh>
    <mesh position={[0, NET_HEIGHT / 2, 0]}><planeGeometry args={[7.9, NET_HEIGHT, 8, 2]} /><primitive object={palette.net} attach="material" dispose={null} /></mesh>
    <instancedMesh ref={posts} args={[undefined, undefined, 2]}><cylinderGeometry args={[0.065, 0.08, NET_HEIGHT * 1.14, 6]} /><primitive object={palette.dark} attach="material" dispose={null} /></instancedMesh>
  </group>;
}

function RetroCourt({ palette }: { palette: RetroPalette }) {
  return <group>
    <mesh receiveShadow position={[0, -0.13, 0]}><boxGeometry args={[COURT_WIDTH, 0.25, COURT_LENGTH]} /><primitive object={palette.grass} attach="material" dispose={null} /></mesh>
    <StaticBlocks transforms={GRASS_LIGHT_BANDS} material={palette.grassLight} /><StaticBlocks transforms={GRASS_DARK_BANDS} material={palette.grassDark} /><StaticBlocks transforms={WORN_GRASS} material={palette.worn} />
    <StaticBlocks transforms={COURT_LINES} material={palette.light} /><RetroNet palette={palette} />
  </group>;
}

function RetroScoreboard({ palette, progress, reducedMotion }: { palette: RetroPalette; progress: MutableRefObject<NarrativeProgress>; reducedMotion: boolean }) {
  const digits = useRef<InstancedMesh>(null); const accent = useRef<MeshStandardMaterial>(palette.accent); const activeChapter = useExperienceStore((state) => state.activeChapter);
  useFrame(() => { accent.current.emissiveIntensity = sampleScoreboardEmphasis(progress.current.value, reducedMotion); });
  useLayoutEffect(() => {
    const mesh = digits.current; if (!mesh) return; const matrix = new Matrix4(); const chapterNumber = Math.max(1, NARRATIVE_CHAPTERS.indexOf(activeChapter as NarrativeChapter) + 1); let instance = 0;
    [0, chapterNumber].forEach((value, digitIndex) => { const enabled = new Set(DIGIT_SEGMENTS[value] ?? DIGIT_SEGMENTS[0]); const centerX = digitIndex === 0 ? -0.62 : 0.62;
      for (let segment = 0; segment < 7; segment += 1) { const horizontal = segment === 0 || segment === 3 || segment === 6; const localX = horizontal ? 0 : segment === 1 || segment === 4 ? -0.22 : 0.22; const localY = segment === 0 ? 0.42 : segment === 3 ? 0 : segment === 6 ? -0.42 : segment < 3 ? 0.22 : -0.22; const visible = enabled.has(segment); matrix.makeScale(visible ? (horizontal ? 0.36 : 0.08) : 0, visible ? (horizontal ? 0.08 : 0.36) : 0, 0.06); matrix.setPosition(centerX + localX, 3.6 + localY, 7.5); mesh.setMatrixAt(instance, matrix); instance += 1; }
    }); mesh.instanceMatrix.needsUpdate = true;
  }, [activeChapter]);
  return <group><mesh position={[0, 3.6, 7.7]}><boxGeometry args={[4.5, 2.05, 0.34]} /><primitive object={palette.dark} attach="material" dispose={null} /></mesh><mesh position={[0, 3.6, 7.52]}><boxGeometry args={[3.9, 1.42, 0.08]} /><primitive object={palette.mid} attach="material" dispose={null} /></mesh><mesh position={[0, 4.72, 7.51]}><boxGeometry args={[2.45, 0.11, 0.09]} /><primitive object={palette.purple} attach="material" dispose={null} /></mesh><instancedMesh ref={digits} args={[undefined, undefined, SCOREBOARD_SEGMENT_COUNT]}><boxGeometry args={[1, 1, 1]} /><primitive object={palette.accent} attach="material" dispose={null} /></instancedMesh></group>;
}

function VenueStations({ palette, progress, reducedMotion }: { palette: RetroPalette; progress: MutableRefObject<NarrativeProgress>; reducedMotion: boolean }) {
  return <group name="venue-stations">
    <WorldHotspot {...WORLD_HOTSPOTS.experienceBench} hitArea={[2.2, 1.5, 1.45]} hitPosition={[-5.15, 0.72, -2.7]}><group><mesh position={[-5.15, 0.64, -2.7]}><boxGeometry args={[1.65, 0.18, 0.42]} /><primitive object={palette.dark} attach="material" dispose={null} /></mesh><mesh position={[-5.15, 0.28, -2.7]}><boxGeometry args={[1.4, 0.55, 0.08]} /><primitive object={palette.mid} attach="material" dispose={null} /></mesh><mesh position={[-5.78, 0.3, -2.32]}><boxGeometry args={[0.48, 0.46, 0.48]} /><primitive object={palette.purple} attach="material" dispose={null} /></mesh></group></WorldHotspot>
    <WorldHotspot {...WORLD_HOTSPOTS.resumeClipboard} hitArea={[0.75, 1.2, 0.48]} hitPosition={[-4.2, 1.16, -3.75]}><mesh position={[-4.2, 1.16, -3.75]} rotation={[0, 0, -0.22]}><boxGeometry args={[0.48, 0.72, 0.1]} /><primitive object={palette.light} attach="material" dispose={null} /></mesh></WorldHotspot>
    <WorldHotspot {...WORLD_HOTSPOTS.researchChair} hitArea={[1.35, 2.6, 1.15]} hitPosition={[4.85, 1.1, 0.4]}><group><mesh position={[4.85, 1.15, 0.4]}><boxGeometry args={[0.62, 0.2, 0.48]} /><primitive object={palette.dark} attach="material" dispose={null} /></mesh><mesh position={[4.85, 1.66, 0.58]} rotation={[0.18, 0, 0]}><boxGeometry args={[0.62, 0.76, 0.1]} /><primitive object={palette.dark} attach="material" dispose={null} /></mesh><mesh position={[4.85, 0.5, 0.4]}><boxGeometry args={[0.42, 1.05, 0.12]} /><primitive object={palette.mid} attach="material" dispose={null} /></mesh><mesh position={[4.85, 1.95, 0.25]} rotation={[0.18, 0, 0]}><boxGeometry args={[0.44, 0.28, 0.07]} /><primitive object={palette.light} attach="material" dispose={null} /></mesh></group></WorldHotspot>
    <WorldHotspot {...WORLD_HOTSPOTS.capabilitiesRack} hitArea={[1.8, 1.7, 1.35]} hitPosition={[-5.1, 0.85, 2.8]}><group><mesh position={[-5.1, 0.82, 2.8]}><boxGeometry args={[1.25, 1.35, 0.28]} /><primitive object={palette.dark} attach="material" dispose={null} /></mesh><mesh position={[-5.42, 1.16, 2.55]} rotation={[0, 0, 0.38]}><boxGeometry args={[0.08, 1.05, 0.08]} /><primitive object={palette.light} attach="material" dispose={null} /></mesh><mesh position={[-4.86, 1.16, 2.55]} rotation={[0, 0, -0.38]}><boxGeometry args={[0.08, 1.05, 0.08]} /><primitive object={palette.light} attach="material" dispose={null} /></mesh><mesh position={[-5.1, 0.25, 3.16]}><boxGeometry args={[0.66, 0.42, 0.42]} /><primitive object={palette.purple} attach="material" dispose={null} /></mesh></group></WorldHotspot>
    <WorldHotspot {...WORLD_HOTSPOTS.contactTunnel} hitArea={[2.4, 2.5, 1.25]} hitPosition={[4.3, 1.25, 7.15]}><group><mesh position={[4.3, 1.25, 7.2]}><boxGeometry args={[2.2, 2.45, 0.7]} /><primitive object={palette.dark} attach="material" dispose={null} /></mesh><mesh position={[4.3, 1.18, 6.83]}><boxGeometry args={[1.34, 1.5, 0.06]} /><primitive object={palette.mid} attach="material" dispose={null} /></mesh><mesh position={[4.3, 2.35, 6.77]}><boxGeometry args={[1.78, 0.12, 0.08]} /><primitive object={palette.accent} attach="material" dispose={null} /></mesh></group></WorldHotspot>
    <WorldHotspot {...WORLD_HOTSPOTS.projectsScoreboard} hitArea={[5.1, 2.7, 1.15]} hitPosition={[0, 3.6, 7.55]}><RetroScoreboard palette={palette} progress={progress} reducedMotion={reducedMotion} /></WorldHotspot>
  </group>;
}

function StadiumShell({ palette, detail }: { palette: RetroPalette; detail: number }) {
  const seats = useRef<InstancedMesh>(null); const crowd = useRef<InstancedMesh>(null);
  const crowdRows = detail >= 3 ? 3 : 2;
  const crowdCount = crowdRows * 16;
  useLayoutEffect(() => { if (seats.current) { const transforms: InstanceTransform[] = []; for (let row = 0; row < 4; row += 1) for (let column = 0; column < 8; column += 1) transforms.push([(column - 3.5) * 0.68, 1.2 + row * 0.28, 7.48 + row * 0.2, 0.56, 0.16, 0.34]); applyInstances(seats.current, transforms); } if (crowd.current) { const transforms: InstanceTransform[] = []; for (let row = 0; row < crowdRows; row += 1) for (let column = 0; column < 16; column += 1) transforms.push([(column - 7.5) * 0.39, 1.58 + row * 0.28, 7.2 + row * 0.24, 0.24, 0.34, 0.18]); applyInstances(crowd.current, transforms); for (let index = 0; index < crowdCount; index += 1) { crowdColor.set(CROWD_COLORS[index % CROWD_COLORS.length]); crowd.current.setColorAt(index, crowdColor); } if (crowd.current.instanceColor) crowd.current.instanceColor.needsUpdate = true; } }, [crowdCount, crowdRows]);
  return <group><StaticBlocks transforms={SURROUND_BLOCKS} material={palette.dark} /><StaticBlocks transforms={STAND_BLOCKS} material={palette.mid} /><StaticBlocks transforms={SIGN_BLOCKS} material={palette.purple} />{detail >= 2 ? <><instancedMesh ref={seats} args={[undefined, undefined, 32]}><boxGeometry args={[1, 1, 1]} /><primitive object={palette.light} attach="material" dispose={null} /></instancedMesh><instancedMesh ref={crowd} args={[undefined, undefined, crowdCount]}><dodecahedronGeometry args={[0.5, 0]} /><primitive object={palette.crowdCream} attach="material" dispose={null} /></instancedMesh></> : null}</group>;
}

/** Court mounts immediately; every tier retains the seven station silhouettes. */
export function RetroEnvironment({ progress, qualityTier, reducedMotion }: { progress: MutableRefObject<NarrativeProgress>; qualityTier: QualityTier; reducedMotion: boolean }) {
  const [stage, setStage] = useState(0); const detail = SCENE_QUALITY[qualityTier].environmentDetail;
  const palette = useMemo<RetroPalette>(() => ({ grass: new MeshStandardMaterial({ color: "#557a3d", flatShading: true, roughness: 0.95 }), grassLight: new MeshStandardMaterial({ color: "#668a49", flatShading: true, roughness: 0.95 }), grassDark: new MeshStandardMaterial({ color: "#476b35", flatShading: true, roughness: 0.95 }), worn: new MeshStandardMaterial({ color: "#8b8a5a", flatShading: true, roughness: 0.96 }), light: new MeshStandardMaterial({ color: "#f4f1e7", roughness: 0.8 }), net: new MeshStandardMaterial({ color: "#18211d", wireframe: true, transparent: true, opacity: 0.72, roughness: 0.9 }), dark: new MeshStandardMaterial({ color: "#154734", flatShading: true, roughness: 0.9 }), mid: new MeshStandardMaterial({ color: "#1e5a40", flatShading: true, roughness: 0.88 }), accent: new MeshStandardMaterial({ color: "#d7bd65", emissive: "#5a4b18", emissiveIntensity: 0.3, flatShading: true, roughness: 0.7 }), purple: new MeshStandardMaterial({ color: "#5e3f77", flatShading: true, roughness: 0.84 }), crowdCream: new MeshStandardMaterial({ color: "#ffffff", vertexColors: true, flatShading: true, roughness: 0.9 }) }), []);
  useEffect(() => () => { Object.values(palette).forEach((material) => material.dispose()); }, [palette]);
  useLayoutEffect(() => { let frame = window.requestAnimationFrame(() => { setStage(1); frame = window.requestAnimationFrame(() => setStage(2)); }); return () => window.cancelAnimationFrame(frame); }, []);
  return <group name="retro-environment"><RetroCourt palette={palette} /><VenueStations palette={palette} progress={progress} reducedMotion={reducedMotion} />{stage >= 1 ? <StadiumShell palette={palette} detail={detail} /> : null}</group>;
}
