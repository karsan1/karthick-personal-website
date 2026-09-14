"use client";

import { useEffect, type MutableRefObject, type RefObject } from "react";
import { getGSAP } from "@/lib/gsap";
import { PROTOTYPE_LABELS, sampleMatchState, type NarrativeProgress } from "./prototypeMotion";
import { useExperienceStore } from "@/store/experienceStore";
import { PORTFOLIO_NAVIGATION_EVENT, requestPortfolioNavigation } from "@/hooks/usePortfolioNavigation";
import type { ChapterId } from "@/types/portfolio";

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
    let alignmentFrame = 0;
    let narrativeTrigger: { refresh: () => void; start: number; end: number } | undefined;
    let layoutRefreshPending = false;
    let refreshingNarrative = false;
    let reducedScrollFrame = 0;

    const commitActiveChapter = (value: number) => {
      const chapter = sampleMatchState(value).chapter;
      const state = useExperienceStore.getState();
      if (state.activeChapter !== chapter) state.setActiveChapter(chapter);
      if (state.navigationTarget === chapter) state.setNavigationTarget(null);
    };

    const chapterScrollTop = (hash = window.location.hash) => {
      const id = hash.slice(1);
      if (!id) return undefined;
      const chapter = document.getElementById(id);
      const rawStart = chapter?.dataset.chapterStart;
      if (!chapter || rawStart === undefined) return undefined;
      const progressStart = Number(rawStart);
      if (!Number.isFinite(progressStart)) return undefined;
      // Land just inside non-hero chapters so pixel rounding and scrub damping
      // cannot retain the previous continuous beat at a shared boundary.
      const landingProgress = progressStart === 0 ? 0 : Math.min(progressStart + 0.005, 1);
      const fallbackEnd = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const triggerStart = narrativeTrigger?.start ?? 0;
      const triggerEnd = narrativeTrigger?.end ?? fallbackEnd;
      return triggerStart + (triggerEnd - triggerStart) * landingProgress;
    };

    const alignHashToNarrative = () => {
      if (layoutRefreshPending && narrativeTrigger && !refreshingNarrative) {
        layoutRefreshPending = false;
        refreshingNarrative = true;
        narrativeTrigger.refresh();
        refreshingNarrative = false;
      }
      const top = chapterScrollTop();
      if (top === undefined || Math.abs(window.scrollY - top) < 2) return;
      window.scrollTo({ top, behavior: "auto" });
    };

    const requestHashAlignment = () => {
      window.cancelAnimationFrame(alignmentFrame);
      // The browser's native hash restoration can run after the first layout
      // frame on an initial deep link. Align on the following frame so the
      // normalized narrative target is the final scroll position.
      alignmentFrame = window.requestAnimationFrame(() => {
        alignmentFrame = window.requestAnimationFrame(alignHashToNarrative);
      });
    };

    const requestLayoutRealignment = () => {
      layoutRefreshPending = true;
      requestHashAlignment();
    };

    const onHashNavigation = () => requestHashAlignment();
    const navigateToChapter = (chapterId: ChapterId) => {
      const href = `#${chapterId}`;
      const top = chapterScrollTop(href);
      if (top === undefined) return;
      if (window.location.hash !== href) window.history.pushState(null, "", href);
      window.scrollTo({ top, behavior: "auto" });
      // A same-chapter request does not guarantee a ScrollTrigger update. This
      // request has been resolved once the canonical scroll position is set.
      const state = useExperienceStore.getState();
      if (state.navigationTarget === chapterId) state.setNavigationTarget(null);
      if (reducedMotion) {
        const chapterProgress = Number(document.getElementById(chapterId)?.dataset.chapterStart ?? 0);
        progress.current.value = chapterProgress;
        commitActiveChapter(chapterProgress);
      }
    };
    const onPortfolioNavigation = (event: Event) => navigateToChapter((event as CustomEvent<ChapterId>).detail);
    const onResize = () => requestLayoutRealignment();
    const onPageReady = () => requestLayoutRealignment();
    const onReducedScroll = () => {
      window.cancelAnimationFrame(reducedScrollFrame);
      reducedScrollFrame = window.requestAnimationFrame(() => {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const value = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
        progress.current.value = value;
        commitActiveChapter(value);
      });
    };
    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const href = link?.getAttribute("href");
      if (!href || href === "#") return;
      event.preventDefault();
      requestPortfolioNavigation(href.slice(1) as ChapterId);
    };

    document.addEventListener("click", onDocumentClick);
    window.addEventListener(PORTFOLIO_NAVIGATION_EVENT, onPortfolioNavigation);
    window.addEventListener("hashchange", onHashNavigation);
    window.addEventListener("popstate", onHashNavigation);
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onPageReady);
    window.addEventListener("pageshow", onPageReady);
    if (reducedMotion) window.addEventListener("scroll", onReducedScroll, { passive: true });
    void document.fonts.ready.then(() => {
      if (!cancelled) requestLayoutRealignment();
    });
    // Window resize can fire before responsive content has changed the document
    // height. Observe the settled layout too, so a hash remains mapped to its
    // normalized chapter range after wrapping/reflow. Scrolling itself does not
    // change element dimensions, so this cannot feed back into an observer loop.
    const layoutObserver = new ResizeObserver(requestLayoutRealignment);
    layoutObserver.observe(document.documentElement);
    layoutObserver.observe(document.body);

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
                  onRefresh: requestHashAlignment,
                  onUpdate: (self: { progress: number }) => commitActiveChapter(self.progress),
                },
              }),
        });
        narrativeTrigger = timeline.scrollTrigger ?? undefined;

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
          const hashChapter = document.getElementById(window.location.hash.slice(1));
          const hashProgress = Number(hashChapter?.dataset.chapterStart);
          commitActiveChapter(Number.isFinite(hashProgress) ? hashProgress : 0);
          requestHashAlignment();
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

        requestHashAlignment();

      }, scope);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(alignmentFrame);
      window.cancelAnimationFrame(reducedScrollFrame);
      document.removeEventListener("click", onDocumentClick);
      window.removeEventListener(PORTFOLIO_NAVIGATION_EVENT, onPortfolioNavigation);
      window.removeEventListener("hashchange", onHashNavigation);
      window.removeEventListener("popstate", onHashNavigation);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onPageReady);
      window.removeEventListener("pageshow", onPageReady);
      window.removeEventListener("scroll", onReducedScroll);
      layoutObserver.disconnect();
      narrativeTrigger = undefined;
      context?.revert();
    };
  }, [debug, progress, reducedMotion, scope]);
}
