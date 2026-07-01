export type RsvpAttending = "yes" | "no";
export type RsvpSide = "groom" | "bride";

export type RsvpSubmitInput = {
  name: string;
  side: RsvpSide;
  attending: RsvpAttending;
  guestCount: number;
  message?: string;
};

const SUBMITTED_KEY = (clientId: string) => `may-rsvp-submitted-${clientId}`;
const DISMISS_KEY = (clientId: string) => `may-rsvp-dismiss-${clientId}`;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function hasSubmittedRsvp(clientId: string): boolean {
  try {
    return localStorage.getItem(SUBMITTED_KEY(clientId)) === "1";
  } catch {
    return false;
  }
}

export function isRsvpDismissedToday(clientId: string): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY(clientId)) === todayKey();
  } catch {
    return false;
  }
}

export function markRsvpSubmitted(clientId: string): void {
  localStorage.setItem(SUBMITTED_KEY(clientId), "1");
}

export function dismissRsvpForToday(clientId: string): void {
  localStorage.setItem(DISMISS_KEY(clientId), todayKey());
}

async function fetchRsvpApi<T>(
  clientId: string,
  init: RequestInit,
): Promise<T | null> {
  try {
    const res = await fetch(`/.netlify/functions/rsvp?clientId=${encodeURIComponent(clientId)}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function submitRsvp(
  clientId: string,
  input: RsvpSubmitInput,
): Promise<boolean> {
  const payload = {
    name: input.name.trim(),
    side: input.side,
    attending: input.attending,
    guestCount: input.guestCount,
    message: input.message?.trim() || undefined,
  };

  const result = await fetchRsvpApi<{ ok: true }>(clientId, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (result?.ok) {
    markRsvpSubmitted(clientId);
    return true;
  }
  return false;
}
