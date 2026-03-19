import { motion } from "framer-motion";

interface TimelineEntry {
  type: "education" | "publication-journal" | "publication-conference" | "career" | "award" | "activity" | "international" | "future";
  title: string;
  subtitle?: string;
  detail?: string;
  doi?: string;
}

interface YearBlock {
  year: string;
  entries: TimelineEntry[];
}

const years: YearBlock[] = [
  {
    year: "2018",
    entries: [
      { type: "education", title: "Enrolled in B.Sc. in Computer Science & Engineering", subtitle: "Daffodil International University, Dhaka", detail: "Started building foundations in programming, algorithms, data structures, and software engineering." },
      { type: "activity", title: "Joined Computer & Programming Club (CPC)", subtitle: "Daffodil International University", detail: "Began involvement in the campus tech community." },
    ],
  },
  {
    year: "2019",
    entries: [
      { type: "education", title: "Deepened Technical Foundations", subtitle: "OOP, Databases, Web Technologies", detail: "Advanced coursework strengthening core CS competencies." },
      { type: "activity", title: "Organizing Member — \"Take Off 2019\" Programming Contest", subtitle: "Computer & Programming Club, DIU" },
      { type: "education", title: "Began Research Exploration", subtitle: "Under supervision of Prof. Nazmun Nessa Moon", detail: "Started investigating IoT and smart systems as research areas." },
    ],
  },
  {
    year: "2020",
    entries: [
      { type: "publication-conference", title: "Future City of Bangladesh: IoT Based Autonomous Smart Sewerage and Hazard Condition Sharing System", subtitle: "IEEE WIECON-ECE 2020 · pp. 126–130", detail: "Designed an IoT prototype using Arduino, NodeMCU, MQ135 sensors, and MQTT for real-time sewerage monitoring and toxic gas detection in Dhaka.", doi: "10.1109/WIECON-ECE52138.2020.9397950" },
      { type: "award", title: "🏆 IEEE Best Paper Award (Computer — IoT)", subtitle: "IEEE WIECON-ECE 2020", detail: "Recognized for the IoT-based smart sewerage paper — a major early-career milestone." },
      { type: "activity", title: "Technical Lead — \"Take Off 2020\"", subtitle: "Programming Contest, Computer & Programming Club, DIU" },
      { type: "education", title: "Pivoted Research to COVID-19 Impact", subtitle: "Mental health, education, and public health", detail: "Began data collection on pandemic effects across demographics in Bangladesh." },
    ],
  },
  {
    year: "2021",
    entries: [
      { type: "publication-journal", title: "Impact of COVID-19 on Mental Health: A Quantitative Analysis of Anxiety and Depression Based on Regular Life and Internet Use", subtitle: "Current Research in Behavioral Sciences (Elsevier) · 2, 100037", detail: "Corresponding author. Quantitative survey analysis identifying correlations between internet usage patterns and mental health deterioration during lockdowns.", doi: "10.1016/j.crbeha.2021.100037" },
      { type: "publication-journal", title: "COVID-19 and Bangladesh: Situation Report, Comparative Analysis, and Case Study", subtitle: "Current Research in Behavioral Sciences (Elsevier) · 2, 100034", detail: "Comparative data analysis between Bangladesh and global COVID-19 trends with qualitative case study methodology.", doi: "10.1016/j.crbeha.2021.100034" },
      { type: "publication-journal", title: "Impactful E-Learning Framework: A New Hybrid Form of Education", subtitle: "Current Research in Behavioral Sciences (Elsevier) · 2, 100038", detail: "Mixed-methods study proposing an evidence-based hybrid e-learning framework improving engagement and learning outcomes.", doi: "10.1016/j.crbeha.2021.100038" },
      { type: "publication-conference", title: "Deep Learning Model for Detecting and Diagnosing Plant Disease", subtitle: "IEEE SMART GENCON 2021 · pp. 1–8", detail: "CNN-based image classification for plant disease detection — achieved 94% average accuracy.", doi: "10.1109/SMARTGENCON51891.2021.9645857" },
      { type: "publication-conference", title: "TraFoo: An Android Application for Food Delivery in Train", subtitle: "IEEE SMART GENCON 2021 · pp. 1–7", detail: "Three-module Android system using Firebase for food delivery during train journeys.", doi: "10.1109/SMARTGENCON51891.2021.9645900" },
      { type: "international", title: "Erasmus Mundus Exchange Program", subtitle: "Adam Mickiewicz University, Poznań, Poland", detail: "Completed 6 ECTS credits — gaining international academic exposure and European research methodologies." },
      { type: "education", title: "Graduated B.Sc. in CSE — CGPA: 3.83 / 4.00", subtitle: "Daffodil International University" },
      { type: "activity", title: "Vice President — Research & Career Wing", subtitle: "Computer & Programming Club, DIU" },
    ],
  },
  {
    year: "2022",
    entries: [
      { type: "career", title: "Software Engineer — BJIT Group", subtitle: "April 2022 · Backend Development", detail: "GraphQL-based BFF services using Java & Spring Boot. Backend modules for Rakuten Echiba (Japan) and Denka Corporate Website." },
      { type: "publication-conference", title: "Pandemic Effect on Education System Among University Students", subtitle: "Springer — Progresses in AI & Robotics · pp. 157–168", doi: "10.1007/978-3-030-98531-8_16" },
      { type: "activity", title: "Peer Reviewer — DLAIR 2022, ISMS 2022, CIS 2022", subtitle: "International Conferences" },
    ],
  },
  {
    year: "2023",
    entries: [
      { type: "career", title: "Software Engineer — REVE Systems Ltd.", subtitle: "July 2023 · Enterprise Java & National Projects", detail: "NBR Customs Bond Management System. Monolith to microservices refactoring. Oracle DB optimization." },
      { type: "publication-conference", title: "Cyber Security Intruder Detection Using Deep Learning Approach", subtitle: "Springer — Information Systems and Management Science · pp. 518–530", detail: "CICIDS2017 dataset. Random Forest achieved 99.9% accuracy. Neural network predicted 14 attack types at 91%.", doi: "10.1007/978-3-031-13150-9_42" },
      { type: "publication-conference", title: "A New Chaotic-Based Analysis of Data Encryption and Decryption", subtitle: "Springer — Advances in Data Science and AI · pp. 455–468", doi: "10.1007/978-3-031-16178-0_32" },
      { type: "activity", title: "Active Peer Reviewer", subtitle: "ISA Transactions · NLP Journal · Journal of King Saud University" },
    ],
  },
  {
    year: "2024",
    entries: [
      { type: "career", title: "Software Engineer L-II — Akij iBOS Ltd.", subtitle: "November 2024 · Architecture & Team Leadership", detail: "Akij Air architecture planning. Leading teams on TrackForce — REST APIs, real-time tracking, CI/CD." },
      { type: "publication-conference", title: "Machine Learning-Based Prediction of COVID-19: A Robust Approach for Early Diagnosis and Treatment", subtitle: "Springer — TCCE 2024 · pp. 205–215", detail: "XGBoost outperformed 11 other ML algorithms for COVID-19 prediction.", doi: "10.1007/978-981-97-1923-5_16" },
      { type: "activity", title: "Conference Speaker — IEEE WIECON-ECE 2024", subtitle: "10th IEEE International Women in Engineering Conference" },
      { type: "activity", title: "Guest Speaker — \"How to Get Started: Undergraduate Research Journey\"", subtitle: "Computer & Programming Club, DIU" },
    ],
  },
  {
    year: "2025",
    entries: [
      { type: "career", title: "Continuing at Akij iBOS Ltd.", subtitle: "Cross-functional coordination & architectural documentation", detail: "3.5+ years across BJIT, REVE Systems, and Akij iBOS." },
      { type: "education", title: "IBM Data Science Professional Certificate", subtitle: "Coursera · DataCamp ML & Data Science Certifications" },
    ],
  },
  {
    year: "2026 →",
    entries: [
      {
        type: "future",
        title: "Research & Advanced Studies",
        subtitle: "Artificial Intelligence · Data Science · Systems Research",
        detail: "Focused on advancing expertise in machine learning, cybersecurity, and intelligent systems through research and industry collaboration."
      },
    ],
  },
];

const typeConfig: Record<string, { label: string; borderClass: string }> = {
  education:                { label: "Education",     borderClass: "border-l-primary/40" },
  "publication-journal":    { label: "Journal",       borderClass: "border-l-accent" },
  "publication-conference": { label: "Conference",    borderClass: "border-l-navy-light" },
  career:                   { label: "Career",        borderClass: "border-l-primary/25" },
  award:                    { label: "Award",         borderClass: "border-l-gold-deep" },
  activity:                 { label: "Activity",      borderClass: "border-l-muted-foreground/30" },
  international:            { label: "International", borderClass: "border-l-primary/50" },
  future:                   { label: "Future",        borderClass: "border-l-accent" },
};

const dotConfig: Record<string, string> = {
  education: "bg-primary/40",
  "publication-journal": "bg-accent",
  "publication-conference": "bg-navy-light",
  career: "bg-primary/25",
  award: "bg-gold-deep",
  activity: "bg-muted-foreground/30",
  international: "bg-primary/50",
  future: "bg-accent",
};

const labelConfig: Record<string, string> = {
  education: "text-primary/70 bg-primary/5",
  "publication-journal": "text-gold-deep bg-gold-muted",
  "publication-conference": "text-navy-light bg-primary/5",
  career: "text-muted-foreground bg-secondary",
  award: "text-gold-deep bg-gold-muted",
  activity: "text-muted-foreground bg-secondary",
  international: "text-primary bg-primary/5",
  future: "text-accent bg-gold-muted",
};

const YearbookSection = () => {
  return (
    <section id="journey" className="section-padding bg-section-alt">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="section-label">Yearbook</p>
          <h2 className="section-title">The Full Story</h2>
          <p className="text-muted-foreground text-sm max-w-2xl">
            A chronological record — from BSc enrollment in 2018 through
            10 publications, an IEEE Best Paper Award, and onward to a PhD.
          </p>
        </motion.div>

        <div>
          {years.map((yearBlock, yi) => (
            <motion.div
              key={yearBlock.year}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: yi * 0.03 }}
              className="mb-12"
            >
              {/* Year */}
              <div className="mb-5">
                <span className="font-display text-4xl md:text-5xl font-bold text-primary/40 select-none">
                  {yearBlock.year}
                </span>
              </div>

              {/* Entries */}
              <div className="space-y-0 border-l border-border ml-3">
                {yearBlock.entries.map((entry, ei) => {
                  const cfg = typeConfig[entry.type];
                  return (
                    <motion.div
                      key={ei}
                      className={`relative pl-7 py-3 border-l-2 -ml-px ${cfg.borderClass}`}
                      initial={{ opacity: 0, x: -6 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.25, delay: ei * 0.03 }}
                    >
                      {/* Dot */}
                      <div className={`absolute -left-[5px] top-4 w-2 h-2 rounded-full ${dotConfig[entry.type]}`} />

                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-sm tracking-wider uppercase ${labelConfig[entry.type]}`}>
                        {cfg.label}
                      </span>

                      <h4 className="text-[14px] font-semibold text-foreground leading-snug mt-1">
                        {entry.title}
                      </h4>

                      {entry.subtitle && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {entry.subtitle}
                        </p>
                      )}

                      {entry.detail && (
                        <p className="text-[13px] text-muted-foreground/80 leading-relaxed mt-1.5">
                          {entry.detail}
                        </p>
                      )}

                      {entry.doi && (
                        <a
                          href={`https://doi.org/${entry.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-[11px] text-accent hover:text-gold-deep transition-colors mt-1 font-medium"
                        >
                          DOI: {entry.doi} ↗
                        </a>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <motion.div
          className="border-t border-border pt-10 mt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-5 gap-2">
            {[
              { n: "10", l: "Publications" },
              { n: "3", l: "Journals" },
              { n: "7", l: "Conferences" },
              { n: "3.5+", l: "Years Industry" },
              { n: "6+", l: "Reviewer Roles" },
            ].map((s) => (
              <div key={s.l} className="text-center py-3">
                <p className="font-display text-xl font-bold text-foreground">{s.n}</p>
                <p className="text-[10px] text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default YearbookSection;
