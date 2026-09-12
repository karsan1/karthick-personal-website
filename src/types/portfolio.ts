export type ChapterId =
  | "hero"
  | "about"
  | "experience"
  | "research"
  | "projects"
  | "capabilities"
  | "contact";

export type NavigationItem = {
  id: ChapterId | "resume";
  label: string;
  href: string;
  external?: boolean;
};

export type Chapter = {
  id: ChapterId;
  label: string;
  start: number;
  end: number;
  matchBeat: string;
  cameraBeat: string;
};

export type ExperienceItem = {
  id: string;
  organization: string;
  role: string;
  period: string;
  location?: string;
  summary: string;
  highlights: string[];
  technologies?: string[];
};

export type ProjectItem = {
  id: string;
  title: string;
  summary: string;
  details: string;
  technologies: string[];
  href?: string;
  repoHref?: string;
  image?: string;
  featured: boolean;
};

export type ResearchItem = {
  id: string;
  title: string;
  institution: string;
  summary: string;
  methods: string[];
  href?: string;
};

export type CapabilityGroup = {
  id: string;
  title: string;
  items: string[];
};

export type ContactLink = {
  label: string;
  href: string;
  description: string;
  external?: boolean;
};

export type Portfolio = {
  name: string;
  role: string;
  introduction: string;
  availability: string;
  navigation: NavigationItem[];
  chapters: Chapter[];
  about: {
    eyebrow: string;
    title: string;
    body: string;
    principles: string[];
  };
  experience: ExperienceItem[];
  research: ResearchItem[];
  projects: ProjectItem[];
  capabilities: CapabilityGroup[];
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    links: ContactLink[];
  };
};
