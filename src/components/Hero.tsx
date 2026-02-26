'use client';

import { techIconMap } from '@/components/TechIcons';
import { Button } from '@/components/ui/button';
import { Typewriter } from 'react-simple-typewriter';

export default function Hero() {
    return (
        <section
            id="hero"
            className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-4xl mx-auto text-center">
                {/* Name & Title */}
                <div className="mb-8 flex flex-col items-center">

                    {/* Profile Image */}
                    <img
                        src="/assets/Mosfik.png"
                        alt="Md Mosfikur Rahman"
                        className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover shadow-lg mb-6 border-4 border-white"
                    />
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                        Md. Mosfikur{' '}
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
                        Software Engineer (Backend Systems) · AI/ML Researcher
                    </p>

                    {/* Contact */}
                    <div className="space-y-2 text-gray-600 mb-8">
                        <div className="flex items-center justify-center gap-2">
                            {techIconMap["Phone"]}
                            <span>+880 1797-554948</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            {techIconMap["Mail"]}
                            <a
                                href="mailto:mdmosfikurrahman.cse@gmail.com"
                                className="hover:text-primary"
                            >
                                mdmosfikurrahman.cse@gmail.com
                            </a>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            {techIconMap["Location"]}
                            <span>Modhumoti · Sector - 18, Uttara, Dhaka</span>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <p className="text-lg text-gray-700 leading-relaxed">
                        I design and build <strong>scalable backend systems</strong> for
                        enterprise and national-scale platforms, with hands-on experience
                        in <strong>microservices, distributed systems, and secure APIs</strong>.
                        Alongside industry work, I actively conduct research in
                        <strong> software systems, applied machine learning, and empirical studies</strong>,
                        with multiple peer-reviewed publications.
                        <br /><br />
                        Currently open to <strong>backend engineering roles</strong> and
                        <strong> MS/PhD research opportunities</strong> in Software Engineering,
                        Systems, and Applied AI.
                    </p>
                </div>

                {/* Primary CTAs */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                    <Button asChild variant="secondary" size="lg" className="gap-2">
                        <a
                            href="https://mdmosfikurrahman.github.io/cv"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {techIconMap["Academic CV"]}
                            Academic CV (MS/PhD)
                        </a>
                    </Button>
                    <Button asChild variant="secondary" size="lg" className="gap-2">
                        <a
                            href="https://mdmosfikurrahman.github.io/resume"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {techIconMap["Industry Resume"]}
                            Industry Resume
                        </a>
                    </Button>
                </div>

                {/* Socials */}
                <div className="flex flex-wrap justify-center gap-4 mb-10">
                    <Button asChild variant="outline" size="lg">
                        <a
                            href="https://www.linkedin.com/in/mdmosfikurrahman"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {techIconMap["LinkedIn"]}
                            LinkedIn
                        </a>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <a
                            href="https://github.com/mdmosfikurrahman"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {techIconMap["GitHub"]}
                            GitHub
                        </a>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <a
                            href="https://scholar.google.com/citations?user=1GAfMAEAAAAJ"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {techIconMap["Google Scholar"]}
                            Google Scholar
                        </a>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <a href="mailto:mdmosfikurrahman.cse@gmail.com?subject=Prospective%20Collaboration">
                            {techIconMap["Email"]}
                            Email
                        </a>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <div className="text-2xl font-bold text-primary">3.5+</div>
                        <div className="text-sm text-gray-600">Years Industry Backend</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <div className="text-2xl font-bold text-primary">5.5+</div>
                        <div className="text-sm text-gray-600">Years Total Experience</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <div className="text-2xl font-bold text-primary">10+</div>
                        <div className="text-sm text-gray-600">Peer-Reviewed Publications</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <div className="text-2xl font-bold text-primary">4+</div>
                        <div className="text-sm text-gray-600">Large-Scale Systems</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
