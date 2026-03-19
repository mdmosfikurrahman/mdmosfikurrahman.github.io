import { motion } from "framer-motion";

const skillGroups = [
  {
    category: "Research Skills",
    skills: ["Literature Review", "Academic Writing", "Statistical Analysis", "Experimental Design", "Peer Review", "Data Visualization"],
  },
  {
    category: "Machine Learning & AI",
    skills: ["Machine Learning", "Deep Learning (CNN, ANN)", "Feature Engineering", "Model Evaluation", "Data Processing", "NLP"],
  },
  {
    category: "Programming Languages",
    skills: ["Java (8–21)", "Python", "C#", "JavaScript"],
  },
  {
    category: "Frameworks & Tools",
    skills: ["Spring Boot", "ASP.NET Core", "Spring Security", "JPA/JDBC", "Docker", "GraphQL", "Thymeleaf"],
  },
  {
    category: "Databases",
    skills: ["Oracle", "PostgreSQL", "MySQL", "SQL Server", "Firebase"],
  },
  {
    category: "Practices & Architecture",
    skills: ["Microservices", "REST API Design", "CI/CD", "Git", "Agile", "System Architecture", "Security"],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="section-padding max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="section-label">Skills</p>
        <h2 className="section-title">Technical Competencies</h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {skillGroups.map((group, i) => (
          <motion.div
            key={group.category}
            className="border border-border rounded-lg p-5"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
          >
            <h3 className="font-semibold text-foreground text-sm mb-3">{group.category}</h3>
            <div className="flex flex-wrap gap-1.5">
              {group.skills.map((skill) => (
                <span key={skill} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
