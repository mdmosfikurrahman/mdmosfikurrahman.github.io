import {Briefcase, Calendar, MapPin} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

const Experience = () => {
    const experiences = [
        {
            title: "Software Engineer L-II",
            company: "Akij iBOS Ltd.",
            location: "Dhaka, Bangladesh",
            duration: "November 2024 – Present",
            description: [
                "Architecting and developing backend systems for the Akij Air platform",
                "Driving system modularization and technical planning initiatives",
                "Led the TrackForce project, delivering REST APIs and SQL reporting features",
                "Refactored legacy .NET components into scalable Java microservices"
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
                "Built scalable Spring Boot + React solutions with secure OAuth2 workflows",
                "Optimized Oracle DB structures for performance and maintainability",
                "Developed core modules for the NBR Customs Bond Management System",
                "Integrated BGMEA/BKMEA data services to automate legal workflows"
            ],
            technologies: ["Spring Boot", "React", "Oracle DB", "OAuth2", "REST APIs"],
            level: "Mid-Level"
        },
        {
            "title": "Software Engineer",
            "company": "BJIT Group",
            "location": "Dhaka, Bangladesh",
            "duration": "April 2022 – June 2023",
            "description": [
                "Built and maintained GraphQL-based BFF (Backend for Frontend) services using Java and Spring Boot",
                "Developed scalable APIs for Rakuten Echiba's e-commerce modules with both GraphQL and REST interfaces",
                "Implemented GraphQL schema stitching, batching, and resolvers for optimized nested queries",
                "Created detailed API documentation and UML diagrams to support maintainable enterprise integration"
            ],
            "technologies": ["Spring Boot", "GraphQL", "JavaEE", "Oracle DB", "SOAP", "REST", "UML"],
            "level": "Junior"
        }
        // ,
        // {
        //   title: "Teaching Assistant (Instructional Role)",
        //   company: "Daffodil International University",
        //   location: "Dhaka, Bangladesh",
        //   duration: "June 2020 – April 2022",
        //   description: [
        //     "Assisted in teaching core computer science courses such as OOP and Data Structures",
        //     "Conducted labs, prepared assignments, and mentored students",
        //     "Delivered lectures independently under faculty guidance",
        //     "Supported academic activities within the department"
        //   ],
        //   technologies: ["Java", "Data Structures", "OOP", "Academic Research"],
        //   level: "Academic"
        // }
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
                                                    <Briefcase className="w-6 h-6 text-gray-700"/>
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
                                                            <MapPin className="w-4 h-4"/>
                                                            <span>{exp.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4"/>
                                                            <span>{exp.duration}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                                            {exp.description.map((point, i) => (
                                                <li key={i}>{point}</li>
                                            ))}
                                        </ul>
                                        <div className="flex flex-wrap gap-2">
                                            {exp.technologies.map((tech, techIndex) => (
                                                <span
                                                    key={techIndex}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md font-medium hover:bg-gray-200 transition-colors"
                                                >
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
