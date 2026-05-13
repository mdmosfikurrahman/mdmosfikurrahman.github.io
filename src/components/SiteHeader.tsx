import { useTemplate } from "@/lib/template";
import SiteHeaderBroadsheet from "@/templates/broadsheet/SiteHeader";
import SiteHeaderSurveillance from "@/templates/surveillance/SiteHeader";

export default function SiteHeader() {
  const { template } = useTemplate();
  if (template === "broadsheet") return <SiteHeaderBroadsheet />;
  return <SiteHeaderSurveillance />;
}
