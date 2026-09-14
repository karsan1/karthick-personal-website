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

export type MatchState = {
  chapter: "hero" | "about" | "experience" | "research" | "projects" | "capabilities" | "contact";
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
  playerBaselineZ: 5.15,
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
export const CHARACTER_ANIMATION_FPS = 18;

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
      new Vector3(0, 2.5, -5.15),
      new Vector3(0, 3.25, -5.15),
      new Vector3(0, 2.25, -5.15),
    ),
  },
  {
    id: "serve",
    start: PROTOTYPE_LABELS.serveContact,
    end: PROTOTYPE_LABELS.firstBounce,
    curve: new CubicBezierCurve3(
      new Vector3(0, 2.25, -5.15),
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
      new Vector3(1.15, 1.05, 4.3),
      new Vector3(0.65, 1.55, 4.9),
      new Vector3(0.15, 1.25, 5.05),
    ),
  },
  {
    id: "player-b-return",
    start: PROTOTYPE_LABELS.playerBReturn,
    end: PROTOTYPE_LABELS.secondBounce,
    curve: new CubicBezierCurve3(
      new Vector3(0.15, 1.25, 5.05),
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
      new Vector3(-1.55, 1.1, -4.35),
      new Vector3(-0.75, 1.65, -4.85),
      new Vector3(-0.15, 1.3, -5.0),
    ),
  },
  {
    id: "player-a-return",
    start: PROTOTYPE_LABELS.playerAReturn,
    end: PROTOTYPE_LABELS.contentPause,
    curve: new CubicBezierCurve3(
      new Vector3(-0.15, 1.3, -5.0),
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

/** Wide broadcast framing: active play moves smoothly; reading ranges hold. */
const DESKTOP_CAMERA_KEYFRAMES: readonly CameraKeyframe[] = [
  {
    progress: 0,
    position: new Vector3(5.7, 3.15, -9.1),
    target: new Vector3(0, 1.1, -1.5),
    fov: 39,
  },
  {
    progress: PROTOTYPE_LABELS.serveToss,
    position: new Vector3(5.45, 3.3, -8.7),
    target: new Vector3(0, 2.05, -3.2),
    fov: 38,
  },
  {
    progress: PROTOTYPE_LABELS.serveContact,
    position: new Vector3(5.15, 3.5, -8.1),
    target: new Vector3(0.25, 1.55, -0.4),
    fov: 38,
  },
  {
    progress: PROTOTYPE_LABELS.firstBounce,
    position: new Vector3(5.25, 4.35, -9.35),
    target: new Vector3(0, 1.05, 0),
    fov: 36,
    transition: "soft-cut",
  },
  {
    progress: 0.43,
    position: new Vector3(5.25, 4.35, -9.35),
    target: new Vector3(0, 1.05, 0),
    fov: 36,
  },
  {
    progress: 0.49,
    position: new Vector3(-5.35, 4.7, 8.5),
    target: new Vector3(0, 1.45, 1.2),
    fov: 37,
    transition: "soft-cut",
  },
  {
    progress: 0.82,
    position: new Vector3(-5.35, 4.7, 8.5),
    target: new Vector3(0, 1.45, 1.2),
    fov: 37,
  },
  {
    progress: 0.9,
    position: new Vector3(4.75, 3.7, -8.2),
    target: new Vector3(0, 1.25, 0),
    fov: 39,
    transition: "soft-cut",
  },
  {
    progress: PROTOTYPE_LABELS.prototypeEnd,
    position: new Vector3(4.75, 3.7, -8.2),
    target: new Vector3(0, 1.25, 0),
    fov: 39,
  },
];

/** Narrow landscape uses its own stable game framing, not a desktop FOV tweak. */
const TABLET_CAMERA_KEYFRAMES: readonly CameraKeyframe[] = [
  { progress: 0, position: new Vector3(4.8, 3.7, -10.1), target: new Vector3(0, 1.15, -1), fov: 43 },
  { progress: PROTOTYPE_LABELS.serveContact, position: new Vector3(4.55, 3.9, -9.55), target: new Vector3(0, 1.4, -0.4), fov: 42 },
  { progress: PROTOTYPE_LABELS.firstBounce, position: new Vector3(4.35, 4.65, -10.35), target: new Vector3(0, 1.1, 0), fov: 40, transition: "soft-cut" },
  { progress: 0.49, position: new Vector3(-4.5, 4.8, 9.5), target: new Vector3(0, 1.3, 0.8), fov: 41, transition: "soft-cut" },
  { progress: 0.82, position: new Vector3(-4.5, 4.8, 9.5), target: new Vector3(0, 1.3, 0.8), fov: 41 },
  { progress: 0.9, position: new Vector3(4.25, 4.25, -9.7), target: new Vector3(0, 1.2, 0), fov: 43, transition: "soft-cut" },
  { progress: 1, position: new Vector3(4.25, 4.25, -9.7), target: new Vector3(0, 1.2, 0), fov: 43 },
];

/** Portrait reduces angle changes and prioritizes a legible full-court silhouette. */
const MOBILE_CAMERA_KEYFRAMES: readonly CameraKeyframe[] = [
  { progress: 0, position: new Vector3(0, 5.8, -14.2), target: new Vector3(0, 1.2, 0), fov: 51 },
  { progress: PROTOTYPE_LABELS.firstBounce, position: new Vector3(0, 6.2, -14.7), target: new Vector3(0, 1.25, 0), fov: 52 },
  { progress: 0.64, position: new Vector3(0, 6.2, -14.7), target: new Vector3(0, 1.25, 0), fov: 52 },
  { progress: 0.9, position: new Vector3(0, 5.75, -14.3), target: new Vector3(0, 1.2, 0), fov: 51 },
  { progress: 1, position: new Vector3(0, 5.75, -14.3), target: new Vector3(0, 1.2, 0), fov: 51 },
];

/** Reduced motion is a single calm composition with no cinematic transition. */
const REDUCED_CAMERA_KEYFRAMES: readonly CameraKeyframe[] = [
  { progress: 0, position: new Vector3(0, 5.9, -14.5), target: new Vector3(0, 1.2, 0), fov: 50 },
  { progress: 1, position: new Vector3(0, 5.9, -14.5), target: new Vector3(0, 1.2, 0), fov: 50 },
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
 * 18fps character clip sampling, so court placement remains smooth and does
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
 * exact shot contact under 18fps stepping. Pass `stepped: false` only for
 * smooth reference/debug playback.
 */
export function sampleCharacterClipTime(
  localProgress: number,
  clipDuration: number,
  stepped = true,
  contactLocalProgress?: number,
) {
  const duration = Math.max(clipDuration, 0);
  const time = clampProgress(localProgress) * duration;
  if (!stepped) {
    return time;
  }

  const contactTime = contactLocalProgress === undefined ? undefined : clampProgress(contactLocalProgress) * duration;
  const steppedTime = quantizeCharacterClipTime(time, CHARACTER_ANIMATION_FPS, contactTime);
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
