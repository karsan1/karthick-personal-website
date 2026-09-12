import type { Portfolio } from "@/types/portfolio";

const email = "karthickg.sankar@gmail.com";
const github = "https://github.com/karsan1";

export const portfolio = {
  name: "Karthick Sankar",
  role: "Software engineer & product builder",
  introduction:
    "I build useful digital products across the web and Android, pairing clear systems with interfaces people can understand.",
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
      "I am a software engineer drawn to the whole product: how information is structured, how an interaction communicates, and how the implementation holds up after launch. My work spans web experiences, Android applications, data-backed products, and the systems that keep their content maintainable.",
    principles: [
      "Start with the person using it.",
      "Make the system legible to the next builder.",
      "Use motion and technology only when they improve the story.",
    ],
  },
  experience: [
    {
      id: "independent-products",
      organization: "Independent product work",
      role: "Designer & developer",
      period: "2025 — Present",
      summary:
        "Designing and shipping focused websites for academic, cultural, and personal stories, with an emphasis on content systems and durable handoff.",
      highlights: [
        "Built an Astro and TypeScript academic portfolio with validated research content.",
        "Created event and brochure experiences that translate rich source material into clear web narratives.",
        "Documented editing and deployment workflows so site owners can maintain their own content.",
      ],
      technologies: ["Astro", "TypeScript", "Next.js", "Content collections"],
    },
    {
      id: "software-coursework",
      organization: "Computer science coursework",
      role: "Software developer",
      period: "2022 — 2024",
      summary:
        "Built collaborative and individual software across full-stack web and Android courses, moving from interface concepts to database and API integration.",
      highlights: [
        "Co-developed a MongoDB-backed video game review platform with live PokeAPI search.",
        "Built a Kotlin Android scheduler around native date, time, and email flows.",
        "Explored interactive games and utility applications across Java, Kotlin, and the web stack.",
      ],
      technologies: ["Kotlin", "Java", "Node.js", "MongoDB", "REST APIs"],
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
      institution: "Roshini academic website",
      summary:
        "Investigating a content-first way to present interdisciplinary research across planetary science, paleomagnetism, astrobiology, policy, teaching, and outreach without duplicating source material in templates.",
      methods: ["Content modeling", "Schema validation", "Editorial IA", "Static generation"],
      href: "https://github.com/karsan1/roshini-website",
    },
  ],
  projects: [
    {
      id: "roshini-academic-website",
      title: "Roshini Academic Website",
      summary: "An editorial scientific portfolio built around structured research content.",
      details:
        "The site brings research, science policy, teaching, and outreach into one coherent publishing system. Validated content collections keep project data separate from presentation and make future updates safer.",
      technologies: ["Astro", "TypeScript", "Content collections", "GitHub Actions"],
      href: "https://karsan1.github.io/roshini-website/",
      repoHref: "https://github.com/karsan1/roshini-website",
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
    {
      id: "video-game-review",
      title: "Video Game Review Platform",
      summary: "A collaborative review blog with persistent posts and live Pokémon lookup.",
      details:
        "Users can publish game reviews through a form, browse community submissions stored in MongoDB, and query Pokémon types through the PokeAPI. The project joined server-rendered content, database work, and third-party API handling.",
      technologies: ["Node.js", "MongoDB", "PokeAPI", "CSS"],
      href: "https://videogame-review-website.onrender.com/",
      repoHref: "https://github.com/karsan1/Video-Game-Review",
      featured: true,
    },
    {
      id: "mobile-meeting-scheduler",
      title: "Mobile Meeting Scheduler",
      summary: "A Kotlin Android app for composing calendar-aware meeting reminders.",
      details:
        "The app combines native calendar and clock selection with an email handoff, letting a user choose a meeting time and send the reminder directly through a mobile mail flow.",
      technologies: ["Kotlin", "Android", "Native intents"],
      repoHref: "https://github.com/karsan1/Android-Final-Project",
      featured: true,
    },
    {
      id: "arangetram-websites",
      title: "Arangetram Digital Story",
      summary: "Event websites that turn a traditional performance program into a shareable experience.",
      details:
        "A pair of web builds explored long-form event storytelling and a concise digital brochure format, balancing ceremonial detail with a clear experience for guests on mobile and desktop.",
      technologies: ["HTML", "CSS", "Responsive design"],
      repoHref: "https://github.com/karsan1/SrutiArangetramWebsite",
      featured: false,
    },
  ],
  capabilities: [
    { id: "interfaces", title: "Interfaces", items: ["React", "Next.js", "Astro", "TypeScript", "Responsive CSS"] },
    { id: "immersive", title: "Interactive systems", items: ["Three.js", "React Three Fiber", "GSAP", "Accessible motion"] },
    { id: "applications", title: "Applications", items: ["Kotlin", "Android", "Java", "Node.js", "REST APIs"] },
    { id: "data", title: "Data & delivery", items: ["MongoDB", "Content modeling", "GitHub Actions", "Vercel"] },
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
