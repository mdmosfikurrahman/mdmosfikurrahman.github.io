import { motion } from "framer-motion";
import { FileText, Mail, ArrowDown, Download } from "lucide-react";
import profileAvatar from "@/assets/profile-avatar.jpg";

const HeroSection = () => {
  return (
      <section className="relative min-h-[88vh] flex items-center justify-center border-b border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
          >
            {/* Avatar (FIXED SIZE) */}
            <div className="mb-6">
              <img
                  src={profileAvatar}
                  alt="Md. Mosfikur Rahman"
                  className="w-36 h-36 md:w-44 md:h-44 rounded-full mx-auto border-2 border-accent/40 object-cover shadow-md"
              />
            </div>

            {/* Tagline */}
            <p className="text-accent font-semibold tracking-[0.25em] uppercase text-xs mb-5">
              Researcher · Machine Learning · Intelligent Systems Engineer
            </p>

            {/* Name */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] mb-5">
              Md. Mosfikur Rahman
            </h1>

            <div className="w-16 h-0.5 bg-accent mx-auto mb-5" />

            {/* Research Domains */}
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-3 tracking-wide">
              Machine Learning  ·  Cybersecurity  ·  IoT Systems  ·  Healthcare AI
            </p>

            {/* Supporting Line */}
            <p className="text-muted-foreground/60 text-sm max-w-md mx-auto leading-relaxed mb-2">
              Designing and building real-world AI-driven systems
            </p>

            {/* ✅ ACHIEVEMENTS (FIXED NO BAD BREAK) */}
            <p className="text-muted-foreground/70 text-sm max-w-2xl mx-auto leading-relaxed mb-10">
            <span className="whitespace-nowrap">
              10+ Peer-Reviewed Publications
            </span>
              <span className="mx-2">·</span>
              <span className="whitespace-nowrap">
              IEEE Best Paper Award
            </span>
              <span className="mx-2">·</span>
              <span className="whitespace-nowrap">
              Applied AI Researcher
            </span>
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* View Research */}
            <a
                href="#research"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded font-medium hover:opacity-90 transition-opacity text-sm"
            >
              View Research
              <ArrowDown className="w-3.5 h-3.5" />
            </a>

            {/* CV */}
            <a
                href="https://mdmosfikurrahman.github.io/cv"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-2.5 rounded font-medium hover:opacity-90 transition-opacity text-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download CV
            </a>

            {/* Publications */}
            <a
                href="#publications"
                className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-2.5 rounded font-medium hover:bg-secondary transition-colors text-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              Publications
            </a>

            {/* Contact */}
            <a
                href="#contact"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-2.5 text-sm font-medium"
            >
              <Mail className="w-3.5 h-3.5" />
              Contact
            </a>
          </motion.div>
        </div>
      </section>
  );
};

export default HeroSection;