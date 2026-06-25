import type { ClientConfig } from "../../../packages/shared/types";
import { clientImageUrl } from "../../../packages/shared/types";

export function renderCalendarHtml(
  clientId: string,
  calendar: ClientConfig["calendar"],
): string {
  const calendarSrc = clientImageUrl(clientId, calendar.image);

  return /* html */ `
    <section class="bg-[#F7F7F7] py-[48px] text-center" aria-label="캘린더">
      <div class="w-full px-[69px] text-center">
        <img
          class="mx-auto my-[96px] block w-full h-auto"
          src="${calendarSrc}"
          alt="${calendar.alt}"
          width="777"
          height="912"
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>`;
}
