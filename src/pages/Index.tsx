import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Education from '@/components/Education';
import Research from '@/components/Research';
import Activities from '@/components/Activities';
import Interests from '@/components/Interests';
import Github from '@/components/Github';
import Contact from '@/components/Contact';

const Index = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <Hero />
            <Skills />
            <Projects />
            <Experience />
            <Education />
            <Research />
            <Activities />
            <Interests />
            <Github />
            <Contact />
        </div>
    );
};

export default Index;
