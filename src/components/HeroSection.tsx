import { motion } from "framer-motion";
import { FileText, Mail, ArrowDown, Download } from "lucide-react";
import profileAvatar from "@/assets/profile-avatar.png";

const HeroSection = () => {
  return (
      <section className="relative min-h-screen flex items-center justify-center border-b border-border px-4 sm:px-6">

        <div className="w-full max-w-4xl mx-auto text-center">

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
          >
            {/* Avatar */}
            <div className="mb-5">
              <img
                  src={profileAvatar}
                  alt="Md. Mosfikur Rahman"
                  className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full mx-auto border border-accent/40 object-cover shadow-md"
              />
            </div>

            {/* Tagline */}
            <p className="text-accent font-semibold tracking-widest uppercase text-[10px] sm:text-xs mb-4 leading-relaxed">
              Researcher · Machine Learning · Intelligent Systems Engineer
            </p>

            {/* Name */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4 px-2">
              Md. Mosfikur Rahman
            </h1>

            <div className="w-14 h-[2px] bg-accent mx-auto mb-4" />

            {/* Research Domains */}
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-3 px-2">
              Machine Learning · Cybersecurity · IoT Systems · Healthcare AI
            </p>

            {/* Supporting Line */}
            <p className="text-muted-foreground/60 text-xs sm:text-sm max-w-md mx-auto leading-relaxed mb-2 px-2">
              Designing and building real-world AI-driven systems
            </p>

            {/* Achievements (RESPONSIVE FIXED) */}
            <div className="text-muted-foreground/70 text-xs sm:text-sm max-w-2xl mx-auto mb-8 flex flex-wrap justify-center gap-x-2 gap-y-1 px-2">
              <span>10+ Peer-Reviewed Publications</span>
              <span className="hidden sm:inline">·</span>
              <span>IEEE Best Paper Award</span>
              <span className="hidden sm:inline">·</span>
              <span>Applied AI Researcher</span>
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* View Research */}
            <a
                href="#research"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded font-medium hover:opacity-90 transition text-sm"
            >
              View Research
              <ArrowDown className="w-4 h-4" />
            </a>

            {/* CV */}
            <a
                href="https://mdmosfikurrahman.github.io/cv"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded font-medium hover:opacity-90 transition text-sm"
            >
              <Download className="w-4 h-4" />
              Download CV
            </a>

            {/* Publications */}
            <a
                href="#publications"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-border text-foreground px-6 py-3 rounded font-medium hover:bg-secondary transition text-sm"
            >
              <FileText className="w-4 h-4" />
              Publications
            </a>

            {/* Contact */}
            <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition px-4 py-3 text-sm font-medium"
            >
              <Mail className="w-4 h-4" />
              Contact
            </a>
          </motion.div>
        </div>
      </section>
  );
};

export default HeroSection;