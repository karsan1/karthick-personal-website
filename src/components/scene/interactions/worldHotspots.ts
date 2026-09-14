import type { ChapterId } from "@/types/portfolio";

export type WorldHotspotId =
  | "about-player"
  | "experience-bench"
  | "research-chair"
  | "projects-scoreboard"
  | "capabilities-rack"
  | "contact-tunnel"
  | "resume-clipboard";

export type WorldHotspotConfig = {
  id: WorldHotspotId;
  chapterId: ChapterId;
  label: string;
  enabledOnTouch?: boolean;
};

export const WORLD_HOTSPOTS = {
  aboutPlayer: {
    id: "about-player",
    chapterId: "about",
    label: "About Karthick",
    enabledOnTouch: true,
  },
  projectsScoreboard: {
    id: "projects-scoreboard",
    chapterId: "projects",
    label: "View selected projects",
    enabledOnTouch: true,
  },
} as const satisfies Record<string, WorldHotspotConfig>;
