"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectItem } from "@/types/portfolio";
import { useExperienceStore } from "@/store/experienceStore";

export function ProjectGallery({ projects }: { projects: ProjectItem[] }) {
  const [selected, setSelected] = useState<ProjectItem | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const setActiveProjectId = useExperienceStore((state) => state.setActiveProjectId);
  const setProjectDetailOpen = useExperienceStore((state) => state.setProjectDetailOpen);
  const close = useCallback(() => {
    setSelected(null);
    setActiveProjectId(null);
    setProjectDetailOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, [setActiveProjectId, setProjectDetailOpen]);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.dataset.projectDialogOpen = "true";
    const isolated = new Map<HTMLElement, boolean>();
    let branch: HTMLElement | null = backdropRef.current;
    while (branch?.parentElement) {
      for (const sibling of Array.from(branch.parentElement.children)) {
        if (sibling === branch || !(sibling instanceof HTMLElement)) continue;
        isolated.set(sibling, sibling.inert);
        sibling.inert = true;
      }
      branch = branch.parentElement;
      if (branch === document.body) break;
    }
    requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      isolated.forEach((wasInert, element) => { element.inert = wasInert; });
      delete document.body.dataset.projectDialogOpen;
    };
  }, [close, selected]);

  return (
    <>
      <div className="project-list">
        {projects.map((project, index) => (
          <article className="project-card" key={project.id}>
            <div className="project-card-row">
              <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-summary">{project.summary}</p>
              </div>
              <button
                className="project-open"
                type="button"
                onClick={(event) => {
                  triggerRef.current = event.currentTarget;
                  setSelected(project);
                  setActiveProjectId(project.id);
                  setProjectDetailOpen(true);
                }}
                aria-label={`Open details for ${project.title}`}
              >
                View <span aria-hidden="true">↗</span>
              </button>
            </div>
          </article>
        ))}
      </div>
      {selected ? (
        <div ref={backdropRef} className="project-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <section ref={dialogRef} className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title">
            <button ref={closeRef} className="dialog-close" type="button" onClick={close} aria-label="Close project details">Close <span aria-hidden="true">×</span></button>
            <p className="eyebrow">Project detail</p>
            <h3 id="project-dialog-title">{selected.title}</h3>
            <p className="project-dialog-summary">{selected.summary}</p>
            <p className="project-dialog-body">{selected.details}</p>
            <ul className="tag-list" aria-label={`${selected.title} technologies`}>
              {selected.technologies.map((technology) => <li key={technology}>{technology}</li>)}
            </ul>
            <div className="project-links">
              {selected.href ? <a href={selected.href} target="_blank" rel="noreferrer">Visit project <span aria-hidden="true">↗</span></a> : null}
              {selected.repoHref ? <a href={selected.repoHref} target="_blank" rel="noreferrer">View source <span aria-hidden="true">↗</span></a> : null}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
