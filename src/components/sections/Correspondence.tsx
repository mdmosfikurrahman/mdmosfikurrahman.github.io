import { useTemplate } from "@/lib/template";
import CorrespondenceBroadsheet from "@/templates/broadsheet/Correspondence";
import CorrespondenceSurveillance from "@/templates/surveillance/Correspondence";

export default function Correspondence() {
  const { template } = useTemplate();
  if (template === "broadsheet") return <CorrespondenceBroadsheet />;
  return <CorrespondenceSurveillance />;
}
