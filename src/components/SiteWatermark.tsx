import { useTemplate } from "@/lib/template";
import SiteWatermarkBroadsheet from "@/templates/broadsheet/SiteWatermark";
import SiteWatermarkSurveillance from "@/templates/surveillance/SiteWatermark";

export default function SiteWatermark() {
  const { template } = useTemplate();
  if (template === "broadsheet") return <SiteWatermarkBroadsheet />;
  return <SiteWatermarkSurveillance />;
}
