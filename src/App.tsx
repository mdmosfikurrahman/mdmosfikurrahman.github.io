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
import SiteWatermark from "@/components/SiteWatermark";
import ScanlineOverlay from "@/components/ScanlineOverlay";
import BootSequence from "@/components/BootSequence";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import Chatbot from "@/components/Chatbot";
import Terminal from "@/components/Terminal";
import SiteGuards from "@/components/SiteGuards";
import AdminModal, { type AdminSection } from "@/components/admin/AdminModal";
import { useTemplate } from "@/lib/template";
import { recordPageView } from "@/lib/analytics";
import Index from "./pages/Index";
import Experience from "./pages/Experience";
import Publications from "./pages/Publications";
import About from "./pages/About";
import Special from "./pages/Special";
import Guestbook from "./pages/Guestbook";
import QandA from "./pages/QandA";
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

function ExternalRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return null;
}

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

function AnalyticsBeacon() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    void recordPageView(pathname + search);
  }, [pathname, search]);
  return null;
}

// /admin/* deep-links now redirect to / and open the modal at the right tab.
function AdminRedirect({ section }: { section: AdminSection }) {
  const navigate = useNavigate();
  useEffect(() => {
    sessionStorage.setItem("portfolio.admin.openOnLoad", section);
    navigate("/", { replace: true });
  }, [navigate, section]);
  return null;
}

// Top-level App with admin modal hoisted to global scope.
function AppInner() {
  const navigate = useNavigate();
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminSection, setAdminSection] = useState<AdminSection>("dashboard");

  // Open admin modal: by deep-link request, by Shift+T+T chord, or by hash.
  const openAdmin = useCallback((section?: AdminSection) => {
    if (section) setAdminSection(section);
    setAdminOpen(true);
  }, []);

  // Honour any deferred open-on-load request (from /admin/* redirect).
  useEffect(() => {
    const deferred = sessionStorage.getItem("portfolio.admin.openOnLoad");
    if (deferred) {
      sessionStorage.removeItem("portfolio.admin.openOnLoad");
      const valid: AdminSection[] = ["dashboard", "templates", "guestbook", "qanda", "settings"];
      const s = (valid as string[]).includes(deferred) ? (deferred as AdminSection) : "dashboard";
      openAdmin(s);
    }
  }, [openAdmin]);

  // Honour location.hash like #admin or #admin/settings
  const location = useLocation();
  useEffect(() => {
    if (!location.hash.startsWith("#admin")) return;
    const part = location.hash.slice(6).replace(/^\//, ""); // 'settings' / 'templates' / ''
    const valid: AdminSection[] = ["dashboard", "templates", "guestbook", "qanda", "settings"];
    const s = (valid as string[]).includes(part) ? (part as AdminSection) : "dashboard";
    openAdmin(s);
    navigate(location.pathname + location.search, { replace: true });
  }, [location.hash, location.pathname, location.search, navigate, openAdmin]);

  // Shift+T+T chord — opens modal, no navigation.
  useEffect(() => {
    let lastT = 0;
    const handler = (e: KeyboardEvent) => {
      if (!e.shiftKey) return;
      if (e.key !== "T" && e.key !== "t") return;
      // Don't fire while typing in inputs / textareas / contenteditable.
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
      <SiteWatermark />
      <TemplateChrome />
      <AnalyticsBeacon />
      <div className="relative z-10">
        <AnimatedRoutes />
      </div>
      <ScrollToTopButton />
      <Chatbot />
      <Terminal />
      <AdminModal
        open={adminOpen}
        initialSection={adminSection}
        onClose={() => setAdminOpen(false)}
      />
    </>
  );
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
        <Route path="/guestbook" element={<Guestbook />} />
        <Route path="/ask" element={<QandA />} />

        {/* Admin deep-links now route through the modal. */}
        <Route path="/admin" element={<AdminRedirect section="dashboard" />} />
        <Route path="/admin/dashboard" element={<AdminRedirect section="dashboard" />} />
        <Route path="/admin/templates" element={<AdminRedirect section="templates" />} />
        <Route path="/admin/guestbook" element={<AdminRedirect section="guestbook" />} />
        <Route path="/admin/qanda" element={<AdminRedirect section="qanda" />} />
        <Route path="/admin/settings" element={<AdminRedirect section="settings" />} />

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
        <AppInner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
