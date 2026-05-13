import { useTemplate } from "@/lib/template";
import SiteFooterBroadsheet from "@/templates/broadsheet/SiteFooter";
import SiteFooterSurveillance from "@/templates/surveillance/SiteFooter";

export default function SiteFooter() {
  const { template } = useTemplate();
  if (template === "broadsheet") return <SiteFooterBroadsheet />;
  return <SiteFooterSurveillance />;
}
