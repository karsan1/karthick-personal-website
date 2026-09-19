import type { ChapterId, Portfolio } from "@/types/portfolio";
import { Navigation } from "./Navigation";
import { ChapterIndicator } from "./ChapterIndicator";
import { ProjectGallery } from "./ProjectGallery";
import { WorldMenu } from "./WorldMenu";

type PortfolioLayerProps = {
  portfolio: Portfolio;
};

function ChapterHeading({
  id,
  eyebrow,
  title,
  introduction,
}: {
  id: ChapterId;
  eyebrow: string;
  title: string;
  introduction?: string;
}) {
  return (
    <header className="chapter-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={`${id}-title`}>{title}</h2>
      {introduction ? <p className="chapter-introduction">{introduction}</p> : null}
    </header>
  );
}

export function PortfolioLayer({ portfolio }: PortfolioLayerProps) {
  const beats = new Map(portfolio.chapters.map((chapter) => [chapter.id, chapter]));
  const chapterProps = (id: ChapterId) => ({
    id,
    "data-chapter": id,
    "data-chapter-start": beats.get(id)?.start,
    "data-chapter-end": beats.get(id)?.end,
    "aria-labelledby": `${id}-title`,
  });

  return (
    <div className="portfolio-layer">
      <a className="skip-link" href="#about">Skip to portfolio content</a>
      <Navigation items={portfolio.navigation} />
      <ChapterIndicator chapters={portfolio.chapters} />
      <WorldMenu />

      <section className="hero section" {...chapterProps("hero")}>
        <div className="hero-content">
          <p className="eyebrow">{portfolio.role}</p>
          <h1 id="hero-title">{portfolio.name}</h1>
          <p className="hero-copy">{portfolio.introduction}</p>
          <p className="availability">{portfolio.availability}</p>
          <a className="scroll-cue" href="#about">
            Follow the match <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="section content-section" {...chapterProps("about")}>
        <article className="content-card prose-card" tabIndex={0}>
          <ChapterHeading id="about" eyebrow={portfolio.about.eyebrow} title={portfolio.about.title} />
          <p>{portfolio.about.body}</p>
          <ul className="principle-list" aria-label="Working principles">
            {portfolio.about.principles.map((principle) => <li key={principle}>{principle}</li>)}
          </ul>
        </article>
      </section>

      <section className="section content-section section-right" {...chapterProps("experience")}>
        <div className="chapter-panel" tabIndex={0}>
          <ChapterHeading
            id="experience"
            eyebrow="Experience · Rally"
            title="Learning by shipping"
            introduction="Practical work across independent products and collaborative software projects."
          />
          <div className="entry-list">
            {portfolio.experience.map((item) => (
              <article className="entry" key={item.id}>
                <div className="entry-meta">
                  <p>{item.period}</p>
                  <p>{item.organization}</p>
                </div>
                <div>
                  <h3>{item.role}</h3>
                  <p>{item.summary}</p>
                  <ul>{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
                  {item.technologies ? <p className="technology-line">{item.technologies.join(" · ")}</p> : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section content-section" {...chapterProps("research")}>
        <div className="chapter-panel" tabIndex={0}>
          <ChapterHeading
            id="research"
            eyebrow="Research · Change of rhythm"
            title="Questions worth testing"
            introduction="Independent technical inquiry grounded in working software, documented decisions, and reusable systems."
          />
          <div className="research-grid">
            {portfolio.research.map((item) => (
              <article className="content-card research-card" key={item.id}>
                <p className="entry-kicker">{item.institution}</p>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <ul className="tag-list" aria-label={`${item.title} methods`}>
                  {item.methods.map((method) => <li key={method}>{method}</li>)}
                </ul>
                {item.href ? <a className="text-link" href={item.href} target="_blank" rel="noreferrer">Read the source <span aria-hidden="true">↗</span></a> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section content-section section-right" {...chapterProps("projects")}>
        <div className="chapter-panel project-panel" tabIndex={0}>
          <ChapterHeading
            id="projects"
            eyebrow="Projects · Sideline sequence"
            title="Selected builds"
            introduction="Every board uses the same interaction: open the details, understand the work, then follow a standard web link."
          />
          <ProjectGallery projects={portfolio.projects} />
        </div>
      </section>

      <section className="section content-section" {...chapterProps("capabilities")}>
        <div className="chapter-panel" tabIndex={0}>
          <ChapterHeading
            id="capabilities"
            eyebrow="Capabilities · Between points"
            title="A practical toolkit"
            introduction="Technologies are grouped by the kinds of problems they help solve."
          />
          <div className="capability-grid">
            {portfolio.capabilities.map((group) => (
              <article className="capability-group" key={group.id}>
                <h3>{group.title}</h3>
                <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section contact-section" {...chapterProps("contact")}>
        <div className="contact-card" tabIndex={0}>
          <ChapterHeading id="contact" eyebrow={portfolio.contact.eyebrow} title={portfolio.contact.title} />
          <p>{portfolio.contact.body}</p>
          <ul className="contact-links">
            {portfolio.contact.links.map((link) => (
              <li key={link.label}>
                <a href={link.href} {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}>
                  <span>{link.label}</span>
                  <small>{link.description}</small>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="closing-note">Designed and built by Karthick Sankar.</p>
        </div>
      </section>

      <div className="prototype-content-cue" data-prototype-cue="about" aria-hidden="true">
        <span>About · quiet interval</span>
        <strong>Make space for the story.</strong>
      </div>
      <div className="prototype-content-cue" data-prototype-cue="experience" aria-hidden="true">
        <span>Experience · return</span>
        <strong>Momentum, then focus.</strong>
      </div>
      <aside className="debug-readout" data-camera-readout aria-hidden="true" />
    </div>
  );
}
