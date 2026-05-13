import { useTemplate } from "@/lib/template";
import SkillsMatrixBroadsheet from "@/templates/broadsheet/SkillsMatrix";
import SkillsMatrixSurveillance from "@/templates/surveillance/SkillsMatrix";

export default function SkillsMatrix() {
  const { template } = useTemplate();
  if (template === "broadsheet") return <SkillsMatrixBroadsheet />;
  return <SkillsMatrixSurveillance />;
}
