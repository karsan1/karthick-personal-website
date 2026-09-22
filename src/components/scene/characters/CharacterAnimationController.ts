import { useEffect, useRef, type MutableRefObject, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { AnimationMixer, LoopOnce, type AnimationAction, type AnimationClip, type Group, type Object3D } from "three";
import {
  CHARACTER_ANIMATION_FPS,
  COURT_DIMENSIONS,
  readCharacterAnimationCadence,
  type CharacterAnimationCadence,
  sampleCharacterClipTime,
  sampleCharacterNarrative,
  sampleCharacterRootTransform,
  sampleReducedMotionCharacterPose,
  sampleReducedMotionCharacterRootTransform,
  type CharacterRootTransformSample,
  type NarrativeProgress,
} from "@/animations/prototypeMotion";
import { CHARACTER_CLIP_NAMES, type CharacterClipName, type CharacterSide } from "./characterAssetContract";

type CharacterAnimationControllerOptions = {
  scene: Object3D;
  animations: AnimationClip[];
  applicationRoot: RefObject<Group | null>;
  progress: MutableRefObject<NarrativeProgress>;
  side: CharacterSide;
  reducedMotion: boolean;
  smoothReference: boolean;
  /** Optional explicit review override; otherwise `?characterFps=` is used. */
  cadence?: CharacterAnimationCadence;
};

type CharacterActions = Partial<Record<CharacterClipName, AnimationAction>>;
type CharacterRuntime = { mixer: AnimationMixer; actions: CharacterActions };

const CHARACTER_CLIP_NAME_SET = new Set<string>(CHARACTER_CLIP_NAMES);

function createActions(mixer: AnimationMixer, animations: AnimationClip[]): CharacterActions {
  const actions: CharacterActions = {};

  for (const clip of animations) {
    if (!CHARACTER_CLIP_NAME_SET.has(clip.name)) continue;
    const action = mixer.clipAction(clip);
    action.setLoop(LoopOnce, 1);
    action.clampWhenFinished = true;
    action.enabled = true;
    action.paused = true;
    action.time = 0;
    action.setEffectiveWeight(0);
    action.play();
    actions[clip.name as CharacterClipName] = action;
  }

  return actions;
}

/**
 * Scrubs a single authored action from GSAP's master progress. It deliberately
 * never advances mixer time from the render clock, so forward and reverse
 * scroll resolve to the same clip pose.
 */
export function useCharacterAnimationController({
  scene,
  animations,
  applicationRoot,
  progress,
  side,
  reducedMotion,
  smoothReference,
  cadence,
}: CharacterAnimationControllerOptions) {
  const runtime = useRef<CharacterRuntime | null>(null);
  if (runtime.current === null) {
    const mixer = new AnimationMixer(scene);
    runtime.current = { mixer, actions: createActions(mixer, animations) };
  }
  const sample = useRef({
    clip: "idle_ready" as CharacterClipName,
    localProgress: 0,
    contactLocalProgress: undefined as number | undefined,
    active: false,
  });
  const rootTransform = useRef<CharacterRootTransformSample>({
    positionX: side === "a" ? -0.12 : 0.14,
    positionY: 0,
    positionZ: side === "a" ? -COURT_DIMENSIONS.playerBaselineZ : COURT_DIMENSIONS.playerBaselineZ,
    rotationY: side === "a" ? 0.12 : Math.PI + 0.12,
    rotationZ: 0,
    scaleY: 1,
  });
  const activeAction = useRef<AnimationAction | undefined>(undefined);
  // Keep a stable review choice through a mount. It is intentionally outside
  // the frame loop so no per-frame URL/state work reaches the render path.
  const resolvedCadence = useRef<CharacterAnimationCadence>(cadence ?? readCharacterAnimationCadence());

  useFrame(() => {
    const currentRuntime = runtime.current;
    if (!currentRuntime) return;
    const root = applicationRoot.current;
    if (root) {
      const transform = reducedMotion
        ? sampleReducedMotionCharacterRootTransform(side, rootTransform.current)
        : sampleCharacterRootTransform(progress.current.value, side, rootTransform.current);
      root.position.set(transform.positionX, transform.positionY, transform.positionZ);
      root.rotation.set(0, transform.rotationY, transform.rotationZ);
      root.scale.set(1, transform.scaleY, 1);
    }
    const target = reducedMotion
      ? sampleReducedMotionCharacterPose(sample.current)
      : sampleCharacterNarrative(progress.current.value, side, sample.current);
    const requestedClip = target.clip as CharacterClipName;
    const action = currentRuntime.actions[requestedClip] || currentRuntime.actions.idle_ready;

    if (!action) return;

    if (activeAction.current !== action) {
      activeAction.current?.setEffectiveWeight(0);
      action.setEffectiveWeight(1);
      activeAction.current = action;
    }

    const stepped = !smoothReference && resolvedCadence.current !== "smooth" && CHARACTER_ANIMATION_FPS > 0;
    action.time = sampleCharacterClipTime(
      target.localProgress,
      action.getClip().duration,
      stepped,
      target.contactLocalProgress,
      resolvedCadence.current === "smooth" ? CHARACTER_ANIMATION_FPS : resolvedCadence.current,
    );
    currentRuntime.mixer.update(0);
  });

  useEffect(() => {
    const mixer = runtime.current?.mixer;
    return () => {
      mixer?.stopAllAction();
      mixer?.uncacheRoot(scene);
    };
  }, [scene]);
}
