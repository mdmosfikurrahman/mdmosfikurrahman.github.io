import { motion } from "framer-motion";

const AboutSection = () => {
  return (
      <section id="about" className="section-padding max-w-6xl mx-auto px-6">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
          <p className="section-label">About</p>
          <h2 className="section-title">Research Profile</h2>

          <div className="grid md:grid-cols-[2fr_1fr] gap-10 mt-8">

            {/* LEFT CONTENT */}
            <div className="space-y-5 text-muted-foreground leading-relaxed text-[15px] text-justify [hyphens:auto] max-w-3xl tracking-[0.01em]">

              <p>
                I am <strong className="text-foreground">Md. Mosfikur Rahman</strong>, a software engineer and researcher with a
                B.Sc. in Computer Science and Engineering from{" "}
                <strong className="text-foreground">Daffodil International University</strong> (CGPA: 3.83/4.00).
                I also participated in the <strong className="text-foreground">Erasmus Mundus Exchange Program</strong> at
                Adam Mickiewicz University, Poland.
              </p>

              <p>
                My work focuses on applying machine learning and data-driven methods to real-world problems.
                I have worked on cybersecurity, healthcare analytics, and intelligent systems, including
                deep learning-based intrusion detection, pandemic data analysis, and smart infrastructure solutions.
              </p>

              <p>
                I have published <strong className="text-foreground">10+ peer-reviewed papers</strong> in venues including IEEE,
                Springer, and Elsevier. My work emphasizes clarity, reproducibility, and practical impact.
                I also serve as a reviewer for several international journals and conferences.
              </p>

              <p>
                Alongside research, I have over <strong className="text-foreground">3.5 years of experience</strong> in software engineering,
                where I have built scalable systems and real-world applications. This experience helps me
                connect research ideas with practical implementation.
              </p>

              <p>
                I am particularly interested in advancing intelligent systems and developing solutions
                that are both technically robust and practically meaningful.
              </p>

            </div>

            {/* RIGHT SIDE CARDS */}
            <div className="space-y-4">

              <div className="border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Education</p>
                <p className="font-semibold text-foreground text-sm">B.Sc. in CSE</p>
                <p className="text-xs text-muted-foreground">Daffodil International University</p>
                <p className="text-xs text-accent font-semibold mt-1">CGPA: 3.83 / 4.00</p>
              </div>

              <div className="border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Exchange</p>
                <p className="font-semibold text-foreground text-sm">Erasmus Mundus</p>
                <p className="text-xs text-muted-foreground">Adam Mickiewicz University, Poland</p>
              </div>

              <div className="border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Publications</p>
                <p className="font-bold text-foreground text-2xl">10+</p>
                <p className="text-xs text-muted-foreground">Peer-reviewed papers</p>
              </div>

              <div className="border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Experience</p>
                <p className="font-bold text-foreground text-2xl">3.5+</p>
                <p className="text-xs text-muted-foreground">Years in Software Engineering</p>
              </div>

            </div>

          </div>
        </motion.div>
      </section>
  );
};

export default AboutSection;