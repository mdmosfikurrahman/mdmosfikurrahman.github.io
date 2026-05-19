import { useTemplate } from "@/lib/template";
import NotFoundFolio from "@/templates/folio/NotFound";
import NotFoundBroadsheet from "@/templates/broadsheet/NotFound";
import NotFoundSurveillance from "@/templates/surveillance/NotFound";
import NotFoundMinimal from "@/templates/minimal/NotFound";
import NotFoundAnimus from "@/templates/animus/NotFound";
import NotFoundInception from "@/templates/inception/NotFound";
import NotFoundHeist from "@/templates/heist/NotFound";
import NotFoundChess from "@/templates/chess/NotFound";
import NotFoundTenet from "@/templates/tenet/NotFound";
import NotFoundKeynote from "@/templates/keynote/NotFound";

export default function NotFound() {
  const { template } = useTemplate();
  switch (template) {
    case "broadsheet":   return <NotFoundBroadsheet />;
    case "surveillance": return <NotFoundSurveillance />;
    case "minimal":      return <NotFoundMinimal />;
    case "animus":       return <NotFoundAnimus />;
    case "inception":    return <NotFoundInception />;
    case "heist":        return <NotFoundHeist />;
    case "chess":        return <NotFoundChess />;
    case "tenet":        return <NotFoundTenet />;
    case "keynote":      return <NotFoundKeynote />;
    case "folio":
    default:             return <NotFoundFolio />;
  }
}
