import { useEffect, useMemo, useState, type FormEvent } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import {
  fetchGuestbook,
  publicEntries,
  submitEntry,
  type SubmitInput,
} from "@/lib/guestbook";
import { isBinConfigured, type GuestbookEntry } from "@/lib/binStore";

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "ok"; pending: boolean }
  | { kind: "err"; reason: string };

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); // bots fill this; humans don't see it
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    void (async () => {
      const all = await fetchGuestbook();
      setEntries(all);
      setLoading(false);
    })();
  }, []);

  const approved = useMemo(() => publicEntries(entries), [entries]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status.kind === "saving") return;
    setStatus({ kind: "saving" });
    const input: SubmitInput = { name, message, honeypot };
    const res = await submitEntry(input);
    if (res.kind === "ok") {
      setName("");
      setMessage("");
      setHoneypot("");
      setStatus({ kind: "ok", pending: res.entry.status === "pending" });
      // Don't optimistically show pending in the public list — moderation gate.
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
            <p className="sig">Guestbook</p>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-[-0.03em] mt-2 text-balance">
              Leave a note.
            </h1>
            <p className="mt-5 max-w-prose font-serif-body text-[1.075rem] leading-[1.6] text-ink-soft">
              A short message if our paths have crossed — a class together, a paper read,
              an interview, a hire, a thank-you. Notes are reviewed before they appear here.
            </p>
          </div>
        </header>

        {/* Form */}
        <section className="border-b rule-soft">
          <div className="shell py-10 md:py-14 max-w-3xl">
            <form onSubmit={submit} className="grid grid-cols-1 gap-5">
              <Field id="gb-name" label="Name">
                <input
                  id="gb-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={80}
                  placeholder="How you'd like to appear"
                  className="w-full bg-transparent border-b rule py-2 text-[15px] focus:outline-none focus:border-accent"
                  disabled={status.kind === "saving"}
                />
              </Field>

              <Field id="gb-message" label="Message">
                <textarea
                  id="gb-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  maxLength={1000}
                  rows={5}
                  placeholder="A few words — what brought you here?"
                  className="w-full bg-transparent border rule p-3 text-[15px] leading-[1.55] focus:outline-none focus:border-accent resize-y"
                  disabled={status.kind === "saving"}
                />
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {message.length}/1000
                </p>
              </Field>

              {/* Honeypot — visually hidden, autoComplete off, tabIndex -1 */}
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
                <label htmlFor="gb-website">Website (leave blank)</label>
                <input
                  id="gb-website"
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
                  {status.kind === "saving" ? "Sending…" : "Submit"}
                </button>

                {status.kind === "ok" && (
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--accent-deep))]">
                    Thanks — {status.pending ? "queued for review." : "received."}
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

        {/* List */}
        <section>
          <div className="shell py-10 md:py-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
              {loading
                ? "Loading…"
                : approved.length === 0
                  ? "No notes yet — be the first."
                  : `${approved.length} ${approved.length === 1 ? "note" : "notes"}`}
            </p>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              {approved.map((e) => (
                <li key={e.id}>
                  <Note entry={e} />
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

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function Note({ entry }: { entry: GuestbookEntry }) {
  return (
    <article className="border-l-2 pl-4" style={{ borderColor: "hsl(var(--accent) / 0.4)" }}>
      <p className="font-serif-body text-[15px] leading-[1.6] text-ink text-pretty whitespace-pre-wrap">
        {entry.message}
      </p>
      <footer className="mt-3 flex items-baseline gap-2 flex-wrap">
        <span className="text-[13.5px] font-medium text-ink">— {entry.name}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {fmtDate(entry.ts)}
          {entry.country ? ` · ${entry.country}` : ""}
        </span>
      </footer>
    </article>
  );
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
