import { BookOpen, FlaskConical, Briefcase, Server, GraduationCap, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Highlights() {
    const academic = [
        '10+ publications across journals & conferences',
        'Reviewer for multiple journals and conferences',
        'Research focus: AI/ML, Data Science, IoT',
        'Erasmus+ exchange (AMU, Poland)',
    ];
    const industry = [
        'Backend architecture & microservices (Java, Spring Boot)',
        'Secure APIs, OAuth2, PostgreSQL/Oracle optimization',
        'Large-scale systems for gov & enterprise',
        'Hands-on with GraphQL BFF and .NET migration',
    ];

    const Pill = ({ children }: { children: React.ReactNode }) => (
        <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">{children}</span>
    );

    return (
        <section id="highlights" className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Highlights</h2>
                    <p className="text-lg text-gray-600">A quick view of my academic and industry profiles</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                <span className="bg-primary/10 p-2 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </span>
                                Academic Track
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                {academic.map((a, i) => <li key={i}>{a}</li>)}
                            </ul>
                            <div className="flex flex-wrap gap-2 pt-2">
                                <Pill><BookOpen className="w-4 h-4 inline mr-1" />Scholar</Pill>
                                <Pill><FlaskConical className="w-4 h-4 inline mr-1" />AI/ML</Pill>
                                <Pill><Shield className="w-4 h-4 inline mr-1" />Reviewer</Pill>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                <span className="bg-primary/10 p-2 rounded-lg">
                  <Briefcase className="w-5 h-5 text-primary" />
                </span>
                                Industry Track
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                {industry.map((a, i) => <li key={i}>{a}</li>)}
                            </ul>
                            <div className="flex flex-wrap gap-2 pt-2">
                                <Pill><Server className="w-4 h-4 inline mr-1" />Microservices</Pill>
                                <Pill>Spring Boot</Pill>
                                <Pill>PostgreSQL</Pill>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
