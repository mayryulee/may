import { initAccountGift, renderGiftAccountsHtml } from "./sections/account-gift";
import { initCalendarCountdown } from "../../packages/shared/calendar-countdown";
import { initGallery, renderGalleryHtml } from "./sections/gallery";
import { initGuestbook, renderGuestbookHtml } from "./sections/guestbook";
import {
  initInformationCarousel,
  renderInformationHtml,
} from "./sections/information";
import { initLocation, renderLocationHtml } from "./sections/location";
import { renderQuoteHtml } from "./sections/quote";
import { initShare, renderShareHtml } from "./sections/share";
import type { ClientConfig, ThemeId } from "../../packages/shared/types";
import { clientImageUrl, themeImageUrl } from "../../packages/shared/types";

export function renderPageHtml(config: ClientConfig, themeId: ThemeId): string {

  const invitationLines = config.invitation.lines
    .map((line, i) => {
      const margin = i === 3 ? "mt-[24px] m-0" : "m-0";
      return `<p class="${margin}">${line}</p>`;
    })
    .join("");

  return /* html */ `
  <article class="font-jeju">
    <section aria-label="타이틀">
      <header class="pl-[45px] pt-[53px] pr-[62px] pb-[40px]">
        <div class="relative">
          <img
            class="block w-full h-auto"
            src="${themeImageUrl(themeId, "title.png")}"
            alt="${config.header.titleImageAlt}"
            width="878"
            height="486"
            decoding="async"
          />
          <div
            class="absolute right-0 bottom-[10px] flex flex-col items-end font-questrial text-[12px] font-normal tracking-wider"
            aria-label="예식 연월일"
          >
            <span class="block">${config.header.year}</span>
            <span class="block">${config.header.monthDay}</span>
          </div>
        </div>
      </header>

      <img
        class="block w-full px-[46px] object-cover object-center"
        src="${clientImageUrl(config.id, config.hero.image)}"
        alt="${config.hero.alt}"
        width="400"
        height="533"
        decoding="async"
      />
    </section>

    <section class="pt-[25px] flex flex-col gap-[21px] text-center" aria-label="신랑신부">
      <p class="m-0 inline-flex items-baseline justify-center gap-x-[8px] font-questrial text-[14px] tracking-wide">
        <span>${config.couple.groomEn}</span>
        <span class="font-quicksand text-[14px] tracking-wider">&amp;</span>
        <span>${config.couple.brideEn}</span>
      </p>
      <p class="inline-flex items-baseline justify-center gap-x-[22px] text-[17px] leading-[1.41] text-black">
        <span class="inline-flex items-baseline gap-x-[14px]">
          <span class="font-semibold">신랑</span>
          <span>${config.couple.groomKo}</span>
        </span>
        <span class="inline-flex items-baseline gap-x-[14px]">
          <span class="font-semibold">신부</span>
          <span>${config.couple.brideKo}</span>
        </span>
      </p>
    </section>

    <section class="pt-[57px] text-center" aria-label="예식안내">
      <div class="mb-[25px] mx-auto h-[70px] w-px bg-[#111111]" aria-hidden="true"></div>
      <img
        class="mx-auto block h-[68px] w-[262px]"
        src="${themeImageUrl(themeId, "date.png")}"
        alt="SAVE the DATE"
        width="524"
        height="136"
        decoding="async"
      />
      <p class="mt-[14px] flex flex-col gap-[12px] items-center font-milchella text-[33px] leading-none tracking-wide">
        <span class="w-fit">${config.dateDisplay.shortDate}</span>
        <span class="w-fit">${config.dateDisplay.time}</span>
      </p>
      <div class="mt-[60px] mb-[35px] text-[14px] leading-[1.7] tracking-tighter">
        <p class="m-0">${config.dateDisplay.fullDateKo}</p>
        <p class="m-0">${config.dateDisplay.venueShort}</p>
      </div>
      <div class="mx-auto h-[70px] w-px bg-[#111111]" aria-hidden="true"></div>
    </section>

    <section class="pt-[60px] text-center" aria-label="초대">
      <div class="mx-auto flex h-[22px] w-[78px] items-center justify-center rounded-[50%] border-[0.5px] border-[#111111]">
        <span class="font-sans text-[7.5px] font-normal uppercase tracking-[0.13em]">
          INVITATION
        </span>
      </div>
      <h2 class="mt-[16px] text-[18px] tracking-normal">
        소중한 분들을 초대합니다
      </h2>
      <div class="mt-[42px] text-[13px] leading-[1.8] tracking-tighter text-black">
        ${invitationLines}
      </div>
      <div class="mx-auto mt-[40px] h-px w-[50px] bg-[#d4d4d4]" aria-hidden="true"></div>

      <div class="px-[114px] mt-[40px] w-full space-y-[3px] text-[13px] font-normal leading-[1.54] tracking-tighter">
        <p class="m-0 flex items-baseline justify-between">
          <span class="text-left flex gap-0">
            <span class="font-medium">${config.invitation.groomParents.parents}</span>
            <span class="text-[#6E6E6E]">의</span>
          </span>
          <span class="inline-flex items-baseline justify-end gap-x-[6px] text-right">
            <span class="text-[#6E6E6E]">${config.invitation.groomParents.relation}</span>
            <span class="font-medium">${config.invitation.groomParents.name}</span>
          </span>
        </p>
        <p class="m-0 flex items-baseline justify-between">
          <span class="text-left flex gap-0">
            <span class="">${config.invitation.brideParents.parents}</span>
            <span class="text-[#6E6E6E]">의</span>
          </span>
          <span class="inline-flex items-baseline justify-end gap-x-[10px] text-right">
            <span class="text-[#6E6E6E]">${config.invitation.brideParents.relation}</span>
            <span class="">${config.invitation.brideParents.name}</span>
          </span>
        </p>
      </div>

      <img
        class="mt-[100px] mb-0 block w-full"
        src="${clientImageUrl(config.id, config.invitation.subImage)}"
        alt="${config.invitation.subImageAlt}"
        loading="lazy"
        decoding="async"
      />
    </section>

    <section class="bg-[#F7F7F7] text-center" aria-label="캘린더">
      <div class="w-full pt-[72px] pl-[76px] pr-[65px] text-center">
        <img
          class="mx-auto block w-full h-auto"
          src="${clientImageUrl(config.id, config.calendar.image)}"
          alt="${config.calendar.alt}"
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
          ${config.couple.groomGivenName}<span class="mx-[3px]">♥</span>${config.couple.brideGivenName} 결혼식이
          <span id="d-day-count" class="font-zalando-sans text-[#27467A]">0</span>일
          남았습니다.
        </p>
      </div>
    </section>

    ${renderGalleryHtml(config.id, config.gallery)}

    ${renderLocationHtml(config, themeId)}

    ${renderGiftAccountsHtml(config.accounts)}

    ${renderInformationHtml(config.information)}

    ${renderGuestbookHtml()}

    ${renderQuoteHtml(config.quote)}

    ${renderShareHtml()}
  </article>
`;
}

export function initPage(
  root: ParentNode,
  config: ClientConfig,
  themeId: ThemeId,
): void {
  const weddingAt = new Date(config.weddingAt);

  initCalendarCountdown(root, weddingAt);
  initGallery(root, config.id, config.gallery);
  initLocation(root, config.venue);
  initAccountGift(root);
  initInformationCarousel(root, config.information);
  initGuestbook(root, config.id);
  initShare(config.id, config.share);
}
