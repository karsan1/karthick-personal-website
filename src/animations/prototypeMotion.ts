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
  secondBounce: 0.45,
  playerAReturn: 0.55,
  contentPause: 0.68,
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
  id: "player-a-serve-recovery" | "player-b-return-recovery" | "player-a-return-recovery";
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
 * - return A: Player A's `backhand` reaches local 0.48 at playerAReturn (0.55).
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
  {
    id: "player-a-return-recovery",
    side: "a",
    clip: "recovery",
    start: PROTOTYPE_LABELS.contentPause,
    end: PROTOTYPE_LABELS.finalExchange,
  },
] as const;

const ballAtRest = new Vector3(0, 1.25, -COURT_DIMENSIONS.playerBaselineZ);

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

const CAMERA_KEYFRAMES: readonly CameraKeyframe[] = [
  {
    progress: 0,
    position: new Vector3(5.9, 2.6, -8.3),
    target: new Vector3(0, 1.1, -2.5),
    fov: 43,
  },
  {
    progress: PROTOTYPE_LABELS.serveContact,
    position: new Vector3(5.5, 2.8, -7.7),
    target: new Vector3(0, 1.8, -2.1),
    fov: 42,
  },
  {
    progress: PROTOTYPE_LABELS.firstBounce,
    position: new Vector3(4.75, 3.35, -6.8),
    target: new Vector3(0.25, 1.15, 0.7),
    fov: 40,
  },
  {
    progress: PROTOTYPE_LABELS.secondBounce,
    position: new Vector3(4.15, 3.1, -5.3),
    target: new Vector3(-0.35, 1.1, -0.6),
    fov: 41,
  },
  {
    progress: PROTOTYPE_LABELS.contentPause,
    position: new Vector3(4.2, 3.15, -5.15),
    target: new Vector3(0, 1, 0),
    fov: 41,
  },
  {
    progress: PROTOTYPE_LABELS.finalExchange,
    position: new Vector3(4.15, 3.1, -5.1),
    target: new Vector3(0, 1, 0),
    fov: 41,
  },
  {
    progress: PROTOTYPE_LABELS.prototypeEnd,
    position: new Vector3(3.8, 3.2, -4.75),
    target: new Vector3(-0.4, 1.05, -1.25),
    fov: 42,
  },
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

export function sampleCamera(
  progress: number,
  positionTarget: Vector3,
  lookAtTarget: Vector3,
  aspect: number,
) {
  const clampedProgress = clampProgress(progress);
  let nextKeyframe = CAMERA_KEYFRAMES[CAMERA_KEYFRAMES.length - 1];
  let previousKeyframe = CAMERA_KEYFRAMES[0];

  for (let index = 1; index < CAMERA_KEYFRAMES.length; index += 1) {
    if (clampedProgress <= CAMERA_KEYFRAMES[index].progress) {
      nextKeyframe = CAMERA_KEYFRAMES[index];
      previousKeyframe = CAMERA_KEYFRAMES[index - 1];
      break;
    }
  }

  const range = nextKeyframe.progress - previousKeyframe.progress;
  const rawProgress = range === 0 ? 0 : (clampedProgress - previousKeyframe.progress) / range;
  const easedProgress = smoothstep(Math.min(Math.max(rawProgress, 0), 1));

  positionTarget.lerpVectors(previousKeyframe.position, nextKeyframe.position, easedProgress);
  lookAtTarget.lerpVectors(previousKeyframe.target, nextKeyframe.target, easedProgress);
  const baseFov = previousKeyframe.fov + (nextKeyframe.fov - previousKeyframe.fov) * easedProgress;

  // Portrait viewports need a wider, more centered composition to keep both
  // players and the ball inside the narrow horizontal field of view.
  const portraitAmount = Math.min(Math.max((1.15 - aspect) / 0.5, 0), 1);
  if (portraitAmount === 0) {
    return baseFov;
  }

  positionTarget.x += -positionTarget.x * portraitAmount;
  lookAtTarget.x += -lookAtTarget.x * portraitAmount;
  positionTarget.y += (lookAtTarget.y + 4.2 - positionTarget.y) * portraitAmount * 0.22;
  lookAtTarget.y += 0.15 * portraitAmount;
  positionTarget.sub(lookAtTarget).multiplyScalar(1 + portraitAmount * 2).add(lookAtTarget);

  return baseFov + 32 * portraitAmount;
}
