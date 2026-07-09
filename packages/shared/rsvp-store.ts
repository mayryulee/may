import { storageScope } from "./storage-scope";
import type { ThemeId } from "./types";

export type RsvpAttending = "yes" | "no";
export type RsvpSide = "groom" | "bride";

export type RsvpSubmitInput = {
  name: string;
  side: RsvpSide;
  attending: RsvpAttending;
  guestCount: number;
  message?: string;
};

const SUBMITTED_KEY = (scope: string) => `may-rsvp-submitted-${scope}`;
const DISMISS_KEY = (scope: string) => `may-rsvp-dismiss-${scope}`;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function rsvpScope(clientId: string, themeId: ThemeId): string {
  return storageScope(clientId, themeId);
}

export function hasSubmittedRsvp(clientId: string, themeId: ThemeId): boolean {
  try {
    return localStorage.getItem(SUBMITTED_KEY(rsvpScope(clientId, themeId))) === "1";
  } catch {
    return false;
  }
}

export function isRsvpDismissedToday(clientId: string, themeId: ThemeId): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY(rsvpScope(clientId, themeId))) === todayKey();
  } catch {
    return false;
  }
}

export function markRsvpSubmitted(clientId: string, themeId: ThemeId): void {
  localStorage.setItem(SUBMITTED_KEY(rsvpScope(clientId, themeId)), "1");
}

export function dismissRsvpForToday(clientId: string, themeId: ThemeId): void {
  localStorage.setItem(DISMISS_KEY(rsvpScope(clientId, themeId)), todayKey());
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
  themeId: ThemeId,
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
    markRsvpSubmitted(clientId, themeId);
    return true;
  }
  return false;
}
