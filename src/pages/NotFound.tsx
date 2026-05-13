import { useTemplate } from "@/lib/template";
import NotFoundBroadsheet from "@/templates/broadsheet/NotFound";
import NotFoundSurveillance from "@/templates/surveillance/NotFound";

export default function NotFound() {
  const { template } = useTemplate();
  if (template === "broadsheet") return <NotFoundBroadsheet />;
  return <NotFoundSurveillance />;
}
