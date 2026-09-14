"use client";

import type { Chapter } from "@/types/portfolio";
import { useExperienceStore } from "@/store/experienceStore";

export function ChapterIndicator({ chapters }: { chapters: Chapter[] }) {
  const activeChapter = useExperienceStore((state) => state.activeChapter);
  const active = chapters.find((chapter) => chapter.id === activeChapter) ?? chapters[0];
  const activeIndex = Math.max(0, chapters.findIndex((chapter) => chapter.id === active.id));

  return (
    <aside className="chapter-indicator" aria-label="Current portfolio chapter">
      <span className="chapter-indicator-label">Point {String(activeIndex + 1).padStart(2, "0")}</span>
      <span className="chapter-indicator-name">{active.label}</span>
      <span className="chapter-indicator-track" aria-hidden="true">
        <span style={{ width: `${((activeIndex + 1) / chapters.length) * 100}%` }} />
      </span>
    </aside>
  );
}
