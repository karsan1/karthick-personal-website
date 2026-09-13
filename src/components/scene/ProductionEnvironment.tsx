import { useGLTF } from "@react-three/drei";
import { Component, Suspense, useCallback, useEffect, useState, type ReactNode } from "react";
import type { Group } from "three";
import { PrimitiveCourtFallback } from "./PrototypeCourt";

/**
 * Runtime contract for Phase 04 static partitions. Node names are documented in
 * assets-source/README.md and validated by scripts/validate-assets.mjs. These
 * assets contain no animation clips; Phase 02 keeps ownership of player and ball
 * motion until authored character clips are introduced.
 */
const PRODUCTION_ASSETS = {
  court: "/models/court.glb",
  props: "/models/props.glb",
  scoreboard: "/models/scoreboard.glb",
  stadium: "/models/stadium-shell.glb",
} as const;

type AssetBoundaryProps = { children: ReactNode; fallback: ReactNode; onError?: () => void };

export class AssetBoundary extends Component<AssetBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function StaticModel({ path, onResolved }: {
  path: (typeof PRODUCTION_ASSETS)[keyof typeof PRODUCTION_ASSETS];
  onResolved?: () => void;
}) {
  // Drei supplies MeshoptDecoder when `useMeshOpt` is true. Keep it explicit so
  // EXT_meshopt_compression remains a stable contract if Drei defaults change.
  const { scene } = useGLTF(path, false, true);

  useEffect(() => {
    onResolved?.();
  }, [onResolved, scene]);

  return <primitive object={scene as Group} />;
}

function DecorativeAssets({ stage, advance }: { stage: number; advance: (stage: number) => void }) {
  return (
    <>
      {stage >= 1 ? <AssetBoundary fallback={null} onError={() => advance(2)}>
        <Suspense fallback={null}><StaticModel path={PRODUCTION_ASSETS.props} onResolved={() => advance(2)} /></Suspense>
      </AssetBoundary> : null}
      {stage >= 2 ? <AssetBoundary fallback={null} onError={() => advance(3)}>
        <Suspense fallback={null}><StaticModel path={PRODUCTION_ASSETS.scoreboard} onResolved={() => advance(3)} /></Suspense>
      </AssetBoundary> : null}
      {stage >= 3 ? <AssetBoundary fallback={null}>
        <Suspense fallback={null}><StaticModel path={PRODUCTION_ASSETS.stadium} /></Suspense>
      </AssetBoundary> : null}
    </>
  );
}

export function ProductionEnvironment() {
  const [decorativeStage, setDecorativeStage] = useState(0);
  const advance = useCallback((stage: number) => {
    setDecorativeStage((current) => Math.max(current, stage));
  }, []);

  return (
    <>
      <AssetBoundary fallback={<PrimitiveCourtFallback />} onError={() => advance(1)}>
        <Suspense fallback={<PrimitiveCourtFallback />}>
          <StaticModel path={PRODUCTION_ASSETS.court} onResolved={() => advance(1)} />
        </Suspense>
      </AssetBoundary>
      <DecorativeAssets stage={decorativeStage} advance={advance} />
    </>
  );
}
