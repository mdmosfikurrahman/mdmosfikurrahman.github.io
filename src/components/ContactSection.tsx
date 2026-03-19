import { motion } from "framer-motion";
import { Mail, Github, Linkedin, GraduationCap } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="section-padding border-t border-border">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-label">Contact</p>
          <h2 className="section-title mx-auto">Let's Discuss Research</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed text-sm">
            I am actively seeking PhD opportunities. If my research aligns with your group's 
            interests, I would be delighted to connect.
          </p>

          <a
            href="mailto:mdmosfikurrahman.cse@gmail.com"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
          >
            <Mail className="w-4 h-4" />
            mdmosfikurrahman.cse@gmail.com
          </a>

          <div className="flex items-center justify-center gap-5 mt-8">
            <a
              href="https://github.com/mdmosfikurrahman"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/mdmosfikurrahman"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://scholar.google.com/citations?user=mdmosfikurrahman"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Google Scholar"
            >
              <GraduationCap className="w-5 h-5" />
            </a>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
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
