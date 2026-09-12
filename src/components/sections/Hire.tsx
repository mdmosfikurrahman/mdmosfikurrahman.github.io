import { isIndustryTemplate, useTemplate } from "@/lib/template";
import { useHireMeEnabled } from "@/lib/settings";
import { freelance } from "@/lib/content";
import HireShared from "@/templates/minimal/Hire";

// Freelance band. Three gates, in the order they are cheapest to fail:
//   1. the content says availability is off
//   2. the admin toggle (local, or published to every visitor) says off
//   3. the active template is one of the keynote decks — an interview or
//      seminar surface, where a freelance pitch would be off-key
// Every industry template shares one token-driven implementation for now.
export default function Hire() {
  const { template } = useTemplate();
  const enabled = useHireMeEnabled();

  if (!freelance.available) return null;
  if (!enabled) return null;
  if (!isIndustryTemplate(template)) return null;

  return <HireShared />;
}
