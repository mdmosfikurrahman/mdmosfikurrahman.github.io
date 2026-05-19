import { useTemplate } from "@/lib/template";
import CorrespondenceFolio from "@/templates/folio/Correspondence";
import CorrespondenceBroadsheet from "@/templates/broadsheet/Correspondence";
import CorrespondenceSurveillance from "@/templates/surveillance/Correspondence";
import CorrespondenceMinimal from "@/templates/minimal/Correspondence";
import CorrespondenceAnimus from "@/templates/animus/Correspondence";
import CorrespondenceInception from "@/templates/inception/Correspondence";
import CorrespondenceHeist from "@/templates/heist/Correspondence";
import CorrespondenceChess from "@/templates/chess/Correspondence";
import CorrespondenceTenet from "@/templates/tenet/Correspondence";
import CorrespondenceKeynote from "@/templates/keynote/Correspondence";

export default function Correspondence() {
  const { template } = useTemplate();
  switch (template) {
    case "broadsheet":   return <CorrespondenceBroadsheet />;
    case "surveillance": return <CorrespondenceSurveillance />;
    case "minimal":      return <CorrespondenceMinimal />;
    case "animus":       return <CorrespondenceAnimus />;
    case "inception":    return <CorrespondenceInception />;
    case "heist":        return <CorrespondenceHeist />;
    case "chess":        return <CorrespondenceChess />;
    case "tenet":        return <CorrespondenceTenet />;
    case "keynote":
    case "keynote-tech":
    case "keynote-talk":  return <CorrespondenceKeynote />;
    case "folio":
    default:             return <CorrespondenceFolio />;
  }
}
