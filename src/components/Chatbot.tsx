import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageSquare, RefreshCw, Send, Sparkles, X } from "lucide-react";
import {
  answer,
  DISPLAY_NAME,
  emptyContext,
  openingMessage,
  SUGGESTED_QUESTIONS,
  type ChatContext,
  type ChatMessage,
} from "@/lib/chatbot";
import { getChatbotEnabled, subscribeSettings } from "@/lib/settings";

const STORAGE_KEY = "portfolio-chatbot-v2";

// Streaming speed of bot replies (typewriter feel).
const STREAM_CHARS_PER_TICK = 2;
const STREAM_TICK_MS = 14;
const THINK_MIN_MS = 320;
const THINK_MAX_MS = 720;

type Persisted = {
  messages: ChatMessage[];
  ctx: ChatContext;
};

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function loadPersisted(): Persisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Persisted;
  } catch {
    return null;
  }
}

function savePersisted(p: Persisted) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* quota */
  }
}

export default function Chatbot() {
  const location = useLocation();
  const hideOnRoute = location.pathname.startsWith("/admin");

  const [enabled, setEnabled] = useState<boolean>(() => getChatbotEnabled());
  useEffect(() => subscribeSettings((s) => setEnabled(s.chatbotEnabled)), []);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ctx, setCtx] = useState<ChatContext>(emptyContext());
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [streamProgress, setStreamProgress] = useState(0);
  const [unread, setUnread] = useState(false);
  const [pristine, setPristine] = useState(true); // true until first user message

  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const streamTimer = useRef<number | null>(null);
  const thinkTimer = useRef<number | null>(null);

  // ---- initial state: seed with opener if first time
  useEffect(() => {
    const persisted = loadPersisted();
    if (persisted && persisted.messages.length) {
      setMessages(persisted.messages);
      setCtx(persisted.ctx);
      setPristine(!persisted.messages.some((m) => m.role === "user"));
      return;
    }
    seedOpener();
  }, []);

  function seedOpener() {
    const opener = openingMessage();
    const msg: ChatMessage = {
      id: genId(),
      role: "bot",
      text: opener.text,
      ts: Date.now(),
      chips: opener.chips,
    };
    setMessages([msg]);
    setCtx(emptyContext());
    setPristine(true);
  }

  // ---- persist on every change
  useEffect(() => {
    if (!messages.length) return;
    savePersisted({ messages, ctx });
  }, [messages, ctx]);

  // ---- autoscroll
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, streamProgress, thinking, open]);

  // ---- focus input on open
  useEffect(() => {
    if (open) {
      setUnread(false);
      const t = window.setTimeout(() => inputRef.current?.focus(), 80);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  // ---- ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // ---- cleanup timers
  useEffect(() => {
    return () => {
      if (streamTimer.current) window.clearInterval(streamTimer.current);
      if (thinkTimer.current) window.clearTimeout(thinkTimer.current);
    };
  }, []);

  const respond = useCallback(
    (userText: string) => {
      const userMsg: ChatMessage = { id: genId(), role: "user", text: userText, ts: Date.now() };
      setMessages((m) => [...m, userMsg]);
      setPristine(false);

      const { reply, nextCtx } = answer(userText, ctx);
      setCtx(nextCtx);

      setThinking(true);
      const wait = THINK_MIN_MS + Math.random() * (THINK_MAX_MS - THINK_MIN_MS);
      thinkTimer.current = window.setTimeout(() => {
        setThinking(false);
        const botMsg: ChatMessage = {
          id: genId(),
          role: "bot",
          text: reply.text,
          ts: Date.now(),
          chips: reply.chips,
        };
        setMessages((m) => [...m, botMsg]);
        setStreamingId(botMsg.id);
        setStreamProgress(0);
        if (streamTimer.current) window.clearInterval(streamTimer.current);
        streamTimer.current = window.setInterval(() => {
          setStreamProgress((p) => {
            const next = p + STREAM_CHARS_PER_TICK;
            if (next >= reply.text.length) {
              if (streamTimer.current) {
                window.clearInterval(streamTimer.current);
                streamTimer.current = null;
              }
              setStreamingId(null);
              return reply.text.length;
            }
            return next;
          });
        }, STREAM_TICK_MS);
        if (!open) setUnread(true);
      }, wait);
    },
    [ctx, open],
  );

  const onSend = useCallback(() => {
    const v = input.trim();
    if (!v || thinking || streamingId) return;
    setInput("");
    respond(v);
  }, [input, thinking, streamingId, respond]);

  const onChip = useCallback(
    (label: string) => {
      if (thinking || streamingId) return;
      respond(label);
    },
    [respond, thinking, streamingId],
  );

  const onReset = useCallback(() => {
    if (streamTimer.current) {
      window.clearInterval(streamTimer.current);
      streamTimer.current = null;
    }
    if (thinkTimer.current) {
      window.clearTimeout(thinkTimer.current);
      thinkTimer.current = null;
    }
    sessionStorage.removeItem(STORAGE_KEY);
    setThinking(false);
    setStreamingId(null);
    setStreamProgress(0);
    seedOpener();
  }, []);

  const renderedText = useCallback(
    (m: ChatMessage) => {
      if (m.role === "bot" && m.id === streamingId) {
        return m.text.slice(0, streamProgress);
      }
      return m.text;
    },
    [streamingId, streamProgress],
  );

  const initials = useMemo(() => "MR", []);
  const busy = thinking || !!streamingId;

  if (hideOnRoute) return null;
  if (!enabled) return null;

  return (
    <>
      {/* FAB — gentle attention pulse before first open */}
      <button
        type="button"
        aria-label={open ? "Close chatbot" : "Open chatbot"}
        title={open ? "Close" : `Ask ${DISPLAY_NAME}'s assistant`}
        onClick={() => setOpen((v) => !v)}
        className={[
          "group fixed bottom-5 right-5 md:bottom-8 md:right-8 z-50",
          "w-12 h-12 grid place-items-center",
          "bg-ink text-paper",
          "rounded-full",
          "shadow-[0_2px_0_hsl(var(--ink)/0.06),0_18px_36px_-14px_hsl(var(--ink)/0.55)]",
          "hover:scale-[1.04] active:scale-[0.96]",
          "transition-transform duration-200 ease-out print:hidden",
        ].join(" ")}
        style={{
          // ring + gentle ambient pulse when closed and not yet interacted
          boxShadow: open
            ? undefined
            : "0 0 0 0 hsl(var(--accent) / 0.45)",
          animation: !open && pristine ? "chatbot-fab-pulse 2.6s ease-out infinite" : undefined,
        }}
      >
        {open ? (
          <X size={18} strokeWidth={1.8} aria-hidden />
        ) : (
          <MessageSquare size={18} strokeWidth={1.8} aria-hidden />
        )}
        {!open && unread && (
          <span
            aria-hidden
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
            style={{
              background: "hsl(var(--accent))",
              boxShadow: "0 0 0 2px hsl(var(--paper))",
            }}
          />
        )}
      </button>

      {/* Panel */}
      <div
        role="dialog"
        aria-label={`${DISPLAY_NAME} portfolio assistant`}
        aria-hidden={!open}
        className={[
          "fixed z-50 print:hidden",
          // sizing
          "bottom-20 right-3 left-3 md:left-auto md:right-8 md:bottom-24",
          "md:w-[400px] max-h-[min(660px,calc(100vh-7rem))]",
          "flex flex-col",
          "rounded-[14px] overflow-hidden",
          "bg-paper",
          "shadow-[0_2px_0_hsl(var(--ink)/0.04),0_30px_60px_-22px_hsl(var(--ink)/0.55)]",
          "transition-all duration-220 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom-right",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
            : "opacity-0 translate-y-3 pointer-events-none scale-[0.96]",
        ].join(" ")}
        style={{ border: "1px solid hsl(var(--rule))" }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3.5"
          style={{
            borderBottom: "1px solid hsl(var(--rule))",
            background:
              "linear-gradient(180deg, hsl(var(--paper-glass)) 0%, hsl(var(--paper)) 100%)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="relative">
            <div
              className="w-9 h-9 grid place-items-center text-[12px] font-semibold tracking-wide rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--ink)) 0%, hsl(var(--ink-soft)) 100%)",
                color: "hsl(var(--paper))",
              }}
              aria-hidden
            >
              {initials}
            </div>
            {/* online indicator */}
            <span
              aria-hidden
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
              style={{
                background: "hsl(140 65% 45%)",
                boxShadow: "0 0 0 2px hsl(var(--paper)), 0 0 0 3px hsl(140 65% 45% / 0.25)",
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="text-[14px] font-semibold leading-tight flex items-center gap-1.5"
              style={{ color: "hsl(var(--ink))" }}
            >
              Ask {DISPLAY_NAME}
              <Sparkles
                size={12}
                strokeWidth={2}
                style={{ color: "hsl(var(--accent))" }}
                aria-hidden
              />
            </div>
            <div
              className="text-[11.5px] leading-tight mt-0.5 flex items-center gap-1.5"
              style={{ color: "hsl(var(--muted))" }}
            >
              <span>Portfolio assistant</span>
              <span style={{ color: "hsl(var(--whisper))" }}>·</span>
              <span>not a real AI</span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Clear chat"
            title="Clear chat"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-[11px] px-2 py-1 transition-all rounded-md"
            style={{
              border: "1px solid hsl(var(--rule))",
              color: "hsl(var(--ink-soft))",
              background: "hsl(var(--paper))",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = "hsl(var(--paper-deep))";
              el.style.borderColor = "hsl(var(--ink) / 0.4)";
              el.style.color = "hsl(var(--ink))";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = "hsl(var(--paper))";
              el.style.borderColor = "hsl(var(--rule))";
              el.style.color = "hsl(var(--ink-soft))";
            }}
          >
            <RefreshCw size={11} strokeWidth={2} aria-hidden />
            <span>Clear</span>
          </button>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="p-1.5 -mr-1 hover:opacity-70 transition-opacity rounded-md"
            style={{ color: "hsl(var(--ink))" }}
          >
            <X size={16} strokeWidth={1.8} aria-hidden />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
          style={{ scrollbarWidth: "thin" }}
        >
          {messages.map((m) => (
            <MessageBubble
              key={m.id}
              role={m.role}
              text={renderedText(m)}
              chips={m.role === "bot" && m.id !== streamingId ? m.chips : undefined}
              onChip={onChip}
              streaming={m.id === streamingId}
            />
          ))}
          {thinking && <TypingDots />}

          {/* Welcome state: surface suggestions as a discoverable grid */}
          {pristine && !thinking && (
            <div className="pt-2 pb-1">
              <div
                className="text-[10.5px] uppercase tracking-[0.12em] mb-2.5 font-semibold"
                style={{ color: "hsl(var(--whisper))" }}
              >
                Try asking
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => onChip(q)}
                    disabled={busy}
                    className="text-left text-[13px] px-3 py-2 transition-all duration-150 disabled:opacity-50"
                    style={{
                      border: "1px solid hsl(var(--rule))",
                      borderRadius: "8px",
                      background: "hsl(var(--paper))",
                      color: "hsl(var(--ink-soft))",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.background = "hsl(var(--paper-deep))";
                      el.style.borderColor = "hsl(var(--ink) / 0.4)";
                      el.style.color = "hsl(var(--ink))";
                      el.style.transform = "translateX(2px)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.background = "hsl(var(--paper))";
                      el.style.borderColor = "hsl(var(--rule))";
                      el.style.color = "hsl(var(--ink-soft))";
                      el.style.transform = "translateX(0)";
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSend();
          }}
          className="px-3 py-2.5 flex items-end gap-2"
          style={{
            borderTop: "1px solid hsl(var(--rule))",
            background:
              "linear-gradient(180deg, hsl(var(--paper)) 0%, hsl(var(--paper-glass)) 100%)",
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder={busy ? "Thinking…" : "Ask anything — work, papers, contact"}
            rows={1}
            disabled={busy}
            className="flex-1 resize-none bg-transparent outline-none text-[13.5px] leading-[1.5] py-2 px-2 max-h-32 placeholder:opacity-50 disabled:opacity-60"
            style={{ color: "hsl(var(--ink))" }}
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={!input.trim() || busy}
            className={[
              "w-9 h-9 grid place-items-center rounded-md",
              "transition-all duration-150",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              "hover:scale-[1.04] active:scale-[0.96]",
            ].join(" ")}
            style={{
              background: "hsl(var(--ink))",
              color: "hsl(var(--paper))",
            }}
          >
            <Send size={14} strokeWidth={1.9} aria-hidden />
          </button>
        </form>

        {/* Footer attribution */}
        <div
          className="px-4 py-2 text-[10px] tracking-wide text-center"
          style={{
            color: "hsl(var(--whisper))",
            borderTop: "1px solid hsl(var(--rule))",
            background: "hsl(var(--paper))",
          }}
        >
          Heuristic responses · sourced from {DISPLAY_NAME}'s portfolio data
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// pieces
// ---------------------------------------------------------------------------

function MessageBubble({
  role,
  text,
  chips,
  onChip,
  streaming,
}: {
  role: "user" | "bot";
  text: string;
  chips?: string[];
  onChip: (s: string) => void;
  streaming?: boolean;
}) {
  const isUser = role === "user";
  return (
    <div
      className={[
        "flex w-full items-end gap-2",
        isUser ? "justify-end" : "justify-start",
        "chatbot-message-enter",
      ].join(" ")}
    >
      {!isUser && <BotAvatar />}
      <div className={["max-w-[82%] flex flex-col", isUser ? "items-end" : "items-start"].join(" ")}>
        <div
          className="px-3.5 py-2.5 text-[13.5px] leading-[1.55] whitespace-pre-wrap break-words"
          style={{
            borderRadius: isUser ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
            background: isUser ? "hsl(var(--ink))" : "hsl(var(--paper-deep))",
            color: isUser ? "hsl(var(--paper))" : "hsl(var(--ink))",
            border: isUser
              ? "1px solid hsl(var(--ink))"
              : "1px solid hsl(var(--rule))",
            boxShadow: isUser
              ? "0 1px 0 hsl(var(--ink) / 0.1)"
              : "0 1px 0 hsl(var(--ink) / 0.03)",
          }}
        >
          {text}
          {streaming && (
            <span
              className="inline-block w-[6px] h-[14px] align-middle ml-0.5"
              style={{
                background: "hsl(var(--ink))",
                animation: "chatbot-caret 0.9s ease-in-out infinite",
              }}
              aria-hidden
            />
          )}
        </div>
        {!isUser && chips && chips.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onChip(c)}
                className="text-[11.5px] px-2.5 py-1 transition-all duration-150"
                style={{
                  border: "1px solid hsl(var(--rule))",
                  color: "hsl(var(--ink-soft))",
                  background: "hsl(var(--paper))",
                  borderRadius: "999px",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "hsl(var(--ink))";
                  el.style.color = "hsl(var(--paper))";
                  el.style.borderColor = "hsl(var(--ink))";
                  el.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "hsl(var(--paper))";
                  el.style.color = "hsl(var(--ink-soft))";
                  el.style.borderColor = "hsl(var(--rule))";
                  el.style.transform = "translateY(0)";
                }}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BotAvatar() {
  return (
    <div
      className="w-6 h-6 grid place-items-center rounded-full shrink-0 mb-1"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--ink)) 0%, hsl(var(--ink-soft)) 100%)",
        color: "hsl(var(--paper))",
      }}
      aria-hidden
    >
      <Sparkles size={11} strokeWidth={2} />
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex w-full items-end gap-2 justify-start chatbot-message-enter">
      <BotAvatar />
      <div
        className="px-3.5 py-2.5 inline-flex items-center gap-1"
        style={{
          borderRadius: "12px 12px 12px 4px",
          background: "hsl(var(--paper-deep))",
          border: "1px solid hsl(var(--rule))",
        }}
        aria-label="Thinking"
      >
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full"
      style={{
        background: "hsl(var(--ink-soft))",
        animation: `chatbot-dot 1.1s ${delay}ms infinite ease-in-out`,
      }}
      aria-hidden
    />
  );
}
