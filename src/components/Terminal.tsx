import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  changePassword,
  ensureAuth,
  isUnlocked,
  markLocked,
  markUnlocked,
  verifyCredentials,
} from "@/lib/adminAuth";
import { fetchVisits, summarise } from "@/lib/analytics";
import { useTemplate, type TemplateId } from "@/lib/template";
import { pushRemoteTemplate, fetchRemoteTemplate } from "@/lib/templateRemote";
import {
  getBinId,
  hasEnvMasterKey,
  isBinConfigured,
} from "@/lib/binStore";
import { getChatbotEnabled, setChatbotEnabled } from "@/lib/settings";
import { profile } from "@/lib/content";

const HISTORY_STORAGE = "portfolio.terminal.history";
const HOST = "portfolio";

type Tone = "ok" | "err" | "warn" | "info" | "dim";
type Line =
  | { kind: "echo"; text: string }
  | { kind: "out"; text: string; tone?: Tone }
  | { kind: "block"; text: string }; // pre-formatted block (tables, banners)

type Stage =
  | { kind: "idle" }
  | { kind: "awaiting-username" }
  | { kind: "awaiting-password"; username: string }
  | { kind: "awaiting-cur-password" }
  | { kind: "awaiting-new-password"; current: string }
  | { kind: "awaiting-confirm-password"; current: string; next: string };

const BANNER = String.raw`
  ┌─────────────────────────────────────────────────────────┐
  │   ███╗   ███╗ ██████╗ ███████╗███████╗██╗██╗  ██╗      │
  │   ████╗ ████║██╔═══██╗██╔════╝██╔════╝██║██║ ██╔╝      │
  │   ██╔████╔██║██║   ██║███████╗█████╗  ██║█████╔╝       │
  │   ██║╚██╔╝██║██║   ██║╚════██║██╔══╝  ██║██╔═██╗       │
  │   ██║ ╚═╝ ██║╚██████╔╝███████║██║     ██║██║  ██╗      │
  │   ╚═╝     ╚═╝ ╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝      │
  └─────────────────────────────────────────────────────────┘
  Portfolio Studio Console · v1.0  ·  type ' help ' for commands
`;

export default function Terminal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { templates, template, setTemplate } = useTemplate();

  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [authed, setAuthed] = useState<boolean>(() => isUnlocked());
  const [history, setHistory] = useState<string[]>(() => loadHistory());
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const hideOnRoute = false; // terminal is always available, even on /admin

  // ---- Alt+T toggle, Esc closes ----
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.altKey && (e.key === "t" || e.key === "T")) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // ---- focus input on open + seed banner first time ----
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    if (lines.length === 0) {
      const intro: Line[] = [
        { kind: "block", text: BANNER },
        {
          kind: "out",
          text: authed
            ? `Welcome back. Type 'help' to see what's available.`
            : `Not signed in.  Type 'login' to authenticate, or 'help' for commands.`,
          tone: "info",
        },
        { kind: "out", text: "", tone: "dim" },
      ];
      setLines(intro);
    }
    return () => window.clearTimeout(t);
  }, [open, authed, lines.length]);

  // ---- autoscroll on new lines ----
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, open]);

  const promptHost = useMemo(() => {
    if (!authed) return `guest@${HOST}`;
    return `mosfik@${HOST}`;
  }, [authed]);

  const promptSymbol = authed ? "#" : "$";

  // ----------------------------------------------------------------
  // command pipeline
  // ----------------------------------------------------------------

  const push = useCallback((line: Line) => setLines((ls) => [...ls, line]), []);
  const pushOut = useCallback((text: string, tone?: Tone) => {
    setLines((ls) => [...ls, { kind: "out", text, tone }]);
  }, []);
  const pushEcho = useCallback(
    (cmd: string, masked = false) => {
      const shown = masked ? "•".repeat(Math.max(1, cmd.length)) : cmd;
      const prefix = stage.kind.startsWith("awaiting")
        ? "" // prompt for those is the inline label; we still echo for transcript
        : `${promptHost}:${shortPath(location.pathname)}${promptSymbol} `;
      push({ kind: "echo", text: `${prefix}${shown}` });
    },
    [push, promptHost, promptSymbol, location.pathname, stage.kind],
  );

  const runCommand = useCallback(
    async (raw: string) => {
      const cmd = raw.trim();

      // ---- staged interactive input ----
      if (stage.kind === "awaiting-username") {
        pushEcho(cmd);
        if (!cmd) {
          pushOut("Login cancelled.", "warn");
          setStage({ kind: "idle" });
          return;
        }
        setStage({ kind: "awaiting-password", username: cmd });
        pushOut("password: ", "dim");
        return;
      }
      if (stage.kind === "awaiting-password") {
        pushEcho(cmd, true);
        const res = await verifyCredentials(stage.username, cmd);
        if (res.kind === "ok") {
          markUnlocked();
          setAuthed(true);
          pushOut(`✓  Authenticated as ${stage.username}`, "ok");
          pushOut("Run 'dashboard', 'stats', or 'help' to continue.", "info");
        } else {
          pushOut(`✗  ${res.reason}`, "err");
        }
        setStage({ kind: "idle" });
        return;
      }
      if (stage.kind === "awaiting-cur-password") {
        pushEcho(cmd, true);
        if (!cmd) {
          pushOut("Cancelled.", "warn");
          setStage({ kind: "idle" });
          return;
        }
        setStage({ kind: "awaiting-new-password", current: cmd });
        pushOut("new password: ", "dim");
        return;
      }
      if (stage.kind === "awaiting-new-password") {
        pushEcho(cmd, true);
        if (cmd.length < 8) {
          pushOut("✗  New password must be at least 8 characters.", "err");
          setStage({ kind: "idle" });
          return;
        }
        setStage({ kind: "awaiting-confirm-password", current: stage.current, next: cmd });
        pushOut("confirm: ", "dim");
        return;
      }
      if (stage.kind === "awaiting-confirm-password") {
        pushEcho(cmd, true);
        if (cmd !== stage.next) {
          pushOut("✗  Confirmation doesn't match.", "err");
          setStage({ kind: "idle" });
          return;
        }
        const res = await changePassword(stage.current, stage.next);
        if (res.kind === "ok") {
          pushOut("✓  Password updated.", "ok");
        } else {
          pushOut(`✗  ${res.reason}`, "err");
        }
        setStage({ kind: "idle" });
        return;
      }

      // ---- regular command parsing ----
      pushEcho(raw);
      if (!cmd) return;

      // history bookkeeping
      const nextHistory = [...history.filter((h) => h !== cmd), cmd].slice(-50);
      setHistory(nextHistory);
      saveHistory(nextHistory);
      setHistoryIndex(null);

      const [head, ...args] = cmd.split(/\s+/);
      const name = head.toLowerCase();
      switch (name) {
        case "help":
        case "?":
          renderHelp(pushOut, authed);
          break;

        case "clear":
        case "cls":
          setLines([]);
          break;

        case "exit":
        case "quit":
        case "close":
          setOpen(false);
          break;

        case "whoami": {
          const auth = await ensureAuth();
          if (authed && auth) {
            pushOut(`${auth.username} (admin)`, "ok");
            pushOut(`session unlocked locally`, "dim");
          } else {
            pushOut("guest (unauthenticated)", "warn");
          }
          break;
        }

        case "login": {
          if (authed) {
            pushOut("Already signed in. Use 'logout' first.", "warn");
            break;
          }
          if (args.length >= 1) {
            // login <username>
            setStage({ kind: "awaiting-password", username: args.join(" ") });
            pushOut("password: ", "dim");
          } else {
            setStage({ kind: "awaiting-username" });
            pushOut("username: ", "dim");
          }
          break;
        }

        case "logout": {
          if (!authed) {
            pushOut("Already signed out.", "warn");
            break;
          }
          markLocked();
          setAuthed(false);
          pushOut("✓  Signed out.", "ok");
          break;
        }

        case "passwd": {
          if (!authed) {
            pushOut("✗  Login first.", "err");
            break;
          }
          setStage({ kind: "awaiting-cur-password" });
          pushOut("current password: ", "dim");
          break;
        }

        case "stats":
        case "summary": {
          if (!authed) {
            pushOut("✗  Login first.", "err");
            break;
          }
          pushOut("Loading…", "dim");
          const visits = await fetchVisits();
          const s = summarise(visits);
          pushOut("", "dim");
          pushOut(`total page views ........ ${s.total}`, "info");
          pushOut(`unique sessions ......... ${s.sessions}`, "info");
          pushOut(`unique IPs .............. ${s.uniqueIps}`, "info");
          pushOut(
            `top country ............. ${s.byCountry[0]?.name ?? "—"}${
              s.byCountry[0] ? `  (${s.byCountry[0].count})` : ""
            }`,
            "info",
          );
          pushOut(
            `top device .............. ${s.byDevice[0]?.name ?? "—"}${
              s.byDevice[0] ? `  (${s.byDevice[0].count})` : ""
            }`,
            "info",
          );
          pushOut(
            `top browser ............. ${s.byBrowser[0]?.name ?? "—"}${
              s.byBrowser[0] ? `  (${s.byBrowser[0].count})` : ""
            }`,
            "info",
          );
          break;
        }

        case "visits":
        case "tail": {
          if (!authed) {
            pushOut("✗  Login first.", "err");
            break;
          }
          const limit = parseInt(args[0] ?? "10", 10) || 10;
          const visits = await fetchVisits();
          const recent = visits.slice(-limit).reverse();
          if (recent.length === 0) {
            pushOut("(no visits yet)", "dim");
            break;
          }
          push({ kind: "block", text: renderVisitsTable(recent) });
          break;
        }

        case "templates":
        case "ls": {
          renderTemplates(pushOut, templates, template);
          break;
        }

        case "set-template":
        case "use": {
          if (!authed) {
            pushOut("✗  Login first.", "err");
            break;
          }
          const id = args[0];
          if (!id) {
            pushOut("usage: set-template <id>", "warn");
            break;
          }
          const meta = templates.find((t) => t.id === id);
          if (!meta) {
            pushOut(`✗  unknown template: ${id}`, "err");
            break;
          }
          setTemplate(id as TemplateId);
          pushOut(`Switching to '${meta.name}' locally…`, "dim");
          const res = await pushRemoteTemplate(id as TemplateId);
          if (res.kind === "ok") pushOut(`✓  pushed remotely. visitors see it on next load.`, "ok");
          else pushOut(`! local only — remote: ${res.reason}`, "warn");
          break;
        }

        case "dashboard":
        case "console":
        case "analytics": {
          if (!authed) {
            pushOut("✗  Login first.", "err");
            break;
          }
          pushOut("Loading dashboard…", "dim");
          const visits = await fetchVisits();
          const s = summarise(visits);
          push({ kind: "block", text: renderDashboard(s) });
          pushOut("", "dim");
          pushOut("commands: 'visits [N]' · 'templates' · 'passwd' · 'stats'", "dim");
          break;
        }

        case "open":
        case "goto":
        case "cd": {
          const p = args[0] || "/";
          if (p.startsWith("/admin")) {
            pushOut("✗  admin pages stay in the terminal. Try 'dashboard', 'templates', 'passwd'.", "err");
            break;
          }
          navigate(p.startsWith("/") ? p : `/${p}`);
          pushOut(`→  navigating public site to ${p}`, "info");
          setOpen(false);
          break;
        }

        case "about":
        case "whois": {
          pushOut(`${profile.name} — ${profile.role}`, "ok");
          pushOut(profile.tagline, "info");
          pushOut(`location: ${profile.location}`, "dim");
          pushOut(`email:    ${profile.email}`, "dim");
          pushOut(`github:   ${profile.links.github}`, "dim");
          pushOut(`linkedin: ${profile.links.linkedin}`, "dim");
          break;
        }

        case "echo":
          pushOut(args.join(" "));
          break;

        case "date":
          pushOut(new Date().toString(), "dim");
          break;

        case "banner":
          push({ kind: "block", text: BANNER });
          break;

        case "chatbot": {
          const sub = (args[0] ?? "status").toLowerCase();
          if (sub === "status") {
            const on = getChatbotEnabled();
            pushOut(`chatbot: ${on ? "ON" : "OFF"}`, on ? "ok" : "warn");
            pushOut("toggle with: chatbot on  |  chatbot off", "dim");
            break;
          }
          if (!authed) {
            pushOut("✗  Login required to change settings.", "err");
            break;
          }
          if (sub === "on" || sub === "enable") {
            setChatbotEnabled(true);
            pushOut("✓  chatbot enabled.", "ok");
            break;
          }
          if (sub === "off" || sub === "disable") {
            setChatbotEnabled(false);
            pushOut("✓  chatbot disabled.", "ok");
            break;
          }
          pushOut("usage: chatbot [status|on|off]", "warn");
          break;
        }

        case "remote":
        case "bin": {
          pushOut("Loading remote info…", "dim");
          const r = await fetchRemoteTemplate();
          push({ kind: "block", text: renderRemoteInfo(r, getBinId(), isBinConfigured(), hasEnvMasterKey()) });
          break;
        }

        default:
          pushOut(`command not found: ${head}`, "err");
          pushOut(`type 'help' to see available commands`, "dim");
      }
    },
    [
      authed,
      history,
      location.pathname,
      navigate,
      push,
      pushEcho,
      pushOut,
      setTemplate,
      stage,
      template,
      templates,
    ],
  );

  // ----------------------------------------------------------------
  // input handlers
  // ----------------------------------------------------------------

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const cmd = input;
      setInput("");
      void runCommand(cmd);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next] ?? "");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(next);
        setInput(history[next] ?? "");
      }
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const completed = autoComplete(input, authed);
      if (completed) setInput(completed);
      return;
    }
    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  if (hideOnRoute) return null;

  // ----------------------------------------------------------------
  // render
  // ----------------------------------------------------------------

  const maskedStage =
    stage.kind === "awaiting-password" ||
    stage.kind === "awaiting-cur-password" ||
    stage.kind === "awaiting-new-password" ||
    stage.kind === "awaiting-confirm-password";

  return (
    <div
      role="dialog"
      aria-label="Terminal"
      aria-hidden={!open}
      className={[
        "fixed inset-0 z-[100] flex items-stretch md:items-center justify-center print:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 transition-opacity duration-200"
        style={{
          background: "rgba(4, 8, 14, 0.72)",
          backdropFilter: "blur(3px)",
          opacity: open ? 1 : 0,
        }}
        onClick={() => setOpen(false)}
      />

      {/* terminal window */}
      <div
        className={[
          "term-window relative w-full md:w-[820px] md:max-w-[92vw] md:h-[540px] h-[100dvh]",
          "md:rounded-[10px] overflow-hidden flex flex-col",
          "transition-all duration-200 ease-out",
          open ? "scale-100 opacity-100" : "scale-[0.985] opacity-0 translate-y-3",
        ].join(" ")}
        style={{
          background: "#0b1118",
          border: "1px solid #1d2632",
          boxShadow:
            "0 30px 80px -16px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.02) inset, 0 1px 0 rgba(255,255,255,0.04) inset",
          fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-3 px-3.5 py-2.5 shrink-0 relative"
          style={{
            background: "#0e151e",
            borderBottom: "1px solid #1d2632",
          }}
        >
          {/* traffic lights */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="close"
              onClick={() => setOpen(false)}
              className="w-[11px] h-[11px] rounded-full transition-opacity hover:opacity-80"
              style={{ background: "#ed6a5e", border: "1px solid #c9483d" }}
            />
            <span
              className="w-[11px] h-[11px] rounded-full"
              style={{ background: "#f5bf4f", border: "1px solid #cf9d2f" }}
              aria-hidden
            />
            <span
              className="w-[11px] h-[11px] rounded-full"
              style={{ background: "#62c554", border: "1px solid #4ba039" }}
              aria-hidden
            />
          </div>

          {/* divider */}
          <span aria-hidden className="hidden md:block h-4 w-px" style={{ background: "#1d2632" }} />

          {/* window title — path breadcrumb */}
          <div className="flex-1 flex items-center justify-center gap-2 text-[11.5px] tabular-nums">
            <span style={{ color: "#5eead4" }} aria-hidden>●</span>
            <span style={{ color: "#dbe4f0", fontWeight: 600 }}>{promptHost}</span>
            <span style={{ color: "#3a4658" }}>:</span>
            <span style={{ color: "#94a4ba" }}>{shortPath(location.pathname)}</span>
          </div>

          {/* status pill on the right */}
          <div className="hidden md:inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.08em] px-2 py-1 rounded"
               style={{
                 color: "#7c8da6",
                 border: "1px solid #1d2632",
                 background: "#0a0f17",
               }}>
            <kbd className="font-mono normal-case tracking-normal text-[10px]"
                 style={{ color: "#a5b3c8" }}>Alt</kbd>
            <span style={{ color: "#3a4658" }}>+</span>
            <kbd className="font-mono normal-case tracking-normal text-[10px]"
                 style={{ color: "#a5b3c8" }}>T</kbd>
          </div>
        </div>

        {/* Output area */}
        <div
          ref={scrollerRef}
          className="flex-1 overflow-y-auto px-5 py-4 text-[12.5px] leading-[1.6] whitespace-pre-wrap"
          style={{ color: "#dbe4f0", scrollbarWidth: "thin" }}
        >
          {lines.map((l, i) => (
            <LineView key={i} line={l} />
          ))}
        </div>

        {/* Prompt */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const cmd = input;
            setInput("");
            void runCommand(cmd);
          }}
          className="flex items-center gap-2 px-5 py-2.5 shrink-0"
          style={{ borderTop: "1px solid #1d2632", background: "#0a0f17" }}
        >
          {stage.kind === "idle" ? (
            <span className="text-[12.5px] tabular-nums whitespace-nowrap inline-flex items-baseline gap-0">
              <span style={{ color: "#7dd3fc" }}>{promptHost}</span>
              <span style={{ color: "#3a4658" }}>:</span>
              <span style={{ color: "#94a4ba" }}>{shortPath(location.pathname)}</span>
              <span style={{ color: "#5eead4", marginLeft: 6 }}>❯</span>
            </span>
          ) : (
            <span className="text-[12.5px] inline-flex items-center gap-1.5" style={{ color: "#94a4ba" }}>
              <span style={{ color: "#f5bf4f" }}>▸</span>
              {labelForStage(stage)}
              <span style={{ color: "#3a4658" }}>:</span>
            </span>
          )}
          <input
            ref={inputRef}
            type={maskedStage ? "password" : "text"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            className="term-input flex-1 bg-transparent outline-none text-[12.5px] tabular-nums"
            style={{ color: "#dbe4f0", caretColor: "#5eead4" }}
            placeholder=""
          />
          {/* thin vertical caret instead of block */}
          <span
            aria-hidden
            className="inline-block w-px h-[14px] shrink-0"
            style={{
              background: "#5eead4",
              animation: "term-caret 1s ease-in-out infinite",
            }}
          />
        </form>

        {/* Status footer */}
        <StatusFooter authed={authed} />
      </div>
    </div>
  );
}

function StatusFooter({ authed }: { authed: boolean }) {
  const [now, setNow] = useState(() => new Date());
  const [chatbot, setChatbot] = useState<boolean>(() => getChatbotEnabled());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);
  useEffect(() => {
    const t = window.setInterval(() => setChatbot(getChatbotEnabled()), 1500);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div
      className="flex items-center gap-3 px-4 py-1.5 text-[10.5px] uppercase tracking-[0.07em] shrink-0 font-medium"
      style={{
        background: "#070b11",
        borderTop: "1px solid #131b27",
        color: "#94a4ba",
      }}
    >
      <StatusItem dot="#34d399" label="online" />
      <Divider />
      <StatusItem
        dot={authed ? "#7dd3fc" : "#f5bf4f"}
        label={authed ? "admin" : "guest"}
      />
      <Divider />
      <StatusItem
        dot={chatbot ? "#34d399" : "#5b6678"}
        label={`bot ${chatbot ? "on" : "off"}`}
      />
      <span
        className="ml-auto tabular-nums font-mono normal-case tracking-normal"
        style={{ color: "#7c8da6" }}
      >
        {fmtTime(now)}
      </span>
    </div>
  );
}

function Divider() {
  return (
    <span aria-hidden className="inline-block w-px h-2.5" style={{ background: "#1d2632" }} />
  );
}

function StatusItem({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ background: dot }}
        aria-hidden
      />
      {label}
    </span>
  );
}

function fmtTime(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// =============================================================================
// pieces
// =============================================================================

function LineView({ line }: { line: Line }) {
  if (line.kind === "echo") {
    return <div style={{ color: "#94a4ba" }}>{line.text}</div>;
  }
  if (line.kind === "block") {
    return (
      <pre className="my-1.5" style={{ color: "#a5e9f5", fontFamily: "inherit" }}>
        {line.text}
      </pre>
    );
  }
  const color =
    line.tone === "ok"   ? "#34d399" :
    line.tone === "err"  ? "#fb7185" :
    line.tone === "warn" ? "#f5bf4f" :
    line.tone === "info" ? "#7dd3fc" :
    line.tone === "dim"  ? "#5b6678" :
                           "#dbe4f0";
  return <div style={{ color }}>{line.text}</div>;
}

function renderHelp(out: (s: string, tone?: Tone) => void, authed: boolean) {
  const lines: [string, string, boolean?][] = [
    ["help, ?",                 "list available commands"],
    ["whoami",                  "current session identity"],
    ["about, whois",            "the portfolio owner — public info"],
    ["templates, ls",           "list available portfolio templates"],
    ["chatbot [on|off|status]", "toggle the public-site chatbot"],
    ["open <path>",             "navigate the public site to <path>"],
    ["clear, cls",              "clear the terminal"],
    ["exit, quit, close",       "close the terminal"],
    ["—", "—"],
    ["login [username]",        "authenticate as admin"],
    ["logout",                  "sign out", true],
    ["passwd",                  "change admin password", true],
    ["dashboard, analytics",    "render the dashboard inline", true],
    ["stats, summary",          "one-line analytics summary", true],
    ["visits [N]",              "show recent visits (default 10)", true],
    ["remote, bin",             "JSONBin connection info", true],
    ["set-template <id>, use",  "switch the live portfolio template", true],
  ];
  for (const [name, desc, adminOnly] of lines) {
    if (name === "—") {
      out("─ admin commands ─────────────────────────────────────────", "dim");
      continue;
    }
    if (adminOnly && !authed) {
      out(`  ${name.padEnd(28)}${desc}  · (login required)`, "dim");
    } else {
      out(`  ${name.padEnd(28)}${desc}`, "info");
    }
  }
}

function renderTemplates(
  out: (s: string, tone?: Tone) => void,
  templates: ReturnType<typeof useTemplate>["templates"],
  active: TemplateId,
) {
  out("available templates:", "dim");
  for (const t of templates) {
    const marker = t.id === active ? "●" : " ";
    out(`  ${marker}  ${t.id.padEnd(16)}  ${t.name}`, t.id === active ? "ok" : "info");
  }
  out("", "dim");
  out("switch with: set-template <id>", "dim");
}

function renderDashboard(s: ReturnType<typeof summarise>): string {
  // KPI line
  const kpiTable = [
    ["Page views",  fmtCount(s.total)],
    ["Sessions",    fmtCount(s.sessions)],
    ["Unique IPs",  fmtCount(s.uniqueIps)],
    ["Top country", s.byCountry[0]?.name ?? "—"],
    ["Top device",  s.byDevice[0]?.name ?? "—"],
    ["Top browser", s.byBrowser[0]?.name ?? "—"],
  ];
  const kpiLines = kpiTable
    .map(([label, value]) => `  ${label.padEnd(14)}  ${String(value).padStart(8)}`)
    .join("\n");

  // 14-day sparkline (8 levels)
  const blocks = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];
  const max = Math.max(1, ...s.byDay.map((d) => d.count));
  const spark = s.byDay
    .map((d) => (d.count === 0 ? "·" : blocks[Math.max(0, Math.min(7, Math.round((d.count / max) * 7)))]))
    .join(" ");
  const labels = s.byDay.map((d) => d.day.slice(8)).join(" ");

  // breakdown bars
  const renderBreak = (rows: { name: string; count: number; code?: string }[]) => {
    if (rows.length === 0) return "  (no data)";
    const max = Math.max(1, ...rows.map((r) => r.count));
    return rows
      .slice(0, 6)
      .map((r) => {
        const bar = "█".repeat(Math.max(1, Math.round((r.count / max) * 18)));
        return `  ${(r.name ?? "—").padEnd(16)} ${bar.padEnd(18)} ${String(r.count).padStart(4)}`;
      })
      .join("\n");
  };

  return [
    "═══════════════════════════════════════════════════════════",
    "  DASHBOARD                                       ● LIVE",
    "═══════════════════════════════════════════════════════════",
    "",
    kpiLines,
    "",
    "  Last 14 days",
    `    ${spark}`,
    `    ${labels}`,
    "",
    "  By country",
    renderBreak(s.byCountry),
    "",
    "  By device",
    renderBreak(s.byDevice),
    "",
    "  By browser",
    renderBreak(s.byBrowser),
    "",
    "  By OS",
    renderBreak(s.byOS),
    "",
    "  Top entry paths",
    renderBreak(s.byPath),
    "",
    "═══════════════════════════════════════════════════════════",
  ].join("\n");
}

function renderRemoteInfo(
  remote: { template?: string; updatedAt?: string } | null,
  binId: string,
  configured: boolean,
  envKey: boolean,
): string {
  const lines = [
    "── REMOTE STORAGE ─────────────────────────────────────────",
    "",
    `  status ........ ${configured ? "● connected" : "○ disabled"}`,
    `  provider ...... JSONBin v3`,
    `  bin id ........ ${binId || "(not set)"}`,
    `  master key .... ${envKey ? "env-loaded" : "browser localStorage"}`,
    "",
    `  remote template . ${remote?.template ?? "—"}`,
    `  last update ..... ${remote?.updatedAt ? new Date(remote.updatedAt).toLocaleString() : "—"}`,
    "",
    "───────────────────────────────────────────────────────────",
  ];
  return lines.join("\n");
}

function fmtCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function renderVisitsTable(visits: Array<{
  ts: string;
  ip?: string;
  city?: string;
  country?: string;
  countryCode?: string;
  device: string;
  browser: string;
  os: string;
  path: string;
}>): string {
  const rows = visits.map((v) => ({
    when: fmtShort(v.ts),
    ip: v.ip ?? "—",
    loc: [v.city, v.countryCode].filter(Boolean).join(", ") || "—",
    device: v.device,
    browser: v.browser,
    path: v.path,
  }));
  const widths = {
    when:    Math.max(4,  ...rows.map((r) => r.when.length)),
    ip:      Math.max(2,  ...rows.map((r) => r.ip.length)),
    loc:     Math.max(8,  ...rows.map((r) => r.loc.length)),
    device:  Math.max(6,  ...rows.map((r) => r.device.length)),
    browser: Math.max(7,  ...rows.map((r) => r.browser.length)),
    path:    Math.max(4,  ...rows.map((r) => r.path.length)),
  };
  const sep = ` │ `;
  const head =
    "when".padEnd(widths.when) + sep +
    "ip".padEnd(widths.ip) + sep +
    "loc".padEnd(widths.loc) + sep +
    "device".padEnd(widths.device) + sep +
    "browser".padEnd(widths.browser) + sep +
    "path".padEnd(widths.path);
  const divider = head.replace(/[^│]/g, "─");
  const body = rows.map(
    (r) =>
      r.when.padEnd(widths.when) + sep +
      r.ip.padEnd(widths.ip) + sep +
      r.loc.padEnd(widths.loc) + sep +
      r.device.padEnd(widths.device) + sep +
      r.browser.padEnd(widths.browser) + sep +
      r.path.padEnd(widths.path),
  );
  return [head, divider, ...body].join("\n");
}

function autoComplete(input: string, authed: boolean): string | null {
  const v = input.trim();
  if (!v || v.includes(" ")) return null;
  const all = [
    "help", "whoami", "about", "whois", "templates", "ls", "open", "clear", "cls",
    "exit", "quit", "close", "echo", "date", "banner", "chatbot",
    ...(authed
      ? ["logout", "passwd", "stats", "summary", "visits", "tail", "set-template", "use", "dashboard", "analytics", "console", "remote", "bin"]
      : ["login"]),
  ];
  const matches = all.filter((c) => c.startsWith(v));
  if (matches.length === 1) return matches[0];
  return null;
}

function shortPath(p: string): string {
  if (p === "/") return "~";
  if (p.startsWith("/admin")) return `~/admin${p.slice(6)}`;
  return `~${p}`;
}

function labelForStage(s: Stage): string {
  switch (s.kind) {
    case "awaiting-username":          return "username";
    case "awaiting-password":          return "password";
    case "awaiting-cur-password":      return "current password";
    case "awaiting-new-password":      return "new password";
    case "awaiting-confirm-password":  return "confirm";
    default:                            return "";
  }
}

function fmtShort(iso: string): string {
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return iso.slice(11, 16);
  const now = new Date();
  const sameDay =
    now.getFullYear() === t.getFullYear() &&
    now.getMonth() === t.getMonth() &&
    now.getDate() === t.getDate();
  if (sameDay) {
    return `${pad(t.getHours())}:${pad(t.getMinutes())}`;
  }
  return `${pad(t.getMonth() + 1)}-${pad(t.getDate())} ${pad(t.getHours())}:${pad(t.getMinutes())}`;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function loadHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(h: string[]) {
  try {
    window.localStorage.setItem(HISTORY_STORAGE, JSON.stringify(h));
  } catch {
    /* quota */
  }
}
