// Anonymous Q&A. Visitors ask, owner answers and publishes from the admin
// modal. Only entries with status === "published" appear on the public page.
// Anti-abuse mirrors the guestbook layer.

import {
  fetchBin,
  isBinConfigured,
  patchBin,
  QUESTIONS_CAP,
  type QuestionEntry,
  type QuestionStatus,
} from "./binStore";
import {
  hashCurrentIp,
  newId,
  readCachedGeo,
  recentlySubmitted,
  SUBMISSION_THROTTLE_MS,
  tripsHoneypot,
} from "./abuse";

// ---------------------------------------------------------------------------
// READ
// ---------------------------------------------------------------------------

export async function fetchQuestions(): Promise<QuestionEntry[]> {
  const bin = await fetchBin();
  return bin?.questions ?? [];
}

export function publicQuestions(all: QuestionEntry[]): QuestionEntry[] {
  return all
    .filter((q) => q.status === "published" && q.answer && q.answer.trim().length > 0)
    .slice()
    .sort((a, b) => {
      // Sort by answered-at desc, fall back to asked-at.
      const ta = a.answeredAt ?? a.askedAt;
      const tb = b.answeredAt ?? b.askedAt;
      return ta < tb ? 1 : -1;
    });
}

// ---------------------------------------------------------------------------
// ASK (public)
// ---------------------------------------------------------------------------

export type AskInput = {
  question: string;
  honeypot?: string;
};

export type AskResult =
  | { kind: "ok"; entry: QuestionEntry }
  | { kind: "err"; reason: string };

export async function askQuestion(input: AskInput): Promise<AskResult> {
  if (!isBinConfigured()) {
    return { kind: "err", reason: "Remote storage not configured." };
  }
  if (tripsHoneypot(input.honeypot)) {
    return {
      kind: "ok",
      entry: {
        id: newId(),
        question: input.question,
        askedAt: new Date().toISOString(),
        status: "rejected",
      },
    };
  }

  const question = input.question.trim();
  if (question.length < 6 || question.length > 600) {
    return { kind: "err", reason: "Question must be 6–600 characters." };
  }

  const ipHash = await hashCurrentIp();
  const geo = readCachedGeo();

  const existing = await fetchQuestions();
  // Treat `askedAt` as the recency timestamp for throttle.
  const existingForThrottle = existing.map((q) => ({ ipHash: q.ipHash, ts: q.askedAt }));
  if (recentlySubmitted(existingForThrottle, ipHash, SUBMISSION_THROTTLE_MS)) {
    return {
      kind: "err",
      reason: "You asked a question recently — try again in an hour.",
    };
  }

  const entry: QuestionEntry = {
    id: newId(),
    question,
    askedAt: new Date().toISOString(),
    status: "pending",
    ipHash: ipHash ?? undefined,
    country: geo.country,
  };

  const write = await patchBin((current) => {
    const list = (current.questions ?? []).concat([entry]);
    const trimmed = trimToCap(list);
    return { ...current, questions: trimmed, updatedAt: new Date().toISOString() };
  });
  if (write.kind !== "ok") return { kind: "err", reason: write.reason };
  return { kind: "ok", entry };
}

// ---------------------------------------------------------------------------
// ANSWER + PUBLISH (admin)
// ---------------------------------------------------------------------------

export async function answerQuestion(
  id: string,
  answer: string,
  publish: boolean,
): Promise<{ kind: "ok" } | { kind: "err"; reason: string }> {
  const trimmed = answer.trim();
  if (trimmed.length === 0) {
    return { kind: "err", reason: "Answer can't be empty." };
  }
  const write = await patchBin((current) => {
    const list = (current.questions ?? []).map((q) =>
      q.id === id
        ? {
            ...q,
            answer: trimmed,
            answeredAt: new Date().toISOString(),
            status: (publish ? "published" : "answered") as QuestionStatus,
          }
        : q,
    );
    return { ...current, questions: list, updatedAt: new Date().toISOString() };
  });
  if (write.kind !== "ok") return { kind: "err", reason: write.reason };
  return { kind: "ok" };
}

export async function setQuestionStatus(
  id: string,
  status: QuestionStatus,
): Promise<{ kind: "ok" } | { kind: "err"; reason: string }> {
  const write = await patchBin((current) => {
    const list = (current.questions ?? []).map((q) => (q.id === id ? { ...q, status } : q));
    return { ...current, questions: list, updatedAt: new Date().toISOString() };
  });
  if (write.kind !== "ok") return { kind: "err", reason: write.reason };
  return { kind: "ok" };
}

export async function deleteQuestion(
  id: string,
): Promise<{ kind: "ok" } | { kind: "err"; reason: string }> {
  const write = await patchBin((current) => {
    const list = (current.questions ?? []).filter((q) => q.id !== id);
    return { ...current, questions: list, updatedAt: new Date().toISOString() };
  });
  if (write.kind !== "ok") return { kind: "err", reason: write.reason };
  return { kind: "ok" };
}

// ---------------------------------------------------------------------------
// internals
// ---------------------------------------------------------------------------

function trimToCap(list: QuestionEntry[]): QuestionEntry[] {
  if (list.length <= QUESTIONS_CAP) return list;
  // Drop oldest rejected, then oldest pending, then oldest answered, then oldest published.
  const priority: QuestionStatus[] = ["rejected", "pending", "answered", "published"];
  const sorted = list.slice().sort((a, b) => (a.askedAt < b.askedAt ? -1 : 1));
  for (const status of priority) {
    while (sorted.length > QUESTIONS_CAP) {
      const idx = sorted.findIndex((q) => q.status === status);
      if (idx === -1) break;
      sorted.splice(idx, 1);
    }
    if (sorted.length <= QUESTIONS_CAP) break;
  }
  return sorted;
}
