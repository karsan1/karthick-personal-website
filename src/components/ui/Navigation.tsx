import type { PortfolioSection } from "@/types/portfolio";

type NavigationProps = {
  sections: PortfolioSection[];
};

export function Navigation({ sections }: NavigationProps) {
  return (
    <nav className="site-nav" aria-label="Portfolio sections">
      <a className="wordmark" href="#home">
        KS
      </a>
      <div className="nav-links">
        {sections.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.eyebrow}
          </a>
        ))}
      </div>
    </nav>
  );
}
