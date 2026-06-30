import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { getRsvpNotifyContext } from "../rsvp-notify-config";
// Resend 이메일 알림 사용 시 import 해제
// import { sendRsvpEmail } from "../rsvp-send-email";

type StoredRsvpEntry = {
  id: string;
  clientId: string;
  name: string;
  attending: "yes" | "no";
  guestCount: number;
  message?: string;
  createdAt: string;
};

const STORE = "rsvp";

async function readEntries(clientId: string): Promise<StoredRsvpEntry[]> {
  const store = getStore({ name: STORE, consistency: "strong" });
  const raw = await store.get(`${clientId}/entries`, { type: "json" });
  return Array.isArray(raw) ? (raw as StoredRsvpEntry[]) : [];
}

async function writeEntries(
  clientId: string,
  entries: StoredRsvpEntry[],
): Promise<void> {
  const store = getStore({ name: STORE, consistency: "strong" });
  await store.setJSON(`${clientId}/entries`, entries);
}

export default async (req: Request, _context: Context) => {
  const url = new URL(req.url);
  const clientId = url.searchParams.get("clientId")?.trim() ?? "";

  if (!clientId) {
    return Response.json({ error: "client_required" }, { status: 400 });
  }

  const notifyCtx = getRsvpNotifyContext(clientId);
  if (!notifyCtx) {
    return Response.json({ error: "rsvp_disabled" }, { status: 404 });
  }

  if (req.method !== "POST") {
    return Response.json({ error: "method_not_allowed" }, { status: 405 });
  }

  const body = (await req.json()) as {
    name?: string;
    attending?: string;
    guestCount?: number;
    message?: string;
  };

  const name = body.name?.trim() ?? "";
  const attending: "yes" | "no" = body.attending === "no" ? "no" : "yes";
  const guestCount =
    attending === "no"
      ? 0
      : Math.min(10, Math.max(1, Number(body.guestCount) || 1));
  const message = body.message?.trim() || undefined;

  if (!name) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  if (message && message.length > 200) {
    return Response.json({ error: "too_long" }, { status: 400 });
  }

  const entry: StoredRsvpEntry = {
    id: crypto.randomUUID(),
    clientId,
    name,
    attending,
    guestCount,
    message,
    createdAt: new Date().toISOString(),
  };

  const entries = await readEntries(clientId);
  entries.push(entry);
  await writeEntries(clientId, entries);

  // --- Resend 이메일 알림 (사용 시 아래 블록 주석 해제) ---
  // const emailed = await sendRsvpEmail({
  //   to: notifyCtx.emails,
  //   coupleLabel: notifyCtx.coupleLabel,
  //   weddingDate: notifyCtx.weddingDate,
  //   weddingTime: notifyCtx.weddingTime,
  //   venueName: notifyCtx.venueName,
  //   entry,
  // });
  //
  // if (!emailed) {
  //   return Response.json({ error: "notify_failed" }, { status: 502 });
  // }

  return Response.json({ ok: true });
};
