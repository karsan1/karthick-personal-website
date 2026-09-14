"use client";

import { useEffect, type MutableRefObject } from "react";
import { PROTOTYPE_LABELS, type NarrativeProgress } from "@/animations/prototypeMotion";
import { useExperienceStore } from "@/store/experienceStore";

type Cue = {
  progress: number;
  tone: "bounce" | "hit";
};

const CUES: readonly Cue[] = [
  { progress: PROTOTYPE_LABELS.serveContact, tone: "hit" },
  { progress: PROTOTYPE_LABELS.firstBounce, tone: "bounce" },
  { progress: PROTOTYPE_LABELS.playerBReturn, tone: "hit" },
  { progress: PROTOTYPE_LABELS.secondBounce, tone: "bounce" },
  { progress: PROTOTYPE_LABELS.playerAReturn, tone: "hit" },
];

const CUE_COOLDOWN_MS = 240;
const GLOBAL_COOLDOWN_MS = 90;

/**
 * Samples the same normalized master progress as the visual rally. Audio stays
 * opt-in, is generated locally, and crossings are debounced so rapid reverse
 * scrubbing cannot turn a contact point into repeated audio spam.
 */
export function useRallyAudio(
  progress: MutableRefObject<NarrativeProgress>,
  reducedMotion: boolean,
) {
  useEffect(() => {
    let context: AudioContext | null = null;
    let frame = 0;
    let previousProgress = progress.current.value;
    let lastCueAt = 0;
    let enabled = useExperienceStore.getState().soundEnabled;
    const cueTimes = new Map<number, number>();

    const ensureContext = () => {
      if (!("AudioContext" in window)) return null;
      if (!context) context = new AudioContext();
      if (context.state === "suspended") void context.resume();
      return context;
    };

    const playCue = (tone: Cue["tone"]) => {
      const audio = ensureContext();
      if (!audio) return;
      const now = audio.currentTime;
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = tone === "hit" ? "square" : "triangle";
      oscillator.frequency.setValueAtTime(tone === "hit" ? 176 : 104, now);
      oscillator.frequency.exponentialRampToValueAtTime(tone === "hit" ? 112 : 72, now + 0.075);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(tone === "hit" ? 0.055 : 0.035, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.095);
    };

    const sample = (time: number) => {
      frame = 0;
      const currentProgress = progress.current.value;
      if (enabled && !reducedMotion) {
        const movingForward = currentProgress >= previousProgress;
        for (let index = 0; index < CUES.length; index += 1) {
          const cue = CUES[movingForward ? index : CUES.length - index - 1];
          const crossed =
            (previousProgress < cue.progress && currentProgress >= cue.progress) ||
            (previousProgress > cue.progress && currentProgress <= cue.progress);
          const cueLastPlayed = cueTimes.get(cue.progress) ?? -Infinity;
          if (
            crossed &&
            time - cueLastPlayed >= CUE_COOLDOWN_MS &&
            time - lastCueAt >= GLOBAL_COOLDOWN_MS
          ) {
            playCue(cue.tone);
            cueTimes.set(cue.progress, time);
            lastCueAt = time;
          }
        }
      }
      previousProgress = currentProgress;
      if (enabled && !reducedMotion && !document.hidden) frame = window.requestAnimationFrame(sample);
    };

    const startSampling = () => {
      if (enabled && !reducedMotion && !frame && !document.hidden) {
        previousProgress = progress.current.value;
        frame = window.requestAnimationFrame(sample);
      }
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
        frame = 0;
        if (context?.state === "running") void context.suspend();
      } else {
        if (enabled && context?.state === "suspended") {
          void context.resume();
        }
        startSampling();
      }
    };
    const unsubscribe = useExperienceStore.subscribe((state, previousState) => {
      enabled = state.soundEnabled;
      if (state.soundEnabled && !previousState.soundEnabled && !reducedMotion) {
        ensureContext();
        startSampling();
      }
      if (!state.soundEnabled && previousState.soundEnabled && context?.state === "running") {
        window.cancelAnimationFrame(frame);
        frame = 0;
        void context.suspend();
      }
    });

    document.addEventListener("visibilitychange", onVisibilityChange);
    startSampling();

    return () => {
      unsubscribe();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.cancelAnimationFrame(frame);
      void context?.close();
    };
  }, [progress, reducedMotion]);
}
