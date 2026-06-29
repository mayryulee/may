import type { ClientConfig } from "../../../packages/shared/types";
import { themeImageUrl } from "../../../packages/shared/types";

const THEME_ID = "theme03" as const;

export function renderCalendarHtml(calendar: ClientConfig["calendar"]): string {
  const calendarSrc = themeImageUrl(THEME_ID, "calendar.png");

  return /* html */ `
    <section class="w-full" aria-label="캘린더">
      <img
        class="block w-full h-auto"
        src="${calendarSrc}"
        alt="${calendar.alt}"
        width="777"
        height="912"
        loading="lazy"
        decoding="async"
      />
    </section>`;
}
