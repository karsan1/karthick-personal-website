"use client";

import type { NavigationItem } from "@/types/portfolio";
import { useExperienceStore } from "@/store/experienceStore";

type NavigationProps = {
  items: NavigationItem[];
};

export function Navigation({ items }: NavigationProps) {
  const activeChapter = useExperienceStore((state) => state.activeChapter);
  const setNavigationTarget = useExperienceStore((state) => state.setNavigationTarget);

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
            onClick={() => {
              if (!item.external && item.id !== "resume") setNavigationTarget(item.id);
            }}
            {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
