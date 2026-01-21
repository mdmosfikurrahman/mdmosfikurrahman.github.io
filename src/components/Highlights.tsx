import {IconPill} from "@/components/IconPill";
import { techIconMap } from "@/components/TechIcons";
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

export default function Highlights() {
    const academic = [
        '10+ peer-reviewed journal and conference publications in software systems, ML, and data-driven studies',
        'Research experience in applied machine learning, software analytics, and secure systems',
        'Reviewer for international journals and conferences (Elsevier & Springer venues)',
        'Erasmus+ exchange program at Adam Mickiewicz University, Poland',
    ];

    const industry = [
        '3.5+ years of backend engineering experience across enterprise and national-scale systems',
        'Designed and implemented microservice-based architectures using Java and Spring Boot',
        'Developed secure, high-performance APIs with OAuth2, audit logging, and role-based access control',
        'Delivered backend systems for government (NBR), airline, e-commerce, and enterprise platforms',
    ];

    const Pill = ({children}: { children: React.ReactNode }) => (
        <span className="px-2 py-1 bg-gray-100 rounded-md text-sm flex items-center gap-1">
            {children}
        </span>
    );

    return (
        <section id="highlights" className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Highlights
                    </h2>
                    <p className="text-lg text-gray-600">
                        A snapshot of my academic research and industry engineering background
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Academic */}
                    <Card className="shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                  <span className="bg-primary/10 p-2 rounded-lg">
                                    {techIconMap["Academic Track"]}
                                  </span>
                                Academic Track
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                {academic.map((a, i) => (
                                    <li key={i}>{a}</li>
                                ))}
                            </ul>
                            <div className="flex flex-wrap gap-2 pt-2">
                                <IconPill label="Publications"/>
                                <IconPill label="Applied ML"/>
                                <IconPill label="Peer Reviewer"/>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Industry */}
                    <Card className="shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                  <span className="bg-primary/10 p-2 rounded-lg">
                                    {techIconMap["Industry Track"]}
                                  </span>
                                Industry Track
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                {industry.map((a, i) => (
                                    <li key={i}>{a}</li>
                                ))}
                            </ul>
                            <div className="flex flex-wrap gap-2 pt-2">
                                <IconPill label="Microservices"/>
                                <IconPill label="Spring Boot"/>
                                <IconPill label="PostgreSQL"/>
                                <IconPill label="Oracle DB"/>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
