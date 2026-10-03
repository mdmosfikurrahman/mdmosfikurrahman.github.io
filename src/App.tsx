import { useCallback, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageBook } from "@/components/PageBook";
import Chatbot from "@/components/Chatbot";
import BackToTop from "@/components/BackToTop";
import Terminal from "@/components/Terminal";
import SiteGuards from "@/components/SiteGuards";
import PresentationDeck from "@/components/PresentationDeck";
import PresentLauncher from "@/components/PresentLauncher";
import AdminModal, { type AdminSection } from "@/components/admin/AdminModal";
import { recordPageView } from "@/lib/analytics";
import { syncRemoteSettings } from "@/lib/remote";
import { lensFromParam, setLens } from "@/lib/lens";
import { useCvUrl } from "@/lib/settings";
import Home from "./pages/Home";
import Work from "./pages/Work";
import CaseStudy from "./pages/CaseStudy";
import Experience from "./pages/Experience";
import Publications from "./pages/Publications";
import About from "./pages/About";
import Hire from "./pages/Hire";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ADMIN_SECTIONS: AdminSection[] = ["dashboard", "settings"];

function ScrollToTopOnNav() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);
  return null;
}

function ExternalRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return null;
}

function AnalyticsBeacon() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    void recordPageView(pathname + search);
  }, [pathname, search]);
  return null;
}

// A shared link can carry ?for=research or ?for=industry; it sets the lens the
// home page and the header read.
function LensFromUrl() {
  const { search } = useLocation();
  useEffect(() => {
    const next = lensFromParam(new URLSearchParams(search).get("for"));
    if (next) setLens(next);
  }, [search]);
  return null;
}

// /admin/* deep-links redirect to / and open the modal at the right tab.
function AdminRedirect({ section }: { section: AdminSection }) {
  const navigate = useNavigate();
  useEffect(() => {
    sessionStorage.setItem("portfolio.admin.openOnLoad", section);
    navigate("/", { replace: true });
  }, [navigate, section]);
  return null;
}

function AppInner() {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminSection, setAdminSection] = useState<AdminSection>("dashboard");

  const openAdmin = useCallback((section?: AdminSection) => {
    if (section) setAdminSection(section);
    setAdminOpen(true);
  }, []);

  // The CV link, the freelance switch and its links, as published by the admin.
  useEffect(() => {
    void syncRemoteSettings();
  }, []);

  // A deferred open-on-load request from an /admin/* redirect.
  useEffect(() => {
    const deferred = sessionStorage.getItem("portfolio.admin.openOnLoad");
    if (deferred) {
      sessionStorage.removeItem("portfolio.admin.openOnLoad");
      const s = (ADMIN_SECTIONS as string[]).includes(deferred) ? (deferred as AdminSection) : "dashboard";
      openAdmin(s);
    }
  }, [openAdmin]);

  // location.hash like #admin or #admin/settings
  useEffect(() => {
    if (!location.hash.startsWith("#admin")) return;
    const part = location.hash.slice(6).replace(/^\//, "");
    const s = (ADMIN_SECTIONS as string[]).includes(part) ? (part as AdminSection) : "dashboard";
    openAdmin(s);
    navigate(location.pathname + location.search, { replace: true });
  }, [location.hash, location.pathname, location.search, navigate, openAdmin]);

  // Starting a presentation from the Studio console hands the screen to the deck.
  useEffect(() => {
    const close = () => setAdminOpen(false);
    window.addEventListener("portfolio:present-start", close);
    return () => window.removeEventListener("portfolio:present-start", close);
  }, []);

  // Shift+T+T chord opens the admin modal, no navigation.
  useEffect(() => {
    let lastT = 0;
    const handler = (e: KeyboardEvent) => {
      if (!e.shiftKey) return;
      if (e.key !== "T" && e.key !== "t") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const now = Date.now();
      if (now - lastT < 600) {
        e.preventDefault();
        openAdmin();
        lastT = 0;
      } else {
        lastT = now;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openAdmin]);

  return (
    <>
      <SiteGuards />
      <ScrollToTopOnNav />
      <AnalyticsBeacon />
      <LensFromUrl />
      <div className="relative z-10">
        <AnimatedRoutes />
      </div>
      <PresentLauncher />
      <PresentationDeck />
      <BackToTop />
      <Chatbot />
      <Terminal />
      <AdminModal open={adminOpen} initialSection={adminSection} onClose={() => setAdminOpen(false)} />
    </>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const cvUrl = useCvUrl();
  return (
    <PageBook>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/research" element={<Navigate to="/publications" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/hire" element={<Hire />} />

        <Route path="/admin" element={<AdminRedirect section="dashboard" />} />
        <Route path="/admin/dashboard" element={<AdminRedirect section="dashboard" />} />
        <Route path="/admin/settings" element={<AdminRedirect section="settings" />} />

        <Route path="/cv" element={<ExternalRedirect to={cvUrl} />} />
        <Route path="/resume" element={<ExternalRedirect to={cvUrl} />} />
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
        <AppInner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
