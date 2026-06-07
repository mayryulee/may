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
import type { ClientConfig, ThemeId } from "../../packages/core/types";
import { clientImageUrl, themeImageUrl, themeIconUrl } from "../../packages/core/types";

const enc = (s: string) => encodeURIComponent(s);

export function renderPageHtml(config: ClientConfig, themeId: ThemeId): string {
  const { venue } = config;

  const invitationLines = config.invitation.lines
    .map((line, i) => {
      const margin = i === 3 ? "mt-8 m-0" : "m-0";
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
        class="absolute right-0 bottom-3 flex flex-col items-end font-cabinet text-[0.8rem] leading-normal font-normal tracking-[0.16em] text-[#111111]"
        aria-label="예식 연월일"
      >
        <span class="block">${config.header.year}</span>
        <span class="block">${config.header.monthDay}</span>
      </div>
    </header>

    <img
      class="mt-[3.3rem] mb-6 block aspect-[3/4] w-full object-cover object-center"
      src="${clientImageUrl(config.id, config.hero.image)}"
      alt="${config.hero.alt}"
      width="430"
      height="573"
      decoding="async"
    />

    <section class="text-center" aria-label="신랑 신부">
      <p class="m-0 font-dm text-[0.92rem] tracking-[0.08em]">
        ${config.couple.groomEn} &amp; ${config.couple.brideEn}
      </p>
      <p
        class="mt-[0.65rem] font-noto text-[0.88rem] leading-relaxed tracking-[0.18em]"
      >
        신랑 ${config.couple.groomKo}&nbsp;&nbsp;&nbsp;신부 ${config.couple.brideKo}
      </p>
    </section>

    <div
      class="mx-auto my-[1.35rem] mb-[1.15rem] h-9 w-px bg-[#111111]"
      aria-hidden="true"
    ></div>

    <section class="text-center" aria-label="예식 일시·장소">
      <div class="flex flex-wrap items-baseline justify-center gap-1.5">
        <span class="font-dm text-[0.72rem] font-medium tracking-[0.22em]"
          >SAVE</span
        >
        <span
          class="font-great -translate-y-[0.05em] text-[1.05rem] tracking-wide"
          >the</span
        >
        <span class="font-dm text-[0.72rem] font-medium tracking-[0.22em]"
          >DATE</span
        >
      </div>
      <p
        class="mt-[0.85rem] font-cormorant text-[clamp(2.1rem,10.5vw,2.85rem)] leading-tight tracking-wide"
      >
        <span class="block">${config.dateDisplay.shortDate}</span>
        <span class="mt-[0.12em] block">${config.dateDisplay.time}</span>
      </p>
      <div
        class="mt-[1.35rem] font-noto text-[0.76rem] leading-[1.75] tracking-tight"
      >
        <p class="m-0">${config.dateDisplay.fullDateKo}</p>
        <p class="m-0">${config.dateDisplay.venueShort}</p>
      </div>
    </section>

    <section class="mt-20 text-center font-noto" aria-label="초대 인사">
      <div
        class="mx-auto h-[60px] w-px bg-[#d4d4d4]"
        aria-hidden="true"
      ></div>

      <div
        class="mx-auto mt-6 flex h-7 w-[8.75rem] items-center justify-center rounded-[50%] border border-[#111111]"
      >
        <span class="font-dm text-[0.62rem] font-normal tracking-[0.22em]"
          >INVITATION</span
        >
      </div>

      <h2
        class="mt-8 text-[1rem] font-medium tracking-tight text-[#111111]"
      >
        소중한 분들을 초대합니다
      </h2>

      <div
        class="mt-8 text-[0.84rem] font-extralight leading-[2.1] tracking-tight text-[#333333]"
      >
        ${invitationLines}
      </div>

      <div
        class="mx-auto mt-10 h-px w-10 bg-[#d4d4d4]"
        aria-hidden="true"
      ></div>

      <div
        class="mt-10 space-y-3 text-[0.86rem] font-extralight tracking-tight text-[#111111]"
      >
        <p class="m-0 flex flex-wrap items-baseline justify-center gap-x-6">
          <span>${config.invitation.groomParents.parents}</span>
          <span>${config.invitation.groomParents.relation}</span>
          <span>${config.invitation.groomParents.name}</span>
        </p>
        <p class="m-0 flex flex-wrap items-baseline justify-center gap-x-6">
          <span>${config.invitation.brideParents.parents}</span>
          <span>${config.invitation.brideParents.relation}</span>
          <span>${config.invitation.brideParents.name}</span>
        </p>
      </div>

      <img
        class="-mx-[46px] mt-16 mb-0 block w-[calc(100%+92px)] max-w-none"
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
            class="grid w-full grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-end justify-items-center gap-x-1"
          >
            <div class="w-full text-center">
              <p
                class="m-0 font-cormorant text-dday-label font-normal uppercase tracking-[0.22em] text-[#999999]"
              >
                Days
              </p>
              <p
                id="count-days"
                class="m-0 mt-1 w-full font-dm text-dday-num font-semibold leading-none tabular-nums text-[#111111] transition-opacity duration-300"
              >
                000
              </p>
            </div>
            <span class="pb-1 font-dm text-dday-colon leading-none text-[#111111]"
              >:</span
            >
            <div class="w-full text-center">
              <p
                class="m-0 font-cormorant text-dday-label font-normal uppercase tracking-[0.22em] text-[#999999]"
              >
                Hour
              </p>
              <p
                id="count-hours"
                class="m-0 mt-1 w-full font-dm text-dday-num font-semibold leading-none tabular-nums text-[#111111] transition-opacity duration-300"
              >
                00
              </p>
            </div>
            <span class="pb-1 font-dm text-dday-colon leading-none text-[#111111]"
              >:</span
            >
            <div class="w-full text-center">
              <p
                class="m-0 font-cormorant text-dday-label font-normal uppercase tracking-[0.22em] text-[#999999]"
              >
                Min
              </p>
              <p
                id="count-mins"
                class="m-0 mt-1 w-full font-dm text-dday-num font-semibold leading-none tabular-nums text-[#111111] transition-opacity duration-300"
              >
                00
              </p>
            </div>
            <span class="pb-1 font-dm text-dday-colon leading-none text-[#111111]"
              >:</span
            >
            <div class="w-full text-center">
              <p
                class="m-0 font-cormorant text-dday-label font-normal uppercase tracking-[0.22em] text-[#999999]"
              >
                Sec
              </p>
              <p
                id="count-secs"
                class="m-0 mt-1 w-full font-dm text-dday-num font-semibold leading-none tabular-nums text-[#111111] transition-opacity duration-300"
              >
                00
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full px-[69px] pt-10 text-center">
        <p
          class="m-0 w-full font-noto text-[calc(1.03rem-2px)] leading-snug tracking-tight text-[#111111]"
        >
          ${config.couple.ddayLabel}
          결혼식이
          <span id="d-day-count" class="font-medium text-[#4a6fa5]">0</span>일
          남았습니다.
        </p>
      </div>
    </section>

    ${renderGalleryHtml(config.id, config.gallery)}

    <section
      class="-mx-[46px] bg-[#F7F7F7] px-[25px] py-12 text-center"
      aria-label="오시는 길"
    >
      <header class="pb-8">
        <p
          class="m-0 font-cormorant text-[1.05rem] font-normal uppercase tracking-[0.38em] text-[#111111]"
        >
          Location
        </p>
      </header>

      <div class="font-noto text-[#111111]">
        <p class="m-0 text-[0.92rem] font-normal tracking-tight">
          ${venue.name}
        </p>
        <p
          class="m-0 mt-3 flex flex-wrap items-center justify-center gap-x-1.5 text-[0.78rem] font-extralight tracking-tight text-[#333333]"
        >
          <span>${venue.address}</span>
          <button
            id="copy-address"
            type="button"
            class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded border-0 bg-transparent p-0"
            aria-label="주소 복사"
          >
            <img
              src="${themeIconUrl(themeId, "copy.svg")}"
              alt=""
              width="17"
              height="17"
              class="block h-[17px] w-[17px]"
              decoding="async"
              aria-hidden="true"
            />
          </button>
        </p>
        <p class="m-0 mt-2 text-[0.76rem] font-extralight tracking-tight text-[#666666]">
          Tel. ${venue.tel}
        </p>
      </div>

      <div
        id="venue-map"
        class="mt-6 h-[220px] w-full overflow-hidden rounded-sm bg-[#e8edf2]"
        role="img"
        aria-label="${venue.name} 위치 지도"
      ></div>

      <div class="mt-3 grid grid-cols-3 gap-2">
        <a
          data-map="kakao"
          href="https://map.kakao.com/?q=${enc(venue.name)}"
          target="_blank"
          rel="noopener noreferrer"
          class="flex flex-col items-center justify-center gap-1.5 rounded-md bg-white py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.08)] no-underline"
        >
          <span
            class="flex h-7 w-7 items-center justify-center rounded bg-[#FEE500] text-[0.55rem] font-bold text-[#3B1E1E]"
            aria-hidden="true"
            >K</span
          >
          <span class="font-noto text-[0.72rem] font-extralight text-[#111111]"
            >카카오</span
          >
        </a>
        <a
          data-map="naver"
          href="https://map.naver.com/p/search/${enc(venue.name)}/place/${venue.naverPlaceId}"
          target="_blank"
          rel="noopener noreferrer"
          class="flex flex-col items-center justify-center gap-1.5 rounded-md bg-white py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.08)] no-underline"
        >
          <span
            class="flex h-7 w-7 items-center justify-center rounded bg-[#03C75A] text-[0.7rem] font-bold text-white"
            aria-hidden="true"
            >N</span
          >
          <span class="font-noto text-[0.72rem] font-extralight text-[#111111]"
            >네이버</span
          >
        </a>
        <a
          data-map="tmap"
          href="tmap://route?goalname=${enc(venue.name)}&amp;goalx=${venue.lng}&amp;goaly=${venue.lat}"
          rel="noopener noreferrer"
          class="flex flex-col items-center justify-center gap-1.5 rounded-md bg-white py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.08)] no-underline"
        >
          <span
            class="flex h-7 w-7 items-center justify-center rounded bg-[#E4002B] text-[0.65rem] font-bold text-white"
            aria-hidden="true"
            >T</span
          >
          <span class="font-noto text-[0.72rem] font-extralight text-[#111111]"
            >T MAP</span
          >
        </a>
      </div>

      <div
        class="mt-10 space-y-0 border-t border-[#dddddd] text-left font-noto text-[0.76rem] font-extralight leading-[1.85] tracking-tight text-[#333333]"
      >
        ${renderTransportHtml(venue.transport)}
      </div>
    </section>

    ${renderGiftAccountsHtml(config.accounts, themeId)}

    ${renderInformationHtml(config.information)}

    ${renderGuestbookHtml(themeId)}

    ${renderQuoteHtml(config.quote)}

    ${renderShareHtml(themeId)}
  </article>
`;
}

export function initPage(
  root: ParentNode,
  config: ClientConfig,
  _themeId: ThemeId,
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
