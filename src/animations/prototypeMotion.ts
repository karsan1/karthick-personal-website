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
