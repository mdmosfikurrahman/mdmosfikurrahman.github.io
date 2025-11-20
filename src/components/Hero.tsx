// src/components/Hero.tsx
'use client';

import {BookOpen, Briefcase, Github, GraduationCap, Linkedin, Mail, MapPin, Phone} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Typewriter} from 'react-simple-typewriter';

export default function Hero() {
    return (
        <section id="hero" className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <div className="mb-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                        Md. Mosfikur{" "}
                        <span className="text-primary">
                            <Typewriter
                                words={['Rahman']}
                                loop={1}
                                cursor
                                cursorStyle="|"
                                typeSpeed={100}
                                deleteSpeed={50}
                                delaySpeed={1500}
                            />
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 mb-6">
                        Backend Engineer · AI/ML Researcher
                    </p>

                    <div className="space-y-2 text-gray-600 mb-8">
                        <div className="flex items-center justify-center gap-2">
                            <MapPin className="w-4 h-4"/><span>Modhumoti · Sector - 18, Uttara, Dhaka</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Phone className="w-4 h-4"/><span>+8801797-554948</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Mail className="w-4 h-4"/>
                            <a href="mailto:mdmosfikurrahman.cse@gmail.com" className="hover:text-primary">
                                mdmosfikurrahman.cse@gmail.com
                            </a>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <p className="text-lg text-gray-700 leading-relaxed">
                        I design and build scalable backend systems (<strong>Java · Spring Boot · PostgreSQL</strong>)
                        and pursue research at the intersection of <strong>AI/ML</strong> and real-world systems. I’m
                        actively open to <strong>MS/PhD opportunities</strong> as well as <strong>industry
                        roles</strong>.
                    </p>
                </div>

                {/* Dual primary CTAs */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                    <Button asChild variant="secondary" size="lg" className="gap-2">
                        <a href="https://mdmosfikurrahman.github.io/cv" target="_blank" rel="noopener noreferrer">
                            <BookOpen className="w-5 h-5"/> Academic CV (MS/PhD)
                        </a>
                    </Button>
                    <Button asChild variant="secondary" size="lg" className="gap-2">
                        <a href="https://mdmosfikurrahman.github.io/resume" target="_blank" rel="noopener noreferrer">
                            <Briefcase className="w-5 h-5"/> Industry Resume
                        </a>
                    </Button>
                </div>

                {/* Socials */}
                <div className="flex flex-wrap justify-center gap-4 mb-10">
                    <Button asChild variant="outline" size="lg">
                        <a href="https://www.linkedin.com/in/mdmosfikurrahman" target="_blank"
                           rel="noopener noreferrer">
                            <Linkedin className="w-5 h-5 mr-2"/> LinkedIn
                        </a>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <a href="https://github.com/mdmosfikurrahman" target="_blank" rel="noopener noreferrer">
                            <Github className="w-5 h-5 mr-2"/> GitHub
                        </a>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <a href="https://scholar.google.com/citations?user=1GAfMAEAAAAJ" target="_blank"
                           rel="noopener noreferrer">
                            <GraduationCap className="w-5 h-5 mr-2"/> Google Scholar
                        </a>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <a href="mailto:mdmosfikurrahman.cse@gmail.com?subject=Prospective%20Collaboration">
                            <Mail className="w-5 h-5 mr-2"/> Email
                        </a>
                    </Button>
                </div>

                {/* Stats row (optional: minor copy tweak) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <div className="text-2xl font-bold text-primary">3+</div>
                        <div className="text-sm text-gray-600">Years (Backend)</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <div className="text-2xl font-bold text-primary">10+</div>
                        <div className="text-sm text-gray-600">Publications</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <div className="text-2xl font-bold text-primary">3+</div>
                        <div className="text-sm text-gray-600">Major Systems</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <div className="text-2xl font-bold text-primary">3</div>
                        <div className="text-sm text-gray-600">Certifications</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
