import { useTemplate } from "@/lib/template";
import SelectedWorkFolio from "@/templates/folio/SelectedWork";
import SelectedWorkBroadsheet from "@/templates/broadsheet/SelectedWork";
import SelectedWorkSurveillance from "@/templates/surveillance/SelectedWork";
import SelectedWorkMinimal from "@/templates/minimal/SelectedWork";
import SelectedWorkAnimus from "@/templates/animus/SelectedWork";
import SelectedWorkInception from "@/templates/inception/SelectedWork";
import SelectedWorkHeist from "@/templates/heist/SelectedWork";
import SelectedWorkChess from "@/templates/chess/SelectedWork";
import SelectedWorkTenet from "@/templates/tenet/SelectedWork";

export default function SelectedWork() {
  const { template } = useTemplate();
  switch (template) {
    case "broadsheet":   return <SelectedWorkBroadsheet />;
    case "surveillance": return <SelectedWorkSurveillance />;
    case "minimal":      return <SelectedWorkMinimal />;
    case "animus":       return <SelectedWorkAnimus />;
    case "inception":    return <SelectedWorkInception />;
    case "heist":        return <SelectedWorkHeist />;
    case "chess":        return <SelectedWorkChess />;
    case "tenet":        return <SelectedWorkTenet />;
    case "folio":
    default:             return <SelectedWorkFolio />;
  }
}
