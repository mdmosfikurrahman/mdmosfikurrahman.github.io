import { useTemplate } from "@/lib/template";
import SelectedWorkBroadsheet from "@/templates/broadsheet/SelectedWork";
import SelectedWorkSurveillance from "@/templates/surveillance/SelectedWork";

export default function SelectedWork() {
  const { template } = useTemplate();
  if (template === "broadsheet") return <SelectedWorkBroadsheet />;
  return <SelectedWorkSurveillance />;
}
