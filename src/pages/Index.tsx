import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Highlights from '@/components/Highlights';
import Research from '@/components/Research';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Education from '@/components/Education';
import Activities from '@/components/Activities';
import Interests from '@/components/Interests';
import Contact from '@/components/Contact';
import References from "@/components/References.tsx";

export default function Index() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <Hero />
            <Highlights />
            <Research />
            <Projects />
            <Skills />
            <Experience />
            <Education />
            <Activities />
            <Interests />
            <References />
            <Contact />
        </div>
    );
}

