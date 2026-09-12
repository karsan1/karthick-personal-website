"use client";

import { useEffect, type MutableRefObject, type RefObject } from "react";
import { getGSAP } from "@/lib/gsap";
import { PROTOTYPE_LABELS, type NarrativeProgress } from "./prototypeMotion";

type UsePrototypeTimelineOptions = {
  scope: RefObject<HTMLElement | null>;
  progress: MutableRefObject<NarrativeProgress>;
  debug: boolean;
  reducedMotion: boolean;
};

export function usePrototypeTimeline({
  scope,
  progress,
  debug,
  reducedMotion,
}: UsePrototypeTimelineOptions) {
  useEffect(() => {
    let cancelled = false;
    let context: { revert: () => void } | undefined;

    void getGSAP().then((gsap) => {
      if (cancelled || !scope.current) {
        return;
      }

      context = gsap.context(() => {
        const aboutCue = document.querySelector<HTMLElement>("[data-prototype-cue='about']");
        const experienceCue = document.querySelector<HTMLElement>("[data-prototype-cue='experience']");
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          paused: reducedMotion,
          ...(reducedMotion
            ? {}
            : {
                scrollTrigger: {
                  trigger: document.documentElement,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 0.45,
                  invalidateOnRefresh: true,
                  markers: debug,
                },
              }),
        });

        timeline
          .addLabel("hero_idle", PROTOTYPE_LABELS.heroIdle)
          .addLabel("serve_toss", PROTOTYPE_LABELS.serveToss)
          .addLabel("serve_contact", PROTOTYPE_LABELS.serveContact)
          .addLabel("first_bounce", PROTOTYPE_LABELS.firstBounce)
          .addLabel("player_b_return", PROTOTYPE_LABELS.playerBReturn)
          .addLabel("second_bounce", PROTOTYPE_LABELS.secondBounce)
          .addLabel("player_a_return", PROTOTYPE_LABELS.playerAReturn)
          .addLabel("content_pause", PROTOTYPE_LABELS.contentPause)
          .addLabel("final_exchange", PROTOTYPE_LABELS.finalExchange)
          .addLabel("prototype_end", PROTOTYPE_LABELS.prototypeEnd)
          .to(progress.current, { value: 1, duration: 1 }, 0);

        if (reducedMotion) {
          progress.current.value = PROTOTYPE_LABELS.contentPause;
          timeline.pause(0);
          return;
        }

        if (aboutCue) {
          timeline
            .fromTo(
              aboutCue,
              { autoAlpha: 0, y: 18 },
              { autoAlpha: 1, y: 0, duration: 0.04, ease: "power1.out" },
              0.64,
            )
            .to(aboutCue, { autoAlpha: 0, y: -12, duration: 0.035 }, 0.77);
        }

        if (experienceCue) {
          timeline.fromTo(
            experienceCue,
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.04, ease: "power1.out" },
            0.8,
          );
        }

      }, scope);
    });

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [debug, progress, reducedMotion, scope]);
}
