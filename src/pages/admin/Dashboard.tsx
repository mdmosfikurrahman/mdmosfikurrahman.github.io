import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Globe,
  MonitorSmartphone,
  RefreshCw,
  Users,
} from "lucide-react";
import { fetchVisits, summarise, type VisitSummary } from "@/lib/analytics";
import { isBinConfigured, type VisitEntry } from "@/lib/binStore";

const AUTO_REFRESH_MS = 30_000;

export default function Dashboard() {
  const [visits, setVisits] = useState<VisitEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastFetchAt, setLastFetchAt] = useState<number | null>(null);

  const load = async () => {
    setRefreshing(true);
    const data = await fetchVisits();
    setVisits(data);
    setLastFetchAt(Date.now());
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = window.setInterval(() => void load(), AUTO_REFRESH_MS);
    return () => window.clearInterval(id);
  }, [autoRefresh]);

  const summary: VisitSummary = useMemo(() => summarise(visits), [visits]);

  return (
    <div className="h-full flex flex-col gap-3 p-4 md:p-5 overflow-hidden">
      {/* Toolbar (no page header — modal tab already labels this section) */}
      <header className="flex items-center justify-between gap-3 flex-wrap shrink-0">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold"
            style={{ color: "hsl(var(--a-success))" }}
          >
            <LivePulse /> LIVE
          </span>
          <span className="text-[12px]" style={{ color: "hsl(var(--a-ink-muted))" }}>
            Visitor analytics · client-side capture · bots excluded
          </span>
          {lastFetchAt && (
            <span className="text-[11.5px]" style={{ color: "hsl(var(--a-ink-faint))" }}>
              · updated {fmtRel(new Date(lastFetchAt).toISOString())}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label
            className="inline-flex items-center gap-2 text-[12px] cursor-pointer select-none"
            style={{ color: "hsl(var(--a-ink-soft))" }}
          >
            <span
              className="relative w-8 h-[18px] rounded-full transition-colors"
              style={{ background: autoRefresh ? "hsl(var(--a-accent))" : "hsl(var(--a-border))" }}
            >
              <span
                className="absolute top-[2px] w-[14px] h-[14px] rounded-full transition-all"
                style={{
                  background: "white",
                  left: autoRefresh ? "16px" : "2px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.18)",
                }}
              />
            </span>
            <input
              type="checkbox"
              className="sr-only"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto
          </label>
          <button onClick={() => void load()} className="a-btn a-btn-ghost py-1.5 px-2.5 text-[12px]">
            <RefreshCw
              size={12}
              strokeWidth={1.9}
              style={{ animation: refreshing ? "a-spin 0.85s linear infinite" : undefined }}
              aria-hidden
            />
            <span>{refreshing ? "Refreshing" : "Refresh"}</span>
          </button>
        </div>
      </header>

      {!isBinConfigured() && (
        <div
          className="px-3 py-2 rounded-[8px] text-[12px] shrink-0"
          style={{ background: "hsl(var(--a-warn) / 0.08)", color: "hsl(var(--a-warn))" }}
        >
          JSONBin not configured. Set <code className="a-code">VITE_JSONBIN_ID</code> in{" "}
          <code className="a-code">.env</code>.
        </div>
      )}

      {/* KPI row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-2 shrink-0">
        <Kpi
          label="Page views"
          value={loading ? "…" : fmtCount(summary.total)}
          sub={summary.sessions ? `${fmtCount(summary.sessions)} sessions` : "all-time"}
          Icon={Activity}
          spark={summary.byDay.map((d) => d.count)}
        />
        <Kpi
          label="Unique IPs"
          value={loading ? "…" : fmtCount(summary.uniqueIps)}
          sub={
            summary.total
              ? `${Math.round((summary.uniqueIps / summary.total) * 100)}% of visits`
              : "—"
          }
          Icon={Users}
          spark={uniqueIpsByDay(visits)}
        />
        <Kpi
          label="Top country"
          value={
            loading
              ? "…"
              : summary.byCountry[0]
              ? `${countryFlag(summary.byCountry[0].code)} ${summary.byCountry[0].name}`
              : "—"
          }
          sub={summary.byCountry[0] ? `${summary.byCountry[0].count} visits` : undefined}
          Icon={Globe}
        />
        <Kpi
          label="Top device"
          value={loading ? "…" : summary.byDevice[0]?.name ?? "—"}
          sub={
            summary.byDevice[0] && summary.total
              ? `${Math.round((summary.byDevice[0].count / summary.total) * 100)}% of visits`
              : undefined
          }
          Icon={MonitorSmartphone}
        />
      </section>

      {/* Middle row — chart (left) + recent visits (right) */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-3 min-h-0 flex-1">
        <FourteenDayChart byDay={summary.byDay} />
        <RecentVisits visits={visits} />
      </section>

      {/* Bottom row — five tiny breakdowns */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 shrink-0 min-h-0">
        <MiniBreakdown title="Country" rows={summary.byCountry.slice(0, 4)} flag />
        <MiniBreakdown title="Device" rows={summary.byDevice.slice(0, 4)} />
        <MiniBreakdown title="Browser" rows={summary.byBrowser.slice(0, 4)} />
        <MiniBreakdown title="OS" rows={summary.byOS.slice(0, 4)} />
        <MiniBreakdown title="Top paths" rows={summary.byPath.slice(0, 4)} mono />
      </section>
    </div>
  );
}

// =============================================================================
// pieces
// =============================================================================

function Kpi({
  label,
  value,
  sub,
  Icon,
  spark,
}: {
  label: string;
  value: string;
  sub?: string;
  Icon: typeof Activity;
  spark?: number[];
}) {
  return (
    <div className="a-card p-3 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="a-label text-[10px]">{label}</span>
        <span
          className="w-6 h-6 rounded-md grid place-items-center"
          style={{ background: "hsl(var(--a-accent-wash))" }}
        >
          <Icon
            size={12}
            strokeWidth={1.8}
            style={{ color: "hsl(var(--a-accent-deep))" }}
            aria-hidden
          />
        </span>
      </div>
      <div
        className="mt-1 text-[20px] md:text-[22px] font-semibold tracking-[-0.02em] leading-tight truncate"
        style={{ color: "hsl(var(--a-ink))" }}
        title={value}
      >
        {value}
      </div>
      <div className="mt-0.5 flex items-baseline justify-between gap-2">
        {sub && (
          <span className="text-[10.5px] truncate" style={{ color: "hsl(var(--a-ink-muted))" }}>
            {sub}
          </span>
        )}
        {spark && spark.length > 0 && (
          <div className="ml-auto">
            <Sparkline values={spark} />
          </div>
        )}
      </div>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(1, ...values);
  return (
    <div className="flex items-end gap-[2px] h-[18px] w-[64px]">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-[1.5px]"
          style={{
            height: `${(v / max) * 100}%`,
            minHeight: v > 0 ? "2px" : "1px",
            background: v === 0 ? "hsl(var(--a-border))" : "hsl(var(--a-accent) / 0.7)",
          }}
        />
      ))}
    </div>
  );
}

function FourteenDayChart({ byDay }: { byDay: { day: string; count: number }[] }) {
  const max = Math.max(1, ...byDay.map((d) => d.count));
  const total = byDay.reduce((s, d) => s + d.count, 0);
  return (
    <div className="a-card p-4 flex flex-col min-h-0">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <div className="text-[12.5px] font-semibold tracking-tight" style={{ color: "hsl(var(--a-ink))" }}>
            Last 14 days
          </div>
          <div className="text-[10.5px] mt-0.5" style={{ color: "hsl(var(--a-ink-muted))" }}>
            {total} visits · peak {max}
          </div>
        </div>
      </div>
      <div className="flex-1 mt-3 flex items-end gap-1 min-h-0">
        {byDay.map((d) => {
          const pct = (d.count / max) * 100;
          return (
            <div
              key={d.day}
              className="flex-1 flex flex-col items-center justify-end gap-1 group min-h-0"
              title={`${d.day} · ${d.count} visits`}
            >
              <div
                className="text-[9px] tabular-nums opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: "hsl(var(--a-ink-soft))" }}
              >
                {d.count}
              </div>
              <div
                className="w-full rounded-[3px] transition-all"
                style={{
                  height: `${pct}%`,
                  minHeight: d.count > 0 ? "4px" : "2px",
                  background: d.count === 0 ? "hsl(var(--a-border))" : "hsl(var(--a-accent))",
                  opacity: d.count === 0 ? 0.5 : 1,
                }}
              />
              <span className="text-[8.5px] tabular-nums" style={{ color: "hsl(var(--a-ink-faint))" }}>
                {d.day.slice(8)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecentVisits({ visits }: { visits: VisitEntry[] }) {
  const rows = visits.slice().reverse().slice(0, 8);
  return (
    <div className="a-card flex flex-col min-h-0 overflow-hidden">
      <header
        className="px-4 py-2.5 flex items-baseline justify-between shrink-0"
        style={{ borderBottom: "1px solid hsl(var(--a-border))" }}
      >
        <div className="text-[12.5px] font-semibold tracking-tight" style={{ color: "hsl(var(--a-ink))" }}>
          Recent visits
        </div>
        <div className="text-[10.5px]" style={{ color: "hsl(var(--a-ink-muted))" }}>
          showing {rows.length} of {visits.length}
        </div>
      </header>
      <div className="flex-1 overflow-y-auto min-h-0">
        {rows.length === 0 ? (
          <div className="p-4 text-[12px]" style={{ color: "hsl(var(--a-ink-muted))" }}>
            No data yet.
          </div>
        ) : (
          <ul>
            {rows.map((v, i) => (
              <li
                key={`${v.ts}-${i}`}
                className="px-4 py-2 flex items-center gap-2.5 text-[11.5px] a-row-hover"
                style={{
                  borderBottom: "1px solid hsl(var(--a-border) / 0.5)",
                  background: i % 2 ? "transparent" : "hsl(var(--a-border) / 0.12)",
                }}
              >
                <span className="shrink-0 tabular-nums w-[44px]" style={{ color: "hsl(var(--a-ink-muted))" }}>
                  {fmtRel(v.ts)}
                </span>
                <span className="shrink-0 w-[5px] text-[14px] leading-none">
                  {countryFlag(v.countryCode) || "•"}
                </span>
                <span className="shrink-0 truncate min-w-0 max-w-[120px]" style={{ color: "hsl(var(--a-ink))" }}>
                  {v.city || v.country || "—"}
                </span>
                <span className="shrink-0 text-[10.5px] px-1.5 py-0.5 rounded"
                      style={{ background: "hsl(var(--a-border) / 0.5)", color: "hsl(var(--a-ink-soft))" }}>
                  {v.device}
                </span>
                <span className="ml-auto shrink-0 font-mono text-[10.5px] truncate max-w-[110px]"
                      style={{ color: "hsl(var(--a-ink-soft))" }}
                      title={v.path}>
                  {v.path}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function MiniBreakdown({
  title,
  rows,
  flag,
  mono,
}: {
  title: string;
  rows: { name: string; count: number; code?: string }[];
  flag?: boolean;
  mono?: boolean;
}) {
  const max = rows[0]?.count ?? 1;
  return (
    <div className="a-card p-3 min-h-0 overflow-hidden">
      <div
        className="text-[10.5px] uppercase tracking-[0.08em] font-semibold mb-2 truncate"
        style={{ color: "hsl(var(--a-ink-muted))" }}
      >
        {title}
      </div>
      <ul className="space-y-1">
        {rows.length === 0 && (
          <li className="text-[11px]" style={{ color: "hsl(var(--a-ink-faint))" }}>
            —
          </li>
        )}
        {rows.map((r) => {
          const pct = Math.max(8, Math.round((r.count / max) * 100));
          return (
            <li key={r.name} className="relative h-5 rounded overflow-hidden"
                style={{ background: "hsl(var(--a-border) / 0.3)" }}
                title={`${r.name} · ${r.count}`}>
              <div className="absolute inset-y-0 left-0 rounded"
                   style={{
                     width: `${pct}%`,
                     background: "hsl(var(--a-accent) / 0.18)",
                     borderRight: "1.5px solid hsl(var(--a-accent))",
                   }} />
              <div className="absolute inset-0 flex items-center justify-between px-1.5">
                <span className={["text-[10.5px] truncate", mono ? "font-mono" : ""].join(" ")}
                      style={{ color: "hsl(var(--a-ink))" }}>
                  {flag && r.code ? `${countryFlag(r.code)} ` : ""}{r.name}
                </span>
                <span className="text-[10px] tabular-nums shrink-0 ml-1"
                      style={{ color: "hsl(var(--a-ink-soft))" }}>
                  {r.count}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function LivePulse() {
  return (
    <span className="relative inline-flex w-2 h-2">
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: "hsl(var(--a-success))",
          animation: "a-live-pulse 1.8s ease-out infinite",
        }}
      />
      <span className="relative w-2 h-2 rounded-full"
            style={{ background: "hsl(var(--a-success))" }} />
    </span>
  );
}

// =============================================================================
// helpers
// =============================================================================

function fmtRel(iso: string): string {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return iso;
  const diff = Date.now() - t;
  const s = Math.round(diff / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  return `${d}d`;
}

function fmtCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function countryFlag(code?: string): string {
  if (!code || code.length !== 2) return "";
  const upper = code.toUpperCase();
  return upper.replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

function uniqueIpsByDay(visits: VisitEntry[]): number[] {
  const buckets = new Map<string, Set<string>>();
  const now = Date.now();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000);
    buckets.set(toDayKey(d), new Set());
  }
  for (const v of visits) {
    const k = toDayKey(new Date(v.ts));
    const set = buckets.get(k);
    if (set && v.ip) set.add(v.ip);
  }
  return Array.from(buckets.values()).map((s) => s.size);
}

function toDayKey(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
