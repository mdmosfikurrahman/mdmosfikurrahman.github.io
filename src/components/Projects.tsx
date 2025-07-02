import { Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Projects = () => {
  const projects = [
    {
      title: "Akij Air Backend System",
      company: "Akij iBOS Ltd.",
      role: "Lead Backend Developer",
      description: [
        "Planned backend architecture and selected core technologies.",
        "Designed services like inventory, routing, and partner modules.",
        "Defined scalable microservices with integration strategies."
      ],
      technologies: ["Java", "Spring Boot", "Microservices", "PostgreSQL", "System Architecture"]
    },
    {
      title: "TrackForce",
      company: "Akij iBOS Ltd.",
      role: "Lead Developer",
      description: [
        "Led cross-functional teams to enhance system performance.",
        "Built REST APIs and SQL reports using .NET Core.",
        "Enabled real-time tracking and automated reporting."
      ],
      technologies: [".NET Core", "SQL Server", "REST APIs", "Real-time Systems"]
    },
    {
      title: "Customs Bond Management System (NBR)",
      company: "REVE Systems Ltd.",
      role: "Full-stack Developer",
      description: [
        "Developed legal and case modules for CBMS.",
        "Integrated BGMEA/BKMEA APIs for automation.",
        "Built scalable features using Spring Boot and Oracle."
      ],
      technologies: ["Spring Boot", "Thymeleaf", "Oracle DB", "System Integration"]
    },
    {
      title: "Rakuten Echiba Backend Development",
      company: "BJIT Ltd.",
      role: "Backend Developer",
      description: [
        "Built e-commerce backend with Spring Boot.",
        "Optimized Oracle queries for data consistency.",
        "Improved throughput with a reusable backend framework.",
        "Resolved blockers and supported team productivity."
      ],
      technologies: ["Spring Boot", "Oracle DB", "E-commerce", "Performance Optimization"]
    },
    {
      title: "Denka Corporate Website",
      company: "BJIT Ltd.",
      role: "Full Stack Developer",
      description: [
        "Created dynamic components and CMS features.",
        "Added backend logic for scheduling and translations.",
        "Ensured responsive design with UI/UX team."
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
