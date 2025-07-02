
import { Code, ExternalLink, Github } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Projects = () => {
  const projects = [
    {
      title: "Akij Air Backend System",
      company: "Akij iBOS Ltd.",
      role: "Lead Backend Developer",
      description: [
        "Contributing to the initial architecture planning and technology evaluation for the Akij Air backend system.",
        "Involved in identifying and designing core services such as inventory management, flight routing, and partner onboarding.",
        "Collaborating with stakeholders to define scalable microservice modules and integration patterns."
      ],
      technologies: ["Java", "Spring Boot", "Microservices", "PostgreSQL", "System Architecture"]
    },
    {
      title: "TrackForce",
      company: "Akij iBOS Ltd.",
      role: "Lead Developer",
      description: [
        "Led backend, frontend, and QA teams to improve system performance and delivery workflow.",
        "Developed REST APIs and reporting modules using .NET Core and SQL Stored Procedures.",
        "Implemented real-time tracking and automated reporting features to support operations."
      ],
      technologies: [".NET Core", "SQL Server", "REST APIs", "Real-time Systems"]
    },
    {
      title: "Customs Bond Management System (NBR)",
      company: "REVE Systems Ltd.",
      role: "Full-stack Developer",
      description: [
        "Developed modules including Legal and Case Information System and Utilization Declaration System.",
        "Integrated BGMEA and BKMEA databases to automate declaration processes.",
        "Built scalable and maintainable features using Spring Boot, Thymeleaf, and Oracle DB."
      ],
      technologies: ["Spring Boot", "Thymeleaf", "Oracle DB", "System Integration"]
    },
    {
      title: "Rakuten Echiba Backend Development",
      company: "BJIT Ltd.",
      role: "Backend Developer",
      description: [
        "Developed backend modules using Spring Boot tailored to Rakuten's e-commerce ecosystem.",
        "Optimized Oracle database operations to ensure data consistency and performance.",
        "Implemented a reusable framework that improved backend throughput by 25%.",
        "Assisted teammates by resolving technical blockers and providing backend support."
      ],
      technologies: ["Spring Boot", "Oracle DB", "E-commerce", "Performance Optimization"]
    },
    {
      title: "Denka Corporate Website",
      company: "BJIT Ltd.",
      role: "Full Stack Developer",
      description: [
        "Developed dynamic Marquee components and CMS features using Java and Thymeleaf.",
        "Implemented backend logic for content scheduling and multilingual support.",
        "Collaborated with UI/UX designers to ensure responsive and accessible frontend design."
      ],
      technologies: ["Java", "Thymeleaf", "CMS", "Responsive Design"]
    }
  ];

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Projects</h2>
          <p className="text-lg text-gray-600">Key projects and contributions</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <Card key={index} className="animate-fade-up shadow-lg hover:shadow-xl transition-shadow duration-300 group" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Code className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl text-gray-900 group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <p className="text-primary font-medium mt-1">{project.company}</p>
                    <p className="text-sm text-gray-600 mt-1">{project.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {project.description.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-700 text-sm leading-relaxed flex items-start gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
