import { useTemplate } from "@/lib/template";
import SiteWatermarkFolio from "@/templates/folio/SiteWatermark";
import SiteWatermarkBroadsheet from "@/templates/broadsheet/SiteWatermark";
import SiteWatermarkSurveillance from "@/templates/surveillance/SiteWatermark";
import SiteWatermarkMinimal from "@/templates/minimal/SiteWatermark";
import SiteWatermarkAnimus from "@/templates/animus/SiteWatermark";
import SiteWatermarkInception from "@/templates/inception/SiteWatermark";
import SiteWatermarkHeist from "@/templates/heist/SiteWatermark";
import SiteWatermarkChess from "@/templates/chess/SiteWatermark";
import SiteWatermarkTenet from "@/templates/tenet/SiteWatermark";

export default function SiteWatermark() {
  const { template } = useTemplate();
  switch (template) {
    case "broadsheet":   return <SiteWatermarkBroadsheet />;
    case "surveillance": return <SiteWatermarkSurveillance />;
    case "minimal":      return <SiteWatermarkMinimal />;
    case "animus":       return <SiteWatermarkAnimus />;
    case "inception":    return <SiteWatermarkInception />;
    case "heist":        return <SiteWatermarkHeist />;
    case "chess":        return <SiteWatermarkChess />;
    case "tenet":        return <SiteWatermarkTenet />;
    case "folio":
    default:             return <SiteWatermarkFolio />;
  }
}
