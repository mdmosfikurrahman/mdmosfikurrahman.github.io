import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, EyeOff, MessageSquare, RefreshCw, Send, Trash2, X } from "lucide-react";
import {
  answerQuestion,
  deleteQuestion,
  fetchQuestions,
  setQuestionStatus,
} from "@/lib/qanda";
import type { QuestionEntry, QuestionStatus } from "@/lib/binStore";

type Tab = QuestionStatus | "all";

const TAB_ORDER: Tab[] = ["pending", "answered", "published", "rejected", "all"];
const TAB_LABEL: Record<Tab, string> = {
  pending: "Pending",
  answered: "Drafts",
  published: "Published",
  rejected: "Rejected",
  all: "All",
};

export default function AdminQandA() {
  const [items, setItems] = useState<QuestionEntry[]>([]);
  const [tab, setTab] = useState<Tab>("pending");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const all = await fetchQuestions();
    setItems(all);
    // Seed draft answers from existing data so editors don't lose work on tab switch.
    setDrafts((prev) => {
      const next: Record<string, string> = { ...prev };
      for (const q of all) {
        if (!(q.id in next)) next[q.id] = q.answer ?? "";
      }
      return next;
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = useMemo(() => {
    const c: Record<Tab, number> = { pending: 0, answered: 0, published: 0, rejected: 0, all: items.length };
    for (const q of items) c[q.status]++;
    return c;
  }, [items]);

  const visible = useMemo(() => {
    const sorted = items.slice().sort((a, b) => (a.askedAt < b.askedAt ? 1 : -1));
    if (tab === "all") return sorted;
    return sorted.filter((q) => q.status === tab);
  }, [items, tab]);

  const act = async (id: string, fn: () => Promise<unknown>) => {
    setBusyId(id);
    await fn();
    await load();
    setBusyId(null);
  };

  return (
    <div className="h-full flex flex-col gap-3 p-4 md:p-5 overflow-hidden">
      <header className="flex items-center justify-between gap-3 flex-wrap shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} strokeWidth={1.8} style={{ color: "hsl(var(--a-accent-deep))" }} aria-hidden />
          <span className="text-[12px]" style={{ color: "hsl(var(--a-ink-muted))" }}>
            Anonymous Q&amp;A — draft an answer, publish to show it on /ask.
          </span>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="a-btn a-btn-ghost py-1.5 px-2.5 text-[11.5px] inline-flex items-center gap-1.5"
        >
          <RefreshCw size={12} strokeWidth={1.9} aria-hidden className={loading ? "animate-spin" : ""} />
          {loading ? "Loading…" : "Refresh"}
        </button>
      </header>

      <nav
        role="tablist"
        className="flex items-center gap-0.5 p-0.5 rounded-[10px] w-fit shrink-0"
        style={{ background: "hsl(var(--a-border) / 0.4)", border: "1px solid hsl(var(--a-border))" }}
      >
        {TAB_ORDER.map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-all"
              style={{
                background: active ? "hsl(var(--a-surface))" : "transparent",
                color: active ? "hsl(var(--a-ink))" : "hsl(var(--a-ink-soft))",
                boxShadow: active ? "0 1px 2px hsl(222 22% 12% / 0.08)" : undefined,
              }}
            >
              {TAB_LABEL[t]}
              <span
                className="text-[10.5px] tabular-nums px-1.5 py-0.5 rounded"
                style={{
                  background: active ? "hsl(var(--a-accent-wash))" : "hsl(var(--a-border) / 0.6)",
                  color: active ? "hsl(var(--a-accent-deep))" : "hsl(var(--a-ink-muted))",
                }}
              >
                {counts[t]}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {visible.length === 0 ? (
          <p className="text-[12.5px] py-4" style={{ color: "hsl(var(--a-ink-muted))" }}>
            {loading ? "Loading…" : "Nothing here."}
          </p>
        ) : (
          <ul className="space-y-2.5">
            {visible.map((q) => (
              <li key={q.id}>
                <QuestionCard
                  entry={q}
                  draft={drafts[q.id] ?? ""}
                  busy={busyId === q.id}
                  onDraftChange={(v) =>
                    setDrafts((prev) => ({ ...prev, [q.id]: v }))
                  }
                  onSaveDraft={() => void act(q.id, () => answerQuestion(q.id, drafts[q.id] ?? "", false))}
                  onPublish={() => void act(q.id, () => answerQuestion(q.id, drafts[q.id] ?? "", true))}
                  onUnpublish={() => void act(q.id, () => setQuestionStatus(q.id, "answered"))}
                  onReject={() => void act(q.id, () => setQuestionStatus(q.id, "rejected"))}
                  onDelete={() => void act(q.id, () => deleteQuestion(q.id))}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function QuestionCard({
  entry,
  draft,
  busy,
  onDraftChange,
  onSaveDraft,
  onPublish,
  onUnpublish,
  onReject,
  onDelete,
}: {
  entry: QuestionEntry;
  draft: string;
  busy: boolean;
  onDraftChange: (v: string) => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onReject: () => void;
  onDelete: () => void;
}) {
  const statusColor =
    entry.status === "published"
      ? "hsl(var(--a-success))"
      : entry.status === "answered"
        ? "hsl(var(--a-accent-deep))"
        : entry.status === "rejected"
          ? "hsl(var(--a-danger))"
          : "hsl(var(--a-warn))";

  return (
    <article
      className="a-card p-3.5"
      style={{ opacity: busy ? 0.5 : 1, transition: "opacity 120ms ease" }}
    >
      <header className="flex items-baseline gap-2 flex-wrap mb-2">
        <span className="text-[10.5px] uppercase tracking-[0.08em] font-semibold" style={{ color: statusColor }}>
          ● {entry.status}
        </span>
        <span className="text-[10.5px] tabular-nums" style={{ color: "hsl(var(--a-ink-muted))" }}>
          {fmtAbs(entry.askedAt)}
        </span>
        {entry.country && (
          <span className="text-[10.5px]" style={{ color: "hsl(var(--a-ink-muted))" }}>
            · {entry.country}
          </span>
        )}
        {entry.ipHash && (
          <span
            className="text-[10.5px] font-mono"
            style={{ color: "hsl(var(--a-ink-faint))" }}
            title={entry.ipHash}
          >
            · {entry.ipHash.slice(0, 8)}
          </span>
        )}
      </header>

      <p
        className="text-[13px] leading-[1.55] whitespace-pre-wrap"
        style={{ color: "hsl(var(--a-ink))" }}
      >
        {entry.question}
      </p>

      <label className="block mt-3">
        <span className="a-label text-[10px] block mb-1.5">Your answer</span>
        <textarea
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          rows={4}
          placeholder="Draft an answer. Save as draft or publish directly."
          className="a-input w-full text-[12.5px] leading-[1.55] py-2"
          disabled={busy}
        />
      </label>

      <footer className="mt-2.5 flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={busy || !draft.trim()}
          className="a-btn a-btn-ghost py-1 px-2 text-[11.5px] inline-flex items-center gap-1"
        >
          <Check size={11} strokeWidth={2.4} aria-hidden /> Save draft
        </button>
        {entry.status !== "published" ? (
          <button
            type="button"
            onClick={onPublish}
            disabled={busy || !draft.trim()}
            className="a-btn a-btn-primary py-1 px-2 text-[11.5px] inline-flex items-center gap-1"
          >
            <Send size={11} strokeWidth={2.2} aria-hidden /> Publish
          </button>
        ) : (
          <button
            type="button"
            onClick={onUnpublish}
            disabled={busy}
            className="a-btn a-btn-ghost py-1 px-2 text-[11.5px] inline-flex items-center gap-1"
          >
            <EyeOff size={11} strokeWidth={2.2} aria-hidden /> Unpublish
          </button>
        )}
        {entry.status !== "rejected" && (
          <button
            type="button"
            onClick={onReject}
            disabled={busy}
            className="a-btn a-btn-ghost py-1 px-2 text-[11.5px] inline-flex items-center gap-1"
          >
            <X size={11} strokeWidth={2.4} aria-hidden /> Reject
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          className="a-btn a-btn-danger py-1 px-2 text-[11.5px] inline-flex items-center gap-1 ml-auto"
        >
          <Trash2 size={11} strokeWidth={2} aria-hidden /> Delete
        </button>
      </footer>
    </article>
  );
}

function fmtAbs(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
