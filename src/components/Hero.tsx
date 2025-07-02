import { Github, Linkedin, GraduationCap, Download, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
      <section id="hero" className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-48 h-48 mx-auto mb-8 rounded-full overflow-hidden shadow-lg">
              <img
                  src="/IMG_9615.JPG"
                  alt="Md. Mosfikur Rahman"
                  className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Md. Mosfikur <span className="text-primary">Rahman</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-6">
              Backend Engineer & AI Researcher
            </p>

            <div className="space-y-2 text-gray-600 mb-8">
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Modhumoti · Sector - 18, Uttara, Dhaka</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+8801797-554948</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:mdmosfikurrahman.cse@email.com" className="hover:text-primary">
                  mdmosfikurrahman.cse@email.com
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              I am a <strong>backend-focused Software Engineer</strong> with 3+ years of experience building scalable
              microservices, designing secure APIs, and contributing to the architecture and development of enterprise
              systems using <strong>Java, Spring Boot, and PostgreSQL</strong>. I enjoy solving complex problems and shaping
              foundational software systems while contributing to cutting-edge research in AI and ML.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button asChild variant="outline" size="lg">
              <a href="https://www.linkedin.com/in/mdmosfikurrahman/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="https://github.com/mdmosfikurrahman" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="https://scholar.google.com/citations?user=1GAfMAEAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">
                <GraduationCap className="w-5 h-5 mr-2" />
                Google Scholar
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="https://mdmosfikurrahman.github.io/resume/cv" target="_blank" rel="noopener noreferrer">
                <Download className="w-5 h-5 mr-2" />
                CV
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="https://mdmosfikurrahman.github.io/resume/" target="_blank" rel="noopener noreferrer">
                <Download className="w-5 h-5 mr-2" />
                Resume
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-primary">3+</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-primary">10+</div>
              <div className="text-sm text-gray-600">Publications</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-primary">5+</div>
              <div className="text-sm text-gray-600">Major Projects</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-sm text-gray-600">Certifications</div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default Hero;
