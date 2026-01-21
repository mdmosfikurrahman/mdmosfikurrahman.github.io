import {techIconMap} from "@/components/TechIcons";

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

const Experience = () => {
    const experiences = [
        {
            title: "Software Engineer L-II",
            company: "Akij iBOS Ltd.",
            location: "Dhaka, Bangladesh",
            duration: "November 2024 – Present",
            description: [
                "Worked on the backend foundation of an airline management platform, focusing on clean service design and long-term scalability",
                "Gradually modularized core components by identifying clear service responsibilities and interaction boundaries",
                "Built backend services and reporting features that support operational decision-making at scale",
                "Collaborated closely with senior engineers to document system behavior and architectural trade-offs"
            ],
            technologies: ["Java", "Spring Boot", "PostgreSQL", "Microservices", ".NET Core"],
            level: "Mid-Senior Level"
        },
        {
            title: "Software Engineer",
            company: "REVE Systems Ltd.",
            location: "Dhaka, Bangladesh",
            duration: "July 2023 – October 2024",
            description: [
                "Developed backend services for large enterprise systems where reliability and performance were critical",
                "Improved existing system structures by breaking down tightly coupled components into more manageable services",
                "Contributed to nationally deployed regulatory platforms by implementing backend workflows and integrations",
                "Paid particular attention to security, access control, and traceability within production systems"
            ],
            technologies: ["Spring Boot", "React", "Oracle DB", "OAuth2", "REST APIs"],
            level: "Mid-Level"
        },
        {
            "title": "Software Engineer",
            "company": "BJIT Group",
            "location": "Dhaka, Bangladesh",
            "duration": "April 2022 – June 2023",
            description: [
                "Worked on backend services supporting large-scale e-commerce platforms using both GraphQL and REST APIs",
                "Focused on efficient data fetching strategies to reduce API overhead and improve client-side performance",
                "Helped shape reusable backend patterns that simplified integration across multiple services",
                "Regularly coordinated with overseas teams to align technical decisions with product requirements"
            ],
            "technologies": ["Spring Boot", "GraphQL", "JavaEE", "Oracle DB", "SOAP", "REST", "UML"],
            "level": "Junior"
        }
        ,
        {
            title: "Teaching Assistant (Instructional Role)",
            company: "Daffodil International University",
            location: "Dhaka, Bangladesh",
            duration: "June 2020 – April 2022",
            description: [
                "Supported undergraduate teaching in programming-intensive courses such as OOP and Data Structures",
                "Ran lab sessions where students translated theoretical concepts into working code",
                "Guided students through problem-solving approaches rather than providing direct solutions",
                "Gained early experience in academic mentoring and instructional responsibility"
            ],
            technologies: ["Java", "Data Structures", "OOP", "Academic Research"],
            level: "Academic"
        }
    ];

    return (
        <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Experience
                    </h2>
                    <p className="text-xl text-gray-600">Professional journey and achievements</p>
                    <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 hidden md:block"></div>

                    <div className="space-y-12">
                        {experiences.map((exp, index) => (
                            <div key={index} className="relative">
                                {/* Timeline dot */}
                                <div
                                    className="absolute left-6 w-5 h-5 bg-blue-600 border-4 border-white rounded-full hidden md:block z-10 shadow-sm"></div>

                                <Card
                                    className="shadow-lg hover:shadow-xl transition-all duration-300 ml-0 md:ml-16 border-l-4 border-l-blue-600 bg-white">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between flex-col lg:flex-row gap-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="bg-gray-100 p-3 rounded-lg">
                                                    {techIconMap["Experience"]}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                        <CardTitle
                                                            className="text-2xl text-gray-900">{exp.title}</CardTitle>
                                                        <span
                                                            className="px-3 py-1 rounded-full text-xs font-medium text-blue-700 bg-blue-100">
                              {exp.level}
                            </span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-blue-600 mb-2">{exp.company}</p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            {techIconMap["Location"]}
                                                            <span>{exp.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            {techIconMap["Calendar"]}
                                                            <span>{exp.duration}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                                            {exp.description.map((point) => (
                                                <li key={point}>{point}</li>
                                            ))}
                                        </ul>
                                        <div className="flex flex-wrap gap-2">
                                            {exp.technologies.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md font-medium hover:bg-gray-200 transition-colors"
                                                >
    {techIconMap[tech] ?? null}
                                                    {tech}
  </span>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
