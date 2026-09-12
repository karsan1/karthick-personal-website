import { ExperienceShell } from "@/components/experience/ExperienceShell";
import { PortfolioLayer } from "@/components/ui/PortfolioLayer";
import { portfolio } from "@/data/portfolio";

export default function Home() {
  return (
    <main>
      <ExperienceShell />
      <PortfolioLayer portfolio={portfolio} />
    </main>
  );
}
