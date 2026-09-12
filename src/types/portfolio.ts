export type PortfolioSection = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
};

export type Portfolio = {
  name: string;
  role: string;
  introduction: string;
  sections: PortfolioSection[];
};
