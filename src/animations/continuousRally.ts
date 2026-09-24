import { Vector3 } from "three";
import {
  COURT_DIMENSIONS,
  PLAYER_CLIP_CONTACTS,
  type CharacterClip,
  type CharacterNarrativeSample,
  type CharacterRootTransformSample,
  type CharacterSide,
} from "./prototypeMotion";

const EXCHANGES = 14;
const BOUNCE_PHASE = 0.58;
const CONTACT_Z = COURT_DIMENSIONS.playerBaselineZ - 0.24;
const BOUNCE_Y = 0.16;

export type ContinuousRallyPresentation = {
  shadowScale: number;
  shadowOpacity: number;
  ballScaleX: number;
  ballScaleY: number;
  ballScaleZ: number;
  impact: number;
};

type RallyState = {
  hitIndex: number;
  phase: number;
  hitter: CharacterSide;
  receiver: CharacterSide;
};

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function sideForHit(hitIndex: number): CharacterSide {
  return hitIndex % 2 === 0 ? "a" : "b";
}

function getState(progress: number): RallyState {
  const p = clamp01(progress);
  if (p >= 1) {
    const hitIndex = EXCHANGES - 1;
    const hitter = sideForHit(hitIndex);
    return { hitIndex, phase: 1, hitter, receiver: hitter === "a" ? "b" : "a" };
  }
  const scaled = p * EXCHANGES;
  const hitIndex = Math.floor(scaled);
  const hitter = sideForHit(hitIndex);
  return { hitIndex, phase: scaled - hitIndex, hitter, receiver: hitter === "a" ? "b" : "a" };
}

function contactX(hitNumber: number) {
  return Math.sin(hitNumber * 1.71 + 0.35) * 0.78;
}

function clipForHit(hitIndex: number, side: CharacterSide): CharacterClip {
  if (hitIndex === 0 && side === "a") return "serve";
  const pattern = Math.floor(hitIndex / 2) % 2;
  if (side === "a") return pattern === 0 ? "forehand" : "backhand";
  return pattern === 0 ? "backhand" : "forehand";
}

function contactLocalProgress(clip: CharacterClip) {
  return clip === "serve" || clip === "forehand" || clip === "backhand" ? PLAYER_CLIP_CONTACTS[clip] : 0.5;
}

/** Pure scroll-sampled rally clock: progress 0→1 always maps to an exchange. */
export function sampleContinuousRallyCharacter(progress: number, side: CharacterSide, target: CharacterNarrativeSample) {
  const { hitIndex, phase, hitter, receiver } = getState(progress);
  if (hitIndex === 0 && side === "a" && phase <= 0.32) {
    const clip: CharacterClip = "serve";
    const contact = contactLocalProgress(clip);
    target.clip = clip;
    target.localProgress = contact + (1 - contact) * (phase / 0.32);
    target.contactLocalProgress = contact;
    target.active = true;
    return target;
  }
  if (side === hitter && phase <= 0.24) {
    const clip = clipForHit(hitIndex, side);
    const contact = contactLocalProgress(clip);
    target.clip = clip;
    target.localProgress = contact + (1 - contact) * (phase / 0.24);
    target.contactLocalProgress = contact;
    target.active = true;
    return target;
  }
  if (side === receiver && phase >= 0.72) {
    const clip = clipForHit(hitIndex + 1, side);
    const contact = contactLocalProgress(clip);
    target.clip = clip;
    target.localProgress = contact * ((phase - 0.72) / 0.28);
    target.contactLocalProgress = contact;
    target.active = true;
    return target;
  }
  if (side === hitter && phase < 0.55) {
    target.clip = "recovery";
    target.localProgress = clamp01((phase - 0.24) / 0.31);
    target.contactLocalProgress = undefined;
    target.active = true;
    return target;
  }
  target.clip = "idle_ready";
  target.localProgress = 0;
  target.contactLocalProgress = undefined;
  target.active = false;
  return target;
}

export function sampleContinuousRallyRootTransform(progress: number, side: CharacterSide, target: CharacterRootTransformSample) {
  const state = getState(progress);
  const baseX = side === "a" ? -0.12 : 0.14;
  const baseline = side === "a" ? -COURT_DIMENSIONS.playerBaselineZ : COURT_DIMENSIONS.playerBaselineZ;
  let activity = 0;
  let desiredX = baseX;
  if (side === state.hitter && state.phase <= 0.22) {
    activity = 1 - state.phase / 0.22;
    desiredX = contactX(state.hitIndex);
  } else if (side === state.receiver && state.phase >= 0.7) {
    activity = (state.phase - 0.7) / 0.3;
    desiredX = contactX(state.hitIndex + 1);
  }
  target.positionX = baseX + (desiredX - baseX) * 0.32 * activity;
  target.positionY = 0;
  const towardNet = 0.18 * activity;
  target.positionZ = side === "a" ? baseline + towardNet : baseline - towardNet;
  target.rotationY = 0;
  target.rotationZ = (side === "a" ? 1 : -1) * 0.055 * activity;
  target.scaleY = 1 - 0.04 * activity;
  return target;
}

export function sampleContinuousRallyBall(progress: number, target: Vector3) {
  const state = getState(progress);
  const startZ = state.hitter === "a" ? -CONTACT_Z : CONTACT_Z;
  const endZ = state.receiver === "a" ? -CONTACT_Z : CONTACT_Z;
  const startX = contactX(state.hitIndex);
  const endX = contactX(state.hitIndex + 1);
  const startY = state.hitIndex === 0 ? 2.15 : 1.3;
  const endY = 1.3;
  target.x = startX + (endX - startX) * state.phase;
  target.z = startZ + (endZ - startZ) * state.phase;
  if (state.phase <= BOUNCE_PHASE) {
    const t = state.phase / BOUNCE_PHASE;
    const base = startY + (BOUNCE_Y - startY) * t;
    target.y = base + Math.sin(Math.PI * t) * (state.hitIndex === 0 ? 1.15 : 0.82);
  } else {
    const t = (state.phase - BOUNCE_PHASE) / (1 - BOUNCE_PHASE);
    const base = BOUNCE_Y + (endY - BOUNCE_Y) * t;
    target.y = base + Math.sin(Math.PI * t) * 0.68;
  }
  return target;
}

export function sampleContinuousRallyPresentation(progress: number, position: Vector3, target: ContinuousRallyPresentation) {
  const state = getState(progress);
  const bounceDistance = Math.abs(state.phase - BOUNCE_PHASE);
  const contactDistance = Math.min(state.phase, Math.abs(1 - state.phase));
  const bounceImpact = Math.max(0, 1 - bounceDistance / 0.035);
  const contactImpact = Math.max(0, 1 - contactDistance / 0.035);
  const heightFactor = Math.min(Math.max(position.y / 2.8, 0), 1);
  target.impact = Math.max(bounceImpact, contactImpact);
  target.ballScaleX = 1 + contactImpact * 0.08 + bounceImpact * 0.06;
  target.ballScaleY = 1 - contactImpact * 0.1 - bounceImpact * 0.12;
  target.ballScaleZ = 1 + contactImpact * 0.08 + bounceImpact * 0.06;
  target.shadowScale = 0.46 + heightFactor * 0.62 - bounceImpact * 0.12;
  target.shadowOpacity = 0.48 - heightFactor * 0.3 + bounceImpact * 0.16;
  return target;
}
