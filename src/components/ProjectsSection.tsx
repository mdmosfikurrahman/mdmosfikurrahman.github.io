import { motion } from "framer-motion";

const projects = [
    {
        title: "Akij Air Backend System",
        desc: "Architecture planning for airline management system including service modularization and API integration.",
    },
    {
        title: "TrackForce System",
        desc: "Led backend development, built REST APIs, and implemented real-time tracking and reporting.",
    },
    {
        title: "Customs Bond Management System (NBR)",
        desc: "Developed enterprise modules and optimized database performance for national infrastructure.",
    },
    {
        title: "Rakuten Backend Development",
        desc: "Built scalable backend services using Spring Boot for Japanese e-commerce platform.",
    },
];

const ProjectsSection = () => {
    return (
        <section className="section-padding bg-section-alt">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <p className="section-label">Projects</p>
                    <h2 className="section-title">Selected Work</h2>
                </motion.div>

                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                    {projects.map((p, i) => (
                        <motion.div
                            key={i}
                            className="border border-border rounded-lg p-5 hover:border-accent/30 transition"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <h3 className="text-sm font-semibold text-foreground mb-1">
                                {p.title}
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {p.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectsSection;