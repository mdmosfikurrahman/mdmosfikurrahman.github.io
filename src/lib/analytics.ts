// Visitor analytics — one entry per page view, grouped by sessionId.
// Geo lookup is cached (12h in localStorage); UA parsing is local. Writes go
// to the same JSONBin. The visits array is capped so the bin stays small.

import {
  fetchBin,
  isBinConfigured,
  patchBin,
  VISITS_CAP,
  type VisitEntry,
} from "./binStore";

const SESSION_ID_KEY = "portfolio.analytics.sessionId";
const LAST_PATH_KEY = "portfolio.analytics.lastPath";
const LAST_PATH_AT_KEY = "portfolio.analytics.lastPathAt";
const SESSION_BOT_FLAG = "portfolio.analytics.botSession";
const GEO_CACHE = "portfolio.analytics.geoCache";
const GEO_CACHE_MAX_AGE_MS = 12 * 60 * 60 * 1000; // 12h
const DEDUPE_MS = 800; // ignore identical-path repeats within this window

type Parsed = { os: string; browser: string; device: string };

function parseUA(ua: string): Parsed {
  let os = "Unknown";
  if (/Windows NT 11/i.test(ua)) os = "Windows 11";
  else if (/Windows NT 10/i.test(ua)) os = "Windows 10/11";
  else if (/Windows NT/i.test(ua)) os = "Windows";
  else if (/Mac OS X|Macintosh/i.test(ua)) os = "macOS";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/CrOS/i.test(ua)) os = "ChromeOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  let browser = "Unknown";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/OPR\/|Opera\//i.test(ua)) browser = "Opera";
  else if (/Brave/i.test(ua)) browser = "Brave";
  else if (/Vivaldi/i.test(ua)) browser = "Vivaldi";
  else if (/Chrome\//i.test(ua) && !/Edg\/|OPR\//i.test(ua)) browser = "Chrome";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/Safari/i.test(ua) && !/Chrome|Edg/i.test(ua)) browser = "Safari";

  let device = "Desktop";
  if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) device = "Tablet";
  else if (/Mobi|iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua)) device = "Mobile";

  return { os, browser, device };
}

type GeoResponse = {
  ip?: string;
  city?: string;
  region?: string;
  country_name?: string;
  country_code?: string;
  org?: string;
};

type CachedGeo = { at: number; data: GeoResponse };

// Provider fallback chain. Each adapter returns a normalised GeoResponse or
// null when the provider failed (HTTP error, rate-limit body, missing fields,
// or blocked by network). We accept a result as "good" only if it carries at
// least country + ip — partial responses don't poison the cache.
type GeoProvider = { name: string; load: () => Promise<GeoResponse | null> };

function isGoodGeo(g: GeoResponse | null): g is GeoResponse {
  return !!g && !!g.ip && !!g.country_name;
}

async function loadIpapiCo(): Promise<GeoResponse | null> {
  try {
    const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
    if (!res.ok) return null;
    const raw = (await res.json()) as Record<string, unknown>;
    // ipapi.co returns 200 OK with { error: true, reason: "..." } on rate-limit.
    if (raw.error) return null;
    return {
      ip: typeof raw.ip === "string" ? raw.ip : undefined,
      city: typeof raw.city === "string" ? raw.city : undefined,
      region: typeof raw.region === "string" ? raw.region : undefined,
      country_name: typeof raw.country_name === "string" ? raw.country_name : undefined,
      country_code: typeof raw.country_code === "string" ? raw.country_code : undefined,
      org: typeof raw.org === "string" ? raw.org : undefined,
    };
  } catch {
    return null;
  }
}

async function loadIpwhoIs(): Promise<GeoResponse | null> {
  try {
    const res = await fetch("https://ipwho.is/", { cache: "no-store" });
    if (!res.ok) return null;
    const raw = (await res.json()) as Record<string, unknown>;
    if (raw.success === false) return null;
    const connection = (raw.connection as Record<string, unknown> | undefined) ?? {};
    return {
      ip: typeof raw.ip === "string" ? raw.ip : undefined,
      city: typeof raw.city === "string" ? raw.city : undefined,
      region: typeof raw.region === "string" ? raw.region : undefined,
      country_name: typeof raw.country === "string" ? raw.country : undefined,
      country_code: typeof raw.country_code === "string" ? raw.country_code : undefined,
      org:
        typeof connection.org === "string"
          ? (connection.org as string)
          : typeof connection.isp === "string"
          ? (connection.isp as string)
          : undefined,
    };
  } catch {
    return null;
  }
}

async function loadGeojsIo(): Promise<GeoResponse | null> {
  try {
    const res = await fetch("https://get.geojs.io/v1/ip/geo.json", { cache: "no-store" });
    if (!res.ok) return null;
    const raw = (await res.json()) as Record<string, unknown>;
    return {
      ip: typeof raw.ip === "string" ? raw.ip : undefined,
      city: typeof raw.city === "string" ? raw.city : undefined,
      region: typeof raw.region === "string" ? raw.region : undefined,
      country_name: typeof raw.country === "string" ? raw.country : undefined,
      country_code: typeof raw.country_code === "string" ? raw.country_code : undefined,
      org: typeof raw.organization_name === "string" ? raw.organization_name : undefined,
    };
  } catch {
    return null;
  }
}

const GEO_PROVIDERS: GeoProvider[] = [
  { name: "ipapi.co", load: loadIpapiCo },
  { name: "ipwho.is", load: loadIpwhoIs },
  { name: "geojs.io", load: loadGeojsIo },
];

async function fetchGeo(): Promise<GeoResponse | null> {
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(GEO_CACHE);
      if (raw) {
        const c = JSON.parse(raw) as CachedGeo;
        if (Date.now() - c.at < GEO_CACHE_MAX_AGE_MS && isGoodGeo(c.data)) {
          return c.data;
        }
      }
    } catch {
      /* ignore */
    }
  }
  for (const p of GEO_PROVIDERS) {
    const data = await p.load();
    if (!isGoodGeo(data)) continue;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(GEO_CACHE, JSON.stringify({ at: Date.now(), data }));
      } catch {
        /* ignore */
      }
    }
    return data;
  }
  return null;
}

function isBot(ua: string): boolean {
  return /bot|crawler|spider|preview|headless|googleother|slurp|bingpreview|facebookexternalhit/i.test(
    ua,
  );
}

function getOrCreateSessionId(): string {
  let id = sessionStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = `${Date.now().toString(36)}.${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

// Records the *current* navigation path. Skips bots and same-path repeats
// within DEDUPE_MS (avoids StrictMode double-mount and back/forward chatter).
// Also skips admin routes — those are owner-only and shouldn't pollute the
// visitor analytics.
export async function recordPageView(path?: string): Promise<void> {
  if (typeof window === "undefined") return;
  if (!isBinConfigured()) return;

  const ua = navigator.userAgent || "";

  // One-time bot check per session — cheap to repeat but cleaner this way.
  if (sessionStorage.getItem(SESSION_BOT_FLAG) === "1") return;
  if (isBot(ua)) {
    sessionStorage.setItem(SESSION_BOT_FLAG, "1");
    return;
  }

  const resolvedPath = path ?? window.location.pathname + window.location.search;
  // Don't count owner accessing the admin in visitor analytics.
  if (resolvedPath.startsWith("/admin")) return;

  // Dedupe: skip identical paths that fire in rapid succession.
  const lastPath = sessionStorage.getItem(LAST_PATH_KEY);
  const lastAt = Number(sessionStorage.getItem(LAST_PATH_AT_KEY) ?? "0");
  if (lastPath === resolvedPath && Date.now() - lastAt < DEDUPE_MS) return;
  sessionStorage.setItem(LAST_PATH_KEY, resolvedPath);
  sessionStorage.setItem(LAST_PATH_AT_KEY, String(Date.now()));

  const sessionId = getOrCreateSessionId();
  const parsed = parseUA(ua);
  const geo = await fetchGeo();

  const entry: VisitEntry = {
    ts: new Date().toISOString(),
    sessionId,
    ip: geo?.ip,
    city: geo?.city,
    region: geo?.region,
    country: geo?.country_name,
    countryCode: geo?.country_code,
    org: geo?.org,
    os: parsed.os,
    browser: parsed.browser,
    device: parsed.device,
    ua,
    path: resolvedPath,
    referrer: document.referrer || undefined,
  };

  void patchBin((current) => {
    const visits = (current.visits ?? []).concat([entry]);
    const trimmed = visits.length > VISITS_CAP ? visits.slice(-VISITS_CAP) : visits;
    return { ...current, visits: trimmed };
  });
}

// Back-compat alias — App.tsx will call recordPageView going forward.
export const recordVisit = recordPageView;

// Read-side helpers for the dashboard.
export async function fetchVisits(): Promise<VisitEntry[]> {
  const bin = await fetchBin();
  return bin?.visits ?? [];
}

export type VisitSummary = {
  total: number;          // total page views
  sessions: number;       // unique sessions
  uniqueIps: number;
  byCountry: { name: string; code?: string; count: number }[];
  byDevice: { name: string; count: number }[];
  byBrowser: { name: string; count: number }[];
  byOS: { name: string; count: number }[];
  byPath: { name: string; count: number }[];
  byDay: { day: string; count: number }[];
};

export function summarise(visits: VisitEntry[]): VisitSummary {
  const total = visits.length;
  const sessions = new Set(visits.map((v) => v.sessionId).filter(Boolean)).size;
  const uniqueIps = new Set(visits.map((v) => v.ip).filter(Boolean)).size;

  const tally = (arr: VisitEntry[], pick: (v: VisitEntry) => string | undefined) => {
    const m = new Map<string, number>();
    for (const v of arr) {
      const k = pick(v);
      if (!k) continue;
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return Array.from(m.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const byCountry = tally(visits, (v) => v.country).map((row) => ({
    ...row,
    code: visits.find((v) => v.country === row.name)?.countryCode,
  }));
  const byDevice = tally(visits, (v) => v.device);
  const byBrowser = tally(visits, (v) => v.browser);
  const byOS = tally(visits, (v) => v.os);
  const byPath = tally(visits, (v) => v.path);

  // last 14 days
  const days = new Map<string, number>();
  const now = Date.now();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000);
    days.set(toDayKey(d), 0);
  }
  for (const v of visits) {
    const k = toDayKey(new Date(v.ts));
    if (days.has(k)) days.set(k, (days.get(k) ?? 0) + 1);
  }
  const byDay = Array.from(days.entries()).map(([day, count]) => ({ day, count }));

  return { total, sessions, uniqueIps, byCountry, byDevice, byBrowser, byOS, byPath, byDay };
}

function toDayKey(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
