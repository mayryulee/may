import type { ClientConfig } from "../../../packages/shared/types";
import { themeImageUrl } from "../../../packages/shared/types";

const THEME_ID = "theme01" as const;

export function renderWeddingDateHtml(
  dateDisplay: ClientConfig["dateDisplay"],
): string {
  const dateSrc = themeImageUrl(THEME_ID, "date.png");

  return /* html */ `
    <section class="pt-[57px] text-center" aria-label="예식안내">
      <div class="mb-[25px] mx-auto h-[70px] w-px bg-[#111111]" aria-hidden="true"></div>
      <img
        class="mx-auto block h-[68px] w-[262px]"
        src="${dateSrc}"
        alt="SAVE the DATE"
        width="524"
        height="136"
        decoding="async"
      />
      <p class="mt-[14px] flex flex-col gap-[12px] items-center font-milchella text-[33px] leading-none tracking-wide">
        <span class="w-fit">${dateDisplay.shortDate}</span>
        <span class="w-fit">${dateDisplay.time}</span>
      </p>
      <div class="mt-[60px] mb-[35px] text-[14px] leading-[1.7] tracking-tighter">
        <p class="m-0">${dateDisplay.fullDateKo}</p>
        <p class="m-0">${dateDisplay.venueShort}</p>
      </div>
      <div class="mx-auto h-[70px] w-px bg-[#111111]" aria-hidden="true"></div>
    </section>`;
}
