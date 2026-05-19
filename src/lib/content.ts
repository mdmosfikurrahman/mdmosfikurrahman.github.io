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
  role: "Backend architect · Dhaka",
  roleLong: "Engineer II, iBOS Ltd.",
  tagline:
    "Designing the quiet half of software: services, schemas, and workflows, based in Dhaka.",
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
    company: "iBOS Ltd.",
    companyUrl: "https://ibos.io/",
    title: "Engineer II · Backend architecture",
    from: "2024-11",
    to: "present",
    place: "Dhaka, BD",
    summary:
      "Backend architect for an OTA platform at iBOS Ltd. — a sister concern of Akij Resource Ltd. — that I designed and built, now serving 10k+ daily users. Scalable, configurable, rule-driven systems across Java, .NET, and Node, with hands-on Docker and deployment.",
    bullets: [
      "Designed and built the backend architecture for a production OTA platform serving 10k+ daily users.",
      "Owned system design: rule-driven logic, supplier-integration flows, and microservice-based workflows.",
      "Working across multiple stacks (.NET and Java), with hands-on Docker and deployment experience.",
      "Shaping service boundaries and domain models to keep the estate maintainable as it scales.",
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
      "Built full-stack features: React front, Spring Boot back, Oracle data layer.",
      "Improved system throughput ~25% through query tuning and access-path refactoring.",
      "Hardened authentication and authorisation via OAuth2 and Spring Security.",
      "Automated BGMEA / BKMEA sync for garment-export declaration processing.",
    ],
    stack: ["Java", "Spring Boot", "React", "Oracle", "OAuth2"],
  },
  {
    company: "BJIT Group",
    companyUrl: "https://bjitgroup.com/",
    title: "Software Engineer · Backend (GraphQL BFF)",
    from: "2022-04",
    to: "2023-06",
    place: "Dhaka, BD",
    summary:
      "Backend for Rakuten Echiba e-commerce and the Denka corporate CMS. GraphQL-based BFF, schema-stitched resolvers, and database optimisation, with delivery to Japanese stakeholders.",
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
  highlights: string[];
  stack: string[];
  tags: string[];
  flagship?: boolean;
};

export const projects: Project[] = [
  {
    name: "OTA Platform · Backend",
    at: "iBOS Ltd. (Akij Resource sister concern)",
    year: "2024–",
    role: "Backend architecture & system design",
    blurb:
      "A production online-travel platform I designed and built, now serving 10k+ daily users. Backend architecture around supplier integration, rule-driven pricing logic, and configurable microservice workflows — designed configuration-first, so product changes rarely mean code changes.",
    highlights: [
      "Designed and built the end-to-end backend architecture for a production OTA platform now serving 10k+ daily users.",
      "Modelled supplier-integration flows and a rule-driven pricing engine so business changes are configuration, not code.",
      "Decomposed the estate into microservice workflows with clear service boundaries to keep it maintainable as it scales.",
      "Delivered across Java, .NET, and Node with hands-on Docker packaging and deployment.",
    ],
    stack: ["Java", "Spring Boot", ".NET", "Node.js", "Drools", "gRPC", "Docker", "Kubernetes"],
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
      "National-scale customs-bond system for Bangladesh's National Board of Revenue, used for garment-export compliance.",
    highlights: [
      "Shipped production modules on a live national compliance system (NBR Customs Bond).",
      "Owned the Legal Case and Utilization Declaration modules end to end — React front, Spring Boot back, Oracle data layer.",
      "Automated BGMEA / BKMEA synchronisation for garment-export declaration processing.",
      "Improved system throughput ~25% via query tuning and access-path refactoring; hardened auth with OAuth2 and Spring Security.",
    ],
    stack: ["Java", "Spring Boot", "React", "Oracle", "OAuth2"],
    tags: ["Spring Boot", "React", "Oracle", "compliance"],
  },
  {
    name: "Rakuten Echiba · GraphQL BFF",
    at: "BJIT · Rakuten",
    href: "https://www.rakuten.co.jp/",
    year: "2022–23",
    role: "Backend Engineer",
    blurb:
      "GraphQL Backend-for-Frontend for Rakuten Echiba e-commerce, delivered to Japanese stakeholders.",
    highlights: [
      "Built GraphQL BFF services handling complex nested data with resolver batching.",
      "Reduced query latency through schema stitching and join-path optimisation.",
      "Contributed reusable service patterns to internal GraphQL schema tooling used across teams.",
      "Delivered to Japanese enterprise review standards — correctness and operational calmness.",
    ],
    stack: ["Java", "Spring Boot", "GraphQL", "Oracle"],
    tags: ["GraphQL", "Java", "Spring Boot"],
  },
  {
    name: "Denka Corporate CMS",
    at: "BJIT · Denka",
    year: "2022–23",
    role: "Full-stack Engineer",
    blurb:
      "Corporate CMS for Denka Japan across a Thymeleaf-driven stack.",
    highlights: [
      "Delivered CMS and multilingual content logic for the Denka corporate site.",
      "Built dynamic Marquee components and content-scheduling workflows.",
      "Integrated SEO and analytics across the Thymeleaf-driven stack.",
      "Coordinated delivery with Japanese stakeholders end to end.",
    ],
    stack: ["Java", "Thymeleaf", "Spring Boot"],
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
  award?: string;
  impactRank?: number; // 1 = strongest; drives deck ordering within author group
  pdf?: string;        // served from /public/papers/<key>.pdf when available
  abstract?: string;
  problem?: string;
  solution?: string;
  challenges?: string;
  methodology?: string;
  keyFindings?: string;
  impact?: string;
  keywords?: string[];
};

export const publications: Publication[] = [
  {
    key: "Johora2024CovidPrediction",
    impactRank: 5,
    pdf: "/papers/Johora2024CovidPrediction.pdf",
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
    abstract:
      "A machine-learning pipeline for early COVID-19 diagnosis trained on 3,039 clinical / demographic records with 23 features. After normalisation, missing-value handling, and feature encoding, eight supervised models were benchmarked (KNN, Decision Tree, Random Forest, AdaBoost, XGBoost, Logistic Regression, SVM, and Naïve Bayes) under accuracy, Jaccard score, and cross-validation. XGBoost reached ~98.19%, leading Random Forest and Decision Tree. The system is designed to slot into digital health platforms for remote screening, easing load on front-line testing infrastructure.",
    problem:
      "Early COVID-19 diagnosis was rate-limited by testing capacity and slow turnaround, particularly in dense populations, and a scalable predictor from routine clinical signals was missing.",
    solution:
      "Benchmark a panel of supervised classifiers on clinical + demographic signals to predict infection early and select the strongest model for deployment.",
    challenges:
      "Data inconsistency, a modest clinical dataset, and symptom variability across populations constrain model reliability and generalisation.",
    methodology:
      "Assembled 3,039 records × 23 features from medical institutions and open sources; normalised, imputed missing values, and encoded categoricals; trained KNN / DT / RF / AdaBoost / XGBoost / LogReg / SVM / NB with cross-validation; evaluated via accuracy, Jaccard score, and confusion matrix.",
    keyFindings:
      "XGBoost delivered the best accuracy (~98.19%), outperforming all other models. A strong signal that ensemble gradient boosting generalises well on this feature set.",
    impact:
      "A deployable early-diagnosis layer for telehealth and triage systems, reducing pressure on testing queues and tightening pandemic response loops.",
    keywords: ["COVID-19", "Machine Learning", "XGBoost", "Early Diagnosis", "Healthcare AI"],
  },
  {
    key: "Johora2023ChaoticEncryption",
    impactRank: 6,
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
    abstract:
      "CRSA (Chaotic Random Seed Algorithm) strengthens symmetric encryption by deriving keys from millisecond-scale time-dependent randomness, combined with ASCII-value transformation and iterative encryption. Architecture covers both encryption and decryption workflows and was benchmarked against AES and DES on execution time, memory footprint, and throughput. CRSA is slightly slower than AES but offers stronger key unpredictability, and was validated across text, image, and audio payloads for secure-communication use.",
    problem:
      "Classic encryption schemes struggle to generate highly unpredictable keys and to hold up against evolving pattern-based and brute-force attacks on modern data.",
    solution:
      "A chaotic random-seed algorithm that generates keys dynamically from time-dependent entropy, combined with ASCII-level value transformation to iteratively encrypt plaintext.",
    challenges:
      "Balancing randomness with computational efficiency, keeping the scheme scalable, and matching AES-class performance while improving unpredictability.",
    methodology:
      "Designed CRSA around millisecond-based random seed generation; applied ASCII transformations with dynamically generated values for iterative encrypt/decrypt; formalised workflows and benchmarked against AES and DES on execution time, memory use, and throughput.",
    keyFindings:
      "CRSA improves key randomness and resistance to brute-force / pattern attacks, achieves performance competitive with AES, and outperforms DES on efficiency and unpredictability.",
    impact:
      "A flexible encryption building block for modern secure-communication stacks, applicable to text, image, and audio payloads, with a path toward cloud-based security services.",
    keywords: ["Cryptography", "Chaotic Algorithm", "Encryption", "Random Seed", "Data Security", "CRSA"],
  },
  {
    key: "Islam2023CyberSecurity",
    impactRank: 4,
    pdf: "/papers/Islam2023CyberSecurity.pdf",
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
    abstract:
      "A deep-learning intrusion detection system trained on CICIDS2017 (~2.5M records, 79 features) covering DDoS, DoS, PortScan and other attack classes. After cleaning, normalisation, feature encoding, and PCA / t-SNE dimensionality studies, a feedforward network with dropout and early stopping was trained in TensorFlow. The model reached ~91.2% accuracy on multiclass classification and up to 99% on binary tasks, demonstrating that learned representations can catch both known and previously-unseen attack patterns at scale.",
    problem:
      "Signature-based IDS can only catch attacks they have already seen; evolving zero-day and polymorphic traffic patterns slip past and force constant rule updates.",
    solution:
      "A feedforward neural network that learns attack signatures directly from high-dimensional network traffic, handling both binary and multiclass intrusion classification.",
    challenges:
      "Severe class imbalance, overlapping feature distributions between attack types (visible in PCA / t-SNE), and high feature dimensionality complicate accurate classification.",
    methodology:
      "Used CICIDS2017 (~2.5M records, 79 features); performed cleaning, normalisation, feature encoding, and PCA / t-SNE for feature geometry inspection; built a feedforward TensorFlow model with dropout and early stopping; evaluated multiclass and binary tasks via accuracy, precision, recall, and confusion matrix.",
    keyFindings:
      "~91.2% multiclass accuracy and up to 99% binary accuracy. Deep models generalise well to both known and unknown attacks on this feature set.",
    impact:
      "A scalable AI-driven layer for modern intrusion detection, raising coverage of evolving threats without manual signature authoring.",
    keywords: ["Cyber Security", "Intrusion Detection", "Deep Learning", "Neural Network", "CICIDS2017"],
  },
  {
    key: "Yesmin2022Education",
    impactRank: 10,
    pdf: "/papers/Yesmin2022Education.pdf",
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
    abstract:
      "A data-driven study of how pandemic-era online examinations reshaped academic integrity. ~1,000 Google Forms responses captured self-reported exam behaviour: external help, lookups, technical issues. After preprocessing and numerical encoding, KNN, Logistic Regression, and Naïve Bayes were trained to predict cheating patterns. KNN reached 95% accuracy; LR and NB hovered near 89%. Findings expose concrete weaknesses in remote exam designs and motivate stronger monitoring and authentication in digital assessment.",
    problem:
      "Online exams during COVID-19 introduced widespread integrity and security failures, but lacked data-driven analysis to understand cheating behaviour and harden exam design.",
    solution:
      "Model student exam behaviour with supervised ML classifiers to surface cheating patterns and inform more secure online-exam architectures.",
    challenges:
      "Small dataset, self-reported behaviour, and difficulty capturing real cheating in the wild reduce model reliability and external validity.",
    methodology:
      "Collected ~1,000 Google Forms responses on exam behaviour; cleaned and numerically encoded the survey; trained KNN, Logistic Regression, and Naïve Bayes with train-test split; evaluated using accuracy, precision, recall, and confusion matrix.",
    keyFindings:
      "KNN reached ~95% accuracy (vs ~89% for LR / NB), revealing consistent behavioural patterns: students leaned heavily on Google, peers, and online platforms during remote exams.",
    impact:
      "Evidence base for redesigning online-exam platforms with stronger monitoring, authentication, and integrity signals.",
    keywords: ["Online Education", "Exam Security", "Machine Learning", "KNN", "Cheating Detection", "COVID-19"],
  },
  {
    key: "Moon2021PlantDisease",
    impactRank: 7,
    pdf: "/papers/Moon2021PlantDisease.pdf",
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
    abstract:
      "A CNN-based leaf-image classifier for detecting plant disease across potato, tomato, pepper, and rice. A ~20,000-image corpus combining PlantVillage with field-collected rice samples was preprocessed, labelled, and augmented. Transfer learning with ResNet-34 accelerated training and raised accuracy. In-distribution accuracy reached 94–95%, but real-world photos dropped performance to ~44%, exposing background-bias and dataset-shift issues. The paper frames these gaps as concrete targets for deploying a farmer-facing mobile diagnosis tool.",
    problem:
      "Manual plant-disease diagnosis is slow and error-prone, and existing automated pipelines struggle with accuracy, dataset limits, and real-world agricultural variability.",
    solution:
      "A CNN image-classification system using preprocessing, augmentation, and transfer learning to identify diseased vs healthy leaves across four staple crops.",
    challenges:
      "Dataset bias toward clean backgrounds, limited real-field images, visually similar disease classes, and a generalisation gap between lab and field data.",
    methodology:
      "Merged PlantVillage + collected rice-disease images (~20,000 samples); applied resizing, normalisation, and augmentation; fine-tuned ResNet-34 in phases tuning image size and hyperparameters; evaluated using accuracy and F1-score.",
    keyFindings:
      "Up to 95% accuracy in controlled settings, but ~44% on real-world imagery; a concrete generalisation gap driven by dataset bias and background variability.",
    impact:
      "A practical template for mobile-first agricultural AI, and a honest accounting of the data work needed before field deployment.",
    keywords: ["Deep Learning", "CNN", "Plant Disease", "Image Processing", "Transfer Learning", "Agriculture AI"],
  },
  {
    key: "Rahman2021TraFoo",
    impactRank: 3,
    pdf: "/papers/Rahman2021TraFoo.pdf",
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
    abstract:
      "TraFoo is an Android food-delivery application designed for long-distance train travel in Bangladesh. Three coordinated modules (customer, rider, restaurant) run on Android Studio with Java / XML and a Firebase real-time backend. Customers browse menus, place orders, and track deliveries; riders receive notifications and manage pickups; restaurants update availability. Business-process modelling and use-case modelling ensure the three actors stay in sync within tight journey timelines. Usability, functional, and system testing confirm responsive real-time operation.",
    problem:
      "Train passengers struggle to access affordable, hygienic, and timely food on long journeys, and existing systems fail to coordinate customers, delivery riders, and restaurants.",
    solution:
      "A three-module Android application connecting customers, riders, and restaurants for real-time ordering and delivery synced to train schedules.",
    challenges:
      "Dependence on mobile connectivity, real-time coordination across three actors, and delivery reliability inside tight railway-schedule windows.",
    methodology:
      "Designed a three-module architecture (customer / rider / restaurant) with business-process and use-case diagrams; implemented in Android Studio (Java + XML) with Firebase real-time database; validated through unit, functional, and system tests.",
    keyFindings:
      "The system achieves smooth coordination between users, riders, and restaurants, improving delivery speed, usability, and food accessibility during travel.",
    impact:
      "A mobility-first delivery template for railway passengers, pointing toward integrations with national rail systems and station-side vendors.",
    keywords: ["Android", "Food Delivery", "Mobile App", "Firebase", "System Design"],
  },
  {
    key: "SHETU2021100038",
    impactRank: 8,
    pdf: "/papers/SHETU2021100038.pdf",
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
    abstract:
      "A hybrid e-learning framework designed to modernise digital education while staying workable in regions with unstable networks. The architecture combines a web portal, central database, and cloud storage with role-based access for students, teachers, and administrators. Modules cover course management, resource sharing, MCQ and written assessments, performance tracking, forum communication, and feedback. Partial offline functionality makes the system resilient to network failure, and a self-learning-centric design improves usability and scalability across digital-education deployments.",
    problem:
      "Traditional education systems fail to adapt cleanly to digital environments, especially in network-constrained regions, and lack a unified framework bridging online and offline learning.",
    solution:
      "A hybrid e-learning framework integrating online and offline learning, cloud-based storage, and role-based access for students, teachers, and administrators.",
    challenges:
      "Network instability, scalability under load, and integrating offline access with online assessments pose real implementation hurdles.",
    methodology:
      "Designed architecture with web portal, central database, and cloud storage; specified role-based functionality (students / teachers / administrators) for courses, assessments, and performance tracking; modelled enrolment, MCQ / written exams, and forum interaction via structured system diagrams.",
    keyFindings:
      "The hybrid model improves accessibility, supports self-learning, and keeps course management working under network limitations via partial offline functionality.",
    impact:
      "A scalable, flexible education framework especially suited to developing-region deployments, improving digital-learning reach and system efficiency.",
    keywords: ["E-learning", "Blended Learning", "Hybrid Education", "Online Assessment", "Cloud System"],
  },
  {
    key: "RAHMAN2021100037",
    impactRank: 2,
    pdf: "/papers/RAHMAN2021100037.pdf",
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
    abstract:
      "A quantitative study of how COVID-19 reshaped mental health in Bangladesh, based on 350 survey responses. The analysis connects depression and anxiety indicators to internet usage, daily routines, and behavioural change. 42.78% of respondents reported depressive signals (higher among females), and extended internet use, reduced outdoor activity, and disrupted routines emerged as dominant contributors. Secondary effects included loss of concentration, irritability, and fatigue. Together the findings draw a direct line from prolonged digital exposure to declining psychological well-being during lockdown.",
    problem:
      "COVID-19 disrupted daily life and raised psychological distress, but Bangladesh lacked quantitative analyses linking lifestyle changes, internet use, and mental health.",
    solution:
      "A survey-based quantitative study combining lifestyle, internet-usage, and psychological indicators via statistical analysis and visualisation.",
    challenges:
      "Limited sample diversity (student-heavy) and self-reported responses introduce bias and constrain generalisation.",
    methodology:
      "Collected 350 survey responses; converted qualitative responses into quantitative form; applied statistical analysis plus pie / count plots to examine depression, internet use, and behavioural change.",
    keyFindings:
      "42.78% of respondents showed depressive signals (higher among females); prolonged internet use and reduced social activity correlated strongly with declining mental health.",
    impact:
      "Documents the link between digital behaviour and mental health, supporting awareness campaigns and intervention strategies during pandemics and future crises.",
    keywords: ["COVID-19", "Mental Health", "Depression", "Internet Usage", "Psychological Impact"],
  },
  {
    key: "SAIFUZZAMAN2021100034",
    impactRank: 9,
    pdf: "/papers/SAIFUZZAMAN2021100034.pdf",
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
    abstract:
      "A multi-source analysis of COVID-19 in Bangladesh combining national statistics, comparative global data (USA, Brazil, Italy, China, Russia), and media-sourced case studies. Visualisations trace infection rates, mortality, recovery, testing, and quarantine across divisions and demographics. Dhaka emerged as the most affected region by volume (density effect), while Chittagong showed a higher death percentage; older populations and men carried higher mortality. Case studies cover knock-on effects across education, economy, politics, and mental health, producing a multi-dimensional picture of the pandemic locally and globally.",
    problem:
      "COVID-19 caused broad health, economic, and social disruption in Bangladesh, but analyses integrating national trends, global comparisons, and ground-level case studies were missing.",
    solution:
      "An integrated report combining statistical analysis, data visualisation, and case studies for a situation report and comparative analysis vs peer countries.",
    challenges:
      "Data sourced from multiple origins varies in accuracy; case studies drawn from media introduce subjectivity and limit empirical validation.",
    methodology:
      "Gathered national COVID-19 statistics, quarantine data, demographic reports, and global comparisons; cleaned and validated the data; applied line plots and comparative charts; ran algorithmic analysis across divisions and countries.",
    keyFindings:
      "Dhaka showed the highest infection counts; Chittagong carried a higher death percentage. Older age groups and men were more affected. Bangladesh's growth and mortality patterns diverged from global peers.",
    impact:
      "A data-driven, multi-lens view of COVID-19 in Bangladesh, useful for policy analysis, public awareness, and future pandemic preparedness.",
    keywords: ["COVID-19", "Bangladesh", "Comparative Analysis", "Data Visualization", "Case Study"],
  },
  {
    key: "Rahman2020SmartSewer",
    impactRank: 1,
    pdf: "/papers/Rahman2020SmartSewer.pdf",
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
    award: "IEEE Best Paper Award",
    abstract:
      "An IoT-based autonomous smart sewerage system targeting Dhaka's waterlogging and the hazardous conditions faced by sewer workers. A fixed manhole device uses ultrasonic sensors, force-sensitive resistors, and valves to detect rising water and predict blockage; a portable device with MQ135 sensors evaluates air quality and warns workers via LED indicators. Data flow to a central dashboard over MQTT. Urban areas are partitioned into nodes to localise blockage points. Prototype experiments validated water-threshold and hazardous-gas detection, producing a practical, scalable smart-city deployment for flood prediction and worker safety.",
    problem:
      "Urban flooding and hazardous sewer environments in Dhaka lack real-time monitoring, driving waterlogging and life-threatening gas exposure for sewer workers.",
    solution:
      "An IoT smart-sewerage system combining water-level monitoring and toxic-gas detection with a real-time dashboard and alert pipeline.",
    challenges:
      "Protecting sensors in harsh environments, transmitting data reliably, detecting ammonia accurately, and integrating with existing urban infrastructure.",
    methodology:
      "Built a dual-module system: a fixed device (ultrasonic + FSR + valves) for water-level detection, and a portable device (MQ135) for gas sensing; integrated NodeMCU / Arduino; streamed data via MQTT to a central dashboard; partitioned urban areas into nodes for blockage localisation; validated with prototype experiments.",
    keyFindings:
      "The system reliably detects rising water levels and hazardous gas conditions, enabling early blockage prediction and improving safety for sewer workers.",
    impact:
      "A practical smart-city solution for flood prevention and sanitation-worker safety, deployable as a template for developing-region urban infrastructure. Recognised with the IEEE WIECON-ECE Best Paper Award.",
    keywords: ["IoT", "Smart Sewerage", "Flood Prediction", "Hazard Detection", "MQTT", "NodeMCU"],
  },
];

export const reviewerFor = [
  "ISA Transactions",
  "Journal of King Saud University · Computer and Information Sciences",
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
    degree: "B.Sc. in Computer Science & Engineering · Erasmus+ Exchange",
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
      "PCAP · Programming Essentials in Python (Cisco)",
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

// Verifiable, credential-backed badges (Credly). Curated headline set.
export const verifiedBadges = [
  {
    title: "Data Science Professional Certificate",
    issuer: "Coursera",
    authorizedBy: "IBM",
    level: "Professional",
    blurb:
      "End-to-end data science: the DS methodology, Jupyter, Python apps, SQL, Pandas, visualisation, and building/evaluating ML models with scikit-learn & SciPy.",
    url: "https://www.credly.com/badges/daf46bed-e3e1-42d6-9fb4-8d0ab2fd825b/public_url",
  },
  {
    title: "Applied Data Science Specialization",
    issuer: "Coursera",
    authorizedBy: "IBM",
    level: "Intermediate",
    blurb:
      "Practical skills for real-world data science: Python for DS apps, plus data visualisation with Matplotlib and Seaborn.",
    url: "https://www.credly.com/badges/7c97e2b4-b2ec-4413-a39d-31a0f2d3a869/public_url",
  },
  {
    title: "Applied Data Science Capstone",
    issuer: "Coursera",
    authorizedBy: "IBM",
    level: "Intermediate",
    blurb:
      "Defining a location-data problem, calling APIs, solving it with ML, and delivering a full formal data-science project report.",
    url: "https://www.credly.com/badges/68834eaf-abfd-416b-b53d-a21c42385cc3/public_url",
  },
  {
    title: "Data Science Foundations",
    issuer: "Coursera",
    authorizedBy: "IBM",
    level: "Foundational",
    blurb:
      "Foundations of data science: the role and tasks, Jupyter tooling, the DS problem-solving methodology, and SQL on relational databases.",
    url: "https://www.credly.com/badges/b8f09d7b-27db-4f31-b738-b27b84a7ebf3/public_url",
  },
];

// Top-line recognitions used on /about. Curated, not exhaustive.
export type Distinction = {
  year: number;
  kind: "award" | "exchange" | "talk";
  headline: string;
  issuer: string;
  detail?: string;
};

export const distinctions: Distinction[] = [
  {
    year: 2020,
    kind: "award",
    headline: "IEEE Best Paper Award",
    issuer: "WIECON-ECE 2020, IEEE",
    detail: "For the IoT-based autonomous smart-sewerage paper, first author.",
  },
  {
    year: 2021,
    kind: "award",
    headline: "Winner · Data Science Hackathon",
    issuer: "Data Science Summit, DSL · DIU",
    detail: "National university-level hackathon run by Daffodil Smart Lab.",
  },
  {
    year: 2021,
    kind: "exchange",
    headline: "Erasmus+ Exchange Fellowship",
    issuer: "Adam Mickiewicz University, Poznań",
    detail: "One semester of CSE coursework; passed with 80%, 6 ECTS.",
  },
  {
    year: 2024,
    kind: "talk",
    headline: "Invited Speaker",
    issuer: "IEEE WIECON-ECE 2024, 10th edition",
    detail: "Technical session on applied research workflows.",
  },
];

export const talksAndService = [
  { year: 2024, kind: "Speaker", title: "Technical session at the 10th IEEE International Women in Engineering Conference (WIECON-ECE 2024)." },
  { year: 2022, kind: "Guest speaker", title: "“How to Get Started: Undergraduate Research Journey”, Computer & Programming Club, DIU." },
  { year: 2021, kind: "Winner", title: "Data Science Hackathon 2021, Data Science Summit, DSL, Daffodil International University." },
  { year: 2021, kind: "Vice President", title: "Research & Career Wing, Computer & Programming Club, Daffodil International University." },
  { year: 2021, kind: "Instructor", title: "Workshop: “Python: Everything You Need to Know”, CPC DIU." },
  { year: 2020, kind: "Technical Lead", title: "“Take Off – 2020”, CPC DIU." },
  { year: 2019, kind: "Content Writer", title: "Computer & Programming Club, Daffodil International University." },
  { year: 2019, kind: "Organising member", title: "Programming Contest, “Take Off – 2019”, CPC DIU." },
  { year: 2018, kind: "COO", title: "Binary Pathshala · Bangla-language CS learning platform." },
  { year: 2017, kind: "Literary Editor", title: "Bondhushava · national Bangla literary platform." },
];

export function formatAuthors(authors: string[], highlight = "Rahman, Md. Mosfikur") {
  return authors.map((a) => ({ name: a, bold: a === highlight }));
}

export function doiUrl(doi?: string) {
  if (!doi) return undefined;
  return `https://doi.org/${doi}`;
}

// Computed at module load; always current on every page view.
export const stats = {
  years: yearsSince(CAREER_START),
  companies: roles.length,
  publications: publications.length,
  firstAuthor: publications.filter((p) => (p.tags || []).includes("first-author")).length,
  reviewer: reviewerFor.length,
  systems: 5, // OTA · CBMS · Rakuten · Denka · TraFoo
};

export const preamble: string[] = [
  "I design the quiet half of software: the services, schemas, and workflows that hold a product together once traffic shows up. Paid work on backends in Java and .NET, published work in applied ML and systems.",
  `${capitalize(word(stats.years))} years shipping production systems across ${word(stats.companies)} companies, and ${word(stats.publications)} peer-reviewed papers along the way, ${word(stats.firstAuthor)} as first author.`,
  "Currently shaping backend architecture at iBOS: configurable systems, rule-driven logic, and microservice workflows across Java, .NET, and Node. Earlier, national-scale compliance software for the NBR, and backend services for Rakuten in Japan.",
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
