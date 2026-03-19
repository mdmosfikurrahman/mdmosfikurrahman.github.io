import { motion } from "framer-motion";

const experiences = [
    {
        role: "Software Engineer L-II",
        company: "Akij iBOS Ltd.",
        duration: "Nov 2024 – Present",
        points: [
            "Contributing to architecture design for Akij Air platform",
            "Designing microservices and API integration strategies",
            "Leading backend development for TrackForce system",
            "Improved CI/CD workflows and deployment efficiency",
        ],
    },
    {
        role: "Software Engineer",
        company: "REVE Systems Ltd.",
        duration: "Jul 2023 – Oct 2024",
        points: [
            "Refactored monolithic system into scalable microservices",
            "Optimized Oracle database performance significantly",
            "Developed modules for national-scale NBR system",
            "Built enterprise-grade Java backend systems",
        ],
    },
    {
        role: "Software Engineer",
        company: "BJIT Group",
        duration: "Apr 2022 – Jun 2023",
        points: [
            "Developed GraphQL-based BFF services using Spring Boot",
            "Optimized database queries and API performance",
            "Worked with Japanese clients on Rakuten ecosystem",
            "Designed reusable backend service patterns",
        ],
    },
];

const ExperienceSection = () => {
    return (
        <section id="experience" className="section-padding max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <p className="section-label">Experience</p>
                <h2 className="section-title">Industry Experience</h2>
            </motion.div>

            <div className="mt-10 space-y-8">
                {experiences.map((exp, i) => (
                    <motion.div
                        key={i}
                        className="border-l border-border pl-6 py-2"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <h3 className="text-sm font-semibold text-foreground">
                            {exp.role} — {exp.company}
                        </h3>

                        <p className="text-xs text-muted-foreground mb-2">
                            {exp.duration}
                        </p>

                        <ul className="text-xs text-muted-foreground space-y-1 list-disc ml-4">
                            {exp.points.map((p, idx) => (
                                <li key={idx}>{p}</li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default ExperienceSection;