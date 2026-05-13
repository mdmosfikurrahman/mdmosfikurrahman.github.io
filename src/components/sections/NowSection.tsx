import { useTemplate } from "@/lib/template";
import NowSectionFolio from "@/templates/folio/NowSection";
import NowSectionBroadsheet from "@/templates/broadsheet/NowSection";
import NowSectionSurveillance from "@/templates/surveillance/NowSection";
import NowSectionMinimal from "@/templates/minimal/NowSection";
import NowSectionAnimus from "@/templates/animus/NowSection";
import NowSectionInception from "@/templates/inception/NowSection";
import NowSectionHeist from "@/templates/heist/NowSection";
import NowSectionChess from "@/templates/chess/NowSection";
import NowSectionTenet from "@/templates/tenet/NowSection";

export default function NowSection() {
  const { template } = useTemplate();
  switch (template) {
    case "broadsheet":   return <NowSectionBroadsheet />;
    case "surveillance": return <NowSectionSurveillance />;
    case "minimal":      return <NowSectionMinimal />;
    case "animus":       return <NowSectionAnimus />;
    case "inception":    return <NowSectionInception />;
    case "heist":        return <NowSectionHeist />;
    case "chess":        return <NowSectionChess />;
    case "tenet":        return <NowSectionTenet />;
    case "folio":
    default:             return <NowSectionFolio />;
  }
}
