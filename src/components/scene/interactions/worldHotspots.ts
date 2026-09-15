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
  label: string;
  shortLabel: string;
  stationKind: "player" | "bench" | "chair" | "scoreboard" | "equipment" | "tunnel" | "clipboard";
  chapterId?: ChapterId;
  href?: string;
  enabledOnTouch?: boolean;
};

export const WORLD_HOTSPOTS = {
  aboutPlayer: {
    id: "about-player",
    chapterId: "about",
    label: "About Karthick",
    shortLabel: "ABOUT",
    stationKind: "player",
    enabledOnTouch: true,
  },
  experienceBench: {
    id: "experience-bench",
    chapterId: "experience",
    label: "Explore experience",
    shortLabel: "EXPERIENCE",
    stationKind: "bench",
    enabledOnTouch: true,
  },
  researchChair: {
    id: "research-chair",
    chapterId: "research",
    label: "Explore research",
    shortLabel: "RESEARCH",
    stationKind: "chair",
    enabledOnTouch: true,
  },
  projectsScoreboard: {
    id: "projects-scoreboard",
    chapterId: "projects",
    label: "View selected projects",
    shortLabel: "PROJECTS",
    stationKind: "scoreboard",
    enabledOnTouch: true,
  },
  capabilitiesRack: {
    id: "capabilities-rack",
    chapterId: "capabilities",
    label: "Explore capabilities",
    shortLabel: "CAPABILITIES",
    stationKind: "equipment",
    enabledOnTouch: true,
  },
  contactTunnel: {
    id: "contact-tunnel",
    chapterId: "contact",
    label: "Get in touch",
    shortLabel: "CONTACT",
    stationKind: "tunnel",
    enabledOnTouch: true,
  },
  resumeClipboard: {
    id: "resume-clipboard",
    href: "mailto:karthickg.sankar@gmail.com?subject=R%C3%A9sum%C3%A9%20request",
    label: "Request résumé",
    shortLabel: "RÉSUMÉ",
    stationKind: "clipboard",
    enabledOnTouch: true,
  },
} as const satisfies Record<string, WorldHotspotConfig>;
