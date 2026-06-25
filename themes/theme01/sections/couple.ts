import type { ClientConfig } from "../../../packages/shared/types";

export function renderCoupleHtml(couple: ClientConfig["couple"]): string {
  return /* html */ `
    <section class="pt-[25px] flex flex-col gap-[21px] text-center" aria-label="신랑신부">
      <p class="m-0 inline-flex items-baseline justify-center gap-x-[8px] font-questrial text-[14px] tracking-wide">
        <span>${couple.groomEn}</span>
        <span class="font-quicksand text-[14px] tracking-wider">&amp;</span>
        <span>${couple.brideEn}</span>
      </p>
      <p class="inline-flex items-baseline justify-center gap-x-[22px] text-[17px] leading-[1.41] text-black">
        <span class="inline-flex items-baseline gap-x-[14px]">
          <span class="font-semibold">신랑</span>
          <span>${couple.groomKo}</span>
        </span>
        <span class="inline-flex items-baseline gap-x-[14px]">
          <span class="font-semibold">신부</span>
          <span>${couple.brideKo}</span>
        </span>
      </p>
    </section>`;
}
