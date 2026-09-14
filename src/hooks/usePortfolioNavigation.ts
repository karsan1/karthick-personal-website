"use client";

import { useCallback } from "react";
import type { ChapterId } from "@/types/portfolio";
import { useExperienceStore } from "@/store/experienceStore";

export const PORTFOLIO_NAVIGATION_EVENT = "portfolio:navigate";

/**
 * Requests a canonical chapter jump. The ScrollTrigger owner resolves the
 * destination into a scroll position, so callers never manipulate the camera.
 */
export function requestPortfolioNavigation(chapterId: ChapterId) {
  useExperienceStore.getState().setNavigationTarget(chapterId);
  window.dispatchEvent(new CustomEvent<ChapterId>(PORTFOLIO_NAVIGATION_EVENT, { detail: chapterId }));
}

export function usePortfolioNavigation() {
  return useCallback((chapterId: ChapterId) => requestPortfolioNavigation(chapterId), []);
}
