export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

type StoredEntry = GuestbookEntry & { password: string };

const STORAGE_KEY = "may-guestbook-v1";

function readLocal(): StoredEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(entries: StoredEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

async function fetchApi<T>(
  init: RequestInit,
): Promise<T | null> {
  try {
    const res = await fetch("/.netlify/functions/guestbook", init);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function byNewest(a: GuestbookEntry, b: GuestbookEntry): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export async function listGuestbookEntries(): Promise<GuestbookEntry[]> {
  const remote = await fetchApi<GuestbookEntry[]>({ method: "GET" });
  if (remote) return remote.sort(byNewest);
  return readLocal().map(({ password: _p, ...entry }) => entry).sort(byNewest);
}

export async function addGuestbookEntry(input: {
  name: string;
  message: string;
  password: string;
}): Promise<GuestbookEntry> {
  const payload = {
    name: input.name.trim(),
    message: input.message.trim(),
    password: input.password,
  };

  const remote = await fetchApi<GuestbookEntry>({
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (remote) return remote;

  const entry: StoredEntry = {
    id: crypto.randomUUID(),
    ...payload,
    createdAt: new Date().toISOString(),
  };
  const entries = readLocal();
  entries.push(entry);
  writeLocal(entries);
  const { password: _p, ...publicEntry } = entry;
  return publicEntry;
}

export async function deleteGuestbookEntry(
  id: string,
  password: string,
): Promise<boolean> {
  const remote = await fetchApi<{ ok: boolean }>({
    method: "DELETE",
    body: JSON.stringify({ id, password }),
  });
  if (remote) return remote.ok;

  const entries = readLocal();
  const target = entries.find((e) => e.id === id);
  if (!target || target.password !== password) return false;
  writeLocal(entries.filter((e) => e.id !== id));
  return true;
}

export function formatGuestbookDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${day} ${h}:${min}`;
}
