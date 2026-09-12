import type { Portfolio } from "@/types/portfolio";
import { Navigation } from "./Navigation";

type PortfolioLayerProps = {
  portfolio: Portfolio;
};

export function PortfolioLayer({ portfolio }: PortfolioLayerProps) {
  return (
    <div className="portfolio-layer">
      <Navigation sections={portfolio.sections} />

      <section className="hero section" id="home" aria-labelledby="hero-title">
        <p className="eyebrow">{portfolio.role}</p>
        <h1 id="hero-title">{portfolio.name}</h1>
        <p className="hero-copy">{portfolio.introduction}</p>
        <a className="scroll-cue" href="#about">
          Explore the work <span aria-hidden="true">↓</span>
        </a>
      </section>

      {portfolio.sections.map((section, index) => (
        <section
          className={`section content-section ${index % 2 ? "section-right" : ""}`}
          id={section.id}
          key={section.id}
          aria-labelledby={`${section.id}-title`}
        >
          <div className="content-card">
            <p className="eyebrow">{section.eyebrow}</p>
            <h2 id={`${section.id}-title`}>{section.title}</h2>
            <p>{section.body}</p>
          </div>
        </section>
      ))}

      <aside className="debug-readout" data-camera-readout aria-hidden="true" />
    </div>
  );
}
