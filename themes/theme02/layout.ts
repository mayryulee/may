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
import { clientImageUrl, themeIconUrl, themeImageUrl } from "../../packages/core/types";

const enc = (s: string) => encodeURIComponent(s);

function renderTheme02TransportHtml(transport: readonly VenueTransport[]): string {
  return `
    <div
      class="mt-10 space-y-0 border-t border-[#dddddd] text-left font-noto text-[0.76rem] font-extralight leading-[1.85] tracking-tight text-[#333333]"
    >
      ${renderTransportHtml(transport, {
        sectionClass: (i, total) =>
          i < total - 1 ? "border-b border-[#dddddd] py-6" : "pt-6",
        renderTitle: (title) =>
          `<p class="m-0 font-medium text-[#111111]">${title}</p>`,
        linesClass: "m-0 mt-2",
        lineClass: "m-0",
        busLineClass: {
          trunk: "tracking-wide text-[#111111]",
          branch: "tracking-wide text-[#333333]",
          general: "text-[#555555]",
          express: "tracking-wide text-[#111111]",
          village: "text-[#555555]",
        },
      })}
    </div>`;
}

export function renderPageHtml(config: ClientConfig, themeId: ThemeId): string {
  const { venue } = config;

  const heroTitleLines =
    config.header.heroTitleLines ?? [config.header.titleImageAlt];
  const heroSubtitleLines =
    config.header.heroSubtitleLines ?? [
      config.dateDisplay.fullDateKo,
      config.dateDisplay.venueShort,
    ];

  const heroTitleHtml = heroTitleLines
    .map((line) => `<span class="block">${line}</span>`)
    .join("");
  const heroSubtitleHtml = heroSubtitleLines
    .map((line) => `<p class="m-0">${line}</p>`)
    .join("");

  const coupleEnHtml = `${config.couple.groomEn} <span class="font-medium">&amp;</span> ${config.couple.brideEn}`;

  const saveTheDateLines =
    config.invitation.introLines ?? config.invitation.lines.slice(0, 4);
  const saveTheDateHtml = saveTheDateLines
    .map((line) => `<p class="m-0">${line}</p>`)
    .join("");

  const formatParentsLine = (parents: string, relation: string) =>
    `${parents.replace(/ · /g, ' <span class="font-medium">·</span> ')} ${relation}`;

  return `
  <article>
    <section
      class="-mx-[46px] -mt-7 relative w-[calc(100%+92px)]"
      aria-label="메인"
    >
      <img
        class="block w-full h-auto"
        src="${clientImageUrl(config.id, config.hero.image)}"
        alt="${config.hero.alt}"
        width="430"
        height="573"
        decoding="async"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.08)_38%,rgba(0,0,0,0.08)_62%,rgba(0,0,0,0.62)_100%)]"
        aria-hidden="true"
      ></div>

      <div
        class="pointer-events-none absolute inset-0 px-7 pt-9 pb-10 text-[#FFF4C2]"
      >
        <header aria-label="청첩장 타이틀">
          <h1
            class="m-0 font-ultra text-[clamp(2rem,6.8vw,1.75rem)] leading-[1.05] tracking-[-0.01em]"
          >
            ${heroTitleHtml}
          </h1>
          <div
            class="mt-5 space-y-1 font-questrial text-[1rem] leading-[1.55] tracking-[0.02em]"
            aria-label="예식 일시·장소"
          >
            ${heroSubtitleHtml}
          </div>
        </header>
      </div>

      <section
        class="pointer-events-none absolute inset-x-0 bottom-0 px-7 pb-10 text-center text-[#FFF4C2]"
        aria-label="신랑 신부"
      >
        <p
          class="m-0 font-quattrocento text-[1rem] font-bold tracking-[0.06em]"
        >
          ${coupleEnHtml}
        </p>
      </section>
    </section>

    <section
      class="-mx-[46px] flex min-h-[560px] w-[calc(100%+92px)] flex-col justify-center bg-cover bg-center px-8 py-32 text-center font-pretendard text-[#111111]"
      style="background-image: url('${themeImageUrl(themeId, "background.png")}')"
      aria-label="예식 안내"
    >
      <h2
        class="m-0 mb-14 font-quattrocento text-[0.72rem] font-bold uppercase tracking-[0.1em]"
      >
        Save the Date
      </h2>

      <div
        class="mb-16 space-y-1 text-[0.82rem] font-medium leading-[1.85] tracking-tight"
      >
        ${saveTheDateHtml}
      </div>

      <div
        class="mb-16 grid grid-cols-2 gap-4 text-[0.82rem] font-medium leading-[1.75] tracking-tight"
        aria-label="신랑 신부"
      >
        <div>
          <p class="m-0 mb-2">
            ${formatParentsLine(config.invitation.groomParents.parents, config.invitation.groomParents.relation)}
          </p>
          <p class="m-0">신랑 ${config.invitation.groomParents.name}</p>
        </div>
        <div>
          <p class="m-0 mb-2">
            ${formatParentsLine(config.invitation.brideParents.parents, config.invitation.brideParents.relation)}
          </p>
          <p class="m-0">신부 ${config.invitation.brideParents.name}</p>
        </div>
      </div>

      <div
        class="space-y-1 text-[0.78rem] font-normal leading-[1.75] tracking-tight"
        aria-label="예식 일시·장소"
      >
        <p class="m-0">${config.venue.address}</p>
        <p class="m-0">${config.dateDisplay.venueShort}</p>
        <p class="m-0">${config.dateDisplay.fullDateKo}</p>
      </div>
    </section>

    <section
      class="-mx-[46px] bg-[#F7F7F7] py-12 text-center"
      aria-label="예식 일정"
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

      <!--
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
      -->
    </section>

    ${renderGalleryHtml(config.id, config.gallery, themeId)}

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
        <p class="m-0 text-[0.9rem] font-normal tracking-tight">
          ${venue.name}
        </p>
        <p
          class="m-0 mt-3 flex flex-wrap items-center justify-center gap-x-1.5 text-[0.9rem] font-extralight tracking-tight text-[#333333]"
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
        class="mt-6 h-[220px] w-full overflow-hidden rounded-sm bg-[#F7F7F7]"
        role="img"
        aria-label="${venue.name} 위치 지도"
      ></div>

      <div class="mt-3 grid grid-cols-3 gap-1.5">
        <a
          data-map="kakao"
          href="https://map.kakao.com/?q=${enc(venue.name)}"
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-10 items-center justify-center gap-1 rounded-[4px] bg-white no-underline"
        >
          <span
            class="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] bg-[#FEE500] text-[0.45rem] font-bold leading-none text-[#3B1E1E]"
            aria-hidden="true"
            >K</span
          >
          <span class="font-zalando-sans text-[0.72rem] font-extralight text-[#111111]"
            >카카오</span
          >
        </a>
        <a
          data-map="naver"
          href="https://map.naver.com/p/search/${enc(venue.name)}/place/${venue.naverPlaceId}"
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-10 items-center justify-center gap-1 rounded-[4px] bg-white no-underline"
        >
          <span
            class="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] bg-[#03C75A] text-[0.55rem] font-bold leading-none text-white"
            aria-hidden="true"
            >N</span
          >
          <span class="font-zalando-sans text-[0.72rem] font-extralight text-[#111111]"
            >네이버</span
          >
        </a>
        <a
          data-map="tmap"
          href="tmap://route?goalname=${enc(venue.name)}&amp;goalx=${venue.lng}&amp;goaly=${venue.lat}"
          rel="noopener noreferrer"
          class="flex h-10 items-center justify-center gap-1 rounded-[4px] bg-white no-underline"
        >
          <span
            class="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] bg-[#E4002B] text-[0.5rem] font-bold leading-none text-white"
            aria-hidden="true"
            >T</span
          >
          <span class="font-zalando-sans text-[0.72rem] font-extralight text-[#111111]"
            >T MAP</span
          >
        </a>
      </div>

      ${renderTheme02TransportHtml(venue.transport)}
    </section>

    ${renderGiftAccountsHtml(config.accounts, themeId)}

    ${renderInformationHtml(config.information, themeId)}

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
