// Public guestbook with admin moderation. Visitors submit name + message;
// owner approves/rejects from the admin modal. Approved entries render
// publicly on /guestbook. Anti-abuse: honeypot, 1 submission per IP-hash
// per hour, FIFO cap of GUESTBOOK_CAP total entries.

import {
  fetchBin,
  GUESTBOOK_CAP,
  isBinConfigured,
  patchBin,
  type GuestbookEntry,
  type GuestbookStatus,
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

export async function fetchGuestbook(): Promise<GuestbookEntry[]> {
  const bin = await fetchBin();
  return bin?.guestbook ?? [];
}

// Public-facing view — only approved, newest first.
export function publicEntries(all: GuestbookEntry[]): GuestbookEntry[] {
  return all
    .filter((e) => e.status === "approved")
    .slice()
    .sort((a, b) => (a.ts < b.ts ? 1 : -1));
}

// ---------------------------------------------------------------------------
// SUBMIT (public)
// ---------------------------------------------------------------------------

export type SubmitInput = {
  name: string;
  message: string;
  honeypot?: string;
};

export type SubmitResult =
  | { kind: "ok"; entry: GuestbookEntry }
  | { kind: "err"; reason: string };

export async function submitEntry(input: SubmitInput): Promise<SubmitResult> {
  if (!isBinConfigured()) {
    return { kind: "err", reason: "Remote storage not configured." };
  }

  // Honeypot: drop silently from the user's perspective, but surface a fake
  // success to confuse simple bots. (Callers can treat this same as `ok`.)
  if (tripsHoneypot(input.honeypot)) {
    return {
      kind: "ok",
      entry: {
        id: newId(),
        name: input.name,
        message: input.message,
        ts: new Date().toISOString(),
        status: "rejected",
      },
    };
  }

  const name = input.name.trim();
  const message = input.message.trim();
  if (name.length < 1 || name.length > 80) {
    return { kind: "err", reason: "Name must be 1–80 characters." };
  }
  if (message.length < 4 || message.length > 1000) {
    return { kind: "err", reason: "Message must be 4–1000 characters." };
  }

  const ipHash = await hashCurrentIp();
  const geo = readCachedGeo();

  const existing = await fetchGuestbook();
  if (recentlySubmitted(existing, ipHash, SUBMISSION_THROTTLE_MS)) {
    return {
      kind: "err",
      reason: "You've already submitted recently — try again in an hour.",
    };
  }

  const entry: GuestbookEntry = {
    id: newId(),
    name,
    message,
    ts: new Date().toISOString(),
    status: "pending",
    ipHash: ipHash ?? undefined,
    country: geo.country,
  };

  const write = await patchBin((current) => {
    const list = (current.guestbook ?? []).concat([entry]);
    const trimmed = trimToCap(list);
    return { ...current, guestbook: trimmed, updatedAt: new Date().toISOString() };
  });

  if (write.kind !== "ok") return { kind: "err", reason: write.reason };
  return { kind: "ok", entry };
}

// ---------------------------------------------------------------------------
// MODERATE (admin)
// ---------------------------------------------------------------------------

export async function setStatus(
  id: string,
  status: GuestbookStatus,
): Promise<{ kind: "ok" } | { kind: "err"; reason: string }> {
  const write = await patchBin((current) => {
    const list = (current.guestbook ?? []).map((e) =>
      e.id === id
        ? { ...e, status, moderatedAt: new Date().toISOString() }
        : e,
    );
    return { ...current, guestbook: list, updatedAt: new Date().toISOString() };
  });
  if (write.kind !== "ok") return { kind: "err", reason: write.reason };
  return { kind: "ok" };
}

export async function deleteEntry(
  id: string,
): Promise<{ kind: "ok" } | { kind: "err"; reason: string }> {
  const write = await patchBin((current) => {
    const list = (current.guestbook ?? []).filter((e) => e.id !== id);
    return { ...current, guestbook: list, updatedAt: new Date().toISOString() };
  });
  if (write.kind !== "ok") return { kind: "err", reason: write.reason };
  return { kind: "ok" };
}

// ---------------------------------------------------------------------------
// internals
// ---------------------------------------------------------------------------

// If we're over the cap, drop oldest rejected first, then oldest pending, then
// oldest approved. Keeps the public view stable for as long as possible.
function trimToCap(list: GuestbookEntry[]): GuestbookEntry[] {
  if (list.length <= GUESTBOOK_CAP) return list;
  const priority: GuestbookStatus[] = ["rejected", "pending", "approved"];
  const sorted = list.slice().sort((a, b) => (a.ts < b.ts ? -1 : 1));
  for (const status of priority) {
    while (sorted.length > GUESTBOOK_CAP) {
      const idx = sorted.findIndex((e) => e.status === status);
      if (idx === -1) break;
      sorted.splice(idx, 1);
    }
    if (sorted.length <= GUESTBOOK_CAP) break;
  }
  return sorted;
}
