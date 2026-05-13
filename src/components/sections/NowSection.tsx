import { useTemplate } from "@/lib/template";
import NowSectionBroadsheet from "@/templates/broadsheet/NowSection";
import NowSectionSurveillance from "@/templates/surveillance/NowSection";

export default function NowSection() {
  const { template } = useTemplate();
  if (template === "broadsheet") return <NowSectionBroadsheet />;
  return <NowSectionSurveillance />;
}
