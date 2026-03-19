import { motion } from "framer-motion";
import { Brain, Shield, Wifi, HeartPulse, BarChart3, Lightbulb } from "lucide-react";

const interests = [
  { icon: Brain, label: "Artificial Intelligence & Machine Learning", description: "Deep learning, CNNs, model evaluation, classification, and intelligent automation." },
  { icon: BarChart3, label: "Data Science & Analytics", description: "Statistical modelling, feature engineering, data visualization, and behavioural analysis." },
  { icon: Shield, label: "Cybersecurity", description: "Intrusion detection systems, chaotic encryption, network security using deep learning." },
  { icon: Wifi, label: "Internet of Things (IoT)", description: "Smart-city infrastructure, sensor networks, autonomous monitoring, and MQTT protocols." },
  { icon: HeartPulse, label: "Healthcare AI", description: "Pandemic modelling, mental health analytics, clinical prediction, and diagnostic tools." },
  { icon: Lightbulb, label: "Educational Technology", description: "E-learning frameworks, hybrid pedagogy, and technology-enhanced education systems." },
];

const ResearchInterestsSection = () => {
  return (
    <section className="section-padding bg-section-alt">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-label">Interests</p>
          <h2 className="section-title">Research Interests</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {interests.map((item, i) => (
            <motion.div
              key={item.label}
              className="border border-border bg-card rounded-lg p-5 hover:border-accent/30 transition-colors"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <item.icon className="w-5 h-5 text-accent mb-3" />
              <h3 className="font-semibold text-foreground text-sm mb-1">{item.label}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResearchInterestsSection;
