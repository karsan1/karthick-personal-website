import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Matrix4, MeshStandardMaterial, type InstancedMesh } from "three";
import { NARRATIVE_CHAPTERS, sampleMatchState, sampleScoreboardEmphasis, type NarrativeChapter, type NarrativeProgress } from "@/animations/prototypeMotion";

type ScoreboardPalette = Record<"dark" | "mid" | "accent" | "purple", MeshStandardMaterial>;
type Score = { sets: readonly [number, number]; points: readonly [string, string]; finished?: boolean };

// One late second-set game supplies a tennis-valid sequence for the chapter beats.
// Karthick served this game; winning it completes a straight-sets match.
export const TENNIS_SCORES = {
  hero: { sets: [5, 4], points: ["0", "0"] },
  about: { sets: [5, 4], points: ["15", "0"] },
  experience: { sets: [5, 4], points: ["15", "15"] },
  research: { sets: [5, 4], points: ["30", "15"] },
  projects: { sets: [5, 4], points: ["30", "30"] },
  capabilities: { sets: [5, 4], points: ["40", "30"] },
  contact: { sets: [6, 4], points: ["-", "-"], finished: true },
} as const satisfies Record<NarrativeChapter, Score>;

// Three-by-five pixels keep the lettering legible in the game camera without
// adding font requests, texture memory, or a draw call per label.
const GLYPHS: Record<string, readonly string[]> = {
  " ": ["000", "000", "000", "000", "000"],
  "-": ["000", "000", "111", "000", "000"],
  "0": ["111", "101", "101", "101", "111"],
  "1": ["010", "110", "010", "010", "111"],
  "2": ["111", "001", "111", "100", "111"],
  "3": ["111", "001", "111", "001", "111"],
  "4": ["101", "101", "111", "001", "001"],
  "5": ["111", "100", "111", "001", "111"],
  "6": ["111", "100", "111", "101", "111"],
  "A": ["010", "101", "111", "101", "101"],
  "C": ["111", "100", "100", "100", "111"],
  "D": ["110", "101", "101", "101", "110"],
  "E": ["111", "100", "110", "100", "111"],
  "F": ["111", "100", "110", "100", "100"],
  "H": ["101", "101", "111", "101", "101"],
  "I": ["111", "010", "010", "010", "111"],
  "J": ["011", "001", "001", "101", "111"],
  "K": ["101", "101", "110", "101", "101"],
  "L": ["100", "100", "100", "100", "111"],
  "M": ["101", "111", "111", "101", "101"],
  "N": ["101", "111", "111", "111", "101"],
  "O": ["111", "101", "101", "101", "111"],
  "P": ["111", "101", "111", "100", "100"],
  "R": ["110", "101", "110", "101", "101"],
  "S": ["111", "100", "111", "001", "111"],
  "T": ["111", "010", "010", "010", "010"],
  "V": ["101", "101", "101", "101", "010"],
  "W": ["101", "101", "111", "111", "101"],
  "Y": ["101", "101", "010", "010", "010"],
};

type Pixel = readonly [number, number, number, number];
const PIXEL_PITCH = 0.037;
const CHARACTER_ADVANCE = 0.154;
const TEXT_Z = 7.405;

function addText(pixels: Pixel[], label: string, x: number, y: number, centered = false) {
  const startX = centered ? x - (label.length * CHARACTER_ADVANCE - 0.043) / 2 : x;
  for (let character = 0; character < label.length; character += 1) {
    const glyph = GLYPHS[label[character]];
    if (!glyph) throw new Error(`Unsupported scoreboard glyph: ${label[character]}`);
    for (let row = 0; row < 5; row += 1) {
      for (let column = 0; column < 3; column += 1) {
        if (glyph[row][column] === "1") pixels.push([startX + character * CHARACTER_ADVANCE + column * PIXEL_PITCH, y - row * PIXEL_PITCH, 0.030, 0.030]);
      }
    }
  }
}

function scorePixels(score: Score): Pixel[] {
  const pixels: Pixel[] = [];
  addText(pixels, "MATCH SCORE", 0, 4.53, true);
  addText(pixels, "S", -2.08, 4.14, true);
  addText(pixels, "PLAYER", -1.87, 4.14);
  addText(pixels, "SET1", 0.22, 4.14, true);
  addText(pixels, "SET2", 1.02, 4.14, true);
  addText(pixels, "PTS", 1.84, 4.14, true);
  addText(pixels, "KARTHICK", -1.87, 3.67);
  addText(pixels, "VISITOR", -1.87, 3.17);
  // A square beside the name is the serve lamp; it turns off when the match ends.
  if (!score.finished) pixels.push([-2.08, 3.60, 0.105, 0.105]);
  addText(pixels, "6", 0.22, 3.67, true);
  addText(pixels, "4", 0.22, 3.17, true);
  addText(pixels, String(score.sets[0]), 1.02, 3.67, true);
  addText(pixels, String(score.sets[1]), 1.02, 3.17, true);
  addText(pixels, score.points[0], 1.84, 3.67, true);
  addText(pixels, score.points[1], 1.84, 3.17, true);
  addText(pixels, score.finished ? "KARTHICK WINS 2-0" : "SELECT FOR PROJECTS", 0, 2.70, true);
  return pixels;
}

const SCOREBOARD_PIXELS = Object.fromEntries(NARRATIVE_CHAPTERS.map((chapter) => [chapter, scorePixels(TENNIS_SCORES[chapter])])) as Record<NarrativeChapter, Pixel[]>;
const MAX_PIXELS = Math.max(...Object.values(SCOREBOARD_PIXELS).map((pixels) => pixels.length));
export const SCOREBOARD_PIXEL_CAPACITY = MAX_PIXELS;

function writeScore(mesh: InstancedMesh, chapter: NarrativeChapter, matrix: Matrix4) {
  const marks = SCOREBOARD_PIXELS[chapter];
  marks.forEach(([x, y, width, height], index) => {
    matrix.makeScale(width, height, 0.025);
    // The gameplay camera looks toward +Z, so world X is screen-right to left.
    matrix.setPosition(-x, y, TEXT_Z);
    mesh.setMatrixAt(index, matrix);
  });
  mesh.count = marks.length;
  mesh.instanceMatrix.needsUpdate = true;
}

export function RetroScoreboard({ palette, progress, reducedMotion }: {
  palette: ScoreboardPalette;
  progress: MutableRefObject<NarrativeProgress>;
  reducedMotion: boolean;
}) {
  const pixels = useRef<InstancedMesh>(null);
  const textMaterial = useMemo(() => new MeshStandardMaterial({ color: "#f5dfa0", emissive: "#f5dfa0", emissiveIntensity: 0.85, toneMapped: false }), []);
  const accent = useRef<MeshStandardMaterial>(textMaterial);
  const matrix = useRef(new Matrix4());
  const lastChapter = useRef<NarrativeChapter | null>(null);

  useEffect(() => () => textMaterial.dispose(), [textMaterial]);

  useFrame(() => {
    accent.current.emissiveIntensity = 0.65 + sampleScoreboardEmphasis(progress.current.value, reducedMotion);
    const chapter = sampleMatchState(progress.current.value).chapter;
    if (chapter !== lastChapter.current && pixels.current) {
      writeScore(pixels.current, chapter, matrix.current);
      lastChapter.current = chapter;
    }
  });

  useLayoutEffect(() => {
    const mesh = pixels.current;
    if (!mesh) return;
    const chapter = sampleMatchState(progress.current.value).chapter;
    writeScore(mesh, chapter, matrix.current);
    lastChapter.current = chapter;
  }, [progress]);

  return <group name="tennis-scoreboard">
    <mesh position={[0, 3.65, 7.7]}><boxGeometry args={[4.8, 2.65, 0.34]} /><primitive object={palette.dark} attach="material" dispose={null} /></mesh>
    <mesh position={[0, 3.65, 7.49]}><boxGeometry args={[4.47, 2.29, 0.07]} /><primitive object={palette.mid} attach="material" dispose={null} /></mesh>
    <mesh position={[0, 4.88, 7.46]}><boxGeometry args={[4.47, 0.07, 0.08]} /><primitive object={palette.purple} attach="material" dispose={null} /></mesh>
    <instancedMesh ref={pixels} args={[undefined, undefined, MAX_PIXELS]}><boxGeometry args={[1, 1, 1]} /><primitive object={textMaterial} attach="material" dispose={null} /></instancedMesh>
  </group>;
}
