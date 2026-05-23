import { useEffect, useMemo, useState, type FormEvent } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { askQuestion, fetchQuestions, publicQuestions } from "@/lib/qanda";
import { isBinConfigured, type QuestionEntry } from "@/lib/binStore";

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "ok" }
  | { kind: "err"; reason: string };

export default function QandA() {
  const [items, setItems] = useState<QuestionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    void (async () => {
      const all = await fetchQuestions();
      setItems(all);
      setLoading(false);
    })();
  }, []);

  const published = useMemo(() => publicQuestions(items), [items]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status.kind === "saving") return;
    setStatus({ kind: "saving" });
    const res = await askQuestion({ question, honeypot });
    if (res.kind === "ok") {
      setQuestion("");
      setHoneypot("");
      setStatus({ kind: "ok" });
    } else {
      setStatus({ kind: "err", reason: res.reason });
    }
  };

  return (
    <>
      <SiteHeader />
      <main>
        <header className="border-b rule-soft">
          <div className="shell py-14 md:py-20">
            <p className="sig">Ask</p>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-[-0.03em] mt-2 text-balance">
              Ask anything.
            </h1>
            <p className="mt-5 max-w-prose font-serif-body text-[1.075rem] leading-[1.6] text-ink-soft">
              Curious about a system, a paper, a career step? Drop the question — no name needed.
              I answer the interesting ones publicly so the next person doesn't have to ask again.
            </p>
          </div>
        </header>

        {/* Ask form */}
        <section className="border-b rule-soft">
          <div className="shell py-10 md:py-14 max-w-3xl">
            <form onSubmit={submit} className="grid grid-cols-1 gap-5">
              <label htmlFor="qa-q" className="block">
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
                  Your question
                </span>
                <textarea
                  id="qa-q"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                  minLength={6}
                  maxLength={600}
                  rows={4}
                  placeholder="Be specific — the more concrete, the better I can answer."
                  className="w-full bg-transparent border rule p-3 text-[15px] leading-[1.55] focus:outline-none focus:border-accent resize-y"
                  disabled={status.kind === "saving"}
                />
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {question.length}/600
                </p>
              </label>

              <div
                aria-hidden
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                }}
              >
                <label htmlFor="qa-url">URL (leave blank)</label>
                <input
                  id="qa-url"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="submit"
                  disabled={status.kind === "saving" || !isBinConfigured()}
                  className="px-4 py-2 bg-ink text-paper font-mono text-[11px] uppercase tracking-[0.18em] border rule-soft hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status.kind === "saving" ? "Sending…" : "Submit question"}
                </button>

                {status.kind === "ok" && (
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--accent-deep))]">
                    Thanks — I'll get to it.
                  </span>
                )}
                {status.kind === "err" && (
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-red-500">
                    {status.reason}
                  </span>
                )}
                {!isBinConfigured() && (
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Submissions currently disabled.
                  </span>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Published Q&A */}
        <section>
          <div className="shell py-10 md:py-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
              {loading
                ? "Loading…"
                : published.length === 0
                  ? "No published answers yet."
                  : `${published.length} ${published.length === 1 ? "answered" : "answered"}`}
            </p>
            <ol className="space-y-10">
              {published.map((q) => (
                <li key={q.id}>
                  <QACard entry={q} />
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function QACard({ entry }: { entry: QuestionEntry }) {
  return (
    <article>
      <header className="flex items-baseline gap-3 mb-3 flex-wrap">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--accent-deep))]">
          Q.
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {fmtDate(entry.askedAt)}
        </span>
      </header>
      <p className="font-serif-body text-[1.075rem] leading-[1.6] text-ink text-pretty whitespace-pre-wrap">
        {entry.question}
      </p>

      <div className="mt-5 pl-4 border-l-2" style={{ borderColor: "hsl(var(--accent))" }}>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] mb-2" style={{ color: "hsl(var(--accent-deep))" }}>
          A.
        </p>
        <p className="font-serif-body text-[15.5px] leading-[1.65] text-ink-soft text-pretty whitespace-pre-wrap">
          {entry.answer}
        </p>
        {entry.answeredAt && (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Answered {fmtDate(entry.answeredAt)}
          </p>
        )}
      </div>
    </article>
  );
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
