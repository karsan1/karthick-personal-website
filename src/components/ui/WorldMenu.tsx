"use client";

import { usePortfolioNavigation } from "@/hooks/usePortfolioNavigation";
import { WORLD_HOTSPOTS } from "@/components/scene/interactions/worldHotspots";
import type { WorldHotspotConfig } from "@/components/scene/interactions/worldHotspots";
import { useExperienceStore } from "@/store/experienceStore";

const HOTSPOTS: readonly WorldHotspotConfig[] = Object.values(WORLD_HOTSPOTS);

/** Keyboard and non-WebGL equivalent controls for the currently interactive world targets. */
export function WorldMenu() {
  const navigateToChapter = usePortfolioNavigation();
  const hoveredHotspot = useExperienceStore((state) => state.hoveredHotspot);
  const selectedHotspot = useExperienceStore((state) => state.selectedHotspot);
  const activeChapter = useExperienceStore((state) => state.activeChapter);

  const activeTarget = HOTSPOTS.find(
    (hotspot) => hotspot.id === hoveredHotspot || hotspot.id === selectedHotspot
  );

  return (
    <nav className="world-menu" aria-label="World destinations">
      <div className="world-menu-header">
        <span className="world-menu-label">Court select</span>
        {activeTarget ? (
          <span className="world-menu-target" aria-live="polite">
            [{activeTarget.shortLabel}]
          </span>
        ) : null}
      </div>
      {HOTSPOTS.map((hotspot) => {
        const isHovered = hoveredHotspot === hotspot.id;
        const isActive =
          selectedHotspot === hotspot.id ||
          (Boolean(hotspot.chapterId) && activeChapter === hotspot.chapterId);

        const handleMouseEnter = () => useExperienceStore.getState().setHoveredHotspot(hotspot.id);
        const handleMouseLeave = () => {
          if (useExperienceStore.getState().hoveredHotspot === hotspot.id) {
            useExperienceStore.getState().setHoveredHotspot(null);
          }
        };

        if (hotspot.chapterId) {
          return (
            <button
              key={hotspot.id}
              type="button"
              data-hovered={isHovered ? "true" : undefined}
              data-active={isActive ? "true" : undefined}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                useExperienceStore.getState().setSelectedHotspot(hotspot.id);
                if (hotspot.chapterId) navigateToChapter(hotspot.chapterId);
              }}
            >
              {hotspot.label}
            </button>
          );
        }

        return (
          <a
            key={hotspot.id}
            href={hotspot.href}
            data-hovered={isHovered ? "true" : undefined}
            data-active={isActive ? "true" : undefined}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => useExperienceStore.getState().setSelectedHotspot(hotspot.id)}
          >
            {hotspot.label}
          </a>
        );
      })}
    </nav>
  );
}
