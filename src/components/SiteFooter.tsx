import { useTemplate } from "@/lib/template";
import SiteFooterFolio from "@/templates/folio/SiteFooter";
import SiteFooterBroadsheet from "@/templates/broadsheet/SiteFooter";
import SiteFooterSurveillance from "@/templates/surveillance/SiteFooter";
import SiteFooterMinimal from "@/templates/minimal/SiteFooter";
import SiteFooterAnimus from "@/templates/animus/SiteFooter";
import SiteFooterInception from "@/templates/inception/SiteFooter";
import SiteFooterHeist from "@/templates/heist/SiteFooter";
import SiteFooterChess from "@/templates/chess/SiteFooter";
import SiteFooterTenet from "@/templates/tenet/SiteFooter";
import SiteFooterKeynote from "@/templates/keynote/SiteFooter";

export default function SiteFooter() {
  const { template } = useTemplate();
  switch (template) {
    case "broadsheet":   return <SiteFooterBroadsheet />;
    case "surveillance": return <SiteFooterSurveillance />;
    case "minimal":      return <SiteFooterMinimal />;
    case "animus":       return <SiteFooterAnimus />;
    case "inception":    return <SiteFooterInception />;
    case "heist":        return <SiteFooterHeist />;
    case "chess":        return <SiteFooterChess />;
    case "tenet":        return <SiteFooterTenet />;
    case "keynote":
    case "keynote-tech":
    case "keynote-talk":  return <SiteFooterKeynote />;
    case "folio":
    default:             return <SiteFooterFolio />;
  }
}
