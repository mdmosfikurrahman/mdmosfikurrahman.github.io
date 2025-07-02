
import { Code, Database, Server, Cloud, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Skills = () => {
  const skillCategories = [
    {
      title: "Backend Development",
      icon: <Server className="w-8 h-8" />,
      skills: ["Java", "Spring Boot", "Spring Security", ".NET Core", "RESTful APIs", "Microservices"]
    },
    {
      title: "Frontend Development",
      icon: <Code className="w-8 h-8" />,
      skills: ["React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Thymeleaf"]
    },
    {
      title: "Database Management",
      icon: <Database className="w-8 h-8" />,
      skills: ["PostgreSQL", "Oracle DB", "MySQL", "MongoDB", "SQL Optimization", "Database Design"]
    },
    {
      title: "DevOps & Tools",
      icon: <Cloud className="w-8 h-8" />,
      skills: ["Docker", "Git", "CI/CD", "Maven", "Gradle", "Jenkins"]
    }
  ];

  const practices = [
    "Microservices Architecture & API Design",
    "CI/CD and DevOps Integration",
    "Secure Coding & OAuth2 Authentication",
    "Database Optimization (PostgreSQL, Oracle, MySQL)",
    "Agile Development & Scrum",
    "REST & GraphQL API Development"
  ];

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Skills & Expertise</h2>
          <p className="text-lg text-gray-600">Technical skills and development practices</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {skillCategories.map((category, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="bg-primary/10 p-4 rounded-lg mx-auto mb-4 w-fit">
                  <div className="text-primary">
                    {category.icon}
                  </div>
                </div>
                <CardTitle className="text-lg text-gray-900">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded">
                      {skill}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="bg-primary/10 p-4 rounded-lg mx-auto mb-4 w-fit">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl text-gray-900">Workflow & Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {practices.map((practice, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{practice}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Skills;
