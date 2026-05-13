import { useTemplate } from "@/lib/template";
import SiteHeaderFolio from "@/templates/folio/SiteHeader";
import SiteHeaderBroadsheet from "@/templates/broadsheet/SiteHeader";
import SiteHeaderSurveillance from "@/templates/surveillance/SiteHeader";
import SiteHeaderMinimal from "@/templates/minimal/SiteHeader";
import SiteHeaderAnimus from "@/templates/animus/SiteHeader";
import SiteHeaderInception from "@/templates/inception/SiteHeader";
import SiteHeaderHeist from "@/templates/heist/SiteHeader";
import SiteHeaderChess from "@/templates/chess/SiteHeader";
import SiteHeaderTenet from "@/templates/tenet/SiteHeader";

export default function SiteHeader() {
  const { template } = useTemplate();
  switch (template) {
    case "broadsheet":   return <SiteHeaderBroadsheet />;
    case "surveillance": return <SiteHeaderSurveillance />;
    case "minimal":      return <SiteHeaderMinimal />;
    case "animus":       return <SiteHeaderAnimus />;
    case "inception":    return <SiteHeaderInception />;
    case "heist":        return <SiteHeaderHeist />;
    case "chess":        return <SiteHeaderChess />;
    case "tenet":        return <SiteHeaderTenet />;
    case "folio":
    default:             return <SiteHeaderFolio />;
  }
}
