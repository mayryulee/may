import { ALL_CLIENT_CONFIGS } from "../packages/shared/generated/client-registry";
import type { ClientConfig } from "../packages/shared/types";

export type RsvpNotifyContext = {
  emails: string[];
  coupleLabel: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
};

const configs: ClientConfig[] = [...ALL_CLIENT_CONFIGS];

export function getRsvpNotifyContext(
  clientId: string,
): RsvpNotifyContext | null {
  const config = configs.find((c) => c.id === clientId);
  if (!config?.rsvp?.enabled) return null;

  const emails = config.rsvp.notify?.emails?.filter(Boolean) ?? [];

  return {
    emails,
    coupleLabel: config.couple.ddayLabel,
    weddingDate: config.dateDisplay.fullDateKo,
    weddingTime: config.dateDisplay.time,
    venueName: config.venue.name,
  };
}
