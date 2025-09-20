// src/components/Projects.tsx
'use client';

import { useState, useMemo } from 'react';
import { Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ProjectType = 'industry' | 'research';

const projects = [
    // Industry
    {
        type: 'industry' as ProjectType,
        title: "Akij Air Backend System",
        company: "Akij iBOS Ltd.",
        role: "Lead Backend Developer",
        description: [
            "Planned backend architecture and selected core technologies.",
            "Designed services like inventory, routing, and partner modules.",
            "Defined scalable microservices with integration strategies.",
        ],
        technologies: ["Java", "Spring Boot", "Microservices", "PostgreSQL", "System Architecture"],
    },
    {
        type: 'industry' as ProjectType,
        title: "TrackForce",
        company: "Akij iBOS Ltd.",
        role: "Lead Developer",
        description: [
            "Led cross-functional teams to enhance system performance.",
            "Built REST APIs and SQL reports using .NET Core.",
            "Enabled real-time tracking and automated reporting.",
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
                        { key: 'all', label: 'All' },
                        { key: 'industry', label: 'Industry' },
                        { key: 'research', label: 'Research' },
                    ].map(({ key, label }) => (
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
                    {filtered.map((project, index) => (
                        <Card
                            key={index}
                            className="animate-fade-up shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
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
                                            <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((tech, techIndex) => (
                                        <span key={techIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">
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
}
