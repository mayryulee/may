export type RsvpEmailEntry = {
  name: string;
  side: "groom" | "bride";
  attending: "yes" | "no";
  guestCount: number;
  message?: string;
  createdAt: string;
};

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function attendingLabel(attending: "yes" | "no"): string {
  return attending === "yes" ? "참석" : "불참";
}

function sideLabel(side: "groom" | "bride"): string {
  return side === "groom" ? "신랑측" : "신부측";
}

function formatCreatedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string): string =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
}

export async function sendRsvpEmail(opts: {
  to: string[];
  coupleLabel: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  entry: RsvpEmailEntry;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    console.error("RSVP email skipped: RESEND_API_KEY or RESEND_FROM_EMAIL missing");
    return false;
  }

  const { entry, to, coupleLabel, weddingDate, weddingTime, venueName } = opts;
  const status = attendingLabel(entry.attending);
  const guestLine =
    entry.attending === "yes" ? `<p><strong>동반 인원:</strong> ${entry.guestCount}명</p>` : "";
  const messageLine = entry.message
    ? `<p><strong>메시지:</strong><br>${escapeHtml(entry.message).replaceAll("\n", "<br>")}</p>`
    : "";

  const subject = `💍 [참석 의사 전달] ${entry.name} - ${status}`;
  const createdAtDisplay = formatCreatedAt(entry.createdAt);
  const textLines = [
    `${entry.name}님께서 참석 여부를 전달해 주셨습니다.`,
    `${coupleLabel} · ${weddingDate} ${weddingTime}`,
    venueName,
    "",
    `성함: ${entry.name}`,
    `측: ${sideLabel(entry.side)}`,
    `참석 여부: ${status}`,
    entry.attending === "yes" ? `동반 인원: ${entry.guestCount}명` : "",
    entry.message ? `메시지: ${entry.message}` : "",
    "",
    `접수 시각: ${createdAtDisplay}`,
  ].filter((line) => line !== "");
  const text = textLines.join("\n");
  const html = `
    <div style="font-family:sans-serif;line-height:1.6;color:#222">
      <h2 style="margin:0 0 12px;font-size:18px">${escapeHtml(entry.name)}님께서 참석 여부를 전달해 주셨습니다.</h2>
      <p style="margin:0 0 16px;color:#666">${escapeHtml(coupleLabel)} · ${escapeHtml(weddingDate)} ${escapeHtml(weddingTime)}<br>${escapeHtml(venueName)}</p>
      <p><strong>성함:</strong> ${escapeHtml(entry.name)}</p>
      <p><strong>측:</strong> ${sideLabel(entry.side)}</p>
      <p><strong>참석 여부:</strong> ${status}</p>
      ${guestLine}
      ${messageLine}
      <p style="margin-top:20px;font-size:12px;color:#999">접수 시각: ${escapeHtml(createdAtDisplay)}</p>
    </div>
  `.trim();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Resend API error:", res.status, detail);
    return false;
  }

  return true;
}
