import type { Portfolio } from "@/types/portfolio";

const email = "karthicksankar10@gmail.com";
const github = "https://github.com/karsan1";

export const portfolio = {
  name: "Karthick Sankar",
  role: "Software engineer & product builder",
  introduction:
    "I build reliable products and data systems across web, mobile, and cloud platforms, pairing clear interfaces with maintainable engineering.",
  availability:
    "Open to software engineering opportunities and thoughtful product collaborations.",
  navigation: [
    { id: "about", label: "About", href: "#about" },
    { id: "experience", label: "Experience", href: "#experience" },
    { id: "research", label: "Research", href: "#research" },
    { id: "projects", label: "Projects", href: "#projects" },
    { id: "capabilities", label: "Capabilities", href: "#capabilities" },
    { id: "contact", label: "Contact", href: "#contact" },
    {
      id: "resume",
      label: "Résumé",
      href: `mailto:${email}?subject=R%C3%A9sum%C3%A9%20request`,
    },
  ],
  chapters: [
    {
      id: "hero",
      label: "Serve",
      start: 0,
      end: 0.12,
      matchBeat: "The server settles, tosses, and begins the point.",
      cameraBeat: "Low broadcast angle behind the near baseline.",
    },
    {
      id: "about",
      label: "First bounce",
      start: 0.12,
      end: 0.24,
      matchBeat: "The serve lands and establishes the rhythm.",
      cameraBeat: "A gentle crane reveals the full court, then pauses.",
    },
    {
      id: "experience",
      label: "Rally",
      start: 0.24,
      end: 0.5,
      matchBeat: "A measured exchange maps one return to each body of work.",
      cameraBeat: "Small lateral moves alternate with readable holds.",
    },
    {
      id: "research",
      label: "Change of rhythm",
      start: 0.5,
      end: 0.64,
      matchBeat: "A high, slower shot creates room for deeper inquiry.",
      cameraBeat: "The camera rises and settles into a composed wide view.",
    },
    {
      id: "projects",
      label: "Sideline sequence",
      start: 0.64,
      end: 0.82,
      matchBeat: "The rally moves toward a row of courtside project boards.",
      cameraBeat: "A restrained track frames each board without chasing the ball.",
    },
    {
      id: "capabilities",
      label: "Between points",
      start: 0.82,
      end: 0.91,
      matchBeat: "The court resets and the toolkit comes into focus.",
      cameraBeat: "Near-static center-court composition.",
    },
    {
      id: "contact",
      label: "Match point",
      start: 0.91,
      end: 1,
      matchBeat: "The final exchange resolves and invites the next conversation.",
      cameraBeat: "A calm hero frame holds through the closing actions.",
    },
  ],
  about: {
    eyebrow: "About · First bounce",
    title: "Make complexity feel clear",
    body:
      "I am a software engineer at Fannie Mae working across cloud data integrations, event-driven services, and developer workflows. Outside work, I build web and native iOS products with clear, useful interfaces. I earned a B.S. in Computer Science from the University of Maryland in 2024.",
    principles: [
      "Start with the person using it.",
      "Make the system legible to the next builder.",
      "Use motion and technology only when they improve the story.",
    ],
  },
  experience: [
    {
      id: "fannie-mae",
      organization: "Fannie Mae",
      role: "Associate Software Engineer",
      period: "Jul 2025 — Present",
      summary:
        "Build and support AWS, Salesforce, and Redshift data integrations serving more than 10 consumers across 500K+ records.",
      highlights: [
        "Migrated CI/CD workflows to GitLab and Terraform for repeatable delivery.",
        "Built an agentic GitHub Copilot workflow and reduced CDC onboarding from about one week to one day.",
      ],
      technologies: ["AWS", "Salesforce", "Redshift", "GitLab", "Terraform", "GitHub Copilot"],
    },
    {
      id: "fannie-mae-internship",
      organization: "Fannie Mae",
      role: "Software Engineer Intern",
      period: "Jun 2024 — Aug 2024",
      summary:
        "Developed Java and Spring Boot services with messaging and relational data integrations.",
      highlights: [
        "Worked with SQS, SNS, and RDS in service workflows.",
        "Added unit coverage with JUnit and Mockito.",
      ],
      technologies: ["Java", "Spring Boot", "SQS", "SNS", "RDS", "JUnit", "Mockito"],
    },
    {
      id: "optum-internship",
      organization: "Optum",
      role: "Software Engineer Intern",
      period: "Jun 2023 — Aug 2023",
      summary:
        "Worked on change data capture and healthcare data workflows with PostgreSQL, Debezium, and Kafka services.",
      highlights: [
        "Built and tested CDC flows with Docker, MSK, and Kafka.",
        "Worked with FHIR data and service integrations.",
      ],
      technologies: ["PostgreSQL", "Debezium", "Docker", "MSK", "Kafka", "FHIR"],
    },
  ],
  research: [
    {
      id: "spatial-storytelling",
      title: "Deterministic spatial storytelling",
      institution: "Independent technical study",
      summary:
        "Exploring how a persistent 3D world can act as navigation without hiding the portfolio it supports. The working model separates semantic HTML from reversible, scroll-scrubbed camera and object choreography.",
      methods: ["React Three Fiber", "GSAP timelines", "Curve sampling", "Progressive enhancement"],
      href: "https://github.com/karsan1/karthick-personal-website",
    },
    {
      id: "academic-content-systems",
      title: "Structured publishing for research portfolios",
      institution: "Independent technical study",
      summary:
        "Investigating content-first ways to present complex technical work without duplicating source material in templates.",
      methods: ["Content modeling", "Schema validation", "Editorial IA", "Static generation"],
    },
  ],
  projects: [
    {
      id: "marketdeck",
      title: "MarketDeck",
      summary: "A stock dashboard with responsive web and native iPhone and iPad apps.",
      details:
        "MarketDeck presents live quotes, watchlists, historical charts, and stock details in a responsive Next.js dashboard and a native SwiftUI app. Finnhub supplies market data; Firebase supports optional sign-in and cross-device state.",
      technologies: ["Next.js", "React", "TypeScript", "SwiftUI", "Firebase", "Finnhub"],
      featured: true,
    },
    {
      id: "photo-map-timeline",
      title: "PhotoMap",
      summary: "A native iOS memory book that connects photos to their dates and places.",
      details:
        "PhotoMap turns a photo library into a timeline and map, with month-based memory views and a focused photo detail experience. Built in SwiftUI with Apple photo and location frameworks.",
      technologies: ["Swift", "SwiftUI", "PhotoKit", "Core Location"],
      featured: true,
    },
    {
      id: "city-bus-app",
      title: "City Bus App",
      summary: "A map-first iOS transit app for routes, stops, arrivals, and bus alerts.",
      details:
        "City Bus App uses SwiftUI and MapKit to show routes, stops, vehicle locations, and trip details. A TypeScript service imports GTFS schedules, processes realtime feeds, and supports arrival and notification features.",
      technologies: ["SwiftUI", "MapKit", "TypeScript", "GTFS", "GTFS-Realtime"],
      featured: true,
    },
    {
      id: "tennis-portfolio",
      title: "3D Tennis Portfolio",
      summary: "This portfolio, designed as a reversible match told through scroll.",
      details:
        "A persistent WebGL court carries the atmosphere while semantic HTML owns every meaningful piece of portfolio content. The architecture keeps camera and ball motion deterministic and preserves a complete non-WebGL reading path.",
      technologies: ["Next.js", "React", "Three.js", "GSAP", "Zustand"],
      repoHref: "https://github.com/karsan1/karthick-personal-website",
      featured: true,
    },
  ],
  capabilities: [
    { id: "languages", title: "Languages", items: ["Java", "Python", "JavaScript", "TypeScript", "Swift", "SQL"] },
    { id: "cloud-data", title: "Cloud & data", items: ["AWS", "Salesforce", "Redshift", "Kafka", "PostgreSQL", "Firebase"] },
    { id: "backend", title: "Backend systems", items: ["Spring Boot", "REST APIs", "Docker", "Terraform", "CDC", "FHIR"] },
    { id: "product", title: "Product delivery", items: ["Next.js", "React", "Tailwind CSS", "GitLab", "GitHub Copilot", "Responsive UI"] },
  ],
  contact: {
    eyebrow: "Contact · Match point",
    title: "Start the next point",
    body:
      "If you are building a product that needs equal care in its structure and its experience, I would like to hear about it.",
    links: [
      { label: "Email Karthick", href: `mailto:${email}`, description: email },
      {
        label: "GitHub",
        href: github,
        description: "Browse public code and current builds",
        external: true,
      },
      {
        label: "Request résumé",
        href: `mailto:${email}?subject=R%C3%A9sum%C3%A9%20request`,
        description: "Ask for the latest PDF résumé",
      },
    ],
  },
} satisfies Portfolio;

export const chapters = portfolio.chapters;
