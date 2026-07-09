import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

type StoredEntry = {
  id: string;
  name: string;
  message: string;
  password: string;
  createdAt: string;
};

type PublicEntry = Omit<StoredEntry, "password">;

const STORE = "guestbook";

function entriesKey(clientId: string): string {
  return `${clientId}/entries`;
}

async function readEntries(clientId: string): Promise<StoredEntry[]> {
  const store = getStore({ name: STORE, consistency: "strong" });
  const raw = await store.get(entriesKey(clientId), { type: "json" });
  return Array.isArray(raw) ? (raw as StoredEntry[]) : [];
}

async function writeEntries(clientId: string, entries: StoredEntry[]): Promise<void> {
  const store = getStore({ name: STORE, consistency: "strong" });
  await store.setJSON(entriesKey(clientId), entries);
}

function toPublic(entry: StoredEntry): PublicEntry {
  return {
    id: entry.id,
    name: entry.name,
    message: entry.message,
    createdAt: entry.createdAt,
  };
}

function resolveClientId(req: Request): string | null {
  const url = new URL(req.url);
  return url.searchParams.get("clientId")?.trim() || null;
}

export default async (req: Request, _context: Context) => {
  const clientId = resolveClientId(req);
  if (!clientId) {
    return Response.json({ error: "client_required" }, { status: 400 });
  }

  if (req.method === "GET") {
    const entries = await readEntries(clientId);
    return Response.json(entries.map(toPublic));
  }

  if (req.method === "POST") {
    const body = (await req.json()) as {
      name?: string;
      message?: string;
      password?: string;
    };
    const name = body.name?.trim() ?? "";
    const message = body.message?.trim() ?? "";
    const password = body.password ?? "";

    if (!name || !message || !password) {
      return Response.json({ error: "invalid" }, { status: 400 });
    }
    if (message.length > 100) {
      return Response.json({ error: "too_long" }, { status: 400 });
    }

    const entry: StoredEntry = {
      id: crypto.randomUUID(),
      name,
      message,
      password,
      createdAt: new Date().toISOString(),
    };

    const entries = await readEntries(clientId);
    entries.push(entry);
    await writeEntries(clientId, entries);
    return Response.json(toPublic(entry));
  }

  if (req.method === "DELETE") {
    const body = (await req.json()) as { id?: string; password?: string };
    const id = body.id ?? "";
    const password = body.password ?? "";
    const entries = await readEntries(clientId);
    const target = entries.find((e) => e.id === id);
    if (!target || target.password !== password) {
      return Response.json({ ok: false }, { status: 403 });
    }
    await writeEntries(
      clientId,
      entries.filter((e) => e.id !== id),
    );
    return Response.json({ ok: true });
  }

  return Response.json({ error: "method_not_allowed" }, { status: 405 });
};
