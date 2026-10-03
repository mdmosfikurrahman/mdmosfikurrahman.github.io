import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Activity,
  AlertTriangle,
  Globe,
  MonitorSmartphone,
  RefreshCw,
  Users,
} from "lucide-react";
import { fetchVisits, summarise, type VisitSummary } from "@/lib/analytics";
import { isBinConfigured, type VisitEntry } from "@/lib/binStore";

const AUTO_REFRESH_MS = 30_000;

// `actionsSlot` is the console's top bar; the refresh controls render there.
export default function Dashboard({ actionsSlot }: { actionsSlot?: HTMLElement | null }) {
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

  const controls = (
    <div className="sc-actions">
      <span className="sc-live" title="Visitor analytics, captured in the browser, bots excluded">
        <span className="sc-dot" aria-hidden />
        Live
        {lastFetchAt && (
          <span className="sc-live-time">· updated {fmtRel(new Date(lastFetchAt).toISOString())} ago</span>
        )}
      </span>
      <label className="sc-switch" title="Refresh every 30 seconds">
        <input
          type="checkbox"
          role="switch"
          className="sc-switch-input"
          checked={autoRefresh}
          onChange={(e) => setAutoRefresh(e.target.checked)}
          aria-label="Auto refresh"
        />
        <span className="sc-switch-track" aria-hidden />
        <span className="sc-switch-text">Auto</span>
      </label>
      <button
        type="button"
        onClick={() => void load()}
        className="sc-btn sc-btn--outline sc-btn--sm sc-refresh"
        title="Refresh now"
      >
        <RefreshCw size={14} strokeWidth={1.9} className={refreshing ? "sc-spin" : undefined} aria-hidden />
        <span className="sc-btn-text">{refreshing ? "Refreshing" : "Refresh"}</span>
      </button>
    </div>
  );

  return (
    <div className="sc-page">
      {actionsSlot ? createPortal(controls, actionsSlot) : controls}

      {!isBinConfigured() && (
        <div className="sc-callout">
          <AlertTriangle size={15} strokeWidth={2} aria-hidden />
          <span>
            JSONBin is not configured. Set <code className="sc-code">VITE_JSONBIN_ID</code> in{" "}
            <code className="sc-code">.env</code>.
          </span>
        </div>
      )}

      <section className="sc-kpis" aria-label="Key figures">
        <Kpi
          label="Page views"
          value={loading ? "…" : fmtCount(summary.total)}
          mono
          sub={summary.sessions ? `${fmtCount(summary.sessions)} sessions` : "all-time"}
          Icon={Activity}
          spark={summary.byDay.map((d) => d.count)}
        />
        <Kpi
          label="Unique IPs"
          value={loading ? "…" : fmtCount(summary.uniqueIps)}
          mono
          sub={
            summary.total
              ? `${Math.round((summary.uniqueIps / summary.total) * 100)}% of visits`
              : "No visits yet"
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
              ? `${countryFlag(summary.byCountry[0].code)} ${summary.byCountry[0].name}`.trim()
              : "None yet"
          }
          sub={summary.byCountry[0] ? `${summary.byCountry[0].count} visits` : undefined}
          Icon={Globe}
        />
        <Kpi
          label="Top device"
          value={loading ? "…" : summary.byDevice[0]?.name ?? "None yet"}
          sub={
            summary.byDevice[0] && summary.total
              ? `${Math.round((summary.byDevice[0].count / summary.total) * 100)}% of visits`
              : undefined
          }
          Icon={MonitorSmartphone}
        />
      </section>

      <FourteenDayChart byDay={summary.byDay} />

      <section className="sc-grid-main">
        <RecentVisits visits={visits} />
        <Breakdown title="Top paths" rows={summary.byPath.slice(0, 4)} mono />
      </section>

      <section className="sc-grid-4">
        <Breakdown title="Country" rows={summary.byCountry.slice(0, 4)} flag />
        <Breakdown title="Device" rows={summary.byDevice.slice(0, 4)} />
        <Breakdown title="Browser" rows={summary.byBrowser.slice(0, 4)} />
        <Breakdown title="OS" rows={summary.byOS.slice(0, 4)} />
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
  mono,
}: {
  label: string;
  value: string;
  sub?: string;
  Icon: typeof Activity;
  spark?: number[];
  mono?: boolean;
}) {
  return (
    <article className="sc-card sc-kpi">
      <div className="sc-kpi-head">
        <span className="sc-kpi-icon">
          <Icon size={14} strokeWidth={1.9} aria-hidden />
        </span>
        {label}
      </div>
      <div className={mono ? "sc-kpi-value is-mono" : "sc-kpi-value"} title={value}>
        {value}
      </div>
      <div className="sc-kpi-foot">
        <span className="sc-kpi-sub">{sub}</span>
        {spark && spark.length > 0 && <Sparkline values={spark} />}
      </div>
    </article>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(1, ...values);
  return (
    <div className="sc-spark" aria-hidden>
      {values.map((v, i) => (
        <span key={i} data-zero={v === 0 ? "true" : undefined} style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
}

function FourteenDayChart({ byDay }: { byDay: { day: string; count: number }[] }) {
  const max = Math.max(1, ...byDay.map((d) => d.count));
  const total = byDay.reduce((s, d) => s + d.count, 0);
  const today = byDay[byDay.length - 1]?.count ?? 0;
  const top = niceCeil(max);
  const ticks = Array.from(new Set(top >= 2 ? [top, Math.round(top / 2), 0] : [top, 0]));

  return (
    <section className="sc-card" aria-label="Visits over the last 14 days">
      <header className="sc-card-head">
        <div>
          <h2>Last 14 days</h2>
          <p>
            <span className="sc-mono">{total}</span> visits · peak <span className="sc-mono">{max}</span> · today{" "}
            <span className="sc-mono">{today}</span>
          </p>
        </div>
      </header>
      <div className="sc-chart-body">
        <div className="sc-plot">
          {ticks.map((t) => (
            <div key={t} className="sc-gridline" style={{ top: `${(1 - t / top) * 100}%` }} aria-hidden>
              <span>{t}</span>
            </div>
          ))}
          <div className="sc-bars">
            {byDay.map((d) => {
              const pct = (d.count / top) * 100;
              return (
                <div key={d.day} className="sc-barcol" title={`${fmtDay(d.day)} · ${d.count} visits`}>
                  <span className="sc-barval" data-peak={d.count > 0 && d.count === max ? "true" : undefined}>
                    {d.count}
                  </span>
                  <span className="sc-bar" data-empty={d.count === 0 ? "true" : undefined} style={{ height: `${pct}%` }} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="sc-xaxis" aria-hidden>
          {byDay.map((d, i) => {
            const first = i === 0 || d.day.slice(8) === "01";
            return (
              <span key={d.day} data-month={first ? "true" : undefined}>
                {first ? fmtDay(d.day) : Number(d.day.slice(8))}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RecentVisits({ visits }: { visits: VisitEntry[] }) {
  const rows = visits.slice().reverse().slice(0, 8);
  return (
    <section className="sc-card" aria-label="Recent visits">
      <header className="sc-card-head sc-card-head--rule">
        <div>
          <h2>Recent visits</h2>
          <p>
            Showing <span className="sc-mono">{rows.length}</span> of <span className="sc-mono">{visits.length}</span>
          </p>
        </div>
      </header>
      {rows.length === 0 ? (
        <p className="sc-empty">No data yet.</p>
      ) : (
        <div className="sc-table-wrap">
          <table className="sc-table">
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">Location</th>
                <th scope="col">IP address</th>
                <th scope="col">Device</th>
                <th scope="col">Path</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((v, i) => (
                <tr key={`${v.ts}-${i}`}>
                  <td className="sc-td-when is-mono is-muted" title={new Date(v.ts).toLocaleString()}>
                    {fmtRel(v.ts)} ago
                  </td>
                  <td className="sc-td-place">
                    {countryFlag(v.countryCode) && <span className="sc-flag">{countryFlag(v.countryCode)}</span>}
                    {v.city || v.country || "Unknown"}
                  </td>
                  <td className={v.ip ? "sc-td-ip is-mono" : "sc-td-ip is-mono is-muted"} title={v.ip || "no IP captured"}>
                    {v.ip || "No IP"}
                  </td>
                  <td className="sc-td-device">
                    <span className="sc-chip">{v.device}</span>
                  </td>
                  <td className="sc-td-path is-mono is-trunc" title={v.path}>
                    {v.path}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Breakdown({
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
    <section className="sc-card" aria-label={title}>
      <header className="sc-card-head">
        <h2>{title}</h2>
      </header>
      {rows.length === 0 ? (
        <p className="sc-empty">No data yet.</p>
      ) : (
        <ol className="sc-rank">
          {rows.map((r, i) => {
            const pct = Math.max(8, Math.round((r.count / max) * 100));
            return (
              <li key={r.name} title={`${r.name} · ${r.count}`}>
                <div className="sc-rank-row">
                  <span className="sc-rank-pos">{i + 1}</span>
                  <span className={mono ? "sc-rank-name is-mono" : "sc-rank-name"}>
                    {flag && r.code ? `${countryFlag(r.code)} ` : ""}
                    {r.name}
                  </span>
                  <span className="sc-rank-count">{r.count}</span>
                </div>
                <div className="sc-rank-bar" aria-hidden>
                  <span style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
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

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2026-09-19" as "19 Sep", read in UTC like the day buckets.
function fmtDay(key: string): string {
  const d = new Date(`${key}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return key;
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

// Rounds the chart ceiling up to a value whose half is also a whole number,
// so the middle gridline always lands on an integer.
function niceCeil(n: number): number {
  if (n <= 10) return Math.max(2, Math.ceil(n / 2) * 2);
  const pow = Math.pow(10, Math.floor(Math.log10(n)));
  const unit = n / pow;
  const step = [1, 1.2, 1.6, 2, 2.4, 3, 4, 5, 6, 8, 10].find((s) => unit <= s) ?? 10;
  return Math.round(step * pow);
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
