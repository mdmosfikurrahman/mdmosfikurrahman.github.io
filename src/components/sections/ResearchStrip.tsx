import { useTemplate } from "@/lib/template";
import ResearchStripBroadsheet from "@/templates/broadsheet/ResearchStrip";
import ResearchStripSurveillance from "@/templates/surveillance/ResearchStrip";

export default function ResearchStrip() {
  const { template } = useTemplate();
  if (template === "broadsheet") return <ResearchStripBroadsheet />;
  return <ResearchStripSurveillance />;
}
