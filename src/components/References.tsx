'use client';

import {Mail, Phone, Quote} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import React from "react";

type Reference = {
    name: string;
    title: string;
    organization: string;
    phone: string;
    email: string;
    feedback?: string;
};

const references: Reference[] = [
    {
        name: 'Nazmun Nessa Moon',
        title: 'Associate Professor, Dept. of CSE',
        organization: 'Daffodil International University, Dhaka, Bangladesh',
        phone: '+880 1798-145670',
        email: 'moon@daffodilvarsity.edu.bd',
        feedback:
            '“As his thesis supervisor, I found Mosfik intelligent, diligent, and principled. He demonstrated research maturity beyond his years and contributed significantly to our academic community. I strongly recommend him for advanced study.”',
    },
    {
        name: 'Mohammad Jahangir Alam',
        title: 'Assistant Professor, Dept. of CSE',
        organization: 'Daffodil International University, Dhaka, Bangladesh',
        phone: '+880 1741-378269',
        email: 'jahangir.cse@diu.edu.bd',
        feedback:
            '“I taught Mosfik and oversaw his co-curricular leadership at DIU. His academic diligence, research achievements, and professional maturity spanning industry roles and CPC leadership make him exceptionally well-suited for research-focused study. I strongly recommend him.”',
    },
    {
        name: 'Mushfiqur Rahman',
        title: 'Assistant Professor, Dept. of CSE',
        organization: 'Daffodil International University, Dhaka, Bangladesh',
        phone: '+880 1714-218217',
        email: 'mushfiqur.cse@diu.edu.bd',
        feedback:
            '“I taught Mosfik Compiler Design and later co-authored a handbook with him. His diligence, analytical ability, and commitment to learning were exemplary, and he is well prepared for advanced, research-oriented study.”',
    },
    {
        name: 'Anisuzzaman Rubel',
        title: 'Consultant – Enterprise Integrator',
        organization: 'Aspire to Innovate (a2i), ICT Division, Dhaka, Bangladesh',
        phone: '+880 1906-994487',
        email: 'anis.zaman@a2i.gov.bd',
        feedback:
            '“I supervised Mosfik on the NBR Customs Bond Management System at REVE Systems. He grasped complex requirements, designed and implemented key modules, integrated external systems securely, and collaborated effectively under tight deadlines. I recommend him without reservation.”',
    },
];

function getGridShape(n: number) {
    if (n <= 4) return {cols: 2, rows: 2};
    if (n === 5) return {cols: 3, rows: 2};
    if (n === 6) return {cols: 3, rows: 3};
    if (n === 7) return {cols: 3, rows: 4};
    return {cols: 3, rows: Math.ceil(n / 3)};
}

export default function References() {
    const count = references.length;
    const {cols, rows} = getGridShape(count);

    return (
        <section id="references" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <style>{`
        #references .refs-grid {
          display: grid;
          gap: 1.5rem; /* 24px, same as gap-6 */
          grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
          grid-template-rows: repeat(var(--rows), auto);
        }
        /* Mobile: always 1 column */
        @media (max-width: 640px) {
          #references .refs-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto !important;
          }
        }
      `}</style>

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        References
                    </h2>
                    <p className="text-lg text-gray-600">
                        Feedback from mentors and colleagues
                    </p>
                </div>

                <div
                    className="refs-grid"
                    style={
                        {
                            '--cols': cols,
                            '--rows': rows,
                        } as React.CSSProperties
                    }
                >
                    {references.map((ref) => (
                        <Card
                            key={ref.email}
                            className="h-full flex flex-col shadow-md hover:shadow-lg transition-all duration-300 bg-white rounded-xl"
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <CardTitle className="text-xl font-semibold text-gray-900">
                                            {ref.name}
                                        </CardTitle>
                                        <p className="text-sm text-gray-700">{ref.title}</p>
                                        <p className="text-xs text-gray-500">{ref.organization}</p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pb-0">
                                <div className="flex flex-col gap-2 text-sm text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-500"/>
                                        <span className="break-words">{ref.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-500"/>
                                        <a
                                            href={`mailto:${ref.email}`}
                                            className="text-primary hover:underline break-all"
                                        >
                                            {ref.email}
                                        </a>
                                    </div>
                                </div>
                            </CardContent>

                            <CardContent className="flex-grow pt-4">
                                {ref.feedback && (
                                    <div className="bg-gray-50 rounded-lg p-4 relative h-full">
                                        <Quote
                                            className="w-5 h-5 text-primary absolute -top-2 -left-2 bg-white rounded-full p-1 shadow-sm"/>
                                        <p className="text-base text-gray-800 leading-relaxed text-justify">
                                            {ref.feedback}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
