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
  const groomParentNames = config.invitation.groomParents.parents.replace(/의$/, "");
  const brideParentNames = config.invitation.brideParents.parents.replace(/의$/, "");

  const invitationLines = config.invitation.lines
    .map((line, i) => {
      const margin = i === 3 ? "mt-[24px] m-0" : "m-0";
      return `<p class="${margin}">${line}</p>`;
    })
    .join("");

  return `
  <article>
    <header class="relative mr-[12px]" aria-label="청첩장 타이틀">
      <img
        class="block w-full h-auto"
        src="${themeImageUrl(themeId, "title.png")}"
        alt="${config.header.titleImageAlt}"
        width="878"
        height="486"
        decoding="async"
      />
      <div
        class="absolute right-0 bottom-[12px] flex flex-col items-end font-cabinet text-[13px] leading-normal font-normal tracking-[0.16em] text-[#111111]"
        aria-label="예식 연월일"
      >
        <span class="block">${config.header.year}</span>
        <span class="block">${config.header.monthDay}</span>
      </div>
    </header>

    <img
      class="mt-[53px] mb-[24px] block aspect-[3/4] w-full object-cover object-center"
      src="${clientImageUrl(config.id, config.hero.image)}"
      alt="${config.hero.alt}"
      width="430"
      height="573"
      decoding="async"
    />

    <section class="text-center" aria-label="신랑 신부">
      <p class="m-0 inline-flex items-baseline justify-center gap-x-[14px] font-questrial text-[14px] leading-normal tracking-wider text-black">
        <span>${config.couple.groomEn}</span>
        <span class="font-sans tracking-wider">&amp;</span>
        <span>${config.couple.brideEn}</span>
      </p>
      <p
        class="mt-[16px] inline-flex items-baseline justify-center gap-x-[28px] font-jeju text-[17px] font-[300] leading-[1.41] tracking-[-0.01em] text-black"
      >
        <span class="inline-flex items-baseline gap-x-[9px]">
          <span class="font-bold">신랑</span>
          <span>${config.couple.groomKo}</span>
        </span>
        <span class="inline-flex items-baseline gap-x-[9px]">
          <span class="font-bold">신부</span>
          <span>${config.couple.brideKo}</span>
        </span>
      </p>
    </section>

    <div
      class="mx-auto mt-[57px] h-[70px] w-px bg-[#111111]"
      aria-hidden="true"
    ></div>

    <section class="mt-[33px] text-center" aria-label="예식 일시·장소">
      <img
        class="mx-auto block h-[68px] w-[262px]"
        src="${themeImageUrl(themeId, "date.png")}"
        alt="SAVE the DATE"
        width="524"
        height="136"
        decoding="async"
      />
      <p
        class="mt-[14px] font-milchella text-[33px] font-[400] leading-[1.1] tracking-[0.03em]"
      >
        <span class="block">${config.dateDisplay.shortDate}</span>
        <span class="mt-[6px] block">${config.dateDisplay.time}</span>
      </p>
      <div
        class="mt-[48px] font-noto text-[14px] leading-[1.71] tracking-normal"
      >
        <p class="m-0">${config.dateDisplay.fullDateKo}</p>
        <p class="m-0">${config.dateDisplay.venueShort}</p>
      </div>
    </section>

    <section class="mt-[35px] text-center font-noto" aria-label="초대 인사">
      <div
        class="mx-auto h-[70px] w-px bg-[#d4d4d4]"
        aria-hidden="true"
      ></div>

      <div
        class="mx-auto mt-[60px] flex h-[22px] w-[78px] items-center justify-center rounded-[50%] border-[0.5px] border-[#111111]"
      >
        <span class="font-sans text-[7.5px] font-normal uppercase tracking-[0.13em]"
          >INVITATION</span
        >
      </div>

      <h2
        class="mt-[16px] text-[18px] font-normal leading-[1.11] tracking-normal text-[#111111]"
      >
        소중한 분들을 초대합니다
      </h2>

      <div
        class="mt-[38px] text-[13px] font-normal leading-[1.85] tracking-[-0.01em] text-black"
      >
        ${invitationLines}
      </div>

      <div
        class="mx-auto mt-[40px] h-px w-[50px] bg-[#d4d4d4]"
        aria-hidden="true"
      ></div>

      <div
        class="mt-[39px] space-y-[3px] text-[13px] font-normal leading-[1.54] tracking-[-0.01em] text-[#111111]"
      >
        <p class="m-0 flex flex-wrap items-baseline justify-center gap-x-[24px]">
          <span>
            <span class="font-medium">${groomParentNames}</span>
            <span class="text-[#6e6e6e]">의</span>
          </span>
          <span class="inline-flex items-baseline gap-x-[14px]">
            <span class="text-[#6e6e6e]">${config.invitation.groomParents.relation}</span>
            <span class="font-medium">${config.invitation.groomParents.name}</span>
          </span>
        </p>
        <p class="m-0 flex flex-wrap items-baseline justify-center gap-x-[24px]">
          <span>
            <span class="font-medium">${brideParentNames}</span>
            <span class="text-[#6e6e6e]">의</span>
          </span>
          <span class="inline-flex items-baseline gap-x-[14px]">
            <span class="text-[#6e6e6e]">${config.invitation.brideParents.relation}</span>
            <span class="font-medium">${config.invitation.brideParents.name}</span>
          </span>
        </p>
      </div>

      <img
        class="-mx-[46px] mt-[128px] mb-0 block w-[calc(100%+92px)] max-w-none"
        src="${clientImageUrl(config.id, config.invitation.subImage)}"
        alt="${config.invitation.subImageAlt}"
        loading="lazy"
        decoding="async"
      />
    </section>

    <section
      class="-mx-[46px] bg-[#F7F7F7] py-[48px] text-center"
      aria-label="예식까지 남은 시간"
    >
      <div class="w-full px-[69px] text-center">
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

      <div class="mt-[32px] w-full px-[69px] text-center">
        <div
          class="mx-auto h-px w-full bg-[#dddddd]"
          aria-hidden="true"
        ></div>

        <div
          class="mx-auto mt-[32px] w-full px-[32px]"
          aria-live="polite"
          aria-atomic="true"
        >
          <div
            class="grid w-full grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-end justify-items-center gap-x-[8px]"
          >
            <div class="w-full text-center">
              <p
                class="m-0 font-optima text-dday-label font-normal uppercase tracking-tight text-[#6E6E6E]"
              >
                Days
              </p>
              <p
                id="count-days"
                class="m-0 mt-[8px] w-full font-zalando-sans text-dday-num font-[500] leading-none text-[#111111] transition-opacity duration-300"
              >
                000
              </p>
            </div>
            <span class="pb-[4px] font-optima text-dday-colon leading-none text-[#111111]"
              >:</span
            >
            <div class="w-full text-center">
              <p
                class="m-0 font-optima text-dday-label font-normal uppercase tracking-tight text-[#6E6E6E]"
              >
                Hour
              </p>
              <p
                id="count-hours"
                class="m-0 mt-[8px] w-full font-zalando-sans text-dday-num font-[500] leading-none text-[#111111] transition-opacity duration-300"
              >
                00
              </p>
            </div>
            <span class="pb-[4px] font-optima text-dday-colon leading-none text-[#111111]"
              >:</span
            >
            <div class="w-full text-center">
              <p
                class="m-0 font-optima text-dday-label font-normal uppercase tracking-tight text-[#6E6E6E]"
              >
                Min
              </p>
              <p
                id="count-mins"
                class="m-0 mt-[8px] w-full font-zalando-sans text-dday-num font-[500] leading-none text-[#111111] transition-opacity duration-300"
              >
                00
              </p>
            </div>
            <span class="pb-[4px] font-optima text-dday-colon leading-none text-[#111111]"
              >:</span
            >
            <div class="w-full text-center">
              <p
                class="m-0 font-optima text-dday-label font-normal uppercase tracking-tight text-[#6E6E6E]"
              >
                Sec
              </p>
              <p
                id="count-secs"
                class="m-0 mt-[8px] w-full font-zalando-sans text-dday-num font-[500] leading-none text-[#111111] transition-opacity duration-300"
              >
                00
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full px-[50px] pt-[40px] text-center">
        <p
          class="m-0 w-full font-jeju text-[17px] leading-snug tracking-tighter text-[#111111]"
        >
          ${config.couple.ddayLabel}
          결혼식이
          <span id="d-day-count" class="font-zalando-sans font-[500] text-[#4a6fa5]">0</span>일
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
