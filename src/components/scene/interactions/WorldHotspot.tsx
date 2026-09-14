import { useCallback, useEffect, type ReactNode } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { requestPortfolioNavigation } from "@/hooks/usePortfolioNavigation";
import { useExperienceStore } from "@/store/experienceStore";
import type { WorldHotspotConfig } from "./worldHotspots";

type WorldHotspotProps = WorldHotspotConfig & {
  children: ReactNode;
  /** A local, transparent box that makes a target comfortably tappable. */
  hitArea?: readonly [number, number, number];
  hitPosition?: readonly [number, number, number];
};

/** Reusable scene-side target with coarse interaction state only. */
export function WorldHotspot({ children, hitArea, hitPosition = [0, 0, 0], ...config }: WorldHotspotProps) {
  const interactionMode = useExperienceStore((state) => state.interactionMode);
  const projectDetailOpen = useExperienceStore((state) => state.projectDetailOpen);
  const enabled = interactionMode === "explore" && !projectDetailOpen;

  const clearHover = useCallback(() => {
    const state = useExperienceStore.getState();
    if (state.hoveredHotspot === config.id) state.setHoveredHotspot(null);
    document.body.style.cursor = "";
  }, [config.id]);

  useEffect(() => clearHover, [clearHover]);

  const onPointerOver = useCallback((event: ThreeEvent<PointerEvent>) => {
    if (!enabled) return;
    event.stopPropagation();
    useExperienceStore.getState().setHoveredHotspot(config.id);
    document.body.style.cursor = "pointer";
  }, [config.id, enabled]);

  const onPointerOut = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    clearHover();
  }, [clearHover]);

  const onClick = useCallback((event: ThreeEvent<MouseEvent>) => {
    if (!enabled) return;
    event.stopPropagation();
    const state = useExperienceStore.getState();
    state.setSelectedHotspot(config.id);
    requestPortfolioNavigation(config.chapterId);
  }, [config.chapterId, config.id, enabled]);

  return (
    <group
      name={`hotspot-${config.id}`}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    >
      {children}
      {hitArea ? (
        <mesh position={hitPosition}>
          <boxGeometry args={hitArea} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      ) : null}
    </group>
  );
}
