export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

function byNewest(a: GuestbookEntry, b: GuestbookEntry): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

async function fetchApi<T>(clientId: string, init: RequestInit): Promise<T> {
  const url = `/.netlify/functions/guestbook?clientId=${encodeURIComponent(clientId)}`;
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  if (!res.ok) throw new Error("guestbook_api_failed");
  return (await res.json()) as T;
}

export async function listGuestbookEntries(clientId: string): Promise<GuestbookEntry[]> {
  const entries = await fetchApi<GuestbookEntry[]>(clientId, { method: "GET" });
  return entries.sort(byNewest);
}

export async function addGuestbookEntry(
  clientId: string,
  input: { name: string; message: string; password: string },
): Promise<GuestbookEntry> {
  return fetchApi<GuestbookEntry>(clientId, {
    method: "POST",
    body: JSON.stringify({
      name: input.name.trim(),
      message: input.message.trim(),
      password: input.password,
    }),
  });
}

export async function deleteGuestbookEntry(
  clientId: string,
  id: string,
  password: string,
): Promise<boolean> {
  const url = `/.netlify/functions/guestbook?clientId=${encodeURIComponent(clientId)}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, password }),
  });
  if (res.status === 403) return false;
  if (!res.ok) throw new Error("guestbook_api_failed");
  const result = (await res.json()) as { ok: boolean };
  return result.ok;
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
