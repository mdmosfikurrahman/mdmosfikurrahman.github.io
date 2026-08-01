// Chatbot "brain" — rule heuristics over the content.ts knowledge base.
// No real AI; responses are deterministic but feel conversational because
// they combine intent scoring, synonym expansion, and short follow-ups.

import {
  profile,
  roles,
  projects,
  publications,
  skillGroups,
  education,
  certifications,
  distinctions,
  stats,
  reviewerFor,
} from "./content";
import { getCvUrl } from "./settings";

export type ChatRole = "user" | "bot";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  ts: number;
  chips?: string[]; // optional follow-up suggestions attached to a bot turn
};

export type ChatContext = {
  lastIntent?: string;
  lastTopicKey?: string;
  turn: number;
};

type Intent = {
  id: string;
  // words/phrases that imply this intent. lowercased.
  patterns: (string | RegExp)[];
  // hard-required phrases — if present, this intent gets a big boost.
  strong?: (string | RegExp)[];
  // negate if these appear; suppresses false positives.
  not?: (string | RegExp)[];
  weight?: number; // baseline priority for tie-breaks
  handle: (q: string, ctx: ChatContext) => BotReply;
};

export type BotReply = {
  text: string;
  chips?: string[];
  topicKey?: string;
};

// ---------------------------------------------------------------------------
// utilities
// ---------------------------------------------------------------------------

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s+./-]/gu, " ").replace(/\s+/g, " ").trim();

function matchScore(q: string, pats: (string | RegExp)[]): number {
  let score = 0;
  for (const p of pats) {
    if (typeof p === "string") {
      // word-boundary match on normalized text
      const re = new RegExp(`(^|\\s)${escapeRe(p)}(\\s|$)`, "i");
      if (re.test(q)) score += 1;
    } else if (p.test(q)) {
      score += 1;
    }
  }
  return score;
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fmtMonth(ym: string): string {
  if (ym === "present") return "now";
  const [y, m] = ym.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mi = Math.max(1, Math.min(12, parseInt(m || "1", 10))) - 1;
  return `${months[mi]} ${y}`;
}

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------------------------------------------------------
// canned bits (kept tight; rendered in first person as "Mosfik")
// ---------------------------------------------------------------------------

const I = "I"; // tiny indirection if I ever want to swap voice

// Public-facing short name used inside chatbot copy — separate from
// profile.shortName so the rest of the site is unaffected.
export const DISPLAY_NAME = "Mosfik";

const GREETINGS = [
  `Hey — ${DISPLAY_NAME} here. What do you want to know? My work, my publications, how to reach me — pick anything.`,
  `Hi! I'm ${DISPLAY_NAME}'s portfolio assistant. Ask me about his backend work, papers, or how to get in touch.`,
  `Assalamu alaikum 👋 — ask me anything about ${DISPLAY_NAME}'s career, projects, or research.`,
  `Hello — happy to help. Try work, projects, publications, awards, education, or contact.`,
];

// Question suggestions surfaced on first open as a discoverable grid.
// Kept short so they fit on small screens; richer chip sets show after a
// real answer.
export const SUGGESTED_QUESTIONS = [
  "Who is Mosfik?",
  "What does he do at iBOS?",
  "Tell me about the OTA platform",
  "Show me the IEEE Best Paper",
  "What's his tech stack?",
  "Is he open to opportunities?",
  "Why backend?",
  "Where is he based?",
  "Future plans / grad school?",
  "How can I contact him?",
];

const FAREWELLS = [
  "Take care — drop me an email if anything comes up.",
  "Catch you later. The CV link's always on the site.",
  "Cheers — feel free to come back with more questions.",
];

const THANKS = [
  "Anytime.",
  "Glad to help.",
  "You're welcome — anything else you want to dig into?",
];

const FALLBACK_TIPS = [
  "I didn't quite catch that. I can talk about his work, publications, skills, education, or contact info.",
  "Hmm, not sure I followed. Try asking about experience, papers, the OTA platform, or the IEEE Best Paper.",
  "Not sure about that one. Want to hear about his current role at iBOS or the published research?",
];

// ---------------------------------------------------------------------------
// helpers for assembling answers from content.ts
// ---------------------------------------------------------------------------

const current = roles[0]; // most recent

function shortBio(): string {
  return (
    `${profile.name} — ${profile.role}. ${profile.tagline} ` +
    `${stats.years}+ years across ${stats.companies} companies, with ${stats.publications} peer-reviewed papers (${stats.firstAuthor} as first author).`
  );
}

function currentRoleBlurb(): string {
  return (
    `Right now ${I}'m ${current.title.split(" · ")[0]} at ${current.company} (since ${fmtMonth(current.from)}). ` +
    `${current.summary}`
  );
}

function listRoles(): string {
  const lines = roles.map(
    (r) => `• ${r.title.split(" · ")[0]} · ${r.company} (${fmtMonth(r.from)} – ${r.to === "present" ? "now" : fmtMonth(r.to)})`,
  );
  return `Career so far:\n${lines.join("\n")}`;
}

function roleByCompanyKeyword(q: string) {
  const map: Record<string, string> = {
    ibos: "iBOS Ltd.",
    "i-bos": "iBOS Ltd.",
    reve: "REVE Systems Ltd.",
    bjit: "BJIT Group",
  };
  for (const [k, v] of Object.entries(map)) {
    if (q.includes(k)) return roles.find((r) => r.company === v);
  }
  return undefined;
}

function listProjects(): string {
  const lines = projects.map((p) => `• ${p.name} — ${p.at} (${p.year})`);
  return `Selected work:\n${lines.join("\n")}`;
}

function projectByKeyword(q: string) {
  const keys: { pat: string[]; key: string }[] = [
    { pat: ["ota", "travel", "online travel", "akij"], key: "OTA Platform · Backend" },
    { pat: ["customs", "cbms", "bond", "nbr"], key: "Customs Bond Management System" },
    { pat: ["rakuten", "echiba", "graphql bff", "graphql"], key: "Rakuten Echiba · GraphQL BFF" },
    { pat: ["denka", "cms"], key: "Denka Corporate CMS" },
  ];
  for (const { pat, key } of keys) {
    if (pat.some((p) => q.includes(p))) {
      return projects.find((pr) => pr.name === key);
    }
  }
  return undefined;
}

function publicationByKeyword(q: string) {
  const keys: { pat: string[]; key: string }[] = [
    { pat: ["sewer", "iot", "wiecon", "best paper", "smart sewerage"], key: "Rahman2020SmartSewer" },
    { pat: ["trafoo", "train food", "food delivery"], key: "Rahman2021TraFoo" },
    { pat: ["mental health", "anxiety", "depression"], key: "RAHMAN2021100037" },
    { pat: ["situation report", "bangladesh covid"], key: "SAIFUZZAMAN2021100034" },
    { pat: ["e-learning", "elearning", "hybrid education"], key: "SHETU2021100038" },
    { pat: ["plant disease", "leaf", "cnn", "agriculture"], key: "Moon2021PlantDisease" },
    { pat: ["cyber security", "intrusion", "ids", "cicids"], key: "Islam2023CyberSecurity" },
    { pat: ["chaotic", "encryption", "crsa", "cryptography"], key: "Johora2023ChaoticEncryption" },
    { pat: ["covid prediction", "xgboost", "early diagnosis"], key: "Johora2024CovidPrediction" },
    { pat: ["pandemic education", "exam", "cheating"], key: "Yesmin2022Education" },
  ];
  for (const { pat, key } of keys) {
    if (pat.some((p) => q.includes(p))) return publications.find((pp) => pp.key === key);
  }
  return undefined;
}

function publicationsSummary(): string {
  const firstAuthor = publications.filter((p) => (p.tags || []).includes("first-author"));
  const award = publications.find((p) => p.award);
  return (
    `${stats.publications} peer-reviewed papers — ${stats.firstAuthor} as first author. ` +
    (award ? `${award.award} for "${award.title.split(":")[0]}" (${award.year}). ` : "") +
    `First-author highlights: ${firstAuthor.map((p) => p.title.split(":")[0]).join("; ")}.`
  );
}

function skillsBlurb(q: string): string {
  // if a specific tech is asked, return targeted line
  const targeted: { hit: string[]; line: string }[] = [
    { hit: ["java"], line: "Strongest in Java (8–21) on Spring Boot — most of my production work runs on it." },
    { hit: ["spring"], line: "Spring Boot is my daily driver, with Spring Security on top for auth flows." },
    { hit: [".net", "dotnet", "c#", "csharp"], line: "I write C# on ASP.NET Core too — currently shipping production services on it at iBOS." },
    { hit: ["graphql"], line: "Built GraphQL BFFs at BJIT for Rakuten — schema stitching, resolver batching, the works." },
    { hit: ["docker", "kubernetes", "k8s"], line: "Hands-on with Docker packaging and Kubernetes deployment for the OTA platform." },
    { hit: ["oracle", "postgres", "sql server", "mysql"], line: "Comfortable across Oracle, PostgreSQL, SQL Server, and MySQL — heavy on query tuning and access-path work." },
    { hit: ["mongodb", "dynamodb", "nosql"], line: "Also work with MongoDB and DynamoDB on the OTA platform, alongside the relational stack." },
    { hit: ["on-call", "oncall", "incident"], line: "I carry on-call production support at iBOS, including weekend/emergency response." },
    { hit: ["mentor", "mentoring", "junior"], line: "I personally train and mentor the junior engineers on my team at iBOS." },
    { hit: ["python"], line: "Python mostly for applied ML and the research papers." },
    { hit: ["typescript", "javascript", "react"], line: "TypeScript / React when I touch the front end — this portfolio is built on it." },
    { hit: ["drools"], line: "Use Drools for the rule-driven pricing engine on the OTA platform." },
    { hit: ["grpc"], line: "gRPC for inter-service comms where REST is the wrong shape." },
  ];
  for (const t of targeted) {
    if (t.hit.some((h) => q.includes(h))) return t.line;
  }
  const lines = skillGroups.map((g) => `• ${g.label}: ${g.items.join(", ")}`);
  return `Stack:\n${lines.join("\n")}`;
}

function educationBlurb(q: string): string {
  if (/erasmus|poland|poznan|adam mickiewicz|exchange/i.test(q)) {
    const e = education.find((x) => x.school.includes("Adam Mickiewicz"))!;
    return `Erasmus+ exchange at ${e.school}, ${e.place} — ${e.degree}. ${e.note ?? ""} (${fmtMonth(e.from)} – ${fmtMonth(e.to)})`;
  }
  if (/thesis|dissertation/i.test(q)) {
    return `Completed a BSc thesis at Daffodil International University (2018–2021, CGPA 3.83 / 4.00). The research line carried into peer-reviewed publications, including the IEEE Best Paper for the smart-sewerage IoT system.`;
  }
  const lines = education.slice(0, 4).map(
    (e) => `• ${e.degree} — ${e.school}${e.place ? ", " + e.place : ""}${e.note ? " (" + e.note + ")" : ""}`,
  );
  return `Education:\n${lines.join("\n")}`;
}

function englishBlurb(): string {
  return `IELTS Academic on file. The full TRF is part of his application packet — happy to share on request via email.`;
}

function credentialBlurb(): string {
  return `Credentials evaluated by ECE (Educational Credential Evaluators) for US equivalency — Bachelor's transcript translated to a US scale. Useful for international applications / immigration / graduate review.`;
}

function futurePlansBlurb(): string {
  return (
    `Currently preparing for Fall 2027 graduate applications — research-track, likely systems / applied ML. ` +
    `Supporting documents (IELTS Academic, ECE credential evaluation, sealed transcripts) are in flight. ` +
    `In the meantime ${I}'m shipping production systems at iBOS.`
  );
}

function contactBlurb(): string {
  return (
    `Easiest is email: ${profile.email}\n` +
    `Phone: ${profile.phone}\n` +
    `GitHub: ${profile.links.github}\n` +
    `LinkedIn: ${profile.links.linkedin}\n` +
    `Scholar: ${profile.links.scholar}`
  );
}

function locationBlurb(): string {
  return `Based in ${profile.location}.`;
}

function awardsBlurb(): string {
  const award = publications.find((p) => p.award);
  const dist = distinctions
    .slice()
    .sort((a, b) => b.year - a.year)
    .map((d) => `• ${d.year} — ${d.headline} · ${d.issuer}${d.detail ? " — " + d.detail : ""}`);
  return (
    (award ? `${award.award} for "${award.title.split(":")[0]}" (${award.year}). ` : "") +
    `Recognitions:\n${dist.join("\n")}`
  );
}

function reviewerBlurb(): string {
  return `Reviewer for ${reviewerFor.length} journals & conferences, including:\n• ${reviewerFor.slice(0, 5).join("\n• ")}`;
}

function certBlurb(): string {
  const groups = certifications.map((c) => `• ${c.group} (${c.issuer}): ${c.items.length} courses`);
  return `Certifications:\n${groups.join("\n")}`;
}

function cvBlurb(): string {
  return `CV is here: ${getCvUrl()}\n(also reachable via /cv or /resume on this site)`;
}

function availabilityBlurb(): string {
  return (
    `${I}'m currently Engineer II at ${current.company}, shipping production systems. ` +
    `Open to interesting backend / architecture conversations — best route is email: ${profile.email}.`
  );
}

function metaBlurb(): string {
  return (
    `Honest answer: I'm not a real AI — I'm rule heuristics on top of the data ${DISPLAY_NAME} ships in his portfolio repo. ` +
    `Tries to feel real, but everything I say is sourced from his actual CV.`
  );
}

// ---------------------------------------------------------------------------
// intents (ordered by typical specificity)
// ---------------------------------------------------------------------------

const intents: Intent[] = [
  // META — must be before greeting so "are you ai" doesn't catch on "you"
  {
    id: "meta",
    patterns: [/are you (a |an )?(real )?(ai|bot|human|person)/i, "chatbot", "how do you work", "are you real", "llm", "gpt", "claude"],
    handle: () => ({ text: metaBlurb(), chips: ["Tell me about Mosfik", "Show his publications"] }),
  },

  {
    id: "greeting",
    patterns: ["hi", "hello", "hey", "yo", "hola", "salam", "assalamu alaikum", "assalamualaikum", "howdy", "good morning", "good afternoon", "good evening"],
    not: ["who are you"],
    handle: () => ({ text: pickOne(GREETINGS), chips: ["What does he do?", "Show me his work", "Publications", "How to contact?"] }),
  },

  {
    id: "thanks",
    patterns: ["thanks", "thank you", "thx", "ty", "appreciate", "shukria", "dhonnobad"],
    handle: () => ({ text: pickOne(THANKS) }),
  },

  {
    id: "farewell",
    patterns: ["bye", "goodbye", "see you", "see ya", "cya", "later", "take care"],
    handle: () => ({ text: pickOne(FAREWELLS) }),
  },

  {
    id: "about_me",
    patterns: [
      "who are you",
      "who is he",
      "who is mosfi",
      "who is mosfik",
      "who is mosfikur",
      "who's mosfik",
      "whos mosfik",
      "who is rahman",
      "about mosfik",
      "about mosfikur",
      "about rahman",
      "about yourself",
      "about you",
      "about him",
      "tell me about him",
      "tell me about mosfik",
      "tell me about mosfikur",
      "your bio",
      "his bio",
      "your background",
      "his background",
      "introduce",
      "introduction",
    ],
    handle: () => ({
      text: shortBio(),
      chips: ["Current role?", "Show publications", "Tech stack", "How to contact?"],
    }),
  },

  // SPECIFIC PUBLICATION (must beat the general "publications" intent)
  {
    id: "publication_specific",
    patterns: [
      "sewer", "iot", "wiecon", "best paper", "ieee best paper", "ieee", "smart sewerage",
      "trafoo", "train food",
      "mental health", "anxiety", "depression",
      "situation report",
      "e-learning", "elearning", "hybrid education",
      "plant disease", "cnn", "leaf",
      "intrusion", "ids", "cicids",
      "chaotic", "crsa", "encryption",
      "xgboost", "covid prediction",
      "exam", "cheating", "pandemic education",
    ],
    weight: 2,
    handle: (q) => {
      const p = publicationByKeyword(q);
      if (!p) return { text: publicationsSummary() };
      const author = (p.authors[0] || "").includes("Rahman, Md. Mosfikur") ? "first author" : `co-author with ${p.authors[0]}`;
      return {
        text:
          `"${p.title}" (${p.year}) — ${author}. ` +
          `Published in ${p.venue}${p.pages ? ", pp. " + p.pages : ""}. ` +
          (p.award ? `${p.award}. ` : "") +
          (p.citations ? `${p.citations} citations on Google Scholar. ` : "") +
          (p.impact ? `\n\nImpact: ${p.impact}` : ""),
        chips: ["All publications", "Research areas", "Awards"],
        topicKey: p.key,
      };
    },
  },

  {
    id: "publications",
    patterns: ["publication", "publications", "paper", "papers", "research", "journal", "conference", "scholar", "citations", "h-index", "google scholar"],
    weight: 1,
    handle: () => ({
      text: publicationsSummary(),
      chips: ["IEEE Best Paper", "TraFoo", "Mental health paper", "Research areas"],
    }),
  },

  // SPECIFIC COMPANY
  {
    id: "company_specific",
    patterns: ["ibos", "i-bos", "akij", "reve", "reve systems", "bjit", "rakuten", "denka"],
    weight: 2,
    handle: (q) => {
      const r = roleByCompanyKeyword(q);
      if (!r) {
        // mentions of Rakuten/Denka — route via projects
        const pr = projectByKeyword(q);
        if (pr) return projectAnswer(pr);
        return { text: currentRoleBlurb() };
      }
      return {
        text:
          `At ${r.company} as ${r.title} (${fmtMonth(r.from)} – ${r.to === "present" ? "now" : fmtMonth(r.to)}, ${r.place}). ` +
          `${r.summary}\n\nHighlights:\n• ${r.bullets.join("\n• ")}\n\nStack: ${r.stack.join(", ")}.`,
        chips: ["Career history", "Projects", "Tech stack"],
        topicKey: r.company,
      };
    },
  },

  // PROJECT (specific)
  {
    id: "project_specific",
    patterns: ["ota", "online travel", "customs", "cbms", "bond", "nbr", "rakuten", "echiba", "denka"],
    weight: 2,
    handle: (q) => {
      const pr = projectByKeyword(q);
      if (!pr) return { text: listProjects() };
      return projectAnswer(pr);
    },
  },

  // CURRENT ROLE
  {
    id: "current_role",
    patterns: ["current role", "current job", "currently", "right now", "where do you work", "where does he work", "what do you do", "what does he do", "day job", "engineer ii"],
    handle: () => ({
      text: currentRoleBlurb(),
      chips: ["Career history", "OTA platform", "Tech stack"],
    }),
  },

  // EXPERIENCE / CAREER
  {
    id: "experience",
    patterns: ["experience", "career", "work history", "past jobs", "previous jobs", "companies", "background", "years of experience"],
    handle: () => ({
      text: listRoles() + "\n\nThat's " + stats.years + "+ years across " + stats.companies + " companies.",
      chips: ["iBOS details", "REVE details", "BJIT details"],
    }),
  },

  // PROJECTS (general)
  {
    id: "projects",
    patterns: ["project", "projects", "portfolio", "what built", "what have you built", "what has he built", "selected work"],
    handle: () => ({
      text: listProjects(),
      chips: ["OTA platform", "Customs (NBR)", "Rakuten BFF"],
    }),
  },

  // SKILLS
  {
    id: "skills",
    patterns: ["skill", "skills", "tech stack", "tech", "languages", "stack", "tools", "frameworks", "java", "spring", "spring boot", ".net", "dotnet", "c#", "node", "node.js", "nodejs", "graphql", "docker", "kubernetes", "k8s", "oracle", "postgres", "mysql", "sql server", "typescript", "python", "react", "drools", "grpc"],
    handle: (q) => ({
      text: skillsBlurb(q),
      chips: ["Years of experience", "Architecture work", "Show me a project"],
    }),
  },

  // EDUCATION
  {
    id: "education",
    patterns: ["education", "studied", "study", "university", "uni", "college", "degree", "school", "daffodil", "diu", "erasmus", "poland", "poznan", "adam mickiewicz", "exchange", "ssc", "hsc", "thesis", "dissertation"],
    handle: (q) => ({
      text: educationBlurb(q),
      chips: ["Erasmus exchange", "BSc thesis", "Distinctions", "Certifications"],
    }),
  },

  // ENGLISH PROFICIENCY
  {
    id: "english",
    patterns: ["ielts", "toefl", "english", "english proficiency", "language test", "language proficiency"],
    handle: () => ({ text: englishBlurb(), chips: ["Future plans", "ECE credential", "Education"] }),
  },

  // CREDENTIAL EVALUATION (US equivalency)
  {
    id: "credential",
    patterns: ["ece", "credential", "credential evaluation", "us equivalency", "wes", "us gpa", "transcript"],
    handle: () => ({ text: credentialBlurb(), chips: ["Future plans", "Education", "IELTS"] }),
  },

  // FUTURE PLANS / GRAD SCHOOL
  {
    id: "future_plans",
    patterns: ["phd", "ph.d", "masters", "master's", "ms ", "msc", "grad school", "graduate school", "graduate study", "next step", "future", "plans", "applying", "applications", "fall 2027", "2027"],
    handle: () => ({
      text: futurePlansBlurb(),
      chips: ["IELTS", "ECE credential", "Research", "Contact"],
    }),
  },

  // CERTIFICATIONS
  {
    id: "certifications",
    patterns: ["certificate", "certificates", "certifications", "certified", "credly", "ibm", "datacamp", "cisco", "coursera"],
    handle: () => ({ text: certBlurb(), chips: ["Education", "Skills"] }),
  },

  // AWARDS / DISTINCTIONS
  {
    id: "awards",
    patterns: ["award", "awards", "best paper", "ieee", "distinction", "distinctions", "recognition", "achievements", "honors", "hackathon", "winner"],
    handle: () => ({ text: awardsBlurb(), chips: ["IEEE Best Paper", "All publications", "Talks & service"] }),
  },

  // REVIEWER
  {
    id: "reviewer",
    patterns: ["reviewer", "review", "peer review", "editor"],
    handle: () => ({ text: reviewerBlurb(), chips: ["Publications", "Awards"] }),
  },

  // CONTACT
  {
    id: "contact",
    patterns: ["contact", "email", "reach", "reach out", "get in touch", "mail", "phone", "call", "linkedin", "github", "social", "links"],
    handle: () => ({ text: contactBlurb(), chips: ["Download CV", "Availability"] }),
  },

  // LOCATION
  {
    id: "location",
    patterns: ["where", "location", "based", "city", "country", "dhaka", "bangladesh", "live", "lives"],
    not: ["where do you work", "where does he work", "where studied", "where study"],
    handle: () => ({ text: locationBlurb(), chips: ["Current role", "How to contact?"] }),
  },

  // AVAILABILITY
  {
    id: "availability",
    patterns: ["hire", "hiring", "available", "availability", "freelance", "consult", "open to work", "looking for", "opportunity"],
    handle: () => ({ text: availabilityBlurb(), chips: ["Contact", "Download CV"] }),
  },

  // CV
  {
    id: "cv",
    patterns: ["cv", "resume", "curriculum"],
    handle: () => ({ text: cvBlurb(), chips: ["Contact", "Experience"] }),
  },

  // PERSONALITY / FUN
  {
    id: "personality",
    patterns: ["joke", "fun fact", "hobby", "hobbies", "interest", "interests", "personality", "favourite", "favorite"],
    handle: () => ({
      text:
        `Not much of a joke-teller — but here's a real one: ${DISPLAY_NAME} shipped a 10k+ DAU OTA backend before turning 28. ` +
        `Outside work: applied ML, systems papers, the occasional invited talk, and quietly polishing personal side-projects.`,
      chips: ["His research", "Distinctions", "Side projects"],
    }),
  },

  // WHY BACKEND
  {
    id: "why_backend",
    patterns: ["why backend", "why back-end", "why backend engineer", "backend over frontend", "back-end", "love backend", "passion"],
    handle: () => ({
      text:
        `Quiet half of software is where the long-term value sits — services, schemas, workflows, the bits that hold a product together once traffic shows up. ` +
        `Frontend is a craft I respect (this portfolio is React), but ${I} find the most interesting problems live behind the API: rule engines, supplier integrations, data shapes that don't break at scale.`,
      chips: ["Tech stack", "OTA platform", "Architecture work"],
    }),
  },

  // WHY DHAKA / LOCATION VALUE
  {
    id: "why_dhaka",
    patterns: ["why dhaka", "why bangladesh", "stay in bangladesh", "leave bangladesh", "move abroad", "relocate", "abroad"],
    handle: () => ({
      text:
        `Dhaka is home — strong engineering community, real problems to solve, and a stable base while ${I}'m preparing the Fall 2027 graduate applications. ` +
        `Open to relocating for the right opportunity (graduate program first, role-driven later). Best email is below.`,
      chips: ["Future plans", "Contact", "Availability"],
    }),
  },

  // ARCHITECTURE (the discipline, not the role)
  {
    id: "architecture",
    patterns: ["architecture", "system design", "design system", "microservices", "modular monolith", "service boundaries", "clean architecture", "design patterns", "domain model"],
    handle: () => ({
      text:
        `Day job is backend architecture: service boundaries, configuration-first design, rule-driven business logic. ` +
        `The OTA estate at iBOS leans microservice, with the pricing/booking core decomposed by domain and supplier integrations isolated behind adapters. ` +
        `Other roles in the past have been modular monolith — pick the shape the product needs.`,
      chips: ["OTA platform", "Drools rule engine", "Current role"],
    }),
  },

  // RULE ENGINE / DROOLS
  {
    id: "rule_engine",
    patterns: ["drools", "rule engine", "rules engine", "business rules", "camunda", "workflow engine"],
    handle: () => ({
      text:
        `Drools is the rule engine behind the OTA platform's pricing layer — business changes are configuration, not code deploys. ` +
        `Camunda lives in the toolbox for longer-running workflow orchestration when state needs to outlive a single request.`,
      chips: ["OTA platform", "Architecture", "Java"],
    }),
  },

  // OPEN SOURCE / GITHUB
  {
    id: "github",
    patterns: ["github", "open source", "open-source", "oss", "repos", "repositories", "contributions", "code samples"],
    handle: () => ({
      text:
        `GitHub: ${profile.links.github}\nPortfolio source is public there too — built on Vite + React + Tailwind. ` +
        `Most production work is closed-source by nature (enterprise / national-scale systems), so the public footprint skews toward personal projects and learning notes.`,
      chips: ["LinkedIn", "Tech stack", "Contact"],
    }),
  },

  // TALKS / SPEAKING
  {
    id: "talks",
    patterns: ["talk", "talks", "speaker", "speaking", "invited talk", "keynote", "conference talk", "workshop", "panel"],
    handle: () => ({
      text:
        `Invited speaker at IEEE WIECON-ECE 2024 (10th edition) — technical session on applied research workflows. ` +
        `Earlier: guest speaker on undergraduate research at DIU's CPC, and instructor for a Python workshop at the same club.`,
      chips: ["Distinctions", "Publications", "Awards"],
    }),
  },

  // REMOTE / WORK PREFERENCES
  {
    id: "remote",
    patterns: ["remote", "hybrid", "in office", "in-office", "wfh", "work from home", "work setup"],
    handle: () => ({
      text:
        `Currently hybrid at iBOS (Dhaka office). Comfortable across remote, hybrid, and in-office — the work is what matters. ` +
        `For overseas roles, would need visa support; for graduate study, that's the Fall 2027 application track.`,
      chips: ["Availability", "Future plans", "Contact"],
    }),
  },

  // NOTICE PERIOD / NEGOTIATION
  {
    id: "notice",
    patterns: ["notice period", "notice", "when can you start", "start date", "join date", "transition"],
    handle: () => ({
      text:
        `Standard notice applies for the current role. Honest conversation about timelines is easiest over email — ${profile.email}.`,
      chips: ["Contact", "Availability"],
    }),
  },

  // COMPENSATION (polite deflection)
  {
    id: "compensation",
    patterns: ["salary", "compensation", "comp", "package", "pay", "rate", "expected salary", "ctc"],
    handle: () => ({
      text:
        `Happy to discuss compensation directly — not over a public chatbot. Drop ${profile.email} a line with the role context and ${I}'ll respond.`,
      chips: ["Contact", "Availability"],
    }),
  },

  // LANGUAGES SPOKEN (human languages)
  {
    id: "languages_human",
    patterns: ["languages spoken", "speak", "speaks", "fluent", "bangla", "bengali", "english", "native"],
    not: ["language test", "language proficiency"], // route to ielts intent
    handle: () => ({
      text: `Native Bangla. Professional English (IELTS Academic on file). Some Hindi/Urdu comprehension. Mostly Banglish in casual chat.`,
      chips: ["IELTS", "Education", "Contact"],
    }),
  },

  // YEARS / TIME RANGE
  {
    id: "years",
    patterns: ["how long", "years of experience", "how many years", "experience years", "how old is his career"],
    handle: () => ({
      text:
        `${stats.years}+ years of professional software engineering since April 2022 — across ${stats.companies} companies, ` +
        `with another 1+ year of research experience during undergrad that fed into the publications.`,
      chips: ["Experience", "Publications", "Current role"],
    }),
  },

  // RESEARCH AREAS (general)
  {
    id: "research_areas",
    patterns: ["research area", "research interest", "research interests", "what kind of research", "research topics", "applied ml", "machine learning research", "ml research"],
    handle: () => ({
      text:
        `Applied machine learning + systems: intrusion detection, COVID-era public health, e-learning frameworks, plant-disease vision, and IoT-based smart-city infrastructure. ` +
        `Two first-author papers, eight more as co-author. The systems flavour shows up in the IEEE Best Paper for IoT smart sewerage.`,
      chips: ["Publications", "IEEE Best Paper", "Future plans"],
    }),
  },

  // VOLUNTEER / SERVICE
  {
    id: "service",
    patterns: ["volunteer", "service", "club", "leadership", "vice president", "organising", "binary pathshala", "bondhushava"],
    handle: () => ({
      text:
        `Past service: VP of Research & Career Wing at DIU's Computer & Programming Club; COO at Binary Pathshala (Bangla CS-learning platform); Literary Editor at Bondhushava. ` +
        `Reviewer for ${reviewerFor.length} journals & conferences.`,
      chips: ["Talks", "Distinctions", "Reviewer"],
    }),
  },

  // COMMAND: clear / restart
  {
    id: "restart",
    patterns: ["restart", "start over", "reset", "clear", "new chat", "begin again"],
    handle: () => ({
      text: `Sure — clear the chat using the refresh icon up top, or just ask a fresh question.`,
      chips: ["Who is Mosfik?", "Publications", "Contact"],
    }),
  },

  // FOLLOW-UP
  {
    id: "more",
    patterns: ["more", "tell me more", "go on", "continue", "what else", "details", "expand"],
    handle: (_q, ctx) => followUp(ctx),
  },
];

// ---------------------------------------------------------------------------
// project handler (shared)
// ---------------------------------------------------------------------------

function projectAnswer(p: typeof projects[number]): BotReply {
  return {
    text:
      `${p.name} — ${p.at} (${p.year}). Role: ${p.role}.\n\n` +
      `${p.blurb}\n\nHighlights:\n• ${p.highlights.join("\n• ")}\n\nStack: ${p.stack.join(", ")}.`,
    chips: ["Other projects", "Current role", "Skills"],
    topicKey: p.name,
  };
}

// ---------------------------------------------------------------------------
// follow-up handling — re-emit the last topic with extra detail
// ---------------------------------------------------------------------------

function followUp(ctx: ChatContext): BotReply {
  if (!ctx.lastIntent) {
    return { text: "More about what? Try: work, publications, education, contact." };
  }
  switch (ctx.lastIntent) {
    case "publications":
      return {
        text:
          `Breakdown: ${publications.filter((p) => p.type === "journal").length} journal, ` +
          `${publications.filter((p) => p.type === "conference").length} conference, ` +
          `${publications.filter((p) => p.type === "chapter").length} chapter. ` +
          `Total citations on Scholar: ~${publications.reduce((s, p) => s + (p.citations ?? 0), 0)}. ` +
          `Strongest cited: "${publications.slice().sort((a, b) => (b.citations ?? 0) - (a.citations ?? 0))[0].title.split(":")[0]}".`,
        chips: ["IEEE Best Paper", "Mental health paper"],
      };
    case "experience":
      return {
        text:
          `${roles.map((r) => `${r.company} — ${r.bullets[0]}`).join("\n\n")}`,
      };
    case "current_role":
      return {
        text:
          `iBOS specifics:\n• ${current.bullets.join("\n• ")}\n\nStack at iBOS: ${current.stack.join(", ")}.`,
      };
    case "skills":
      return {
        text:
          `In practice: ${stats.years}+ years on the JVM, last 1.5+ also on .NET. ` +
          `Heavy on system design — service boundaries, rule engines (Drools), configuration-first design.`,
      };
    case "education":
      return {
        text:
          `Full education timeline:\n${education
            .map((e) => `• ${e.degree} — ${e.school} (${fmtMonth(e.from)} – ${fmtMonth(e.to)})`)
            .join("\n")}`,
      };
    case "awards":
      return { text: awardsBlurb() };
    case "publication_specific":
      return {
        text:
          `Across the publication line, ${stats.firstAuthor} are first-author. ` +
          `IoT smart sewerage won IEEE Best Paper at WIECON-ECE 2020 (most cited at ${publications.find((p) => p.key === "Rahman2020SmartSewer")?.citations} on Scholar). ` +
          `Mental-health study during COVID is the second most-cited at ${publications.find((p) => p.key === "RAHMAN2021100037")?.citations}.`,
      };
    case "project_specific":
    case "projects":
      return { text: listProjects() };
    case "architecture":
      return {
        text:
          `At iBOS the discipline is: pick the smallest service boundary that still owns its data, isolate suppliers behind adapters, push business changes to Drools, keep deployment boring with Docker. ` +
          `The "configuration over code" rule is enforced via the rule engine — most product changes ship without a code deploy.`,
      };
    case "research_areas":
      return {
        text:
          `Two first-author papers: IEEE Best Paper for IoT smart sewerage (2020) and TraFoo Android food-delivery (2021). ` +
          `Highest citation count: COVID-mental-health study (~${publications.find((p) => p.key === "RAHMAN2021100037")?.citations} citations).`,
      };
    case "github":
      return {
        text:
          `Portfolio source: github.com/mdmosfikurrahman/mdmosfikurrahman.github.io\n` +
          `Most production work is closed-source. Personal repos lean toward small experiments and learning notes.`,
      };
    case "future_plans":
      return {
        text:
          `The application track: IELTS Academic ✅, ECE credential evaluation ✅, sealed transcripts in flight, application packets being finalised for Fall 2027 deadlines (late 2026 – early 2027 cycle).`,
      };
    case "contact":
      return {
        text:
          `Fastest channels:\n• Email: ${profile.email}\n• LinkedIn: ${profile.links.linkedin}\n` +
          `Email gets a response within a couple of working days.`,
      };
    default:
      return { text: "Anything specific? I can dig into a paper, a project, or a role." };
  }
}

// ---------------------------------------------------------------------------
// router
// ---------------------------------------------------------------------------

export function answer(rawInput: string, ctx: ChatContext): { reply: BotReply; nextCtx: ChatContext } {
  const q = norm(rawInput);
  if (!q) {
    return {
      reply: { text: pickOne(FALLBACK_TIPS) },
      nextCtx: { ...ctx, turn: ctx.turn + 1 },
    };
  }

  // score every intent
  let best: { intent: Intent; score: number } | undefined;
  for (const it of intents) {
    if (it.not && matchScore(q, it.not) > 0) continue;
    let score = matchScore(q, it.patterns);
    if (it.strong) score += matchScore(q, it.strong) * 3;
    if (score > 0) score += (it.weight ?? 0) * 0.25;
    if (score > 0 && (!best || score > best.score)) best = { intent: it, score };
  }

  if (!best) {
    return {
      reply: {
        text: pickOne(FALLBACK_TIPS),
        chips: ["What does he do?", "Publications", "How to contact?"],
      },
      nextCtx: { ...ctx, turn: ctx.turn + 1, lastIntent: undefined },
    };
  }

  const reply = best.intent.handle(q, ctx);
  return {
    reply,
    nextCtx: {
      ...ctx,
      turn: ctx.turn + 1,
      lastIntent: best.intent.id,
      lastTopicKey: reply.topicKey ?? ctx.lastTopicKey,
    },
  };
}

// initial state + opener used by the UI on first open
export function openingMessage(): BotReply {
  return {
    text: `Hey — I'm ${DISPLAY_NAME}'s portfolio assistant. Ask me anything about his work, research, or how to reach him.`,
    // No chips here — the UI shows the full SUGGESTED_QUESTIONS grid on the
    // welcome screen instead, so the opener stays uncluttered.
  };
}

export function emptyContext(): ChatContext {
  return { turn: 0 };
}
