// src/components/Github.tsx
'use client';

import { useState } from 'react';
import { Github as GithubIcon, LineChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function StatImage({ src, alt, href }: { src: string; alt: string; href?: string }) {
    const [ok, setOk] = useState(true);

    const img = (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="w-full h-auto rounded-md border border-gray-100"
            referrerPolicy="no-referrer"
            onError={() => setOk(false)}
        />
    );

    if (!ok) {
        return (
            <div className="min-h-[220px] grid place-items-center rounded-md border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
                Image temporarily unavailable
            </div>
        );
    }
    return href ? (
        <a href={href} target="_blank" rel="noreferrer">
            {img}
        </a>
    ) : (
        img
    );
}

const Github = () => {
    return (
        <section id="github" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 animate-fade-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Open Source & GitHub</h2>
                    <p className="text-lg text-gray-600">Two quick snapshots from my public activity.</p>
                    <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Contribution Activity */}
                    <Card className="animate-fade-up shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                <span className="bg-primary/10 p-2 rounded-lg text-primary">
                  <LineChart className="w-5 h-5" />
                </span>
                                Contribution Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <StatImage
                                alt="GitHub activity graph for Md. Mosfikur Rahman"
                                href="https://github.com/mdmosfikurrahman"
                                src="https://github-readme-activity-graph.vercel.app/graph?username=mdmosfikurrahman&bg_color=ffffff&color=1f2937&line=2563eb&point=1f2937&area=true&hide_border=true"
                            />
                        </CardContent>
                    </Card>

                    {/* GitHub Stats */}
                    <Card className="animate-fade-up shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ animationDelay: '0.05s' }}>
                        <CardHeader>
                            <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                <span className="bg-primary/10 p-2 rounded-lg text-primary">
                  <GithubIcon className="w-5 h-5" />
                </span>
                                GitHub Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <StatImage
                                alt="GitHub stats for Md. Mosfikur Rahman"
                                href="https://github.com/mdmosfikurrahman"
                                src="https://github-readme-stats.vercel.app/api?username=mdmosfikurrahman&show_icons=true&layout=compact&theme=default&include_all_commits=true&count_private=true"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default Github;
