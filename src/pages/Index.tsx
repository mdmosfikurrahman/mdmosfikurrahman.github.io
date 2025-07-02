
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Research from "@/components/Research";
import Activities from "@/components/Activities";
import Interests from "@/components/Interests";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Hero />
      <Education />
      <Experience />
      <Projects />
      <Skills />
      <Research />
      <Activities />
      <Interests />
    </div>
  );
};

export default Index;
