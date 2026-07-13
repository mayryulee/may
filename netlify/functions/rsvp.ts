import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { getRsvpNotifyContext } from "../rsvp-notify-config";
import { sendRsvpEmail } from "../rsvp-send-email";

type StoredRsvpEntry = {
  id: string;
  clientId: string;
  name: string;
  side: "groom" | "bride";
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
    side?: string;
    attending?: string;
    guestCount?: number;
    message?: string;
  };

  const name = body.name?.trim() ?? "";
  const side: "groom" | "bride" | null =
    body.side === "groom" || body.side === "bride" ? body.side : null;
  const attending: "yes" | "no" = body.attending === "no" ? "no" : "yes";
  const guestCount =
    attending === "no"
      ? 0
      : Math.min(10, Math.max(1, Number(body.guestCount) || 1));
  const message = body.message?.trim() || undefined;

  if (!name || !side) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  if (message && message.length > 100) {
    return Response.json({ error: "too_long" }, { status: 400 });
  }

  const entry: StoredRsvpEntry = {
    id: crypto.randomUUID(),
    clientId,
    name,
    side,
    attending,
    guestCount,
    message,
    createdAt: new Date().toISOString(),
  };

  const entries = await readEntries(clientId);
  entries.push(entry);
  await writeEntries(clientId, entries);

  // Resend 이메일 알림. 접수는 이미 저장됐으므로 메일 실패가 제출을 막지 않도록 로그만 남긴다.
  if (notifyCtx.emails.length > 0) {
    const emailed = await sendRsvpEmail({
      to: notifyCtx.emails,
      coupleLabel: notifyCtx.coupleLabel,
      weddingDate: notifyCtx.weddingDate,
      weddingTime: notifyCtx.weddingTime,
      venueName: notifyCtx.venueName,
      entry,
    });

    if (!emailed) {
      console.error(`RSVP notify email failed for client ${clientId}`);
    }
  }

  return Response.json({ ok: true });
};
