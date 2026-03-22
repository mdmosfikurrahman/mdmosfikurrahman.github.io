import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 z-50 p-3 rounded-full 
bg-background/80 backdrop-blur border border-border
text-foreground shadow-md
hover:bg-accent hover:text-accent-foreground
transition-all duration-300 ease-out
${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
            aria-label="Scroll to top"
        >
            <ArrowUp className="w-5 h-5" />
        </button>
    );
};

export default ScrollToTopButton;