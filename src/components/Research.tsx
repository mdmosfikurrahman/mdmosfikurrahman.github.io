'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { techIconMap } from '@/components/TechIcons';

type Paper = {
    title: string;
    venue: string;
    year: string | number;
    doi?: string;
};

type ReviewerRole = string;

const journals: Paper[] = [
    {
        title: 'Impactful e-learning framework: A new hybrid form of education',
        venue: 'Current Research in Behavioral Sciences',
        year: '2021',
        doi: 'https://doi.org/10.1016/j.crbeha.2021.100038',
    },
    {
        title:
            'Impact of COVID-19 on mental health: A quantitative analysis of anxiety and depression based on regular life and internet use',
        venue: 'Current Research in Behavioral Sciences',
        year: '2021',
        doi: 'https://doi.org/10.1016/j.crbeha.2021.100037',
    },
    {
        title:
            'COVID-19 and Bangladesh: Situation report, comparative analysis, and case study',
        venue: 'Current Research in Behavioral Sciences',
        year: '2021',
        doi: 'https://doi.org/10.1016/j.crbeha.2021.100034',
    },
];

const conferences: Paper[] = [
    {
        title:
            'Future city of Bangladesh: IoT based autonomous smart sewerage and hazard condition sharing system',
        venue: 'IEEE WIECON-ECE',
        year: '2020',
        doi: 'https://doi.org/10.1109/WIECON-ECE52138.2020.9397950',
    },
    {
        title: 'Deep Learning Model for Detecting and Diagnosing Plant Disease',
        venue: 'SMART GENCON',
        year: '2021',
        doi: 'https://doi.org/10.1109/SMARTGENCON51891.2021.9645857',
    },
    {
        title: 'TraFoo: An Android Application for Food Delivery in Train',
        venue: 'SMART GENCON',
        year: '2021',
        doi: 'https://doi.org/10.1109/SMARTGENCON51891.2021.9645900',
    },
    {
        title: 'Pandemic effect on education system among university students',
        venue: 'Springer: Progress in AI & Robotics',
        year: '2021',
        doi: 'https://doi.org/10.1007/978-3-030-98531-8_16',
    },
    {
        title:
            'Machine Learning-Based Prediction of COVID-19: A Robust Approach for Early Diagnosis and Treatment',
        venue: 'Springer: Trends in Computational and Cognitive Engineering',
        year: '2023',
        doi: 'https://doi.org/10.1007/978-981-97-1923-5_16',
    },
    {
        title: 'A New Chaotic-Based Analysis of Data Encryption and Decryption',
        venue: 'Springer: Advances in Data Science and Artificial Intelligence',
        year: '2022',
        doi: 'https://doi.org/10.1007/978-3-031-16178-0_32',
    },
    {
        title: 'Cyber Security Intruder Detection Using Deep Learning Approach',
        venue: 'Springer: Information Systems and Management Science',
        year: '2021',
        doi: 'https://doi.org/10.1007/978-3-031-13150-9_42',
    },
];

const reviewerRoles: ReviewerRole[] = [
    'Current Research in Behavioral Sciences',
    'ISA Transactions',
    'Natural Language Processing Journal',
    'Journal of King Saud University – Computer & Information Sciences',
    'International Conference on Deep Learning, Artificial Intelligence & Robotics (2022)',
    'International Conference on Information Systems & Management Science (2022)',
    'International Conference on Communication & Information Systems (2022)',
];

function useCountUp(target: number, duration = 900) {
    const ref = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const start = performance.now();
        const from = 0;

        const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = Math.round(from + (target - from) * eased);
            el.textContent = String(val);
            if (p < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    }, [target, duration]);

    return ref;
}

function StatTile({
                      iconKey,
                      label,
                      value,
                      delay = 0,
                  }: {
    iconKey: string;
    label: string;
    value: number;
    delay?: number;
}) {
    const numRef = useCountUp(value);

    return (
        <div
            className="group relative rounded-2xl p-5 sm:p-6 bg-white/60 backdrop-blur ring-1 ring-inset ring-zinc-200/70 transition transform duration-300 hover:-translate-y-0.5 hover:shadow-lg animate-fade-up"
            style={{ animationDelay: `${delay}s` }}
            aria-label={label}
        >
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-indigo-400/15 ring-1 ring-inset ring-primary/20">
                    {techIconMap[iconKey]}
                </div>
                <div>
                    <div className="text-3xl font-bold tracking-tight text-zinc-900">
                        <span ref={numRef} aria-live="polite" aria-label={String(value)} />
                    </div>
                    <div className="mt-0.5 text-sm text-zinc-600">{label}</div>
                </div>
            </div>
        </div>
    );
}

export default function Research() {
    const totalPubs = journals.length + conferences.length;

    return (
        <section id="research" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 animate-fade-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Research &amp; Publications
                    </h2>
                    <p className="text-lg text-gray-600">
                        Academic contributions and scholarly work
                    </p>
                </div>

                {/* Journal Publications */}
                <Card className="animate-fade-up shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                {techIconMap['Publications']}
                            </div>
                            <CardTitle className="text-xl text-gray-900">
                                Journal Publications
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-5">
                            {journals.map((paper, i) => (
                                <li
                                    key={`${paper.title}-${i}`}
                                    className="border-l-4 border-blue-600 pl-4 hover:bg-blue-50 rounded-md py-2 transition"
                                >
                                    <h4 className="font-semibold text-gray-900">{paper.title}</h4>
                                    <p className="text-sm text-gray-700">
                                        {paper.venue} • {paper.year}
                                    </p>
                                    {paper.doi && (
                                        <a
                                            href={paper.doi}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline inline-flex items-center gap-1 mt-1"
                                        >
                                            {techIconMap['ExternalLink']} DOI
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Conference Papers */}
                <Card className="animate-fade-up shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-3 rounded-lg">
                                {techIconMap['Speaker']}
                            </div>
                            <CardTitle className="text-xl text-gray-900">
                                Conference Papers
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-5">
                            {conferences.map((paper, i) => (
                                <li
                                    key={`${paper.title}-${i}`}
                                    className="border-l-4 border-green-600 pl-4 hover:bg-green-50 rounded-md py-2 transition"
                                >
                                    <h4 className="font-semibold text-gray-900">{paper.title}</h4>
                                    <p className="text-sm text-gray-700">
                                        {paper.venue} • {paper.year}
                                    </p>
                                    {paper.doi && (
                                        <a
                                            href={paper.doi}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-700 hover:underline inline-flex items-center gap-1 mt-1"
                                        >
                                            {techIconMap['ExternalLink']} DOI
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Reviewer Roles */}
                <Card className="animate-fade-up shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-100 p-3 rounded-lg">
                                {techIconMap['Peer Reviewer']}
                            </div>
                            <CardTitle className="text-xl text-gray-900">
                                Research Contributions &amp; Reviewer Roles
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="grid gap-3 md:grid-cols-2">
                            {reviewerRoles.map((role, i) => (
                                <li
                                    key={`${role}-${i}`}
                                    className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg"
                                >
                                    {techIconMap['User']}
                                    <p className="text-sm text-gray-700">{role}</p>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                    <StatTile
                        iconKey="Publications"
                        label="Total Publications"
                        value={totalPubs}
                        delay={0.2}
                    />
                    <StatTile
                        iconKey="Book"
                        label="Journal Papers"
                        value={journals.length}
                        delay={0.25}
                    />
                    <StatTile
                        iconKey="Speaker"
                        label="Conference Papers"
                        value={conferences.length}
                        delay={0.3}
                    />
                    <StatTile
                        iconKey="Peer Reviewer"
                        label="Reviewer Roles"
                        value={reviewerRoles.length}
                        delay={0.35}
                    />
                </div>
            </div>
        </section>
    );
}
