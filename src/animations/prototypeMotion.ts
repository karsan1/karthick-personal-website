import { CubicBezierCurve3, Vector3 } from "three";

export type NarrativeProgress = {
  value: number;
};

export type Shot = {
  id: string;
  start: number;
  end: number;
  curve: CubicBezierCurve3;
  bounceAt?: number;
};

type CameraKeyframe = {
  progress: number;
  position: Vector3;
  target: Vector3;
  fov: number;
  /** A short, still-continuous game-camera angle change. */
  transition?: "gameplay" | "soft-cut";
};

export type CameraComposition = "desktop" | "tablet" | "mobile" | "reduced";

export const NARRATIVE_CHAPTERS = [
  "hero", "about", "experience", "research", "projects", "capabilities", "contact",
] as const;
export type NarrativeChapter = (typeof NARRATIVE_CHAPTERS)[number];

export type MatchState = {
  chapter: NarrativeChapter;
  scoreboard: string;
  playerState: "serve" | "rally" | "ready" | "between-points" | "match-point";
  ballState: "toss" | "in-play" | "settled" | "final-exchange";
};

/**
 * World-space contract for the primitive court. The net lies on Z = 0;
 * player A starts at negative Z and player B at positive Z. Units are meters.
 */
export const COURT_DIMENSIONS = {
  width: 8,
  length: 12,
  netHeight: 1.05,
  markedBaselineZ: 5.8,
  playerBaselineZ: 6.45,
} as const;

export const PROTOTYPE_LABELS = {
  heroIdle: 0,
  serveToss: 0.08,
  serveContact: 0.14,
  firstBounce: 0.24,
  playerBReturn: 0.33,
  secondBounce: 0.4,
  playerAReturn: 0.45,
  // Research begins at 0.50: every live rally/clip beat has resolved by then.
  contentPause: 0.5,
  finalExchange: 0.82,
  prototypeEnd: 1,
} as const;

/**
 * Stable source-clip contact positions. These are normalized clip times, not
 * narrative progress: the runtime maps them to `CHARACTER_NARRATIVE_BEATS`
 * before converting them to an AnimationMixer action time.
 */
export const PLAYER_CLIP_CONTACTS = {
  serve: 0.72,
  forehand: 0.5,
  backhand: 0.48,
} as const;

export type CharacterSide = "a" | "b";
export type CharacterClip = "idle_ready" | "recovery" | keyof typeof PLAYER_CLIP_CONTACTS;
export type CharacterNarrativeClip = keyof typeof PLAYER_CLIP_CONTACTS;

export type CharacterNarrativeBeat = {
  id: "player-a-serve" | "player-b-return" | "player-a-return";
  side: CharacterSide;
  clip: CharacterNarrativeClip;
  start: number;
  end: number;
  contactProgress: number;
};

export type CharacterRecoveryBeat = {
  id: "player-a-serve-recovery" | "player-b-return-recovery";
  side: CharacterSide;
  clip: "recovery";
  start: number;
  end: number;
};

export type CharacterMotionBeat = CharacterNarrativeBeat | CharacterRecoveryBeat;

/** Mutable caller-owned target; using it keeps frame sampling allocation-free. */
export type CharacterNarrativeSample = {
  clip: CharacterClip;
  localProgress: number;
  /** Defined only for a shot clip; hand to the stepped mixer-time helper. */
  contactLocalProgress?: number;
  active: boolean;
};

/** Mutable caller-owned transform target for application-owned character roots. */
export type CharacterRootTransformSample = {
  positionX: number;
  positionY: number;
  positionZ: number;
  rotationY: number;
  rotationZ: number;
  scaleY: number;
};

/**
 * Character-only sampling runs at this intentionally low rate. Ball, camera,
 * and GSAP master progress remain smooth. The runtime may opt out for clip
 * review, but should not change this value per actor.
 */
export type CharacterAnimationCadence = 12 | 15 | 18 | "smooth";

/** Production default; review can select another approved cadence without changing narrative timing. */
export const CHARACTER_ANIMATION_FPS: Exclude<CharacterAnimationCadence, "smooth"> = 15;

const CHARACTER_ANIMATION_CADENCES = new Set<CharacterAnimationCadence>([12, 15, 18, "smooth"]);

/**
 * Limits the review surface to the four intentional presentation modes. This
 * value controls only authored mixer-time quantization; GSAP progress, ball,
 * and camera continue to sample their existing smooth paths.
 */
export function resolveCharacterAnimationCadence(
  value: string | number | null | undefined,
): CharacterAnimationCadence {
  const normalized = typeof value === "string" ? value.toLowerCase() : value;
  if (normalized === "smooth") return normalized;

  const fps = typeof normalized === "number" ? normalized : Number(normalized);
  return CHARACTER_ANIMATION_CADENCES.has(fps as CharacterAnimationCadence)
    ? fps as Exclude<CharacterAnimationCadence, "smooth">
    : CHARACTER_ANIMATION_FPS;
}

/**
 * Optional URL review seam: `?characterFps=12`, `15`, `18`, or `smooth`.
 * It is read once by the character controller and has no effect outside the
 * authored character clips.
 */
export function readCharacterAnimationCadence() {
  if (typeof window === "undefined") return CHARACTER_ANIMATION_FPS;
  return resolveCharacterAnimationCadence(new URLSearchParams(window.location.search).get("characterFps"));
}

/**
 * Accepted ball/racket contact contract:
 * - serve: Player A's `serve` reaches local 0.72 at serveContact (0.14);
 * - return B: Player B's `forehand` reaches local 0.50 at playerBReturn (0.33);
 * - return A: Player A's `backhand` reaches local 0.48 at playerAReturn (0.45).
 *
 * The sampler maps every shot range from local 0 to 1 in two segments split at
 * its contact. Therefore `PLAYER_CLIP_CONTACTS[beat.clip]` is authoritative;
 * no actor needs a second local contact or endpoint value. Ranges are start
 * inclusive/end exclusive so a shared boundary always enters its next pose.
 */
export const CHARACTER_NARRATIVE_BEATS: readonly CharacterMotionBeat[] = [
  {
    id: "player-a-serve",
    side: "a",
    clip: "serve",
    start: PROTOTYPE_LABELS.serveToss,
    end: PROTOTYPE_LABELS.firstBounce,
    contactProgress: PROTOTYPE_LABELS.serveContact,
  },
  {
    id: "player-a-serve-recovery",
    side: "a",
    clip: "recovery",
    start: PROTOTYPE_LABELS.firstBounce,
    end: PROTOTYPE_LABELS.secondBounce,
  },
  {
    id: "player-b-return",
    side: "b",
    clip: "forehand",
    start: PROTOTYPE_LABELS.firstBounce,
    end: PROTOTYPE_LABELS.secondBounce,
    contactProgress: PROTOTYPE_LABELS.playerBReturn,
  },
  {
    id: "player-b-return-recovery",
    side: "b",
    clip: "recovery",
    start: PROTOTYPE_LABELS.secondBounce,
    end: PROTOTYPE_LABELS.contentPause,
  },
  {
    id: "player-a-return",
    side: "a",
    clip: "backhand",
    start: PROTOTYPE_LABELS.secondBounce,
    end: PROTOTYPE_LABELS.contentPause,
    contactProgress: PROTOTYPE_LABELS.playerAReturn,
  },
] as const;

const ballAtRest = new Vector3(0, 1.25, -COURT_DIMENSIONS.playerBaselineZ);
const PLAYER_CONTACT_Z = COURT_DIMENSIONS.playerBaselineZ - 0.25;
const PLAYER_APPROACH_Z = COURT_DIMENSIONS.playerBaselineZ - 0.45;

/**
 * Discrete game states intentionally share the normalized master range used by
 * the DOM chapters. They are data, rather than another scrolling timeline.
 */
const MATCH_STATES: readonly (MatchState & { start: number })[] = [
  { start: 0, chapter: "hero", scoreboard: "00 · 00", playerState: "serve", ballState: "toss" },
  { start: 0.12, chapter: "about", scoreboard: "15 · 00", playerState: "rally", ballState: "in-play" },
  { start: 0.24, chapter: "experience", scoreboard: "15 · 15", playerState: "rally", ballState: "in-play" },
  { start: 0.5, chapter: "research", scoreboard: "30 · 15", playerState: "ready", ballState: "settled" },
  { start: 0.64, chapter: "projects", scoreboard: "30 · 30", playerState: "between-points", ballState: "settled" },
  { start: 0.82, chapter: "capabilities", scoreboard: "40 · 30", playerState: "ready", ballState: "final-exchange" },
  { start: 0.91, chapter: "contact", scoreboard: "GAME · 30", playerState: "match-point", ballState: "final-exchange" },
] as const;

// ScrollTrigger can settle a few floating-point units either side of a shared
// DOM chapter boundary. This only stabilizes discrete labels/effects; continuous
// camera, ball, and character samplers retain their exact normalized ranges.
const DISCRETE_BOUNDARY_EPSILON = 0.001;

export const PROTOTYPE_SHOTS: readonly Shot[] = [
  {
    id: "serve-toss",
    start: PROTOTYPE_LABELS.serveToss,
    end: PROTOTYPE_LABELS.serveContact,
    curve: new CubicBezierCurve3(
      ballAtRest.clone(),
      new Vector3(0, 2.5, -PLAYER_CONTACT_Z),
      new Vector3(0, 3.25, -PLAYER_CONTACT_Z),
      new Vector3(0, 2.25, -PLAYER_CONTACT_Z),
    ),
  },
  {
    id: "serve",
    start: PROTOTYPE_LABELS.serveContact,
    end: PROTOTYPE_LABELS.firstBounce,
    curve: new CubicBezierCurve3(
      new Vector3(0, 2.25, -PLAYER_CONTACT_Z),
      new Vector3(-0.2, 2.6, -2.6),
      new Vector3(0.8, 1.7, 1.4),
      new Vector3(0.9, 0.2, 3.9),
    ),
    bounceAt: PROTOTYPE_LABELS.firstBounce,
  },
  {
    id: "return-approach",
    start: PROTOTYPE_LABELS.firstBounce,
    end: PROTOTYPE_LABELS.playerBReturn,
    curve: new CubicBezierCurve3(
      new Vector3(0.9, 0.2, 3.9),
      new Vector3(1.15, 1.05, PLAYER_APPROACH_Z - 1.6),
      new Vector3(0.65, 1.55, PLAYER_APPROACH_Z - 0.7),
      new Vector3(0.15, 1.25, PLAYER_CONTACT_Z),
    ),
  },
  {
    id: "player-b-return",
    start: PROTOTYPE_LABELS.playerBReturn,
    end: PROTOTYPE_LABELS.secondBounce,
    curve: new CubicBezierCurve3(
      new Vector3(0.15, 1.25, PLAYER_CONTACT_Z),
      new Vector3(-1.2, 2.25, 2.25),
      new Vector3(-1.35, 1.3, -1.8),
      new Vector3(-1.1, 0.2, -3.9),
    ),
    bounceAt: PROTOTYPE_LABELS.secondBounce,
  },
  {
    id: "return-approach-a",
    start: PROTOTYPE_LABELS.secondBounce,
    end: PROTOTYPE_LABELS.playerAReturn,
    curve: new CubicBezierCurve3(
      new Vector3(-1.1, 0.2, -3.9),
      new Vector3(-1.55, 1.1, -(PLAYER_APPROACH_Z - 1.6)),
      new Vector3(-0.75, 1.65, -(PLAYER_APPROACH_Z - 0.7)),
      new Vector3(-0.15, 1.3, -PLAYER_CONTACT_Z),
    ),
  },
  {
    id: "player-a-return",
    start: PROTOTYPE_LABELS.playerAReturn,
    end: PROTOTYPE_LABELS.contentPause,
    curve: new CubicBezierCurve3(
      new Vector3(-0.15, 1.3, -PLAYER_CONTACT_Z),
      new Vector3(1.3, 2.1, -2.4),
      new Vector3(1.6, 1.35, 1.3),
      new Vector3(1.1, 0.2, 3.45),
    ),
    bounceAt: PROTOTYPE_LABELS.contentPause,
  },
  {
    id: "final-exchange",
    start: PROTOTYPE_LABELS.finalExchange,
    end: PROTOTYPE_LABELS.prototypeEnd,
    curve: new CubicBezierCurve3(
      new Vector3(1.1, 0.2, 3.45),
      new Vector3(-0.65, 2.1, 1.4),
      new Vector3(-1.25, 1.7, -1.6),
      new Vector3(-0.65, 0.45, -4.2),
    ),
  },
];

/**
 * Phase 17 — World-tour camera choreography.
 *
 * The visual anchor is a stable elevated near-baseline gameplay camera. Each
 * chapter gets a restrained variation — a position/target shift toward its
 * station — rather than a distinct cinematic orbit. Transitions between
 * chapters use short soft-cut windows concentrated at chapter boundaries.
 *
 * Rally-tracking keyframes (serveToss → contentPause) overlap into the Hero,
 * About, and Experience chapters so ball and player motion stay readable
 * during active play. After contentPause (0.50) the ball is settled and
 * chapter views are purely station-framing.
 *
 * Station world positions (from RetroEnvironment):
 *   Player A:       (−0.12, 0, −6.45)
 *   Bench:          (−5.15, 0.64, −2.7)
 *   Umpire chair:   (4.85, 1.15, 0.4)
 *   Scoreboard:     (0, 3.6, 7.7)
 *   Equipment rack:  (−5.1, 0.82, 2.8)
 *   Contact tunnel: (4.3, 1.25, 7.2)
 */

/** Elevated baseline game-camera with per-chapter station visits. */
const DESKTOP_CAMERA_KEYFRAMES: readonly CameraKeyframe[] = [
  // ── Hero (0.00–0.12): iconic elevated baseline center — full court, both players, grass, scoreboard ──
  {
    progress: 0,
    position: new Vector3(0.3, 7.1, -18.0),
    target: new Vector3(0, 0.6, 0),
    fov: 29,
  },
  // Rally tracking: serve toss (0.08) — slight pull toward toss height
  {
    progress: PROTOTYPE_LABELS.serveToss,
    position: new Vector3(0.2, 7.15, -16.8),
    target: new Vector3(0, 1.6, -2.8),
    fov: 29,
  },
  // ── About (0.12): shift closer/lower toward Player A, preserve court context ──
  // Rally events serveContact (0.14) and firstBounce (0.24) interpolate naturally
  // through this and the next keyframe.
  {
    progress: 0.12,
    position: new Vector3(-0.6, 6.6, -16.0),
    target: new Vector3(-0.3, 0.9, -2.2),
    fov: 29,
    transition: "soft-cut",
  },
  // ── Experience (0.24): lateral shift toward bench side (−X), court visible ──
  {
    progress: 0.24,
    position: new Vector3(-3.1, 6.6, -16.0),
    target: new Vector3(-0.7, 0.7, -0.6),
    fov: 30,
    transition: "soft-cut",
  },
  // Hold through rally conclusion
  {
    progress: 0.46,
    position: new Vector3(-3.1, 6.6, -16.0),
    target: new Vector3(-0.7, 0.7, -0.6),
    fov: 30,
  },
  // ── Research (0.50): sideline shift toward umpire chair (+X) ──
  {
    progress: 0.50,
    position: new Vector3(2.4, 6.4, -15.4),
    target: new Vector3(1.6, 0.9, 0.8),
    fov: 29,
    transition: "soft-cut",
  },
  {
    progress: 0.61,
    position: new Vector3(2.4, 6.4, -15.4),
    target: new Vector3(1.6, 0.9, 0.8),
    fov: 29,
  },
  // ── Projects (0.64): elevate gaze toward far-wall scoreboard, court below ──
  {
    progress: 0.64,
    position: new Vector3(0.5, 5.9, -10.0),
    target: new Vector3(0, 2.4, 3.5),
    fov: 29,
    transition: "soft-cut",
  },
  {
    progress: 0.79,
    position: new Vector3(0.5, 5.9, -10.0),
    target: new Vector3(0, 2.4, 3.5),
    fov: 29,
  },
  // ── Capabilities (0.82): equipment-side crop (−X, closer) ──
  {
    progress: 0.82,
    position: new Vector3(-2.2, 4.4, -9.6),
    target: new Vector3(-1.8, 0.7, 1.2),
    fov: 32,
    transition: "soft-cut",
  },
  {
    progress: 0.88,
    position: new Vector3(-2.2, 4.4, -9.6),
    target: new Vector3(-1.8, 0.7, 1.2),
    fov: 32,
  },
  // ── Contact (0.91): calm end-match framing, tunnel side, court in background ──
  {
    progress: 0.91,
    position: new Vector3(1.8, 4.8, -9.8),
    target: new Vector3(1.5, 1.2, 3.2),
    fov: 30,
    transition: "soft-cut",
  },
  {
    progress: PROTOTYPE_LABELS.prototypeEnd,
    position: new Vector3(1.8, 4.8, -9.8),
    target: new Vector3(1.5, 1.2, 3.2),
    fov: 30,
  },
];

/** Narrow landscape: same chapter structure, pulled back with wider FOV. */
const TABLET_CAMERA_KEYFRAMES: readonly CameraKeyframe[] = [
  // Hero
  { progress: 0, position: new Vector3(0.3, 7.1, -16.4), target: new Vector3(0, 0.8, 0.5), fov: 32 },
  // About
  { progress: 0.12, position: new Vector3(-0.6, 6.6, -15.6), target: new Vector3(-0.3, 0.9, -2.0), fov: 32, transition: "soft-cut" },
  // Experience
  { progress: 0.24, position: new Vector3(-2.7, 6.5, -15.7), target: new Vector3(-1.3, 0.7, -0.5), fov: 33, transition: "soft-cut" },
  { progress: 0.46, position: new Vector3(-2.7, 6.5, -15.7), target: new Vector3(-1.3, 0.7, -0.5), fov: 33 },
  // Research
  { progress: 0.50, position: new Vector3(2.0, 6.8, -15.6), target: new Vector3(1.4, 0.9, 0.7), fov: 32, transition: "soft-cut" },
  { progress: 0.61, position: new Vector3(2.0, 6.8, -15.6), target: new Vector3(1.4, 0.9, 0.7), fov: 32 },
  // Projects
  { progress: 0.64, position: new Vector3(0.4, 6.4, -11.0), target: new Vector3(0, 2.2, 3.2), fov: 33, transition: "soft-cut" },
  { progress: 0.79, position: new Vector3(0.4, 6.4, -11.0), target: new Vector3(0, 2.2, 3.2), fov: 33 },
  // Capabilities
  { progress: 0.82, position: new Vector3(-2.0, 5.0, -10.6), target: new Vector3(-1.6, 0.7, 1.0), fov: 36, transition: "soft-cut" },
  { progress: 0.88, position: new Vector3(-2.0, 5.0, -10.6), target: new Vector3(-1.6, 0.7, 1.0), fov: 36 },
  // Contact
  { progress: 0.91, position: new Vector3(1.6, 5.3, -10.8), target: new Vector3(1.3, 1.1, 3.0), fov: 34, transition: "soft-cut" },
  { progress: 1, position: new Vector3(1.6, 5.3, -10.8), target: new Vector3(1.3, 1.1, 3.0), fov: 34 },
];

/** Portrait: elevated overhead baseline view, fewer transitions, wider FOV for court legibility. */
const MOBILE_CAMERA_KEYFRAMES: readonly CameraKeyframe[] = [
  // Hero: overhead behind baseline, both players readable
  { progress: 0, position: new Vector3(0, 8.0, -18.3), target: new Vector3(0, 0.6, 0.5), fov: 42 },
  // Rally hold through About + Experience
  { progress: PROTOTYPE_LABELS.firstBounce, position: new Vector3(0, 8.2, -18.6), target: new Vector3(0, 0.8, 0), fov: 43 },
  { progress: 0.46, position: new Vector3(0, 8.2, -18.6), target: new Vector3(0, 0.8, 0), fov: 43 },
  // Research — slight elevation to widen view
  { progress: 0.50, position: new Vector3(0, 7.6, -14.2), target: new Vector3(0, 1.0, 1.0), fov: 49, transition: "soft-cut" },
  { progress: 0.61, position: new Vector3(0, 7.6, -14.2), target: new Vector3(0, 1.0, 1.0), fov: 49 },
  // Projects — gaze shifts toward scoreboard
  { progress: 0.64, position: new Vector3(0, 7.8, -13.5), target: new Vector3(0, 2.0, 3.0), fov: 47, transition: "soft-cut" },
  { progress: 0.79, position: new Vector3(0, 7.8, -13.5), target: new Vector3(0, 2.0, 3.0), fov: 47 },
  // Capabilities + Contact — settle back to full court
  { progress: 0.82, position: new Vector3(0, 7.2, -14.0), target: new Vector3(0, 0.8, 0.5), fov: 49, transition: "soft-cut" },
  { progress: 1, position: new Vector3(0, 7.2, -14.0), target: new Vector3(0, 0.8, 0.5), fov: 49 },
];

/** Reduced motion: single calm composition, zero camera travel. */
const REDUCED_CAMERA_KEYFRAMES: readonly CameraKeyframe[] = [
  { progress: 0, position: new Vector3(0, 7.1, -18.0), target: new Vector3(0, 0.6, 0), fov: 29 },
  { progress: 1, position: new Vector3(0, 7.1, -18.0), target: new Vector3(0, 0.6, 0), fov: 29 },
];

function clampProgress(progress: number) {
  return Math.min(Math.max(progress, 0), 1);
}

function findCharacterNarrativeBeat(progress: number, side: CharacterSide) {
  for (const beat of CHARACTER_NARRATIVE_BEATS) {
    if (beat.side === side && progress >= beat.start && progress < beat.end) {
      return beat;
    }
  }

  return undefined;
}

/**
 * Samples the active authored clip directly from master narrative progress.
 * This is reversible: it does not retain elapsed time or call `action.play()`.
 */
export function sampleCharacterNarrative(
  progress: number,
  side: CharacterSide,
  target: CharacterNarrativeSample,
) {
  const clampedProgress = clampProgress(progress);
  const beat = findCharacterNarrativeBeat(clampedProgress, side);
  if (!beat) {
    target.clip = "idle_ready";
    target.localProgress = 0;
    target.contactLocalProgress = undefined;
    target.active = false;
    return target;
  }

  target.clip = beat.clip;
  if ("contactProgress" in beat) {
    const contactLocalProgress = PLAYER_CLIP_CONTACTS[beat.clip];
    target.contactLocalProgress = contactLocalProgress;
    target.localProgress = clampedProgress <= beat.contactProgress
      ? contactLocalProgress * (clampedProgress - beat.start) / (beat.contactProgress - beat.start)
      : contactLocalProgress + (1 - contactLocalProgress)
        * (clampedProgress - beat.contactProgress) / (beat.end - beat.contactProgress);
  } else {
    target.contactLocalProgress = undefined;
    target.localProgress = (clampedProgress - beat.start) / (beat.end - beat.start);
  }
  target.active = true;
  return target;
}

/**
 * Reduced motion uses this stable ready-frame sample instead of an animated
 * sequence. It intentionally ignores narrative progress while preserving DOM
 * navigation and the smooth ball/camera contracts around it.
 */
export function sampleReducedMotionCharacterPose(target: CharacterNarrativeSample) {
  target.clip = "idle_ready";
  target.localProgress = 0;
  target.contactLocalProgress = undefined;
  target.active = false;
  return target;
}

/**
 * Samples the smooth, application-owned root choreography retained from the
 * Phase 06 prototype. It deliberately uses raw master progress rather than
 * stepped character clip sampling, so court placement remains smooth and does
 * not fight in-place GLB animation or reverse scrolling.
 */
export function sampleCharacterRootTransform(
  progress: number,
  side: CharacterSide,
  target: CharacterRootTransformSample,
) {
  const direction = side === "a" ? 1 : -1;
  const returnBeat = side === "a" ? PROTOTYPE_LABELS.playerAReturn : PROTOTYPE_LABELS.playerBReturn;
  const activeReturn = Math.max(0, 1 - Math.abs(progress - returnBeat) / 0.08);
  const baseX = side === "a" ? -0.12 : 0.14;
  const baseline = side === "a" ? -COURT_DIMENSIONS.playerBaselineZ : COURT_DIMENSIONS.playerBaselineZ;
  const baseRotationY = side === "a" ? 0.12 : Math.PI + 0.12;

  target.positionX = side === "a" ? baseX + activeReturn * 0.52 : baseX - activeReturn * 0.5;
  target.positionY = 0;
  target.positionZ = baseline - direction * activeReturn * 0.28;
  target.rotationY = side === "a" ? baseRotationY - activeReturn * 0.38 : baseRotationY + activeReturn * 0.38;
  target.rotationZ = direction * activeReturn * 0.1;
  target.scaleY = 1 - activeReturn * 0.1;
  return target;
}

/** Reduced motion pins roots to their stable ready positions without approach motion. */
export function sampleReducedMotionCharacterRootTransform(
  side: CharacterSide,
  target: CharacterRootTransformSample,
) {
  target.positionX = side === "a" ? -0.12 : 0.14;
  target.positionY = 0;
  target.positionZ = side === "a" ? -COURT_DIMENSIONS.playerBaselineZ : COURT_DIMENSIONS.playerBaselineZ;
  target.rotationY = side === "a" ? 0.12 : Math.PI + 0.12;
  target.rotationZ = 0;
  target.scaleY = 1;
  return target;
}

/**
 * Quantizes only mixer sampling time, never master scroll progress. When a
 * contact time is supplied, the grid is anchored there so its exact hit pose
 * survives stepping regardless of a clip's duration.
 */
export function quantizeCharacterClipTime(
  time: number,
  fps = CHARACTER_ANIMATION_FPS,
  contactTime?: number,
) {
  if (fps <= 0) {
    return time;
  }

  const origin = contactTime ?? 0;
  return origin + Math.floor((time - origin) * fps) / fps;
}

/**
 * Converts an allocation-free narrative sample to a deterministic mixer time.
 * Pass `sample.contactLocalProgress` as the final argument to preserve the
 * exact shot contact under any approved stepped cadence. Pass `stepped: false`
 * only for smooth reference/debug playback.
 */
export function sampleCharacterClipTime(
  localProgress: number,
  clipDuration: number,
  stepped = true,
  contactLocalProgress?: number,
  fps = CHARACTER_ANIMATION_FPS,
) {
  const duration = Math.max(clipDuration, 0);
  const time = clampProgress(localProgress) * duration;
  if (!stepped) {
    return time;
  }

  const contactTime = contactLocalProgress === undefined ? undefined : clampProgress(contactLocalProgress) * duration;
  const steppedTime = quantizeCharacterClipTime(time, fps, contactTime);
  // A contact-anchored floor can precede zero when the contact is off-grid.
  // Clamp in mixer-time space without moving the exact contact sample.
  return Math.min(Math.max(steppedTime, 0), duration);
}

function smoothstep(value: number) {
  return value * value * (3 - 2 * value);
}

function findShot(progress: number) {
  for (const shot of PROTOTYPE_SHOTS) {
    if (progress >= shot.start && progress <= shot.end) {
      return shot;
    }
  }

  return undefined;
}

export function getActiveShot(progress: number) {
  return findShot(clampProgress(progress));
}

export function sampleMatchState(progress: number): MatchState {
  const clampedProgress = clampProgress(progress);
  let state = MATCH_STATES[0];
  for (const candidate of MATCH_STATES) {
    if (candidate.start > clampedProgress + DISCRETE_BOUNDARY_EPSILON) break;
    state = candidate;
  }
  return state;
}

/** A brief scrubbed scoreboard acknowledgement, derived from chapter crossings. */
export function sampleScoreboardEmphasis(progress: number, reducedMotion = false) {
  if (reducedMotion) return 0.3;
  const clampedProgress = clampProgress(progress);
  let chapterStart = 0;
  for (const candidate of MATCH_STATES) {
    if (candidate.start > clampedProgress + DISCRETE_BOUNDARY_EPSILON) break;
    chapterStart = candidate.start;
  }
  const elapsed = Math.max(0, clampedProgress - chapterStart);
  return 0.3 + Math.max(0, 1 - elapsed / 0.025) * 0.42;
}

export type BallPresentationSample = {
  shadowScale: number;
  shadowOpacity: number;
  ballScaleX: number;
  ballScaleY: number;
  ballScaleZ: number;
  impact: number;
};

/** Mutates a caller-owned value so impact and bounce emphasis reverse exactly. */
export function sampleBallPresentation(progress: number, position: Vector3, target: BallPresentationSample) {
  const clampedProgress = clampProgress(progress);
  const contactDistance = Math.min(
    Math.abs(clampedProgress - PROTOTYPE_LABELS.serveContact),
    Math.abs(clampedProgress - PROTOTYPE_LABELS.playerBReturn),
    Math.abs(clampedProgress - PROTOTYPE_LABELS.playerAReturn),
  );
  const bounceDistance = Math.min(
    Math.abs(clampedProgress - PROTOTYPE_LABELS.firstBounce),
    Math.abs(clampedProgress - PROTOTYPE_LABELS.secondBounce),
    Math.abs(clampedProgress - PROTOTYPE_LABELS.contentPause),
  );
  const contactImpact = Math.max(0, 1 - contactDistance / 0.009);
  const bounceImpact = Math.max(0, 1 - bounceDistance / 0.012);
  const height = Math.max(position.y, 0);
  const groundFactor = Math.min(height / 2.8, 1);

  target.impact = Math.max(contactImpact, bounceImpact);
  target.ballScaleX = 1 + contactImpact * 0.11 + bounceImpact * 0.08;
  target.ballScaleY = 1 - contactImpact * 0.12 - bounceImpact * 0.14;
  target.ballScaleZ = 1 + contactImpact * 0.11 + bounceImpact * 0.08;
  target.shadowScale = 0.42 + groundFactor * 0.7 - bounceImpact * 0.16;
  target.shadowOpacity = 0.46 - groundFactor * 0.3 + bounceImpact * 0.18;
  return target;
}

export function sampleBallPosition(progress: number, target: Vector3) {
  const clampedProgress = clampProgress(progress);
  const activeShot = findShot(clampedProgress);

  if (activeShot) {
    const shotProgress = (clampedProgress - activeShot.start) / (activeShot.end - activeShot.start);
    activeShot.curve.getPointAt(shotProgress, target);
    return;
  }

  let previousShot: Shot | undefined;
  for (const shot of PROTOTYPE_SHOTS) {
    if (shot.end < clampedProgress) {
      previousShot = shot;
    }
  }

  if (previousShot) {
    previousShot.curve.getPointAt(1, target);
    return;
  }

  target.copy(ballAtRest);
}

export function sampleReducedMotionBallPosition(target: Vector3) {
  return target.copy(ballAtRest);
}

function getCameraKeyframes(composition: CameraComposition) {
  switch (composition) {
    case "mobile": return MOBILE_CAMERA_KEYFRAMES;
    case "tablet": return TABLET_CAMERA_KEYFRAMES;
    case "reduced": return REDUCED_CAMERA_KEYFRAMES;
    default: return DESKTOP_CAMERA_KEYFRAMES;
  }
}

export function getCameraComposition(aspect: number, reducedMotion = false): CameraComposition {
  if (reducedMotion) return "reduced";
  if (aspect < 0.82) return "mobile";
  if (aspect < 1.35) return "tablet";
  return "desktop";
}

export function getCameraKeyframePair(progress: number, aspect: number, reducedMotion = false) {
  const keyframes = getCameraKeyframes(getCameraComposition(aspect, reducedMotion));
  const clampedProgress = clampProgress(progress);
  let next = keyframes[keyframes.length - 1];
  let previous = keyframes[0];
  for (let index = 1; index < keyframes.length; index += 1) {
    if (clampedProgress <= keyframes[index].progress) {
      next = keyframes[index];
      previous = keyframes[index - 1];
      break;
    }
  }
  return { previous, next };
}

export function sampleCamera(
  progress: number,
  positionTarget: Vector3,
  lookAtTarget: Vector3,
  aspect: number,
  reducedMotion = false,
) {
  const clampedProgress = clampProgress(progress);
  const keyframes = getCameraKeyframes(getCameraComposition(aspect, reducedMotion));
  let nextKeyframe = keyframes[keyframes.length - 1];
  let previousKeyframe = keyframes[0];
  for (let index = 1; index < keyframes.length; index += 1) {
    if (clampedProgress <= keyframes[index].progress) {
      nextKeyframe = keyframes[index];
      previousKeyframe = keyframes[index - 1];
      break;
    }
  }

  const range = nextKeyframe.progress - previousKeyframe.progress;
  const rawProgress = range === 0 ? 0 : (clampedProgress - previousKeyframe.progress) / range;
  const easedProgress = smoothstep(Math.min(Math.max(rawProgress, 0), 1));

  positionTarget.lerpVectors(previousKeyframe.position, nextKeyframe.position, easedProgress);
  lookAtTarget.lerpVectors(previousKeyframe.target, nextKeyframe.target, easedProgress);
  const baseFov = previousKeyframe.fov + (nextKeyframe.fov - previousKeyframe.fov) * easedProgress;

  return baseFov;
}
