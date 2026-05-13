import { useTemplate } from "@/lib/template";
import ResearchStripFolio from "@/templates/folio/ResearchStrip";
import ResearchStripBroadsheet from "@/templates/broadsheet/ResearchStrip";
import ResearchStripSurveillance from "@/templates/surveillance/ResearchStrip";
import ResearchStripMinimal from "@/templates/minimal/ResearchStrip";
import ResearchStripAnimus from "@/templates/animus/ResearchStrip";
import ResearchStripInception from "@/templates/inception/ResearchStrip";
import ResearchStripHeist from "@/templates/heist/ResearchStrip";
import ResearchStripChess from "@/templates/chess/ResearchStrip";
import ResearchStripTenet from "@/templates/tenet/ResearchStrip";

export default function ResearchStrip() {
  const { template } = useTemplate();
  switch (template) {
    case "broadsheet":   return <ResearchStripBroadsheet />;
    case "surveillance": return <ResearchStripSurveillance />;
    case "minimal":      return <ResearchStripMinimal />;
    case "animus":       return <ResearchStripAnimus />;
    case "inception":    return <ResearchStripInception />;
    case "heist":        return <ResearchStripHeist />;
    case "chess":        return <ResearchStripChess />;
    case "tenet":        return <ResearchStripTenet />;
    case "folio":
    default:             return <ResearchStripFolio />;
  }
}
