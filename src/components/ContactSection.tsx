import { motion } from "framer-motion";
import { Mail, Github, Linkedin, GraduationCap } from "lucide-react";

const ContactSection = () => {
  return (
      <section id="contact" className="py-20 px-4 sm:px-6 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
          >
            {/* Label */}
            <p className="text-accent uppercase tracking-widest text-xs mb-3">
              Contact
            </p>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Let’s Connect
            </h2>

            {/* Description */}
            <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-sm sm:text-base leading-relaxed">
              Focused on advancing intelligent systems through impactful research in machine learning,
              cybersecurity, and real-world AI applications.
            </p>

            {/* CTA Button */}
            <a
                href="mailto:mdmosfikurrahman.cse@gmail.com"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition text-sm"
            >
              <Mail className="w-4 h-4" />
              Get in Touch
            </a>

            {/* Subtle Email */}
            <p className="mt-4 text-xs text-muted-foreground/60">
              mdmosfikurrahman.cse@gmail.com
            </p>

            {/* Social Links */}
            <div className="flex justify-center gap-6 mt-8">
              <a
                  href="https://github.com/mdmosfikurrahman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition"
                  aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>

              <a
                  href="https://www.linkedin.com/in/mdmosfikurrahman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition"
                  aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>

              <a
                  href="https://scholar.google.com/citations?user=1GAfMAEAAAAJ&hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition"
                  aria-label="Google Scholar"
              >
                <GraduationCap className="w-5 h-5" />
              </a>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground/60">
                © {new Date().getFullYear()} Md. Mosfikur Rahman. All rights reserved.
              </p>
            </div>

          </motion.div>
        </div>
      </section>
  );
};

export default ContactSection;