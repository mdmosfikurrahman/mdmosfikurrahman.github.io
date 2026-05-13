import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageBook } from "@/components/PageBook";
import SiteWatermark from "@/components/SiteWatermark";
import ScanlineOverlay from "@/components/ScanlineOverlay";
import BootSequence from "@/components/BootSequence";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import SiteGuards from "@/components/SiteGuards";
import { useTemplate } from "@/lib/template";
import Index from "./pages/Index";
import Experience from "./pages/Experience";
import Publications from "./pages/Publications";
import About from "./pages/About";
import Special from "./pages/Special";
import NotFound from "./pages/NotFound";
import AdminTemplates from "./pages/AdminTemplates";
import { profile } from "@/lib/content";

const queryClient = new QueryClient();

function ScrollToTopOnNav() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);
  return null;
}

// For absolute URLs where react-router's <Navigate> can't help.
function ExternalRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return null;
}

// Renders template-specific chrome (boot, scanlines, etc.) only where it fits.
function TemplateChrome() {
  const { template } = useTemplate();
  if (template !== "surveillance") return null;
  return (
    <>
      <ScanlineOverlay />
      <BootSequence />
    </>
  );
}

// Global keyboard chord: shift+T+T opens the hidden admin page.
function TemplateChord() {
  const navigate = useNavigateLazy();
  useEffect(() => {
    let lastT = 0;
    const handler = (e: KeyboardEvent) => {
      if (!e.shiftKey) return;
      if (e.key !== "T" && e.key !== "t") return;
      const now = Date.now();
      if (now - lastT < 600) {
        navigate("/admin/templates");
        lastT = 0;
      } else {
        lastT = now;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);
  return null;
}

function useNavigateLazy() {
  // useNavigate must be called inside Router; this just inlines it.
  return useNavigate();
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <PageBook>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/about" element={<About />} />
        <Route path="/play" element={<Special />} />
        <Route path="/admin/templates" element={<AdminTemplates />} />
        <Route path="/cv" element={<ExternalRedirect to={profile.cvUrl} />} />
        <Route path="/resume" element={<ExternalRedirect to={profile.cvUrl} />} />
        <Route path="/publication-list" element={<Navigate to="/publications" replace />} />
        <Route path="/yearbook" element={<Navigate to="/about" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageBook>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SiteGuards />
        <ScrollToTopOnNav />
        <SiteWatermark />
        <TemplateChrome />
        <div className="relative z-10">
          <AnimatedRoutes />
        </div>
        <ScrollToTopButton />
        <TemplateChord />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
