import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Hero from "@/components/sections/Hero";
import NowSection from "@/components/sections/NowSection";
import SelectedWork from "@/components/sections/SelectedWork";
import ResearchStrip from "@/components/sections/ResearchStrip";
import SkillsMatrix from "@/components/sections/SkillsMatrix";
import Hire from "@/components/sections/Hire";
import Correspondence from "@/components/sections/Correspondence";

export default function Index() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <NowSection />
        <SelectedWork />
        <ResearchStrip />
        <SkillsMatrix />
        <Hire />
        <Correspondence />
      </main>
      <SiteFooter />
    </>
  );
}
