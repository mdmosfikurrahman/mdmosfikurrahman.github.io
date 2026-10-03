import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  Copy,
  Facebook,
  Github,
  GraduationCap,
  IdCard,
  Linkedin,
  LoaderCircle,
  Lock,
  Mail,
  X,
} from "lucide-react";
import {
  changePassword,
  ensureAuth,
  isUnlocked,
  markLocked,
  markUnlocked,
  verifyCredentials,
} from "@/lib/adminAuth";
import { fetchVisits, summarise, type VisitSummary } from "@/lib/analytics";
import { getBinId, hasEnvMasterKey, isBinConfigured, type VisitEntry } from "@/lib/binStore";
import { fetchRemoteState } from "@/lib/remote";
import {
  getChatbotEnabled,
  getHireMeEnabled,
  setChatbotEnabled,
  useAvatarUrl,
  useCvDownload,
} from "@/lib/settings";
import { DECKS, startPresentation } from "@/lib/presentation";
import { deckForLens, getLens } from "@/lib/lens";
import { useTheme } from "@/hooks/useTheme";
import { caseStudies, freelance, profile } from "@/lib/content";
import { FOLIO_NAV } from "@/site/nav";
import { WhatsAppIcon } from "@/site/icons";
import { useCopy } from "@/site/copy";
import "./terminal.css";

const HISTORY_STORAGE = "portfolio.terminal.history";
const MASK = "••••••••";

type Tone = "ok" | "err" | "warn" | "muted";
type Page = { to: string; label: string; names: string[] };
type Row = { k: string; v: string; tone?: Tone };

type Out =
  | { kind: "text"; text: string; tone?: Tone }
  | { kind: "answer"; label: string; value: string }
  | { kind: "rows"; rows: Row[] }
  | { kind: "welcome" }
  | { kind: "help"; authed: boolean }
  | { kind: "pages"; pages: Page[]; here: string }
  | { kind: "contact" }
  | { kind: "kpis"; s: VisitSummary }
  | { kind: "dashboard"; s: VisitSummary }
  | { kind: "visits"; visits: VisitEntry[] };

type Status = "run" | "ok" | "err";
type Entry = { id: number; cmd?: string; at: number; status: Status; out: Out[] };

type Stage =
  | { kind: "idle" }
  | { kind: "username"; entry: number }
  | { kind: "password"; entry: number; username: string }
  | { kind: "current"; entry: number }
  | { kind: "next"; entry: number; current: string }
  | { kind: "confirm"; entry: number; current: string; next: string };

type Group = "explore" | "terminal" | "studio";
type Spec = { name: string; args?: string; desc: string; aliases?: string[]; group: Group; auth?: boolean };

const COMMANDS: Spec[] = [
  { name: "about", desc: "Who I am, in short", aliases: ["whois"], group: "explore" },
  { name: "contact", desc: "Ways to reach me", group: "explore" },
  { name: "ls", desc: "The pages of this site", aliases: ["pages"], group: "explore" },
  { name: "open", args: "<page>", desc: "Go to a page", aliases: ["cd", "goto"], group: "explore" },
  { name: "cv", desc: "Download or open my CV", aliases: ["resume"], group: "explore" },
  { name: "present", args: "[deck]", desc: "Start a slide deck", group: "explore" },
  { name: "help", desc: "This list", aliases: ["?"], group: "terminal" },
  { name: "theme", args: "[light|dark]", desc: "Switch the site theme", group: "terminal" },
  { name: "whoami", desc: "Who is signed in here", group: "terminal" },
  { name: "clear", desc: "Clear the screen", aliases: ["cls"], group: "terminal" },
  { name: "exit", desc: "Close the terminal", aliases: ["quit", "close"], group: "terminal" },
  { name: "login", args: "[user]", desc: "Sign in to the studio", group: "studio" },
  { name: "logout", desc: "Sign out on this browser", group: "studio", auth: true },
  { name: "passwd", desc: "Change the admin password", group: "studio", auth: true },
  { name: "stats", desc: "Visitor totals", aliases: ["summary"], group: "studio", auth: true },
  { name: "dashboard", desc: "Visitor analytics in full", aliases: ["analytics"], group: "studio", auth: true },
  { name: "visits", args: "[n]", desc: "The most recent visits", aliases: ["tail"], group: "studio", auth: true },
  { name: "remote", desc: "The storage connection", aliases: ["bin"], group: "studio", auth: true },
  { name: "chatbot", args: "[on|off]", desc: "The site assistant", group: "studio" },
  { name: "studio", desc: "Open the Studio Console", aliases: ["console", "admin"], group: "studio" },
];

const GROUPS: { id: Group; title: string }[] = [
  { id: "explore", title: "Explore" },
  { id: "terminal", title: "Terminal" },
  { id: "studio", title: "Studio" },
];

const ALIAS = new Map<string, string>(
  COMMANDS.flatMap((c) => [c.name, ...(c.aliases ?? [])].map((w) => [w, c.name] as [string, string])),
);
const WORDS = [...ALIAS.keys()].filter((w) => w !== "?");
const STARTERS = ["help", "about", "contact", "ls", "cv", "present"];

type IconProps = { size?: number | string; strokeWidth?: number | string; className?: string };
type ChannelSpec = { label: string; href: string; copy: string; what: string; Icon: ComponentType<IconProps> };

const CHANNELS: ChannelSpec[] = [
  { label: "Email", href: `mailto:${profile.email}`, copy: profile.email, what: "Email address", Icon: Mail },
  { label: "LinkedIn", href: profile.links.linkedin, copy: profile.links.linkedin, what: "LinkedIn link", Icon: Linkedin },
  { label: "GitHub", href: profile.links.github, copy: profile.links.github, what: "GitHub link", Icon: Github },
  { label: "Google Scholar", href: profile.links.scholar, copy: profile.links.scholar, what: "Google Scholar link", Icon: GraduationCap },
  { label: "ORCID", href: profile.links.orcid, copy: profile.links.orcid, what: "ORCID link", Icon: IdCard },
  { label: "WhatsApp", href: profile.links.whatsapp, copy: profile.phone, what: "WhatsApp number", Icon: WhatsAppIcon },
  { label: "Facebook", href: profile.links.facebook, copy: profile.links.facebook, what: "Facebook link", Icon: Facebook },
];

const say = (text: string, tone?: Tone): Out => ({ kind: "text", text, tone });

// A keyboard console over the site (Alt+T): explore it, reach out, start a deck,
// or sign in and read the studio's analytics without opening the console.
export default function Terminal() {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const avatar = useAvatarUrl();
  const cv = useCvDownload();
  const { setTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>(() => [
    { id: 0, at: Date.now(), status: "ok", out: [{ kind: "welcome" }] },
  ]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [authed, setAuthed] = useState(() => isUnlocked());
  const [history, setHistory] = useState<string[]>(() => loadHistory());
  const [cursor, setCursor] = useState<number | null>(null);

  const logRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const nextId = useRef(1);

  const close = useCallback(() => setOpen(false), []);

  // Alt+T toggles it anywhere. The key code is matched, not the character, so
  // macOS (where Alt+T types a dagger) works too.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.altKey && !e.ctrlKey && !e.metaKey && e.code === "KeyT") {
        e.preventDefault();
        if (!open) setAuthed(isUnlocked());
        setOpen(!open);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const back = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = overflow;
      back?.focus();
    };
  }, [open]);

  // Follow new output, but never past the top of the latest command: a long
  // answer (help, a dashboard) is read from its first line.
  useEffect(() => {
    const el = logRef.current;
    const last = el?.lastElementChild as HTMLElement | null | undefined;
    if (!el || !last) return;
    el.scrollTop = last.offsetHeight > el.clientHeight ? last.offsetTop - el.offsetTop : el.scrollHeight;
  }, [entries, open]);

  const begin = useCallback((cmd: string, out: Out[], status: Status = "ok") => {
    const id = nextId.current++;
    setEntries((es) => [...es, { id, cmd, at: Date.now(), status, out }]);
    return id;
  }, []);

  const append = useCallback((id: number, out: Out[], status?: Status) => {
    setEntries((es) =>
      es.map((e) => (e.id === id ? { ...e, out: [...e.out, ...out], status: status ?? e.status } : e)),
    );
  }, []);

  const remember = (line: string) => {
    const next = [...history.filter((h) => h !== line), line].slice(-50);
    setHistory(next);
    saveHistory(next);
    setCursor(null);
  };

  const answer = async (raw: string) => {
    const s = stage;
    if (s.kind === "idle") return;
    const cancel = (note: string) => {
      append(s.entry, [say(note, "muted")]);
      setStage({ kind: "idle" });
    };
    switch (s.kind) {
      case "username": {
        const username = raw.trim();
        if (!username) return cancel("Sign-in cancelled.");
        append(s.entry, [{ kind: "answer", label: "username", value: username }]);
        setStage({ kind: "password", entry: s.entry, username });
        return;
      }
      case "password": {
        if (!raw) return cancel("Sign-in cancelled.");
        append(s.entry, [{ kind: "answer", label: "password", value: MASK }], "run");
        setStage({ kind: "idle" });
        const res = await verifyCredentials(s.username, raw);
        if (res.kind === "ok") {
          markUnlocked();
          setAuthed(true);
          append(s.entry, [say(`Signed in as ${s.username}.`, "ok"), say("Try `stats`, `dashboard` or `visits`.", "muted")], "ok");
        } else {
          append(s.entry, [say(res.reason, "err")], "err");
        }
        return;
      }
      case "current":
        if (!raw) return cancel("Cancelled.");
        append(s.entry, [{ kind: "answer", label: "current", value: MASK }]);
        setStage({ kind: "next", entry: s.entry, current: raw });
        return;
      case "next":
        if (!raw) return cancel("Cancelled.");
        append(s.entry, [{ kind: "answer", label: "new", value: MASK }]);
        if (raw.length < 8) {
          append(s.entry, [say("The new password needs at least 8 characters.", "err")], "err");
          setStage({ kind: "idle" });
          return;
        }
        setStage({ kind: "confirm", entry: s.entry, current: s.current, next: raw });
        return;
      case "confirm": {
        append(s.entry, [{ kind: "answer", label: "confirm", value: MASK }], "run");
        setStage({ kind: "idle" });
        if (raw !== s.next) {
          append(s.entry, [say("The two new passwords do not match.", "err")], "err");
          return;
        }
        const res = await changePassword(s.current, s.next);
        append(s.entry, [res.kind === "ok" ? say("Password updated.", "ok") : say(res.reason, "err")], res.kind === "ok" ? "ok" : "err");
        return;
      }
    }
  };

  const run = async (raw: string) => {
    if (stage.kind !== "idle") return answer(raw);
    const line = raw.trim();
    if (!line) return;
    remember(line);
    const [head, ...rest] = line.split(/\s+/);
    const arg = rest.join(" ");
    const signIn = () => void begin(line, [say("Sign in first: run `login`.", "err")], "err");

    switch (ALIAS.get(head.toLowerCase())) {
      case "help":
        begin(line, [{ kind: "help", authed }]);
        return;
      case "about":
        begin(line, [
          {
            kind: "rows",
            rows: [
              { k: "Name", v: profile.name },
              { k: "Role", v: profile.roleLong },
              { k: "Focus", v: "Backend architecture and applied machine learning" },
              { k: "Based in", v: profile.location },
            ],
          },
          say(profile.tagline),
          say("Run `contact` to reach me, or `open work` to see the work.", "muted"),
        ]);
        return;
      case "contact":
        begin(line, [{ kind: "contact" }]);
        return;
      case "ls":
        begin(line, [{ kind: "pages", pages: sitePages(), here: pathname }]);
        return;
      case "open": {
        if (!arg) return void begin(line, [say("Which page? Run `ls` to see them.", "warn")], "err");
        if (/^[~/]*admin/i.test(arg)) return void begin(line, [say("The studio opens with `studio`.", "warn")], "err");
        const page = resolvePage(arg, sitePages());
        if (!page) return void begin(line, [say(`No page called ${arg}. Run \`ls\` to see them.`, "err")], "err");
        begin(line, [say(`Opening ${page.label}.`, "ok")]);
        navigate(page.to);
        close();
        return;
      }
      case "cv": {
        const noun = cv.label === "Resume" ? "resume" : "CV";
        begin(line, [say(cv.download ? `Downloading the ${noun}.` : `Opening the ${noun} in a new tab.`, "ok")]);
        openLink(cv.href, cv.download);
        return;
      }
      case "present": {
        const want = arg.toLowerCase();
        const deck = want
          ? DECKS.find((d) => d.id === want || d.name.toLowerCase() === want)
          : DECKS.find((d) => d.id === deckForLens(getLens()));
        if (!deck) {
          const names = DECKS.map((d) => `\`present ${d.id}\``).join(", ");
          return void begin(line, [say(`No deck called ${arg}. Try ${names}.`, "err")], "err");
        }
        begin(line, [say(`Starting the ${deck.name} deck.`, "ok")]);
        close();
        startPresentation(deck.id);
        return;
      }
      case "theme": {
        const want = arg.toLowerCase();
        if (want && want !== "light" && want !== "dark") {
          return void begin(line, [say("Use `theme light` or `theme dark`.", "err")], "err");
        }
        const next = want === "light" || want === "dark" ? want : document.documentElement.classList.contains("dark") ? "light" : "dark";
        setTheme(next);
        begin(line, [say(`The site is now ${next}.`, "ok")]);
        return;
      }
      case "whoami": {
        if (!authed) return void begin(line, [say("Guest. Run `login` to sign in.", "muted")]);
        const id = begin(line, [], "run");
        const auth = await ensureAuth();
        if (auth) append(id, [say(`${auth.username}, signed in on this browser.`, "ok")], "ok");
        else append(id, [say("Signed in here, but the login store did not answer.", "warn")], "err");
        return;
      }
      case "clear":
        setEntries([]);
        return;
      case "exit":
        close();
        return;
      case "login": {
        if (authed) return void begin(line, [say("Already signed in. Run `logout` first.", "warn")]);
        const id = begin(line, [say("Sign in to the studio. Leave a prompt empty to cancel.", "muted")]);
        if (arg) {
          append(id, [{ kind: "answer", label: "username", value: arg }]);
          setStage({ kind: "password", entry: id, username: arg });
        } else {
          setStage({ kind: "username", entry: id });
        }
        return;
      }
      case "logout":
        if (!authed) return void begin(line, [say("Not signed in.", "muted")]);
        markLocked();
        setAuthed(false);
        begin(line, [say("Signed out on this browser.", "ok")]);
        return;
      case "passwd": {
        if (!authed) return signIn();
        const id = begin(line, [say("Change the admin password. Leave a prompt empty to cancel.", "muted")]);
        setStage({ kind: "current", entry: id });
        return;
      }
      case "stats":
      case "dashboard": {
        if (!authed) return signIn();
        const full = ALIAS.get(head.toLowerCase()) === "dashboard";
        const id = begin(line, [], "run");
        const s = summarise(await fetchVisits());
        append(id, [full ? { kind: "dashboard", s } : { kind: "kpis", s }], "ok");
        return;
      }
      case "visits": {
        if (!authed) return signIn();
        const n = Math.min(50, Math.max(1, parseInt(arg, 10) || 10));
        const id = begin(line, [], "run");
        const visits = (await fetchVisits()).slice(-n).reverse();
        append(id, visits.length ? [{ kind: "visits", visits }] : [say("No visits recorded yet.", "muted")], "ok");
        return;
      }
      case "remote": {
        if (!authed) return signIn();
        const id = begin(line, [], "run");
        const r = await fetchRemoteState();
        const on = isBinConfigured();
        const bin = getBinId();
        const rows: Row[] = [
          { k: "Status", v: !on ? "Not configured" : r ? "Connected" : "Configured, not answering", tone: on && r ? "ok" : "warn" },
          { k: "Provider", v: "JSONBin v3" },
          { k: "Bin", v: bin ? `ends ${bin.slice(-6)}` : "Not set" },
          { k: "Master key", v: hasEnvMasterKey() ? "From the build" : "Stored in this browser" },
          { k: "CV link", v: r?.cvUrl ?? "Not published" },
          { k: "Hire me", v: r?.hireMe === undefined ? "Not published" : r.hireMe ? "On" : "Off" },
          { k: "Updated", v: r?.updatedAt ? new Date(r.updatedAt).toLocaleString() : "Never" },
        ];
        append(id, [{ kind: "rows", rows }], on && r ? "ok" : "err");
        return;
      }
      case "chatbot": {
        const want = arg.toLowerCase();
        if (!want || want === "status") {
          const on = getChatbotEnabled();
          begin(line, [
            say(`The assistant is ${on ? "on" : "off"}.`, on ? "ok" : "muted"),
            ...(authed ? [say("Change it with `chatbot on` or `chatbot off`.", "muted")] : []),
          ]);
          return;
        }
        if (!authed) return signIn();
        if (want !== "on" && want !== "off") return void begin(line, [say("Use `chatbot on` or `chatbot off`.", "err")], "err");
        setChatbotEnabled(want === "on");
        begin(line, [say(`The assistant is now ${want}.`, "ok")]);
        return;
      }
      case "studio":
        begin(line, [say("Opening the Studio Console.", "ok")]);
        close();
        navigate(`${pathname}${search}#admin`);
        return;
      default: {
        const near = closest(head.toLowerCase());
        begin(
          line,
          [say(`Unknown command: ${head}`, "err"), say(near ? `Did you mean \`${near}\`?` : "Run `help` to see what is available.", "muted")],
          "err",
        );
      }
    }
  };

  const exec = (cmd: string) => {
    if (stage.kind !== "idle") return inputRef.current?.focus();
    void run(cmd);
    inputRef.current?.focus();
  };

  const fill = (cmd: string) => {
    setInput(cmd);
    inputRef.current?.focus();
  };

  const staged = stage.kind !== "idle";
  const secret = staged && stage.kind !== "username";
  const completion = staged ? "" : complete(input, sitePages());
  const ghost = completion.slice(input.length);

  const onInputKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    if (e.key === "Tab") {
      e.preventDefault();
      if (completion) setInput(completion);
      return;
    }
    if (e.key === "ArrowRight" && ghost && el.selectionStart === input.length) {
      e.preventDefault();
      setInput(completion);
      return;
    }
    if ((e.key === "ArrowUp" || e.key === "ArrowDown") && !staged) {
      e.preventDefault();
      if (!history.length) return;
      if (e.key === "ArrowUp") {
        const i = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
        setCursor(i);
        setInput(history[i]);
      } else if (cursor !== null) {
        const i = cursor + 1;
        setCursor(i < history.length ? i : null);
        setInput(i < history.length ? history[i] : "");
      }
      return;
    }
    if (e.ctrlKey && !e.altKey && (e.key === "l" || e.key === "L")) {
      e.preventDefault();
      setEntries([]);
      return;
    }
    if (e.ctrlKey && !e.altKey && (e.key === "c" || e.key === "C") && el.selectionStart === el.selectionEnd) {
      e.preventDefault();
      if (stage.kind !== "idle") {
        append(stage.entry, [say("Cancelled.", "muted")]);
        setStage({ kind: "idle" });
      }
      setInput("");
    }
  };

  // Escape and the arrows stay inside: the console and the deck listen for them too.
  const onRootKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
    } else if (e.key.startsWith("Arrow")) {
      e.stopPropagation();
    }
  };

  const focusPrompt = (e: ReactMouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a, button, input, label")) return;
    if (window.getSelection()?.toString()) return;
    inputRef.current?.focus();
  };

  if (!open) return null;

  return (
    <div className="tm-root" role="dialog" aria-modal="true" aria-label="Terminal" onKeyDown={onRootKey}>
      <div className="tm-backdrop" onClick={close} aria-hidden />
      <div className="tm-window" onMouseUp={focusPrompt}>
        <header className="tm-bar">
          <div className="tm-id">
            <img src={avatar} alt="" />
            <span className="tm-title">Terminal</span>
            <span className="tm-sub">Explore the site, or sign in to the studio</span>
          </div>
          <span className="tm-session" data-authed={authed || undefined}>
            <i aria-hidden />
            {authed ? "Signed in" : "Guest"}
          </span>
          <span className="tm-keys" aria-hidden>
            <kbd>Alt</kbd>
            <kbd>T</kbd>
          </span>
          <button type="button" className="tm-close" onClick={close} aria-label="Close terminal" title="Close (Esc)">
            <X size={17} strokeWidth={1.9} />
          </button>
        </header>

        <div ref={logRef} className="tm-log" aria-live="polite">
          {entries.map((entry) => (
            <section key={entry.id} className="tm-entry" data-status={entry.status}>
              {entry.cmd !== undefined && (
                <div className="tm-cmd">
                  <span className="tm-glyph" aria-hidden>❯</span>
                  <span className="tm-cmd-text">{entry.cmd}</span>
                  {entry.status === "run" ? (
                    <LoaderCircle size={14} strokeWidth={2.2} className="tm-spin" aria-label="Running" />
                  ) : (
                    <time className="tm-time">{fmtClock(entry.at)}</time>
                  )}
                </div>
              )}
              {entry.out.length > 0 && (
                <div className={entry.cmd === undefined ? "tm-out tm-out--flush" : "tm-out"}>
                  {entry.out.map((o, i) => (
                    <OutView key={i} o={o} avatar={avatar} exec={exec} fill={fill} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        <form
          className="tm-prompt"
          onSubmit={(e) => {
            e.preventDefault();
            const v = input;
            setInput("");
            void run(v);
          }}
        >
          <label htmlFor="tm-input" className="tm-ps">
            {staged ? (
              <span className="tm-ps-stage">{stageLabel(stage)}</span>
            ) : (
              <span className="tm-ps-path">{shortPath(pathname)}</span>
            )}
            <span className="tm-glyph" aria-hidden>❯</span>
          </label>
          <div className="tm-field">
            {ghost && (
              <span className="tm-ghost" aria-hidden>
                <span>{input}</span>
                {ghost}
              </span>
            )}
            <input
              id="tm-input"
              ref={inputRef}
              type={secret ? "password" : "text"}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setCursor(null);
              }}
              onKeyDown={onInputKey}
              className="tm-input"
              placeholder={staged ? "" : "Type a command"}
              aria-label={staged ? stageLabel(stage) : "Command"}
              enterKeyHint="go"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
            />
          </div>
          {ghost && (
            <button type="button" className="tm-accept" onClick={() => fill(completion)} aria-label={`Complete to ${completion}`}>
              Tab
            </button>
          )}
        </form>

        <footer className="tm-foot" aria-hidden>
          <span><kbd>Tab</kbd> complete</span>
          <span><kbd>↑</kbd><kbd>↓</kbd> history</span>
          <span><kbd>Ctrl</kbd><kbd>L</kbd> clear</span>
          <span><kbd>Ctrl</kbd><kbd>C</kbd> cancel</span>
          <span><kbd>Esc</kbd> close</span>
        </footer>
      </div>
    </div>
  );
}

// =============================================================================
// output
// =============================================================================

type Act = { exec: (cmd: string) => void; fill: (cmd: string) => void };

function OutView({ o, avatar, exec, fill }: { o: Out; avatar: string } & Act) {
  switch (o.kind) {
    case "text":
      return (
        <p className="tm-text" data-tone={o.tone}>
          <Rich text={o.text} exec={exec} />
        </p>
      );
    case "answer":
      return (
        <dl className="tm-answer">
          <dt>{o.label}</dt>
          <dd>{o.value}</dd>
        </dl>
      );
    case "rows":
      return (
        <dl className="tm-rows">
          {o.rows.map((r) => (
            <div key={r.k} className="contents">
              <dt>{r.k}</dt>
              <dd data-tone={r.tone}>{r.v}</dd>
            </div>
          ))}
        </dl>
      );
    case "welcome":
      return (
        <div className="tm-welcome">
          <div className="tm-hello">
            <img src={avatar} alt="" />
            <div className="min-w-0">
              <p className="tm-hello-name">{profile.name}</p>
              <p className="tm-hello-role">Backend architect and applied-ML researcher</p>
            </div>
          </div>
          <p className="tm-text" data-tone="muted">
            Type a command, or start with one of these. Tab completes and ↑ recalls.
          </p>
          <div className="tm-chips">
            {STARTERS.map((c) => (
              <button key={c} type="button" className="tm-chip" onClick={() => exec(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      );
    case "help":
      return (
        <div className="tm-help">
          {GROUPS.map((g) => (
            <div key={g.id}>
              <p className="tm-group-title">
                {g.title}
                {g.id === "studio" && !o.authed && (
                  <span>
                    <Lock size={10} strokeWidth={2.2} aria-hidden /> sign in first
                  </span>
                )}
              </p>
              {COMMANDS.filter((c) => c.group === g.id).map((c) => {
                const locked = c.auth && !o.authed;
                return (
                  <button
                    key={c.name}
                    type="button"
                    className="tm-row-btn"
                    data-locked={locked || undefined}
                    onClick={() => (c.args?.startsWith("<") ? fill(`${c.name} `) : exec(c.name))}
                  >
                    <span className="tm-help-cmd">
                      {c.name}
                      {c.args && <i> {c.args}</i>}
                    </span>
                    <span className="tm-help-desc">{c.desc}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      );
    case "pages":
      return (
        <div>
          {o.pages.map((p) => (
            <button key={p.to} type="button" className="tm-row-btn" onClick={() => exec(`open ${p.names[0]}`)}>
              <span className="tm-page-path">{shortPath(p.to)}</span>
              <span className="tm-page-name">
                {p.label}
                {p.to === o.here && <b>you are here</b>}
              </span>
            </button>
          ))}
        </div>
      );
    case "contact":
      return (
        <ul className="tm-channels">
          {CHANNELS.map((c) => (
            <ChannelRow key={c.label} c={c} />
          ))}
        </ul>
      );
    case "kpis":
      return <Kpis s={o.s} />;
    case "dashboard":
      return <Dashboard s={o.s} />;
    case "visits":
      return <Visits visits={o.visits} />;
  }
}

// Text with `command` spans that run when clicked.
function Rich({ text, exec }: { text: string; exec: (cmd: string) => void }) {
  const parts = text.split(/`([^`]+)`/);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <button key={i} type="button" className="tm-link" onClick={() => exec(p)}>
            {p}
          </button>
        ) : (
          p
        ),
      )}
    </>
  );
}

function ChannelRow({ c }: { c: ChannelSpec }) {
  const { copied, copy } = useCopy(c.copy, c.what);
  const external = c.href.startsWith("http");
  return (
    <li className="tm-channel">
      <c.Icon size={15} strokeWidth={1.8} />
      <span className="tm-channel-name">{c.label}</span>
      <a
        href={c.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="tm-act"
        aria-label={`Open ${c.label}`}
      >
        Open <ArrowUpRight size={12} strokeWidth={2} aria-hidden />
      </a>
      <button
        type="button"
        onClick={copy}
        className="tm-act"
        data-copied={copied || undefined}
        aria-label={`Copy ${c.what.toLowerCase()}`}
      >
        {copied ? <Check size={12} strokeWidth={2.4} aria-hidden /> : <Copy size={12} strokeWidth={2} aria-hidden />}
        {copied ? "Copied" : "Copy"}
      </button>
    </li>
  );
}

function Kpis({ s }: { s: VisitSummary }) {
  const items = [
    { k: "Page views", v: fmtCount(s.total) },
    { k: "Sessions", v: fmtCount(s.sessions) },
    { k: "Unique IPs", v: fmtCount(s.uniqueIps) },
    { k: "Top country", v: s.byCountry[0]?.name ?? "None yet" },
    { k: "Top device", v: s.byDevice[0]?.name ?? "None yet" },
    { k: "Top browser", v: s.byBrowser[0]?.name ?? "None yet" },
  ];
  return (
    <dl className="tm-kpis">
      {items.map((i) => (
        <div key={i.k} className="tm-kpi">
          <dt>{i.k}</dt>
          <dd title={i.v}>{i.v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Dashboard({ s }: { s: VisitSummary }) {
  const max = Math.max(1, ...s.byDay.map((d) => d.count));
  const week = s.byDay.reduce((n, d) => n + d.count, 0);
  return (
    <div className="tm-dash">
      <Kpis s={s} />
      <section className="tm-panel">
        <p className="tm-panel-title">
          Last 14 days <span>{fmtCount(week)} views</span>
        </p>
        <div className="tm-chart" role="img" aria-label={`Page views per day, peak ${max}`}>
          {s.byDay.map((d, i) => (
            <span
              key={d.day}
              title={`${d.day}: ${d.count}`}
              data-today={i === s.byDay.length - 1 || undefined}
              style={{ height: `${d.count ? Math.max(6, (d.count / max) * 100) : 2}%` }}
            />
          ))}
        </div>
        <div className="tm-days" aria-hidden>
          {s.byDay.map((d) => (
            <span key={d.day}>{d.day.slice(8)}</span>
          ))}
        </div>
      </section>
      <div className="tm-breakdowns">
        <Breakdown title="Countries" rows={s.byCountry} />
        <Breakdown title="Devices" rows={s.byDevice} />
        <Breakdown title="Browsers" rows={s.byBrowser} />
        <Breakdown title="Systems" rows={s.byOS} />
        <Breakdown title="Pages" rows={s.byPath} />
      </div>
    </div>
  );
}

function Breakdown({ title, rows }: { title: string; rows: { name: string; count: number }[] }) {
  const top = rows.slice(0, 5);
  const max = Math.max(1, ...top.map((r) => r.count));
  return (
    <section className="tm-panel">
      <p className="tm-panel-title">{title}</p>
      {top.length === 0 ? (
        <p className="tm-text" data-tone="muted">No data yet.</p>
      ) : (
        <ol className="tm-bars">
          {top.map((r) => (
            <li key={r.name}>
              <span className="tm-bars-name" title={r.name}>{r.name || "Unknown"}</span>
              <span className="tm-bars-track">
                <b style={{ width: `${(r.count / max) * 100}%` }} />
              </span>
              <span className="tm-bars-n">{r.count}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function Visits({ visits }: { visits: VisitEntry[] }) {
  return (
    <div className="tm-table-wrap">
      <table className="tm-table">
        <thead>
          <tr>
            <th>When</th>
            <th>Where</th>
            <th>Device</th>
            <th>Browser</th>
            <th>Path</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((v, i) => (
            <tr key={`${v.ts}-${i}`}>
              <td>{fmtWhen(v.ts)}</td>
              <td>{[v.city, v.countryCode].filter(Boolean).join(", ") || "Unknown"}</td>
              <td>{v.device}</td>
              <td>{v.browser}</td>
              <td>{v.path}</td>
              <td>{v.ip ?? "n/a"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================================
// helpers
// =============================================================================

function sitePages(): Page[] {
  const pages: Page[] = [{ to: "/", label: "Home", names: ["home"] }];
  for (const n of FOLIO_NAV) {
    pages.push({ to: n.to, label: n.label, names: [...new Set([n.label.toLowerCase(), n.to.slice(1)])] });
    if (n.to === "/work") {
      for (const c of caseStudies) pages.push({ to: `/work/${c.slug}`, label: `${c.name} case study`, names: [c.slug] });
    }
  }
  if (getHireMeEnabled() && freelance.available) pages.push({ to: "/hire", label: "Hire me", names: ["hire"] });
  return pages;
}

function resolvePage(arg: string, pages: Page[]): Page | undefined {
  const bare = arg.trim().toLowerCase().replace(/^~?\/?/, "").replace(/\/+$/, "");
  if (!bare) return pages[0];
  return pages.find((p) => p.to === `/${bare}` || p.names.includes(bare));
}

// The rest of the command or argument being typed, from the first match.
function complete(input: string, pages: Page[]): string {
  const m = /^(\S+)(\s+)(\S*)$/.exec(input);
  if (!m) {
    const q = input.toLowerCase();
    if (!q || /\s/.test(q)) return "";
    const hit = WORDS.find((w) => w.startsWith(q) && w !== q);
    return hit ? input + hit.slice(q.length) : "";
  }
  const q = m[3].toLowerCase();
  if (!q) return "";
  const name = ALIAS.get(m[1].toLowerCase());
  const options =
    name === "open" ? pages.flatMap((p) => p.names)
    : name === "present" ? DECKS.map((d) => d.id)
    : name === "theme" ? ["light", "dark"]
    : name === "chatbot" ? ["status", "on", "off"]
    : [];
  const hit = options.find((o) => o.startsWith(q) && o !== q);
  return hit ? input + hit.slice(q.length) : "";
}

function closest(word: string): string | null {
  if (word.length < 2) return null;
  const limit = word.length < 4 ? 1 : 2;
  let best: string | null = null;
  let score = limit + 1;
  for (const w of WORDS) {
    const d = distance(word, w);
    if (d < score) {
      score = d;
      best = ALIAS.get(w) ?? w;
    }
  }
  return best;
}

function distance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diag = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const up = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = up;
    }
  }
  return row[b.length];
}

function openLink(href: string, download: boolean) {
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noreferrer";
  if (download) a.download = "";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function stageLabel(s: Stage): string {
  switch (s.kind) {
    case "username":
      return "username";
    case "password":
      return "password";
    case "current":
      return "current password";
    case "next":
      return "new password";
    case "confirm":
      return "confirm password";
    default:
      return "";
  }
}

function shortPath(p: string): string {
  return p === "/" ? "~" : `~${p}`;
}

function fmtCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function fmtClock(at: number): string {
  const d = new Date(at);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fmtWhen(iso: string): string {
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return iso.slice(11, 16);
  const now = new Date();
  const sameDay =
    now.getFullYear() === t.getFullYear() && now.getMonth() === t.getMonth() && now.getDate() === t.getDate();
  const time = `${pad(t.getHours())}:${pad(t.getMinutes())}`;
  return sameDay ? time : `${pad(t.getMonth() + 1)}-${pad(t.getDate())} ${time}`;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function loadHistory(): string[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE);
    const list = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(list) ? list.filter((h): h is string => typeof h === "string") : [];
  } catch {
    return [];
  }
}

function saveHistory(h: string[]) {
  try {
    window.localStorage.setItem(HISTORY_STORAGE, JSON.stringify(h));
  } catch {
    /* storage blocked: history lasts for this visit only */
  }
}
