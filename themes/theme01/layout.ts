import { initAccountGift, renderGiftAccountsHtml } from "../../packages/core/account-gift";
import { initCalendarCountdown } from "../../packages/core/calendar-countdown";
import { initGallery, renderGalleryHtml } from "../../packages/core/gallery";
import { initGuestbook, renderGuestbookHtml } from "../../packages/core/guestbook";
import {
  initInformationCarousel,
  renderInformationHtml,
} from "../../packages/core/information-carousel";
import { initLocation, renderTransportHtml } from "../../packages/core/location";
import { renderQuoteHtml } from "../../packages/core/quote";
import { initShare, renderShareHtml } from "../../packages/core/share";
import type { ClientConfig, ThemeId, VenueTransport } from "../../packages/core/types";
import { clientImageUrl, themeImageUrl, themeIconUrl } from "../../packages/core/types";
import { sectionTitleEnClass } from "../../packages/core/section-heading";

const enc = (s: string) => encodeURIComponent(s);

const TRANSPORT_TITLE_SUFFIXES = [" 이용 시", " 안내"] as const;

function renderTheme01TransportTitle(title: string): string {
  for (const suffix of TRANSPORT_TITLE_SUFFIXES) {
    if (title.endsWith(suffix)) {
      const label = title.slice(0, -suffix.length);
      return `<p class="m-0 text-[16px] text-[#111111]"><span class="font-medium">${label}</span><span class="font-extralight">${suffix}</span></p>`;
    }
  }

  return `<p class="m-0 font-medium text-[16px] text-[#111111]">${title}</p>`;
}

function renderTheme01TransportHtml(transport: readonly VenueTransport[]): string {
  return `
    <div
      class="mt-10 mx-8 space-y-0 text-left font-noto text-[14px] leading-[1.85]"
    >
      ${renderTransportHtml(transport, {
        sectionClass: (i, total) =>
          i < total - 1 ? "border-b border-[#dddddd] py-8" : "pt-6",
        renderTitle: renderTheme01TransportTitle,
        linesClass: "m-0 mt-2",
        lineClass: "m-0",
        busLineClass: {
          trunk: "text-[12px] mt-2",
          branch: "text-[12px]",
          general: "text-[12px]",
          express: "text-[12px]",
          village: "text-[12px]",
        },
      })}
    </div>`;
}

export function renderPageHtml(config: ClientConfig, themeId: ThemeId): string {
  const { venue } = config;
  const groomParentNames = config.invitation.groomParents.parents.replace(/의$/, "");
  const brideParentNames = config.invitation.brideParents.parents.replace(/의$/, "");

  const invitationLines = config.invitation.lines
    .map((line, i) => {
      const margin = i === 3 ? "mt-6 m-0" : "m-0";
      return `<p class="${margin}">${line}</p>`;
    })
    .join("");

  return `
  <article>
    <header class="relative mr-3" aria-label="청첩장 타이틀">
      <img
        class="block w-full h-auto"
        src="${themeImageUrl(themeId, "title.png")}"
        alt="${config.header.titleImageAlt}"
        width="878"
        height="486"
        decoding="async"
      />
      <div
        class="absolute right-0 bottom-3 flex flex-col items-end font-cabinet text-[13px] leading-normal font-normal tracking-[0.16em] text-[#111111]"
        aria-label="예식 연월일"
      >
        <span class="block">${config.header.year}</span>
        <span class="block">${config.header.monthDay}</span>
      </div>
    </header>

    <img
      class="mt-[53px] mb-6 block aspect-[3/4] w-full object-cover object-center"
      src="${clientImageUrl(config.id, config.hero.image)}"
      alt="${config.hero.alt}"
      width="430"
      height="573"
      decoding="async"
    />

    <section class="text-center" aria-label="신랑 신부">
      <p class="m-0 inline-flex items-baseline justify-center gap-x-[14px] font-questrial text-[14px] leading-normal tracking-[0.05em] text-black">
        <span>${config.couple.groomEn}</span>
        <span class="font-sans tracking-[0.05em]">&amp;</span>
        <span>${config.couple.brideEn}</span>
      </p>
      <p
        class="mt-[16px] inline-flex items-baseline justify-center gap-x-[28px] font-jeju text-[17px] font-[300] leading-[24px] tracking-[-0.01em] text-black"
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
        class="mt-[48px] font-noto text-[14px] leading-[24px] tracking-normal"
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
        class="mt-[16px] text-[18px] font-normal leading-[20px] tracking-normal text-[#111111]"
      >
        소중한 분들을 초대합니다
      </h2>

      <div
        class="mt-[38px] text-[13px] font-normal leading-[24px] tracking-[-0.01em] text-black"
      >
        ${invitationLines}
      </div>

      <div
        class="mx-auto mt-[40px] h-px w-[50px] bg-[#d4d4d4]"
        aria-hidden="true"
      ></div>

      <div
        class="mt-[39px] space-y-[3px] text-[13px] font-normal leading-[20px] tracking-[-0.01em] text-[#111111]"
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
        class="-mx-[46px] mt-32 mb-0 block w-[calc(100%+92px)] max-w-none"
        src="${clientImageUrl(config.id, config.invitation.subImage)}"
        alt="${config.invitation.subImageAlt}"
        loading="lazy"
        decoding="async"
      />
    </section>

    <section
      class="-mx-[46px] bg-[#F7F7F7] py-12 text-center"
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

      <div class="mt-8 w-full px-[69px] text-center">
        <div
          class="mx-auto h-px w-full bg-[#dddddd]"
          aria-hidden="true"
        ></div>

        <div
          class="mx-auto mt-8 w-full px-8"
          aria-live="polite"
          aria-atomic="true"
        >
          <div
            class="grid w-full grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-end justify-items-center gap-x-2"
          >
            <div class="w-full text-center">
              <p
                class="m-0 font-optima text-dday-label font-normal uppercase tracking-tight text-[#6E6E6E]"
              >
                Days
              </p>
              <p
                id="count-days"
                class="m-0 mt-2 w-full font-zalando-sans text-dday-num font-[500] leading-none text-[#111111] transition-opacity duration-300"
              >
                000
              </p>
            </div>
            <span class="pb-1 font-optima text-dday-colon leading-none text-[#111111]"
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
                class="m-0 mt-2 w-full font-zalando-sans text-dday-num font-[500] leading-none text-[#111111] transition-opacity duration-300"
              >
                00
              </p>
            </div>
            <span class="pb-1 font-optima text-dday-colon leading-none text-[#111111]"
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
                class="m-0 mt-2 w-full font-zalando-sans text-dday-num font-[500] leading-none text-[#111111] transition-opacity duration-300"
              >
                00
              </p>
            </div>
            <span class="pb-1 font-optima text-dday-colon leading-none text-[#111111]"
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
                class="m-0 mt-2 w-full font-zalando-sans text-dday-num font-[500] leading-none text-[#111111] transition-opacity duration-300"
              >
                00
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full px-[50px] pt-10 text-center">
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

    ${renderGalleryHtml(config.id, config.gallery, themeId)}

    <section
      class="-mx-[46px] bg-[#F7F7F7] px-[25px] py-12 text-center"
      aria-label="오시는 길"
    >
      <header class="pb-8">
        <p
          class="${sectionTitleEnClass(themeId)}"
        >
          Location
        </p>
      </header>

      <div class="font-noto text-[#111111]">
        <p class="m-0 mb-3 text-[14px] font-normal tracking-tight">
          ${venue.name}
        </p>
        <p
          class="m-0 mt-2 flex flex-wrap items-center justify-center gap-x-1.5 text-[14px] font-extralight tracking-tight text-[#5D5D5D]"
        >
          <span>${venue.address}</span>
          <button
            id="copy-address"
            type="button"
            class="inline-flex shrink-0 items-center justify-center rounded border-0 bg-transparent p-0"
            aria-label="주소 복사"
          >
            <img
              src="${themeIconUrl(themeId, "copy.svg")}"
              alt=""
              class="block h-[13px] w-[13px] mx-1"
              decoding="async"
              aria-hidden="true"
            />
          </button>
        </p>
        <p class="m-0 mt-1 font-zalando-sans text-[14px] font-extralight tracking-tight text-[#666666]">
          Tel. ${venue.tel}
        </p>
      </div>

      <div
        id="venue-map"
        class="-mx-[25px] mt-6 h-[220px] w-[calc(100%+50px)] overflow-hidden bg-[#F7F7F7]"
        role="img"
        aria-label="${venue.name} 위치 지도"
      ></div>

      <div class="mt-3 flex items-center justify-center gap-4">
        <a
          data-map="kakao"
          href="https://map.kakao.com/?q=${enc(venue.name)}"
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-10 w-[109px] shrink-0 items-center justify-center rounded-md bg-white no-underline"
          aria-label="카카오맵"
        >
          <img
            src="${themeIconUrl(themeId, "navi-kakao.svg")}"
            alt=""
            width="69"
            height="24"
            class="block h-6 w-auto max-w-full object-contain"
            decoding="async"
            aria-hidden="true"
          />
        </a>
        <a
          data-map="naver"
          href="https://map.naver.com/p/search/${enc(venue.name)}/place/${venue.naverPlaceId}"
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-10 w-[109px] shrink-0 items-center justify-center rounded-md bg-white no-underline"
          aria-label="네이버 지도"
        >
          <img
            src="${themeIconUrl(themeId, "navi-naver.svg")}"
            alt=""
            width="69"
            height="24"
            class="block h-6 w-auto max-w-full object-contain"
            decoding="async"
            aria-hidden="true"
          />
        </a>
        <a
          data-map="tmap"
          href="tmap://route?goalname=${enc(venue.name)}&amp;goalx=${venue.lng}&amp;goaly=${venue.lat}"
          rel="noopener noreferrer"
          class="flex h-10 w-[109px] shrink-0 items-center justify-center rounded-md bg-white no-underline"
          aria-label="T MAP"
        >
          <img
            src="${themeIconUrl(themeId, "navi-tmap.svg")}"
            alt=""
            width="74"
            height="24"
            class="block h-6 w-auto max-w-full object-contain"
            decoding="async"
            aria-hidden="true"
          />
        </a>
      </div>

      ${renderTheme01TransportHtml(venue.transport)}
    </section>

    ${renderGiftAccountsHtml(config.accounts, themeId)}

    ${renderInformationHtml(config.information, themeId)}

    ${renderGuestbookHtml(themeId)}

    ${renderQuoteHtml(config.quote, themeId)}

    ${renderShareHtml(themeId)}
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
  initGallery(root, config.id, config.gallery, themeId);
  initLocation(root, config.venue, themeId);
  initAccountGift(root);
  initInformationCarousel(root, config.information);
  initGuestbook(root, config.id);
  initShare(config.id, config.share);
}
