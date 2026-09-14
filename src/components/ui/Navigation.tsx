"use client";

import type { NavigationItem } from "@/types/portfolio";
import { useExperienceStore } from "@/store/experienceStore";
import { usePortfolioNavigation } from "@/hooks/usePortfolioNavigation";
import { ExperienceControls } from "./ExperienceControls";

type NavigationProps = {
  items: NavigationItem[];
};

export function Navigation({ items }: NavigationProps) {
  const activeChapter = useExperienceStore((state) => state.activeChapter);
  const navigateToChapter = usePortfolioNavigation();

  return (
    <nav className="site-nav" aria-label="Portfolio sections">
      <a className="wordmark" href="#hero" aria-label="Karthick Sankar, back to top">
        KS
      </a>
      <div className="nav-links">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            aria-current={item.id === activeChapter ? "page" : undefined}
            onClick={(event) => {
              if (!item.external && item.id !== "resume") {
                event.preventDefault();
                navigateToChapter(item.id);
              }
            }}
            {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            {item.label}
          </a>
        ))}
      </div>
      <ExperienceControls />
    </nav>
  );
}
