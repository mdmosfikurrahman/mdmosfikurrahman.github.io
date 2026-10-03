import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { getChatbotEnabled, subscribeSettings } from "@/lib/settings";
import { usePresentation } from "@/lib/presentation";

const R = 19;
const C = 2 * Math.PI * R;

// Floats just above the assistant button once the page has been scrolled. The
// ring fills with reading progress. It steps out of the way while the chat
// window is open, and takes the assistant's place when the assistant is off.
export default function BackToTop() {
  const { open: presenting } = usePresentation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatOn, setChatOn] = useState(() => getChatbotEnabled());

  useEffect(() => subscribeSettings((s) => setChatOn(s.chatbotEnabled)), []);

  useEffect(() => {
    const onChat = (e: Event) => setChatOpen(Boolean((e as CustomEvent<boolean>).detail));
    window.addEventListener("portfolio:chat", onChat);
    return () => window.removeEventListener("portfolio:chat", onChat);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      setVisible(window.scrollY > 480);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const shown = visible && !chatOpen && !presenting;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={`Back to top, ${Math.round(progress * 100)}% read`}
      title="Back to top"
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      className={["fo-totop", chatOn ? "fo-totop--stacked" : "", shown ? "is-shown" : ""].join(" ")}
    >
      <svg className="fo-totop-ring" viewBox="0 0 44 44" aria-hidden>
        <circle className="fo-totop-track" cx="22" cy="22" r={R} />
        <circle
          className="fo-totop-bar"
          cx="22"
          cy="22"
          r={R}
          strokeDasharray={C}
          strokeDashoffset={C * (1 - progress)}
        />
      </svg>
      <ArrowUp size={17} strokeWidth={2.1} className="fo-totop-icon" />
    </button>
  );
}
