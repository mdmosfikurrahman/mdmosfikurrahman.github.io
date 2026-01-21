import { Code } from "lucide-react";
import { techIconMap } from "@/components/TechIcons";

export function IconPill({ label }: { label: string }) {
    return (
        <span className="px-2 py-1 bg-gray-100 rounded-md text-sm flex items-center gap-1.5">
      {techIconMap[label] ?? <Code className="w-4 h-4" />}
            {label}
    </span>
    );
}
