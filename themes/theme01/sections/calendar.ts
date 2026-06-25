import { initCalendarCountdown } from "../../../packages/shared/calendar-countdown";
import type { ClientConfig } from "../../../packages/shared/types";
import { clientImageUrl } from "../../../packages/shared/types";

export function renderCalendarHtml(
  clientId: string,
  calendar: ClientConfig["calendar"],
  couple: ClientConfig["couple"],
): string {
  const calendarSrc = clientImageUrl(clientId, calendar.image);

  return /* html */ `
    <section class="bg-[#F7F7F7] text-center" aria-label="캘린더">
      <div class="w-full pt-[72px] pl-[76px] pr-[65px] text-center">
        <img
          class="mx-auto block w-full h-auto"
          src="${calendarSrc}"
          alt="${calendar.alt}"
          width="777"
          height="912"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div class="mt-[26px] w-full text-center">
        <div class="mx-auto h-px w-[200px] origin-center scale-x-[-1.2] bg-[#d4d4d4]" aria-hidden="true"></div>

        <div
          class="mx-auto mt-[46px] w-full"
          aria-live="polite"
          aria-atomic="true"
          aria-label="디데이"
        >
          <div class="mx-auto inline-grid grid-cols-[auto_auto_auto_auto_auto_auto_auto] items-end justify-items-center gap-x-[8px]">
            <div class="flex flex-col items-center">
              <p class="m-0 w-fit font-optima text-[12px] font-normal uppercase tracking-tight text-[#6E6E6E]">
                Days
              </p>
              <p id="count-days" class="m-0 mt-[5px] w-fit font-zalando-sans text-[24px] text-[#111111] transition-opacity duration-300">
                000
              </p>
            </div>
            <span class="pb-[4px] font-optima text-[14px] leading-none text-[#111111]">:</span>
            <div class="flex flex-col items-center">
              <p class="m-0 w-fit font-optima text-[12px] font-normal uppercase tracking-tight text-[#6E6E6E]">
                Hour
              </p>
              <p id="count-hours" class="m-0 mt-[5px] w-fit font-zalando-sans text-[24px] text-[#111111] transition-opacity duration-300">
                00
              </p>
            </div>
            <span class="pb-[4px] font-optima text-[14px] leading-none text-[#111111]">:</span>
            <div class="flex flex-col items-center">
              <p class="m-0 w-fit font-optima text-[12px] font-normal uppercase tracking-tight text-[#6E6E6E]">
                Min
              </p>
              <p id="count-mins" class="m-0 mt-[5px] w-fit font-zalando-sans text-[24px] text-[#111111] transition-opacity duration-300">
                00
              </p>
            </div>
            <span class="pb-[4px] font-optima text-[14px] leading-none text-[#111111]">:</span>
            <div class="flex flex-col items-center">
              <p class="m-0 w-fit font-optima text-[12px] font-normal uppercase tracking-tight text-[#6E6E6E]">
                Sec
              </p>
              <p id="count-secs" class="m-0 mt-[5px] w-fit font-zalando-sans text-[24px] text-[#111111] transition-opacity duration-300">
                00
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full px-[50px] pt-[40px] pb-[72px] text-center">
        <p class="m-0 w-full text-[16px] tracking-tighter text-[#111111]" >
          ${couple.groomGivenName}<span class="mx-[3px]">♥</span>${couple.brideGivenName} 결혼식이
          <span id="d-day-count" class="font-zalando-sans text-[#27467A]">0</span>일
          남았습니다.
        </p>
      </div>
    </section>`;
}

export function initCalendar(root: ParentNode, weddingAt: Date): void {
  initCalendarCountdown(root, weddingAt);
}
