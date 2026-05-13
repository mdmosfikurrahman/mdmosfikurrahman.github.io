import { useTemplate } from "@/lib/template";
import HeroBroadsheet from "@/templates/broadsheet/Hero";
import HeroSurveillance from "@/templates/surveillance/Hero";

export default function Hero() {
  const { template } = useTemplate();
  if (template === "broadsheet") return <HeroBroadsheet />;
  return <HeroSurveillance />;
}
