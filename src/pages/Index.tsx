import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ResearchInterestsSection from "@/components/ResearchInterestsSection";
import PapersDetailSection from "@/components/PapersDetailSection";
import PublicationsSection from "@/components/PublicationsSection";
import YearbookSection from "@/components/YearbookSection";
import AchievementsSection from "@/components/AchievementsSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ResearchInterestsSection />
      <PapersDetailSection />
      <PublicationsSection />
      <YearbookSection />
      <AchievementsSection />
      <SkillsSection />
      <ContactSection />
    </main>
  );
};

export default Index;
