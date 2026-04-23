import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageBook } from "@/components/PageBook";
import SiteWatermark from "@/components/SiteWatermark";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import SiteGuards from "@/components/SiteGuards";
import Index from "./pages/Index";
import Experience from "./pages/Experience";
import Publications from "./pages/Publications";
import About from "./pages/About";
import Special from "./pages/Special";
import NotFound from "./pages/NotFound";
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
        <div className="relative z-10">
          <AnimatedRoutes />
        </div>
        <ScrollToTopButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
