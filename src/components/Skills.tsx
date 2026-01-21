import { techIconMap } from "@/components/TechIcons";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Skills = () => {
  const skillCategories = [
    {
      title: "Backend Development",
      skills: ["Java", "Spring Boot", "Spring Security", ".NET Core", "RESTful APIs", "Microservices"]
    },
    {
      title: "Frontend Development",
      skills: ["React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Thymeleaf"]
    },
    {
      title: "Database Management",
      skills: ["PostgreSQL", "Oracle DB", "MySQL", "MongoDB", "SQL Optimization", "Database Design"]
    },
    {
      title: "DevOps & Tools",
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
                <div className="bg-primary/10 p-4 rounded-lg mx-auto mb-4 w-fit text-primary">
                  {techIconMap[category.title]}
                </div>
                <CardTitle className="text-lg text-gray-900">
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.skills.map((skill) => (
                      <div
                          key={skill}
                          className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded"
                      >
                        {techIconMap[skill]}
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
            <div className="bg-primary/10 p-4 rounded-lg mx-auto mb-4 w-fit text-primary">
              {techIconMap["Workflow & Best Practices"]}
            </div>
            <CardTitle className="text-xl text-gray-900">
              Workflow & Best Practices
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {practices.map((practice) => (
                  <div key={practice} className="flex items-start gap-3">
                    {techIconMap["Practice"]}
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
