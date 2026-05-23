import { useEffect, useState, type ReactNode } from "react";
import { Check, ChevronRight } from "lucide-react";
import { useTemplate, type TemplateId } from "@/lib/template";
import { pushRemoteTemplate, isRemoteConfigured } from "@/lib/templateRemote";

// ----------------------------------------------------------------------------
// Master-detail Templates page — list left, preview right.
// JSONBin connection/master-key live in Settings; this page is purely the
// switcher with a big preview pane.
// ----------------------------------------------------------------------------

export default function AdminTemplates() {
  return <Picker />;
}

type PushStatus =
  | { kind: "idle" }
  | { kind: "pushing"; target: TemplateId }
  | { kind: "ok"; target: TemplateId; at: number }
  | { kind: "err"; target: TemplateId; reason: string };

function Picker() {
  const { template, setTemplate, templates } = useTemplate();
  const [highlighted, setHighlighted] = useState<TemplateId>(template);
  const [pushStatus, setPushStatus] = useState<PushStatus>({ kind: "idle" });

  // keep highlight aligned with live selection if it changed externally
  useEffect(() => {
    setHighlighted(template);
  }, [template]);

  const detail = templates.find((t) => t.id === highlighted) ?? templates[0];
  const isActive = detail.id === template;
  const pushing = pushStatus.kind === "pushing" && pushStatus.target === detail.id;
  const justPushed = pushStatus.kind === "ok" && pushStatus.target === detail.id;
  const lastError = pushStatus.kind === "err" && pushStatus.target === detail.id
    ? pushStatus.reason
    : null;

  const onSelect = async () => {
    setTemplate(detail.id);
    if (!isRemoteConfigured()) {
      setPushStatus({ kind: "ok", target: detail.id, at: Date.now() });
      return;
    }
    setPushStatus({ kind: "pushing", target: detail.id });
    const res = await pushRemoteTemplate(detail.id);
    if (res.kind === "err") {
      setPushStatus({ kind: "err", target: detail.id, reason: res.reason });
    } else {
      setPushStatus({ kind: "ok", target: detail.id, at: Date.now() });
    }
  };

  return (
    <div className="h-full p-4 md:p-5 flex flex-col gap-3 overflow-hidden">
      {/* Top toolbar — replaces the verbose header */}
      <header className="flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 text-[12px]" style={{ color: "hsl(var(--a-ink-muted))" }}>
          <span style={{ color: "hsl(var(--a-ink))" }} className="font-medium">
            {templates.length} templates
          </span>
          <span style={{ color: "hsl(var(--a-border-strong))" }}>·</span>
          <span>Pick the skin every visitor sees.</span>
        </div>
        <ActivePill name={templates.find((t) => t.id === template)?.name ?? template} />
      </header>

      {/* Master-detail layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-3 flex-1 min-h-0">
          {/* LIST */}
          <aside className="a-card overflow-hidden flex flex-col min-h-0">
            <div
              className="px-3 py-2 flex items-center justify-between shrink-0"
              style={{ borderBottom: "1px solid hsl(var(--a-border))" }}
            >
              <span className="a-label text-[10px]">All templates</span>
              <span
                className="text-[11px] tabular-nums"
                style={{ color: "hsl(var(--a-ink-muted))" }}
              >
                {templates.length}
              </span>
            </div>
            <ul role="listbox" className="py-1 flex-1 min-h-0 overflow-y-auto">
              {templates.map((t) => {
                const selected = t.id === highlighted;
                const active = t.id === template;
                return (
                  <li key={t.id} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => setHighlighted(t.id)}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 transition-colors"
                      style={{
                        background: selected ? "hsl(var(--a-accent-wash))" : "transparent",
                        color: selected ? "hsl(var(--a-accent-deep))" : "hsl(var(--a-ink-soft))",
                      }}
                      onMouseEnter={(e) => {
                        if (selected) return;
                        (e.currentTarget as HTMLButtonElement).style.background =
                          "hsl(var(--a-border) / 0.35)";
                      }}
                      onMouseLeave={(e) => {
                        if (selected) return;
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      }}
                    >
                      <span
                        aria-hidden
                        className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                        style={{
                          background: active
                            ? "hsl(var(--a-success))"
                            : "hsl(var(--a-border-strong))",
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div
                          className="text-[13px] font-medium truncate"
                          style={{
                            color: selected ? "hsl(var(--a-accent-deep))" : "hsl(var(--a-ink))",
                          }}
                        >
                          {t.name}
                        </div>
                        <div
                          className="text-[11px] truncate"
                          style={{ color: "hsl(var(--a-ink-muted))" }}
                        >
                          {t.tagline}
                        </div>
                      </div>
                      {active && (
                        <span
                          className="text-[10px] uppercase tracking-[0.08em] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                          style={{
                            background: "hsl(var(--a-success) / 0.1)",
                            color: "hsl(var(--a-success))",
                          }}
                        >
                          Live
                        </span>
                      )}
                      <ChevronRight
                        size={12}
                        strokeWidth={1.8}
                        aria-hidden
                        style={{
                          color: selected ? "hsl(var(--a-accent-deep))" : "hsl(var(--a-ink-faint))",
                        }}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* DETAIL */}
          <section className="a-card p-4 md:p-5 flex flex-col min-h-0 overflow-hidden">
            <header className="flex items-start justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2
                    className="text-[20px] md:text-[22px] font-semibold tracking-[-0.02em] truncate"
                    style={{ color: "hsl(var(--a-ink))" }}
                  >
                    {detail.name}
                  </h2>
                  {isActive && (
                    <span className="a-chip a-chip-success">
                      <Check size={11} strokeWidth={2.6} aria-hidden /> Active
                    </span>
                  )}
                </div>
                <p
                  className="mt-0.5 text-[12.5px] truncate"
                  style={{ color: "hsl(var(--a-ink-soft))" }}
                >
                  {detail.tagline}
                </p>
              </div>
              <div
                className="hidden sm:flex items-center gap-2 text-[11px] shrink-0"
                style={{ color: "hsl(var(--a-ink-muted))" }}
              >
                <span>{detail.era}</span>
                <span aria-hidden style={{ color: "hsl(var(--a-border-strong))" }}>·</span>
                <span>{detail.family}</span>
              </div>
            </header>

            {/* Preview — fills the remaining vertical space */}
            <div className="mt-3 flex-1 min-h-0 overflow-hidden">
              <Preview id={detail.id} />
            </div>

            {/* Description — compact line */}
            <p
              className="mt-3 text-[12.5px] leading-[1.5] line-clamp-2 shrink-0"
              style={{ color: "hsl(var(--a-ink-soft))" }}
            >
              {detail.description}
            </p>

            {/* Footer / actions */}
            <div
              className="mt-3 pt-3 flex items-center justify-between gap-3 flex-wrap shrink-0"
              style={{ borderTop: "1px solid hsl(var(--a-border))" }}
            >
              <div className="text-[11.5px]" style={{ color: "hsl(var(--a-ink-muted))" }}>
                {lastError ? (
                  <span style={{ color: "hsl(var(--a-danger))" }}>
                    Push failed · {lastError}
                  </span>
                ) : justPushed ? (
                  <span style={{ color: "hsl(var(--a-success))" }}>
                    ✓ Live for every visitor on next load.
                  </span>
                ) : isActive ? (
                  <span>Currently live for every visitor.</span>
                ) : (
                  <span>Preview only — press Select to push it live.</span>
                )}
              </div>
              <button
                type="button"
                onClick={onSelect}
                disabled={pushing || (isActive && pushStatus.kind === "idle")}
                className="a-btn a-btn-primary px-4 py-1.5 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pushing ? "Pushing…" :
                 justPushed ? "Pushed ✓" :
                 isActive  ? "Already active" :
                              "Select template"}
              </button>
            </div>
          </section>
        </div>
    </div>
  );
}

// =============================================================================
// pieces
// =============================================================================

function ActivePill({ name }: { name: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{
        background: "hsl(var(--a-accent-wash))",
        border: "1px solid hsl(var(--a-accent) / 0.25)",
      }}
    >
      <span className="a-dot" />
      <span
        className="text-[11px] uppercase tracking-[0.08em] font-semibold"
        style={{ color: "hsl(var(--a-accent-deep))" }}
      >
        Live
      </span>
      <span
        className="text-[13px] font-medium"
        style={{ color: "hsl(var(--a-ink))" }}
      >
        {name}
      </span>
    </div>
  );
}

// =============================================================================
// Preview swatches (unchanged from before)
// =============================================================================

const PreviewFolio = (
  <div className="rounded-[10px] overflow-hidden relative"
       style={{ height: "100%", minHeight: 180, background: "#ffffff", border: "1px solid #e4e4e7" }}>
    <span className="absolute top-5 left-7 text-[12px] font-medium"
          style={{ color: "#2543b0", fontFamily: "Inter, sans-serif" }}>
      Backend architect · Dhaka
    </span>
    <div className="absolute left-7 right-7 top-12"
         style={{ fontFamily: "Inter, sans-serif", fontSize: 34, fontWeight: 600, lineHeight: 1.08, color: "#14181f", letterSpacing: "-0.025em" }}>
      Md. Mosfikur Rahman
    </div>
    <div className="absolute left-7 right-7 top-[110px] text-[13px] leading-[1.55]"
         style={{ color: "#52525b", fontFamily: "Inter, sans-serif" }}>
      Designing the quiet half of software: services, schemas, and workflows, based in Dhaka.
    </div>
    <span className="absolute bottom-5 left-7 right-7 h-px" style={{ background: "#e4e4e7" }} />
    <span className="absolute bottom-5 left-7 text-[12px]"
          style={{ color: "#6b7280", fontFamily: "Inter, sans-serif" }}>
      Experience · Publications · About
    </span>
  </div>
);

const PreviewAnimus = (
  <div className="rounded-[10px] overflow-hidden relative"
       style={{ height: "100%", minHeight: 180, background: "#0b1b2c", border: "1px solid #173249" }}>
    <span className="absolute top-5 left-7 text-[11px] uppercase tracking-[0.32em]"
          style={{ color: "#22d3ee", fontFamily: "Cinzel, serif", fontWeight: 600 }}>
      ✦ Memory Block 0001
    </span>
    <div className="absolute left-7 right-7 top-12 uppercase"
         style={{ fontFamily: "Cinzel, serif", fontSize: 26, fontWeight: 600, letterSpacing: "0.02em", color: "#a5e9f5" }}>
      MD. MOSFIKUR<br />RAHMAN
    </div>
    <span className="absolute top-3 right-3 w-4 h-4" style={{ border: "1px solid #22d3ee", borderRight: 0, borderBottom: 0 }} />
    <span className="absolute bottom-3 left-3 w-4 h-4" style={{ border: "1px solid #22d3ee", borderLeft: 0, borderTop: 0 }} />
    <span className="absolute bottom-5 right-7 text-[11px] uppercase tracking-[0.22em]"
          style={{ color: "#5fa3b8", fontFamily: "Cinzel, serif" }}>
      ✦ Sync 100%
    </span>
  </div>
);

const PreviewInception = (
  <div className="rounded-[10px] overflow-hidden relative"
       style={{
         height: "100%", minHeight: 180,
         background: "#f6f0e6",
         backgroundImage: "linear-gradient(rgba(20,30,60,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20,30,60,0.05) 1px, transparent 1px)",
         backgroundSize: "16px 16px, 16px 16px",
         border: "1px solid #d8d2c4",
       }}>
    <span className="absolute top-5 left-7 text-[11px] uppercase tracking-[0.22em]"
          style={{ color: "#2563eb", fontFamily: "JetBrains Mono, monospace" }}>
      ▾ Level 01 · Surface
    </span>
    <div className="absolute left-7 right-7 top-12"
         style={{ fontFamily: "Inter, sans-serif", fontSize: 34, fontWeight: 600, letterSpacing: "-0.03em", color: "#14233c" }}>
      We build the levels.
    </div>
    <span className="absolute bottom-5 left-7 text-[11px] uppercase tracking-[0.22em]"
          style={{ color: "#2563eb", fontFamily: "JetBrains Mono, monospace" }}>
      plate 01 / 04 · scale 1:1
    </span>
  </div>
);

const PreviewHeist = (
  <div className="rounded-[10px] overflow-hidden relative"
       style={{ height: "100%", minHeight: 180, background: "#f4ebdd", border: "1px solid #cdc3b1" }}>
    <span aria-hidden className="absolute"
          style={{ top: "30%", left: "-10%", right: "-10%", height: 2, background: "#c01a1a", transform: "rotate(-8deg)", opacity: 0.4 }} />
    <span className="absolute top-5 left-7 text-[11.5px] uppercase tracking-[0.28em]"
          style={{ color: "#c01a1a", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
      ● Operation 01
    </span>
    <div className="absolute left-7 right-7 top-12 uppercase"
         style={{ fontFamily: "Inter, sans-serif", fontSize: 30, fontWeight: 800, letterSpacing: "-0.035em", color: "#0a0a0a", lineHeight: 1.0 }}>
      BACKEND,<br /><span style={{ color: "#c01a1a" }}>EXECUTED.</span>
    </div>
    <span className="absolute bottom-5 right-7"
          style={{ fontFamily: "Caveat, cursive", color: "#c01a1a", fontSize: 24, fontWeight: 600 }}>
      Bella Ciao
    </span>
  </div>
);

const PreviewChess = (
  <div className="rounded-[10px] overflow-hidden relative"
       style={{
         height: "100%", minHeight: 180,
         background: "#faf6e9",
         backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
         backgroundSize: "32px 32px",
         border: "1px solid #d8d0b6",
       }}>
    <span className="absolute top-5 left-7 text-[14px]"
          style={{ color: "#a47e1a", fontFamily: "JetBrains Mono, monospace" }}>
      ♔ 1.e4 · Opening
    </span>
    <div className="absolute left-7 right-7 top-12"
         style={{ fontFamily: "Crimson Pro, Georgia, serif", fontSize: 36, fontWeight: 600, letterSpacing: "-0.015em", color: "#0a0a0a" }}>
      Md. Mosfikur Rahman
    </div>
    <span className="absolute bottom-5 left-7"
          style={{ fontFamily: "Crimson Pro, serif", fontStyle: "italic", fontSize: 16, color: "#6b6b6b" }}>
      playing the long game.
    </span>
  </div>
);

const PreviewTenet = (
  <div className="rounded-[10px] overflow-hidden relative"
       style={{ height: "100%", minHeight: 180, background: "#eef1f7", border: "1px solid #cdd2dc" }}>
    <span className="absolute top-5 left-7 text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "#1d6cb0", fontFamily: "JetBrains Mono, monospace" }}>
      ◐ Forward · 2026
    </span>
    <span className="absolute top-5 right-7 text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "#c63a13", fontFamily: "JetBrains Mono, monospace" }}>
      6202 · Reversed ◑
    </span>
    <div className="absolute left-7 right-7 top-12"
         style={{ fontFamily: "Inter, sans-serif", fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em" }}>
      <span style={{ color: "#1d6cb0" }}>Designed</span>{" "}
      <span style={{ color: "#0a0a0a" }}>forward.</span><br />
      <span style={{ color: "#c63a13" }}>Reviewed</span>{" "}
      <span style={{ color: "#0a0a0a" }}>backward.</span>
    </div>
  </div>
);

const PreviewMinimal = (
  <div className="rounded-[10px] overflow-hidden relative"
       style={{ height: "100%", minHeight: 180, background: "#fafaf9", border: "1px solid #e4e4e7" }}>
    <span className="absolute top-5 left-7 text-[12px] font-medium"
          style={{ color: "#0e7490", fontFamily: "Inter, system-ui, sans-serif" }}>
      Backend architect · Dhaka
    </span>
    <div className="absolute left-7 right-7 top-12"
         style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 36, fontWeight: 600, lineHeight: 1.05, color: "#0c0d10", letterSpacing: "-0.03em" }}>
      Hi, I'm Mosfikur.
    </div>
    <span className="absolute bottom-5 left-7 right-7 h-px" style={{ background: "#e4e4e7" }} />
    <span className="absolute bottom-5 left-7 text-[12px]"
          style={{ color: "#71717a", fontFamily: "Inter, system-ui, sans-serif" }}>
      Work · Writing · About
    </span>
  </div>
);

const PreviewBroadsheet = (
  <div className="rounded-[10px] overflow-hidden relative"
       style={{
         height: "100%", minHeight: 180,
         background: "linear-gradient(180deg, hsl(40 22% 96%) 0%, hsl(40 18% 93%) 100%)",
         border: "1px solid hsl(40 14% 86%)",
       }}>
    <span className="absolute top-5 left-7 text-[10.5px] uppercase tracking-[0.22em]"
          style={{ color: "hsl(220 6% 42%)", fontFamily: "JetBrains Mono, monospace" }}>
      13 May 2026 · No. I
    </span>
    <div className="absolute left-7 right-7 top-12"
         style={{ fontFamily: "Fraunces, serif", fontSize: 38, lineHeight: 1.04, color: "hsl(220 14% 10%)", letterSpacing: "-0.025em" }}>
      Engineer <em style={{ color: "hsl(220 6% 42%)", fontWeight: 300 }}>by craft.</em>
    </div>
    <span className="absolute bottom-5 left-7 right-7 h-px"
          style={{ background: "hsl(40 12% 80%)" }} />
    <span className="absolute bottom-5 left-7 text-[10.5px] uppercase tracking-[0.22em]"
          style={{ color: "hsl(16 62% 42%)", fontFamily: "JetBrains Mono, monospace" }}>
      ── SELECTED WORK
    </span>
  </div>
);

const PreviewSurveillance = (
  <div className="rounded-[10px] overflow-hidden relative"
       style={{
         height: "100%", minHeight: 180,
         background: "hsl(24 18% 5%)",
         backgroundImage:
           "repeating-linear-gradient(0deg, hsl(38 92% 64% / 0.07) 0 1px, transparent 1px 3px)",
         border: "1px solid hsl(24 14% 12%)",
       }}>
    <span className="absolute top-5 left-7 text-[10.5px] uppercase tracking-[0.22em] flex items-center gap-1.5"
          style={{ color: "hsl(0 85% 60%)", fontFamily: "JetBrains Mono, monospace" }}>
      <span className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: "hsl(145 80% 55%)" }} />
      LIVE · FEED 14221
    </span>
    <div className="absolute left-7 right-7 top-12"
         style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 28, fontWeight: 600, lineHeight: 1.12, color: "hsl(38 92% 64%)", letterSpacing: "-0.01em" }}>
      <span style={{ color: "hsl(0 85% 60%)" }}>&gt; </span>MD. MOSFIKUR<br />RAHMAN
    </div>
    <span className="absolute top-3 right-3 w-4 h-4"
          style={{ borderTop: "2px solid hsl(0 85% 60%)", borderRight: "2px solid hsl(0 85% 60%)" }} />
    <span className="absolute bottom-3 left-3 w-4 h-4"
          style={{ borderBottom: "2px solid hsl(0 85% 60%)", borderLeft: "2px solid hsl(0 85% 60%)" }} />
    <span className="absolute bottom-5 right-7 text-[10.5px] uppercase tracking-[0.22em]"
          style={{ color: "hsl(38 30% 60%)", fontFamily: "JetBrains Mono, monospace" }}>
      OPERATOR <span style={{ color: "hsl(0 85% 60%)" }}>MACHINE</span>
    </span>
  </div>
);

const PreviewKeynote = (
  <div className="rounded-[10px] overflow-hidden relative"
       style={{ height: "100%", minHeight: 180, background: "#ffffff", border: "1px solid #d9dce6" }}>
    <span className="absolute top-5 left-7 text-[10.5px] uppercase tracking-[0.2em] flex items-center gap-2"
          style={{ color: "#4338ca", fontFamily: "JetBrains Mono, monospace" }}>
      <span className="inline-block w-6 h-[2px]" style={{ background: "#4338ca" }} />
      01 · Title
    </span>
    <span className="absolute top-5 right-7 text-[9px] uppercase tracking-[0.2em]"
          style={{ color: "#9aa0b0", fontFamily: "JetBrains Mono, monospace" }}>
      Interview Deck
    </span>
    <div className="absolute left-7 right-7 top-12"
         style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 40, fontWeight: 700, lineHeight: 0.98, color: "#0d1024", letterSpacing: "-0.04em" }}>
      Md. Mosfikur Rahman
    </div>
    <span className="absolute bottom-5 left-7 text-[11.5px]"
          style={{ color: "#5b6070", fontFamily: "Inter, sans-serif" }}>
      Backend architect · scroll = next slide
    </span>
  </div>
);

const PREVIEWS: Record<TemplateId, ReactNode> = {
  folio:        PreviewFolio,
  broadsheet:   PreviewBroadsheet,
  surveillance: PreviewSurveillance,
  minimal:      PreviewMinimal,
  animus:       PreviewAnimus,
  inception:    PreviewInception,
  heist:        PreviewHeist,
  chess:        PreviewChess,
  tenet:        PreviewTenet,
  keynote:      PreviewKeynote,
  "keynote-tech": PreviewKeynote,
  "keynote-talk": PreviewKeynote,
};

function Preview({ id }: { id: TemplateId }) {
  return <>{PREVIEWS[id] ?? PreviewFolio}</>;
}
