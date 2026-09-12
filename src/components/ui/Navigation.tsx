import type { NavigationItem } from "@/types/portfolio";

type NavigationProps = {
  items: NavigationItem[];
};

export function Navigation({ items }: NavigationProps) {
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
            {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
