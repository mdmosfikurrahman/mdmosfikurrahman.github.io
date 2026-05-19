import { useTemplate } from "@/lib/template";
import HeroFolio from "@/templates/folio/Hero";
import HeroBroadsheet from "@/templates/broadsheet/Hero";
import HeroSurveillance from "@/templates/surveillance/Hero";
import HeroMinimal from "@/templates/minimal/Hero";
import HeroAnimus from "@/templates/animus/Hero";
import HeroInception from "@/templates/inception/Hero";
import HeroHeist from "@/templates/heist/Hero";
import HeroChess from "@/templates/chess/Hero";
import HeroTenet from "@/templates/tenet/Hero";
import HeroKeynote from "@/templates/keynote/Hero";

export default function Hero() {
  const { template } = useTemplate();
  switch (template) {
    case "broadsheet":   return <HeroBroadsheet />;
    case "surveillance": return <HeroSurveillance />;
    case "minimal":      return <HeroMinimal />;
    case "animus":       return <HeroAnimus />;
    case "inception":    return <HeroInception />;
    case "heist":        return <HeroHeist />;
    case "chess":        return <HeroChess />;
    case "tenet":        return <HeroTenet />;
    case "keynote":      return <HeroKeynote />;
    case "folio":
    default:             return <HeroFolio />;
  }
}
