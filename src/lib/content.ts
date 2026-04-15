// Single source of truth. UI components hold no prose.

// Career began April 2022 (BJIT Group). Everything time-based computes from here.
const CAREER_START = new Date(2022, 3, 1);

function yearsSince(d: Date): number {
  const ms = Date.now() - d.getTime();
  return Math.max(1, Math.floor(ms / (365.25 * 24 * 60 * 60 * 1000)));
}

function word(n: number): string {
  const map = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
  return map[n] ?? String(n);
}

export const profile = {
  name: "Md. Mosfikur Rahman",
  shortName: "Mosfikur",
  role: "Engineer · Researcher · Architect",
  roleLong: "Engineer II, Akij iBOS Ltd.",
  tagline:
    "Designing the quiet half of software — services, schemas, and workflows — in Dhaka.",
  location: "Dhaka, Bangladesh",
  email: "mdmosfikurrahman.cse@gmail.com",
  phone: "+880 1797-554948",
  cvUrl: "https://mdmosfikurrahman.github.io/resume/",
  links: {
    github: "https://github.com/mdmosfikurrahman",
    linkedin: "https://linkedin.com/in/mdmosfikurrahman",
    scholar: "https://scholar.google.com/citations?user=1GAfMAEAAAAJ",
    orcid: "https://orcid.org/",
  },
};

export type Role = {
  company: string;
  companyUrl: string;
  title: string;
  from: string;
  to: string;
  place: string;
  summary: string;
  bullets: string[];
  stack: string[];
};

export const roles: Role[] = [
  {
    company: "Akij iBOS Ltd.",
    companyUrl: "https://ibos.io/",
    title: "Engineer II — Backend architecture",
    from: "2024-11",
    to: "present",
    place: "Dhaka, BD",
    summary:
      "Working on backend architecture and system design for an OTA platform — scalable, configurable, rule-driven systems — with hands-on work across Java, .NET, and Node, Docker, and deployment.",
    bullets: [
      "Backend architecture and system design for an OTA platform, focused on scalable and configurable services.",
      "Designing rule-driven logic, supplier integration flows, and microservice-based workflows.",
      "Working across multiple stacks — .NET and Java — with hands-on Docker and deployment experience.",
      "Shaping service boundaries and domain models to keep the estate maintainable as it grows.",
    ],
    stack: ["Java", "Spring Boot", ".NET", "Node.js", "Drools", "gRPC", "Docker", "Kubernetes"],
  },
  {
    company: "REVE Systems Ltd.",
    companyUrl: "https://www.revesoft.com/",
    title: "Software Engineer",
    from: "2023-07",
    to: "2024-10",
    place: "Dhaka, BD",
    summary:
      "Enterprise backend in Java and Spring Boot for the national Customs Bond Management System. Built full-stack modules with React and Oracle; focused on throughput, security, and compliance.",
    bullets: [
      "Shipped production modules on a national compliance system (NBR Customs Bond).",
      "Built full-stack features — React front, Spring Boot back, Oracle data layer.",
      "Improved system throughput ~25% through query tuning and access-path refactoring.",
      "Hardened authentication and authorisation via OAuth2 and Spring Security.",
      "Automated BGMEA / BKMEA sync for garment-export declaration processing.",
    ],
    stack: ["Java", "Spring Boot", "React", "Oracle", "OAuth2"],
  },
  {
    company: "BJIT Group",
    companyUrl: "https://bjitgroup.com/",
    title: "Software Engineer — Backend (GraphQL BFF)",
    from: "2022-04",
    to: "2023-06",
    place: "Dhaka, BD",
    summary:
      "Backend for Rakuten Echiba e-commerce and the Denka corporate CMS. GraphQL-based BFF, schema-stitched resolvers, database optimisation — delivery to Japanese stakeholders.",
    bullets: [
      "Built GraphQL BFF services handling complex nested data with resolver batching.",
      "Reduced query latency via schema stitching and join-path optimisation.",
      "Delivered CMS and multilingual content logic for Denka corporate site.",
      "Contributed reusable service patterns to internal GraphQL schema tooling.",
    ],
    stack: ["Java", "Spring Boot", "GraphQL", "Thymeleaf", "Oracle"],
  },
];

export type Project = {
  name: string;
  at: string;
  href?: string;
  year: string;
  role: string;
  blurb: string;
  tags: string[];
  flagship?: boolean;
};

export const projects: Project[] = [
  {
    name: "OTA Platform — Backend",
    at: "Akij iBOS Ltd. · unreleased",
    year: "2024—",
    role: "Backend architecture & system design",
    blurb:
      "An online travel platform under active development. Backend architecture built around supplier integration, rule-driven pricing logic, and configurable microservice workflows. The system is designed configuration-first, so product changes rarely mean code changes. Details under wraps until launch.",
    tags: ["architecture", "microservices", "rule engine", "OTA"],
    flagship: true,
  },
  {
    name: "Customs Bond Management System",
    at: "REVE Systems · National Board of Revenue",
    href: "https://cusbond.gov.bd/",
    year: "2023–24",
    role: "Full-stack Engineer",
    blurb:
      "National-scale bond system for the NBR. Owned the Legal Case and Utilization Declaration modules, BGMEA/BKMEA sync for garment-export compliance, audit trail, and role-based access control.",
    tags: ["Spring Boot", "React", "Oracle", "compliance"],
  },
  {
    name: "Rakuten Echiba — GraphQL BFF",
    at: "BJIT · Rakuten",
    href: "https://www.rakuten.co.jp/",
    year: "2022–23",
    role: "Backend Engineer",
    blurb:
      "GraphQL BFF for Rakuten Echiba e-commerce. Resolver batching, schema stitching, and query-path optimisation. Internal tooling for consistent schema generation across teams.",
    tags: ["GraphQL", "Java", "Spring Boot"],
  },
  {
    name: "Denka Corporate CMS",
    at: "BJIT · Denka",
    year: "2022–23",
    role: "Full-stack Engineer",
    blurb:
      "Corporate CMS for Denka Japan. Dynamic Marquee components, content scheduling, multilingual support, SEO and analytics integration across a Thymeleaf-driven stack.",
    tags: ["Java", "Thymeleaf", "CMS"],
  },
];

export type Publication = {
  key: string;
  type: "journal" | "conference" | "chapter";
  title: string;
  authors: string[];
  venue: string;
  year: number;
  volume?: string;
  pages?: string;
  doi?: string;
  tags?: string[];
};

export const publications: Publication[] = [
  {
    key: "Johora2024CovidPrediction",
    type: "conference",
    title:
      "Machine Learning-Based Prediction of COVID-19: A Robust Approach for Early Diagnosis and Treatment",
    authors: [
      "Johora, Fatema Tuj",
      "Mahfuja, Israt Binte",
      "Rahman, A. N. M. Masuqur",
      "Rahman, Md. Mosfikur",
      "Rahman, Md. Sadekur",
    ],
    venue:
      "Proc. 5th Intl. Conf. on Trends in Computational and Cognitive Engineering, Springer Nature Singapore",
    year: 2024,
    pages: "205–215",
    doi: "10.1007/978-981-97-1923-5_16",
    tags: ["ML", "health"],
  },
  {
    key: "Johora2023ChaoticEncryption",
    type: "conference",
    title: "A New Chaotic-Based Analysis of Data Encryption and Decryption",
    authors: [
      "Johora, Fatema Tuj",
      "Alamin-Ul-Islam",
      "Yesmin, Farzana",
      "Rahman, Md. Mosfikur",
    ],
    venue: "Advances in Data Science and Artificial Intelligence, Springer International",
    year: 2023,
    pages: "455–468",
    doi: "10.1007/978-3-031-16178-0_32",
    tags: ["security", "cryptography"],
  },
  {
    key: "Islam2023CyberSecurity",
    type: "conference",
    title: "Cyber Security Intruder Detection Using Deep Learning Approach",
    authors: [
      "Islam, Tariqul",
      "Rahman, Md. Mosfikur",
      "Jabiullah, Md. Ismail",
      "Saifuzzaman, Mohd.",
    ],
    venue: "Information Systems and Management Science, Springer International",
    year: 2023,
    pages: "518–530",
    doi: "10.1007/978-3-031-13150-9_42",
    tags: ["security", "DL"],
  },
  {
    key: "Yesmin2022Education",
    type: "chapter",
    title: "Pandemic Effect on Education System Among University Students",
    authors: [
      "Yesmin, Farzana",
      "Rahman, Md. Mosfikur",
      "Saifuzzaman, Mohd.",
      "Moon, Nazmun Nessa",
    ],
    venue:
      "Progresses in Artificial Intelligence & Robotics: Algorithms & Applications, Springer",
    year: 2022,
    pages: "157–168",
    doi: "10.1007/978-3-030-98531-8_16",
    tags: ["education", "survey"],
  },
  {
    key: "Moon2021PlantDisease",
    type: "conference",
    title: "Deep Learning Model for Detecting and Diagnosing Plant Disease",
    authors: [
      "Moon, Nazmun Nessa",
      "Sharmin, Shayla",
      "Hossain, Refath Ara",
      "Jahan, Israt",
      "Nur, Fernaz Narin",
      "Rahman, Md. Mosfikur",
    ],
    venue:
      "Proc. 2021 Intl. Conf. on Smart Generation Computing, Communication and Networking (SMART GENCON)",
    year: 2021,
    pages: "1–8",
    doi: "10.1109/SMARTGENCON51891.2021.9645857",
    tags: ["DL", "agriculture"],
  },
  {
    key: "Rahman2021TraFoo",
    type: "conference",
    title: "TraFoo: An Android Application for Food Delivery in Train",
    authors: [
      "Rahman, Md. Mosfikur",
      "Foysal, Musfiqur Rahman",
      "Moon, Nazmun Nessa",
      "Nur, Fernaz Narin",
    ],
    venue:
      "Proc. 2021 Intl. Conf. on Smart Generation Computing, Communication and Networking (SMART GENCON)",
    year: 2021,
    pages: "1–7",
    doi: "10.1109/SMARTGENCON51891.2021.9645900",
    tags: ["first-author", "mobile", "systems"],
  },
  {
    key: "SHETU2021100038",
    type: "journal",
    title: "Impactful e-learning framework: A new hybrid form of education",
    authors: [
      "Shetu, Syeda Farjana",
      "Rahman, Md. Mosfikur",
      "Ahmed, Akash",
      "Mahin, Mahfuja Ferdousi",
      "Akib, Md. Abtab Uddin",
      "Saifuzzaman, Mohd.",
    ],
    venue: "Current Research in Behavioral Sciences",
    year: 2021,
    volume: "2",
    pages: "100038",
    doi: "10.1016/j.crbeha.2021.100038",
    tags: ["education"],
  },
  {
    key: "RAHMAN2021100037",
    type: "journal",
    title:
      "Impact of COVID-19 on mental health: A quantitative analysis of anxiety and depression based on regular life and internet use",
    authors: [
      "Rahman, Md. Mosfikur",
      "Saifuzzaman, Mohd.",
      "Ahmed, Akash",
      "Mahin, Mahfuja Ferdousi",
      "Shetu, Syeda Farjana",
    ],
    venue: "Current Research in Behavioral Sciences",
    year: 2021,
    volume: "2",
    pages: "100037",
    doi: "10.1016/j.crbeha.2021.100037",
    tags: ["first-author", "public health"],
  },
  {
    key: "SAIFUZZAMAN2021100034",
    type: "journal",
    title:
      "COVID-19 and Bangladesh: Situation report, comparative analysis, and case study",
    authors: [
      "Saifuzzaman, Mohd.",
      "Rahman, Md. Mosfikur",
      "Shetu, Syeda Farjana",
      "Moon, Nazmun Nessa",
    ],
    venue: "Current Research in Behavioral Sciences",
    year: 2021,
    volume: "2",
    pages: "100034",
    doi: "10.1016/j.crbeha.2021.100034",
    tags: ["public health"],
  },
  {
    key: "Rahman2020SmartSewer",
    type: "conference",
    title:
      "Future City of Bangladesh: IoT Based Autonomous Smart Sewerage and Hazard Condition Sharing System",
    authors: [
      "Rahman, Md. Mosfikur",
      "Kashem, Mohammad Abul",
      "Mohiuddin, Mohammad",
      "Hossain, Mohammad Alam",
      "Moon, Nazmun Nessa",
    ],
    venue:
      "Proc. 2020 IEEE Intl. Women in Engineering Conf. on Electrical and Computer Engineering (WIECON-ECE)",
    year: 2020,
    pages: "126–130",
    doi: "10.1109/WIECON-ECE52138.2020.9397950",
    tags: ["first-author", "IoT"],
  },
];

export const reviewerFor = [
  "ISA Transactions",
  "Journal of King Saud University — Computer and Information Sciences",
  "Natural Language Processing Journal",
  "Current Research in Behavioral Sciences",
  "4th ICDLAIR, 2022",
  "Intl. Conf. on Information Systems and Management Science, 2022",
  "Intl. Conf. on Communication and Information Systems, 2022",
];

export const skillGroups: { label: string; items: string[] }[] = [
  {
    label: "Languages",
    items: ["Java (8–21)", "C#", "TypeScript / JavaScript", "Python", "SQL"],
  },
  {
    label: "Backend",
    items: ["Spring Boot", "Spring Security", "ASP.NET Core", "JPA / JDBC", "Node.js", "GraphQL"],
  },
  {
    label: "Data",
    items: ["Oracle", "PostgreSQL", "SQL Server", "MySQL", "Query optimisation"],
  },
  {
    label: "Platform",
    items: ["Docker", "Kubernetes", "gRPC", "OAuth2", "JWT", "CI/CD"],
  },
  {
    label: "Architecture",
    items: ["Microservices", "Modular monolith", "REST APIs", "Clean architecture", "Drools · Camunda"],
  },
  {
    label: "Research",
    items: ["Applied ML", "Model evaluation", "Feature engineering", "Experimental design", "Academic writing"],
  },
];

export type Education = {
  school: string;
  place?: string;
  url?: string;
  degree: string;
  note?: string;
  from: string;
  to: string;
};

export const education: Education[] = [
  {
    school: "Adam Mickiewicz University",
    place: "Poznań, PL",
    url: "https://amu.edu.pl/en",
    degree: "B.Sc. in Computer Science & Engineering — Erasmus+ Exchange",
    note: "Passed with 80% · 6 ECTS",
    from: "2021-03",
    to: "2021-08",
  },
  {
    school: "Daffodil International University",
    place: "Dhaka, BD",
    url: "https://daffodilvarsity.edu.bd/",
    degree: "B.Sc. in Computer Science & Engineering",
    note: "CGPA 3.83 / 4.00 · 49th Batch",
    from: "2018-01",
    to: "2021-12",
  },
  {
    school: "Major General Mahmudul Hasan Adarsha College",
    place: "Tangail, BD",
    degree: "Higher Secondary Certificate (HSC)",
    note: "GPA 4.67 / 5.00",
    from: "2014-06",
    to: "2016-05",
  },
  {
    school: "Police Lines Adarsha High School",
    place: "Tangail, BD",
    degree: "Secondary School Certificate (SSC)",
    note: "GPA 5.00 / 5.00",
    from: "2009-01",
    to: "2014-05",
  },
  {
    school: "Mirikpur Gangacharan Tapashili School",
    place: "Basail, Tangail, BD",
    degree: "Primary Education",
    note: "Thana-level Scholarship, 2008",
    from: "2008-01",
    to: "2008-12",
  },
  {
    school: "Kurtubi Cadet Madrashah",
    place: "Tangail, BD",
    degree: "Islamic & Primary Foundation",
    note: "Class 1–4",
    from: "2004-01",
    to: "2007-12",
  },
];

export type YearbookEntry = {
  year: number | string;
  kind: "milestone" | "study" | "work" | "lead" | "research" | "award" | "talk";
  headline: string;
  detail?: string;
  place?: string;
};

export const yearbook: YearbookEntry[] = [
  { year: 2004, kind: "study", headline: "Alif, Ba, Ta.", detail: "Kurtubi Cadet Madrashah, class 1–4.", place: "Tangail" },
  { year: 2008, kind: "award", headline: "Thana-level scholarship at primary finals.", detail: "Mirikpur Gangacharan Tapashili School, Basail.", place: "Tangail" },
  { year: 2014, kind: "study", headline: "SSC — 5.00/5.00.", detail: "Police Lines Adarsha High School.", place: "Tangail" },
  { year: 2016, kind: "study", headline: "HSC — 4.67/5.00.", detail: "Major General Mahmudul Hasan Adarsha College.", place: "Tangail" },
  { year: 2017, kind: "lead", headline: "Literary Editor, Bondhushava.", detail: "A first taste of editing and publishing at a national literary platform." },
  { year: 2018, kind: "study", headline: "Enrolled in B.Sc. CSE, Daffodil International University.", detail: "49th Batch · Spring 2018.", place: "Dhaka" },
  { year: 2018, kind: "lead", headline: "Chief Operating Officer, Binary Pathshala.", detail: "Ran ops for a Bangla-language CS learning platform for a year." },
  { year: 2019, kind: "lead", headline: "Content Writer, CPC DIU.", detail: "Wrote for the Computer & Programming Club through the year." },
  { year: 2020, kind: "research", headline: "First IEEE paper accepted — IoT smart sewerage.", detail: "WIECON-ECE, first-author." },
  { year: 2021, kind: "award", headline: "Winner, Data Science Hackathon 2021.", detail: "Data Science Summit, DSL, DIU." },
  { year: 2021, kind: "milestone", headline: "Erasmus+ exchange at Adam Mickiewicz University.", detail: "Studied CSE for a semester at AMU. Passed with 80%.", place: "Poznań" },
  { year: 2021, kind: "lead", headline: "Vice President, Research & Career Wing, CPC DIU.", detail: "Mentorship, workshops, career programmes." },
  { year: 2021, kind: "research", headline: "Three journal papers in Current Research in Behavioral Sciences.", detail: "Two as first author — mental health during COVID-19." },
  { year: 2021, kind: "milestone", headline: "Graduated B.Sc. — CGPA 3.83 / 4.00.", place: "Dhaka" },
  { year: 2022, kind: "work", headline: "Joined BJIT Group as Software Engineer.", detail: "Backend for Rakuten Echiba (Japan) and Denka corporate CMS." },
  { year: 2022, kind: "talk", headline: "Guest speaker, CPC DIU.", detail: "“How to Get Started: Undergraduate Research Journey”." },
  { year: 2023, kind: "work", headline: "Joined REVE Systems Ltd.", detail: "Backend on the national NBR Customs Bond Management System." },
  { year: 2024, kind: "work", headline: "Joined Akij iBOS as Engineer II.", detail: "Backend architecture and system design for an unreleased OTA platform." },
  { year: 2024, kind: "talk", headline: "Technical speaker, IEEE WIECON-ECE 2024.", detail: "10th IEEE International Women in Engineering Conference." },
  { year: 2026, kind: "milestone", headline: "Next.", detail: "Writing more. Shipping more. Teaching more.", place: "TBD" },
];

export const certifications = [
  {
    group: "Data Science",
    issuer: "IBM · Coursera",
    items: [
      "What is Data Science?",
      "Tools for Data Science",
      "Data Science Methodology",
      "Python for Data Science and AI",
      "Python Project for Data Science",
      "Databases and SQL for Data Science",
      "Data Analysis with Python",
      "Data Visualization with Python",
      "Machine Learning with Python",
      "Applied Data Science Capstone",
      "IBM Data Science Professional Certificate",
    ],
  },
  {
    group: "Data Science",
    issuer: "DataCamp",
    items: [
      "Introduction to Python",
      "Intermediate Python",
      "Python Data Science Toolbox (Part 1)",
      "Python Data Science Toolbox (Part 2)",
      "Introduction to Importing Data in Python",
    ],
  },
  {
    group: "Machine Learning",
    issuer: "DataCamp",
    items: [
      "Image Processing in Python",
      "Image Processing with Keras in Python",
    ],
  },
  {
    group: "Programming",
    issuer: "Coursera · DataCamp · Cisco Networking Academy",
    items: [
      "Create Your First Python Program (Coursera)",
      "AI For Everyone (Coursera)",
      "Python Programming (DataCamp)",
      "PCAP — Programming Essentials in Python (Cisco)",
    ],
  },
  {
    group: "Cyber Security",
    issuer: "Cisco Networking Academy",
    items: ["Introduction to Cybersecurity", "Cybersecurity Essentials"],
  },
  {
    group: "Public Health",
    issuer: "Coursera",
    items: ["COVID-19 Contact Tracing"],
  },
];

export const talksAndService = [
  { year: 2024, kind: "Speaker", title: "Technical session — 10th IEEE International Women in Engineering Conference (WIECON-ECE 2024)." },
  { year: 2022, kind: "Guest speaker", title: "“How to Get Started: Undergraduate Research Journey”, Computer & Programming Club, DIU." },
  { year: 2021, kind: "Winner", title: "Data Science Hackathon 2021, Data Science Summit, DSL, Daffodil International University." },
  { year: 2021, kind: "Vice President", title: "Research & Career Wing, Computer & Programming Club, Daffodil International University." },
  { year: 2021, kind: "Instructor", title: "Workshop — “Python: Everything You Need to Know”, CPC DIU." },
  { year: 2020, kind: "Technical Lead", title: "“Take Off – 2020”, CPC DIU." },
  { year: 2019, kind: "Content Writer", title: "Computer & Programming Club, Daffodil International University." },
  { year: 2019, kind: "Organising member", title: "Programming Contest, “Take Off – 2019”, CPC DIU." },
  { year: 2018, kind: "COO", title: "Binary Pathshala — Bangla-language CS learning platform." },
  { year: 2017, kind: "Literary Editor", title: "Bondhushava — national Bangla literary platform." },
];

export function formatAuthors(authors: string[], highlight = "Rahman, Md. Mosfikur") {
  return authors.map((a) => ({ name: a, bold: a === highlight }));
}

export function doiUrl(doi?: string) {
  if (!doi) return undefined;
  return `https://doi.org/${doi}`;
}

// ——— computed at module load — always current on every page view ———
export const stats = {
  years: yearsSince(CAREER_START),
  companies: roles.length,
  publications: publications.length,
  firstAuthor: publications.filter((p) => (p.tags || []).includes("first-author")).length,
  reviewer: reviewerFor.length,
  systems: 5, // OTA · CBMS · Rakuten · Denka · TraFoo
};

export const preamble: string[] = [
  "I design the quiet half of software — the services, schemas, and workflows that hold a product together once traffic shows up. Engineer by craft, architect by practice, and researcher by rigor.",
  `${capitalize(word(stats.years))} years shipping production systems across ${word(stats.companies)} companies, and ${word(stats.publications)} peer-reviewed papers along the way — ${word(stats.firstAuthor)} as first author.`,
  "Currently shaping backend architecture at Akij iBOS — configurable systems, rule-driven logic, and microservice workflows across Java, .NET, and Node. Earlier, national-scale compliance software for the NBR, and backend services for Rakuten in Japan.",
];

export const figures = [
  { k: "in industry", v: `${stats.years}+ yr`, note: "Java · .NET · Node" },
  { k: "publications", v: String(stats.publications), note: `peer-reviewed · ${stats.firstAuthor} as first author` },
  { k: "reviewer for", v: String(stats.reviewer), note: "journals & conferences" },
  { k: "systems shipped", v: String(stats.systems), note: "national · global · product" },
];

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
