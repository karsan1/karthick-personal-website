"use client";

import { usePortfolioNavigation } from "@/hooks/usePortfolioNavigation";
import { WORLD_HOTSPOTS } from "@/components/scene/interactions/worldHotspots";

const HOTSPOTS = [WORLD_HOTSPOTS.aboutPlayer, WORLD_HOTSPOTS.projectsScoreboard] as const;

/** Keyboard and non-WebGL equivalent controls for the currently interactive world targets. */
export function WorldMenu() {
  const navigateToChapter = usePortfolioNavigation();

  return (
    <nav className="world-menu" aria-label="World destinations">
      <span className="world-menu-label">Court select</span>
      {HOTSPOTS.map((hotspot) => (
        <button key={hotspot.id} type="button" onClick={() => navigateToChapter(hotspot.chapterId)}>
          {hotspot.label}
        </button>
      ))}
    </nav>
  );
}
