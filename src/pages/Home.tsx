import type { ComponentType } from "react";
import SiteHeader from "@/site/SiteHeader";
import SiteFooter from "@/site/SiteFooter";
import Hero from "@/site/Hero";
import SelectedWork from "@/site/SelectedWork";
import ResearchStrip from "@/site/ResearchStrip";
import ExperienceStrip from "@/site/ExperienceStrip";
import Capabilities from "@/site/Capabilities";
import Recommendations from "@/site/Recommendations";
import Contact from "@/site/Contact";
import { recommendations } from "@/lib/content";
import { useLens, type Lens } from "@/lib/lens";

type Section = { key: string; C: ComponentType<{ alt?: boolean }> };

const WORK: Section = { key: "work", C: SelectedWork };
const RESEARCH: Section = { key: "research", C: ResearchStrip };
const RECORD: Section = { key: "record", C: ExperienceStrip };
const CAPS: Section = { key: "caps", C: Capabilities };
const RECS: Section = { key: "recs", C: Recommendations };
const CONTACT: Section = { key: "contact", C: Contact };

// What each kind of reader meets first. The balanced order alternates the two
// sides of the profile so neither one buries the other.
const ORDER: Record<Lens, Section[]> = {
  balanced: [WORK, RESEARCH, RECORD, CAPS, RECS, CONTACT],
  industry: [WORK, RECORD, RESEARCH, CAPS, RECS, CONTACT],
  academia: [RESEARCH, RECORD, WORK, CAPS, RECS, CONTACT],
};

export default function Home() {
  const lens = useLens();
  // Sections with nothing to show are dropped first, so the tint still alternates.
  const sections = ORDER[lens].filter((s) => !(s === RECS && recommendations.length === 0));
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        {sections.map(({ key, C }, i) => (
          <C key={key} alt={i % 2 === 0} />
        ))}
      </main>
      <SiteFooter />
    </>
  );
}
