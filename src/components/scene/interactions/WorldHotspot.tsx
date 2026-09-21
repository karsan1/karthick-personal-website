import { useCallback, useEffect, type ReactNode } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { BoxGeometry, MeshBasicMaterial } from "three";
import { requestPortfolioNavigation } from "@/hooks/usePortfolioNavigation";
import { useExperienceStore } from "@/store/experienceStore";
import type { WorldHotspotConfig } from "./worldHotspots";

const ACCENT_MARKER_GEOMETRY = new BoxGeometry(0.14, 0.14, 0.14);
const ACCENT_MARKER_MATERIAL = new MeshBasicMaterial({ color: "#d7bd65" });

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
  const hoveredHotspot = useExperienceStore((state) => state.hoveredHotspot);
  const selectedHotspot = useExperienceStore((state) => state.selectedHotspot);
  const isHovered = hoveredHotspot === config.id;
  const isSelected = selectedHotspot === config.id;
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
    if (config.chapterId) requestPortfolioNavigation(config.chapterId);
    else if (config.href) window.location.assign(config.href);
  }, [config.chapterId, config.href, config.id, enabled]);

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
      {(isHovered || isSelected) && hitArea ? (
        <mesh
          position={[
            hitPosition[0],
            hitPosition[1] + hitArea[1] / 2 + 0.28 + (isHovered ? 0.04 : 0),
            hitPosition[2],
          ]}
          rotation={[0, 0, Math.PI / 4]}
          geometry={ACCENT_MARKER_GEOMETRY}
          material={ACCENT_MARKER_MATERIAL}
        />
      ) : null}
    </group>
  );
}
