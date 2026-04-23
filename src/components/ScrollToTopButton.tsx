import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      title="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={[
        "fixed bottom-5 right-5 md:bottom-8 md:right-8 z-40",
        "w-11 h-11 grid place-items-center",
        "border rule bg-paper/90 backdrop-blur-sm text-ink",
        "shadow-[0_1px_0_hsl(var(--ink)/0.04),0_10px_24px_-14px_hsl(var(--ink)/0.35)]",
        "hover:bg-ink hover:text-paper hover:border-ink",
        "transition-all duration-200 ease-out print:hidden",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-2 pointer-events-none",
      ].join(" ")}
    >
      <ArrowUp size={16} strokeWidth={1.6} aria-hidden />
    </button>
  );
}
