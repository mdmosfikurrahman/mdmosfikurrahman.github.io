'use client';

import {useMemo, useState} from 'react';
import { techIconMap } from "@/components/TechIcons";
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';

type ProjectType = 'industry' | 'research';

const projects = [
    // Industry
    {
        type: 'industry' as ProjectType,
        title: "Akij Air Backend System",
        company: "Akij iBOS Ltd.",
        role: "Lead Backend Developer",
        description: [
            "Designed the backend architecture and selected core technologies for the Akij Air ecosystem",
            "Developed key modules including inventory, routing, and partner management",
            "Defined scalable microservices and integration strategies for long-term growth",
        ],
        technologies: ["Java", "Spring Boot", "Microservices", "PostgreSQL", "System Architecture"],
    },
    {
        type: 'industry' as ProjectType,
        title: "TrackForce",
        company: "Akij iBOS Ltd.",
        role: "Lead Developer",
        description: [
            "Led a cross-functional team to improve system performance and reliability",
            "Built REST APIs and SQL reporting modules using .NET Core",
            "Implemented real-time tracking and automated operational insights",
        ],
        technologies: [".NET Core", "SQL Server", "REST APIs", "Real-time Systems"],
    },
    {
        type: 'industry' as ProjectType,
        title: "Customs Bond Management System (NBR)",
        company: "REVE Systems Ltd.",
        role: "Full-stack Developer",
        description: [
            "Developed legal and case modules for CBMS.",
            "Integrated BGMEA/BKMEA APIs for automation.",
            "Built scalable features using Spring Boot and Oracle.",
        ],
        technologies: ["Spring Boot", "Thymeleaf", "Oracle DB", "System Integration"],
    },
    {
        type: 'industry' as ProjectType,
        title: "Rakuten Echiba Backend Development",
        company: "BJIT Ltd.",
        role: "Backend Developer (GraphQL BFF)",
        description: [
            "Built GraphQL-based BFF for e-commerce modules.",
            "Implemented schema stitching, batching, and resolver optimizations.",
            "Improved query performance; ensured data consistency with Oracle DB.",
        ],
        technologies: ["Spring Boot", "GraphQL", "Oracle DB", "BFF Architecture", "Performance Optimization"],
    },
    // Research (map from your Research section as “systems” where applicable)
    {
        type: 'research' as ProjectType,
        title: "IoT-based Smart Sewerage & Hazard Sharing",
        company: "IEEE WIECON-ECE Paper",
        role: "Research & Prototyping",
        description: [
            "Designed sensor data pipeline and alert mechanisms.",
            "Built proof-of-concept edge → API ingestion flow.",
        ],
        technologies: ["IoT", "Edge Processing", "REST APIs", "Analytics"],
    },
    {
        type: 'research' as ProjectType,
        title: "Deep Learning for Plant Disease Diagnosis",
        company: "SMART GENCON Paper",
        role: "Modeling & Evaluation",
        description: [
            "Implemented CNN architectures; curated/augmented dataset.",
            "Benchmarked models and reported inference performance.",
        ],
        technologies: ["PyTorch/TensorFlow", "CNN", "Model Evaluation"],
    },
];

export default function Projects() {
    const [tab, setTab] = useState<ProjectType | 'all'>('all');
    const filtered = useMemo(
        () => (tab === 'all' ? projects : projects.filter(p => p.type === tab)),
        [tab]
    );

    return (
        <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Projects</h2>
                    <p className="text-lg text-gray-600">Filter by track to browse focus areas</p>
                </div>

                {/* Tabs */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {[
                        {key: 'all', label: 'All'},
                        {key: 'industry', label: 'Industry'},
                        {key: 'research', label: 'Research'},
                    ].map(({key, label}) => (
                        <Button
                            key={key}
                            variant={tab === (key as any) ? 'default' : 'outline'}
                            onClick={() => setTab(key as any)}
                            className="px-4"
                        >
                            {label}
                        </Button>
                    ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {filtered.map((project) => (
                        <Card
                            key={`${project.title}-${project.company}`}
                            className="animate-fade-up shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                        >
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                                        {techIconMap["Project"]}
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle
                                            className="text-xl text-gray-900 group-hover:text-primary transition-colors">
                                            {project.title}
                                        </CardTitle>
                                        <p className="text-primary font-medium mt-1">{project.company}</p>
                                        <p className="text-sm text-gray-600 mt-1">{project.role}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 mb-4">
                                    {project.description.map((item) => (
                                        <li
                                            key={item}
                                            className="text-gray-700 text-sm leading-relaxed flex items-start gap-2"
                                        >
                                            <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((tech) => (
                                        <span
                                            key={tech}
                                            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-md font-medium hover:bg-gray-200 transition"
                                        >
                                          {techIconMap[tech]} {tech}
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
}
