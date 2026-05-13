import { useTemplate } from "@/lib/template";
import SkillsMatrixFolio from "@/templates/folio/SkillsMatrix";
import SkillsMatrixBroadsheet from "@/templates/broadsheet/SkillsMatrix";
import SkillsMatrixSurveillance from "@/templates/surveillance/SkillsMatrix";
import SkillsMatrixMinimal from "@/templates/minimal/SkillsMatrix";
import SkillsMatrixAnimus from "@/templates/animus/SkillsMatrix";
import SkillsMatrixInception from "@/templates/inception/SkillsMatrix";
import SkillsMatrixHeist from "@/templates/heist/SkillsMatrix";
import SkillsMatrixChess from "@/templates/chess/SkillsMatrix";
import SkillsMatrixTenet from "@/templates/tenet/SkillsMatrix";

export default function SkillsMatrix() {
  const { template } = useTemplate();
  switch (template) {
    case "broadsheet":   return <SkillsMatrixBroadsheet />;
    case "surveillance": return <SkillsMatrixSurveillance />;
    case "minimal":      return <SkillsMatrixMinimal />;
    case "animus":       return <SkillsMatrixAnimus />;
    case "inception":    return <SkillsMatrixInception />;
    case "heist":        return <SkillsMatrixHeist />;
    case "chess":        return <SkillsMatrixChess />;
    case "tenet":        return <SkillsMatrixTenet />;
    case "folio":
    default:             return <SkillsMatrixFolio />;
  }
}
