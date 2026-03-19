import { motion } from "framer-motion";
import { Award, Mic, BookCheck, GraduationCap, BadgeCheck } from "lucide-react";

const achievements = [
  {
    icon: Award,
    title: "IEEE Best Paper Award (Computer — IoT)",
    description:
        "IEEE WIECON-ECE 2020 — \"Future City of Bangladesh: IoT Based Autonomous Smart Sewerage and Hazard Condition Sharing System\"",
    highlight: true,
  },
  {
    icon: GraduationCap,
    title: "Erasmus Mundus Exchange Scholar",
    description:
        "Selected for Erasmus Mundus program at Adam Mickiewicz University, Poland (6 ECTS).",
  },
  {
    icon: Mic,
    title: "Conference Speaker — IEEE WIECON-ECE 2024",
    description:
        "Invited speaker at the 10th IEEE International Women in Engineering Conference on Electrical and Computer Engineering.",
  },
  {
    icon: Mic,
    title: "Guest Speaker — Undergraduate Research Journey",
    description:
        "\"How to get started: Undergraduate Research Journey\" — Computer & Programming Club, Daffodil International University.",
  },
  {
    icon: BookCheck,
    title: "Active Peer Reviewer (6+ Venues)",
    description:
        "Reviewer for ISA Transactions, Natural Language Processing Journal, Journal of King Saud University, Current Research in Behavioral Science, and IEEE/Springer conferences (DLAIR 2022, ISMS 2022, CIS 2022).",
  },
  {
    icon: BadgeCheck,
    title: "IBM Data Science Professional Certificate",
    description:
        "Coursera Professional Certificate in Data Science. DataCamp certifications in Data Science and Machine Learning (Basic to Advanced).",
  },
  {
    icon: GraduationCap,
    title: "Vice President — Research & Career Wing",
    description:
        "Computer & Programming Club, Daffodil International University (2021). Led student research initiatives, organized tech talks and mentoring sessions.",
  },
];

const AchievementsSection = () => {
  return (
      <section id="achievements" className="section-padding bg-section-alt">
        <div className="max-w-5xl mx-auto">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
          >
            <p className="section-label">Recognition</p>
            <h2 className="section-title">Achievements & Awards</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {achievements.map((a, i) => (
                <motion.div
                    key={a.title}
                    className={`rounded-lg p-5 border transition-all duration-300 ${
                        a.highlight
                            ? "bg-card border-accent/40 md:col-span-2 shadow-sm"
                            : "bg-card border-border hover:border-accent/30"
                    }`}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md shrink-0 bg-accent/10">
                      <a.icon className="w-4 h-4 text-accent" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm mb-1 text-foreground">
                        {a.title}
                      </h3>

                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {a.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
            ))}
          </div>
        </div>
      </section>
  );
};

export default AchievementsSection;