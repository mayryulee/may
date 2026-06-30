import sample01 from "../clients/sample01/config";
import sample02 from "../clients/sample02/config";
import type { ClientConfig } from "../packages/shared/types";

const configs: ClientConfig[] = [sample01, sample02];

export type RsvpNotifyContext = {
  emails: string[];
  coupleLabel: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
};

export function getRsvpNotifyContext(
  clientId: string,
): RsvpNotifyContext | null {
  const config = configs.find((c) => c.id === clientId);
  if (!config?.rsvp?.enabled) return null;

  const emails = config.rsvp.notify?.emails?.filter(Boolean) ?? [];
  // Resend 이메일 알림 사용 시 아래 조건 해제
  // if (emails.length === 0) return null;

  return {
    emails,
    coupleLabel: config.couple.ddayLabel,
    weddingDate: config.dateDisplay.fullDateKo,
    weddingTime: config.dateDisplay.time,
    venueName: config.venue.name,
  };
}
