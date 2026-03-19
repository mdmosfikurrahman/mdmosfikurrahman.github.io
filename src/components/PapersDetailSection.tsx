import {motion} from "framer-motion";
import {ExternalLink} from "lucide-react";

interface PaperDetail {
    id: string;
    title: string;
    authors: string;
    venue: string;
    year: number;
    doi: string;
    type: "journal" | "conference";
    award?: string;
    abstract: string;
    keywords: string[];
    problem: string;
    solution: string;
    challenges: string;
    methodology: string;
    keyFindings: string;
    impact: string;
}

const papers: PaperDetail[] = [
    {
        id: "mental-health",
        title: "Impact of COVID-19 on mental health: A quantitative analysis of anxiety and depression based on regular life and internet use",
        authors: "Md. Mosfikur Rahman, Mohd. Saifuzzaman, Akash Ahmed, Mahfuja Ferdousi Mahin, Syeda Farjana Shetu",
        venue: "Current Research in Behavioral Sciences (Elsevier)",
        year: 2021,
        doi: "10.1016/j.crbeha.2021.100037",
        type: "journal",

        problem: "Psychological impact of COVID-19 including anxiety, depression, and behavioral changes.",
        solution: "Survey-based statistical and visualization-driven analysis.",
        challenges: "Qualitative data transformation and behavioral variability.",

        abstract: "Analyzes psychological state using survey data, statistical modeling, and visualization.",
        keywords: ["COVID-19", "Mental Health", "Depression", "Anxiety"],

        methodology: "350 participant survey, qualitative-to-quantitative transformation, statistical analysis.",
        keyFindings: "42.78% people depressed; strong link between internet use and psychological change.",
        impact: "Guides mental health policy and awareness.",
    },

    {
        id: "covid-bd",
        title: "COVID-19 and Bangladesh: Situation report, comparative analysis, and case study",
        authors: "Md. Mosfikur Rahman, Mohd. Saifuzzaman, Akash Ahmed, Mahfuja Ferdousi Mahin, Syeda Farjana Shetu",
        venue: "Current Research in Behavioral Sciences (Elsevier)",
        year: 2021,
        doi: "10.1016/j.crbeha.2021.100034",
        type: "journal",

        problem: "Understanding COVID-19 spread and impact in Bangladesh.",
        solution: "Comparative analysis using global and national datasets.",
        challenges: "Dynamic and incomplete pandemic data.",

        abstract: "Comparative case study of COVID-19 trends in Bangladesh.",
        keywords: ["COVID-19", "Bangladesh"],

        methodology: "Comparative statistical analysis and case study.",
        keyFindings: "Identified country-specific trends.",
        impact: "Supports national decision-making.",
    },

    {
        id: "elearning",
        title: "Impactful e-learning framework: A new hybrid form of education",
        authors: "Syeda Farjana Shetu, Md. Mosfikur Rahman, Akash Ahmed, Mahfuja Ferdousi Mahin, Md. Abtab Uddin Akib, Mohd. Saifuzzaman",
        venue: "Current Research in Behavioral Sciences (Elsevier)",
        year: 2021,
        doi: "10.1016/j.crbeha.2021.100038",
        type: "journal",

        problem: "Limitations of traditional and online education systems.",
        solution: "Hybrid e-learning framework integrating online and offline systems.",
        challenges: "Infrastructure and usability across regions.",

        abstract: "Proposes a scalable hybrid e-learning architecture with cloud-based system.",
        keywords: ["E-learning", "Blended Learning"],

        methodology: "System architecture design + 297 participant evaluation :contentReference[oaicite:0]{index=0}.",
        keyFindings: "Improved engagement, accessibility, and scalability.",
        impact: "Applicable in developing country education systems.",
    },

    {
        id: "iot",
        title: "Future City of Bangladesh: IoT Based Autonomous Smart Sewerage and Hazard Condition Sharing System",
        authors: "Md. Mosfikur Rahman, Mohammad Abul Kashem, Mohammad Mohiuddin",
        venue: "IEEE",
        year: 2020,
        doi: "10.1109/WIECON-ECE52138.2020.9397950",
        type: "conference",
        award: "🏆 IEEE Best Paper Award",

        problem: "Urban sewer overflow and toxic gas hazards.",
        solution: "IoT-based real-time monitoring system.",
        challenges: "Environmental conditions and sensor reliability.",

        abstract: "IoT system for sewer monitoring and hazard detection.",
        keywords: ["IoT", "Smart City"],

        methodology: "NodeMCU + MQ135 sensor + real-time monitoring :contentReference[oaicite:1]{index=1}.",
        keyFindings: "Effective real-time flood and gas detection.",
        impact: "Improves urban safety and infrastructure.",
    },

    {
        id: "plant",
        title: "Deep Learning Model for Detecting and Diagnosing Plant Disease",
        authors: "Nazmun Nessa Moon, Israt Jahan, Shayla Sharmin, Fernaz Narin Nur, Refath Ara Hossain, Md. Mosfikur Rahman",
        venue: "IEEE",
        year: 2021,
        doi: "10.1109/SMARTGENCON51891.2021.9645857",
        type: "conference",

        problem: "Manual plant disease detection inefficiency.",
        solution: "CNN-based automated detection.",
        challenges: "Dataset variability and image quality.",

        abstract: "Deep learning model for plant disease classification.",
        keywords: ["CNN", "Agriculture"],

        methodology: "CNN (ResNet-style architecture) with image segmentation :contentReference[oaicite:2]{index=2}.",
        keyFindings: "Achieved ~94% accuracy.",
        impact: "Supports agricultural automation.",
    },

    {
        id: "trafoo",
        title: "TraFoo: An Android Application for Food Delivery in Train",
        authors: "Md. Mosfikur Rahman, Nazmun Nessa Moon, Musfiqur Rahman Foysal, Fernaz Narin Nur",
        venue: "IEEE",
        year: 2021,
        doi: "10.1109/SMARTGENCON51891.2021.9645900",
        type: "conference",

        problem: "Food accessibility during train travel.",
        solution: "Android app with customer, rider, and restaurant modules.",
        challenges: "Internet dependency and logistics.",

        abstract: "Mobile application for train-based food delivery.",
        keywords: ["Android", "Food Delivery"],

        methodology: "Firebase backend + Android native framework :contentReference[oaicite:3]{index=3}.",
        keyFindings: "Functional real-time system.",
        impact: "Improves travel convenience.",
    },

    {
        id: "edu",
        title: "Pandemic Effect on Education System Among University Students",
        authors: "Md. Mosfikur Rahman et al.",
        venue: "Springer",
        year: 2022,
        doi: "10.1007/978-3-030-98531-8_16",
        type: "conference",

        problem: "Educational disruption due to COVID-19.",
        solution: "Survey-based analysis.",
        challenges: "Student diversity and adaptability.",

        abstract: "Study on pandemic impact on education.",
        keywords: ["Education"],

        methodology: "Quantitative survey.",
        keyFindings: "Learning decline observed.",
        impact: "Supports policy decisions.",
    },

    {
        id: "ids",
        title: "Cyber Security Intruder Detection using Deep Learning Approach",
        authors: "Md. Mosfikur Rahman et al.",
        venue: "Springer",
        year: 2023,
        doi: "10.1007/978-3-031-13150-9_42",
        type: "conference",

        problem: "Network intrusion detection.",
        solution: "Deep learning-based IDS.",
        challenges: "High-dimensional data.",

        abstract: "Deep learning approach for intrusion detection.",
        keywords: ["Cybersecurity"],

        methodology: "CNN, DNN, LSTM models :contentReference[oaicite:4]{index=4}.",
        keyFindings: "Up to ~98% accuracy.",
        impact: "Improves cybersecurity systems.",
    },

    {
        id: "chaos",
        title: "Chaotic Encryption",
        authors: "Md. Mosfikur Rahman et al.",
        venue: "Springer",
        year: 2023,
        doi: "10.1007/978-3-031-16178-0_32",
        type: "conference",

        problem: "Weak encryption security.",
        solution: "Chaos-based encryption model.",
        challenges: "Mathematical complexity.",

        abstract: "Chaos theory-based encryption system.",
        keywords: ["Security"],

        methodology: "Chaotic systems modeling.",
        keyFindings: "Improved randomness.",
        impact: "Stronger encryption systems.",
    },

    {
        id: "covid-ml",
        title: "Machine Learning-Based Prediction of COVID-19: A Robust Approach for Early Diagnosis and Treatment",
        authors: "Fatema Tuj Johora, Israt Binte Mahfuja, A N M Masuqur Rahman, Md. Mosfikur Rahman, Md. Sadekur Rahman",
        venue: "Springer",
        year: 2024,
        doi: "10.1007/978-981-97-1923-5_16",
        type: "conference",

        problem: "Early COVID-19 detection.",
        solution: "ML model comparison.",
        challenges: "Model selection.",

        abstract: "Machine learning models for COVID prediction.",
        keywords: ["ML"],

        methodology: "Multiple ML algorithms.",
        keyFindings: "XGBoost best performer.",
        impact: "Supports healthcare decision making.",
    },
];

const PaperDetailCard = ({ paper, index }: { paper: PaperDetail; index: number }) => (
    <motion.article
        className="border border-border rounded-xl p-6 md:p-7 bg-background hover:shadow-lg transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
    >
        {/* Header */}
        <div className="mb-4">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {paper.type === "journal" ? "Journal Article" : "Conference Paper"} · {paper.year}
            </p>

            <h3 className="text-lg md:text-xl font-semibold text-foreground mt-1 leading-snug">
                {paper.title}
            </h3>

            <p className="text-xs text-muted-foreground mt-2">{paper.authors}</p>
            <p className="text-xs italic text-muted-foreground">{paper.venue}</p>
        </div>

        {/* Abstract */}
        <div className="mb-4">
            <p className="text-[11px] font-medium uppercase text-muted-foreground mb-1">
                Abstract
            </p>
            <p className="text-sm text-foreground/90 leading-relaxed">
                {paper.abstract}
            </p>
        </div>

        {/* Problem + Challenges */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
                <p className="text-[11px] font-medium uppercase text-muted-foreground mb-1">
                    Problem
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                    {paper.problem}
                </p>
            </div>

            <div>
                <p className="text-[11px] font-medium uppercase text-muted-foreground mb-1">
                    Challenges
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                    {paper.challenges}
                </p>
            </div>
        </div>

        {/* Solution (highlighted but subtle) */}
        <div className="mb-4 border-l-2 border-accent pl-4">
            <p className="text-[11px] font-medium uppercase text-muted-foreground mb-1">
                Proposed Solution
            </p>
            <p className="text-sm text-foreground leading-relaxed font-medium">
                {paper.solution}
            </p>
        </div>

        {/* Method + Results */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
                <p className="text-[11px] font-medium uppercase text-muted-foreground mb-1">
                    Methodology
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                    {paper.methodology}
                </p>
            </div>

            <div>
                <p className="text-[11px] font-medium uppercase text-muted-foreground mb-1">
                    Key Findings
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                    {paper.keyFindings}
                </p>
            </div>
        </div>

        {/* Impact */}
        <div className="mb-4">
            <p className="text-[11px] font-medium uppercase text-muted-foreground mb-1">
                Impact
            </p>
            <p className="text-sm text-foreground/90 leading-relaxed">
                {paper.impact}
            </p>
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap gap-2 mb-4">
            {paper.keywords.map((kw) => (
                <span
                    key={kw}
                    className="text-[10px] px-2 py-1 rounded bg-muted text-muted-foreground"
                >
          {kw}
        </span>
            ))}
        </div>

        {/* DOI */}
        <a
            href={`https://doi.org/${paper.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
        >
            <ExternalLink className="w-3 h-3" />
            View Publication
        </a>
    </motion.article>
);

const PapersDetailSection = () => {
    const journals = papers.filter((p) => p.type === "journal");
    const conferences = papers.filter((p) => p.type === "conference");

    return (
        <section id="research" className="section-padding bg-section-alt">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.5}}
                >
                    <p className="section-label">Research Papers</p>
                    <h2 className="section-title">Research Contributions</h2>
                    <p className="section-desc">
                        Each paper presented with abstract, methodology, key findings, and real-world impact drawn
                        directly from the published manuscripts.
                    </p>
                </motion.div>

                <div className="space-y-12">
                    <div>
                        <h3 className="font-display text-xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                            Journal Articles ({journals.length})
                        </h3>
                        <div className="space-y-6">
                            {journals.map((paper, i) => (
                                <PaperDetailCard key={paper.id} paper={paper} index={i}/>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-display text-xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                            Conference Papers ({conferences.length})
                        </h3>
                        <div className="space-y-6">
                            {conferences.map((paper, i) => (
                                <PaperDetailCard key={paper.id} paper={paper} index={i}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PapersDetailSection;
