import { initAccountGift, renderGiftAccountsHtml } from "../../packages/core/account-gift";
import { initCalendarCountdown } from "../../packages/core/calendar-countdown";
import { initGallery, renderGalleryHtml } from "../../packages/core/gallery";
import {
  initInformationCarousel,
  renderInformationHtml,
} from "../../packages/core/information-carousel";
import { initLocation, renderTransportHtml } from "../../packages/core/location";
import { renderQuoteHtml } from "../../packages/core/quote";
import { initShare, renderShareHtml } from "../../packages/core/share";
import { theme02MelodramaTitleClass } from "../../packages/core/section-heading";
import type { ClientConfig, ThemeId, Venue, VenueTransport } from "../../packages/core/types";
import { clientImageUrl, themeIconUrl, themeImageUrl } from "../../packages/core/types";

const enc = (s: string) => encodeURIComponent(s);

function formatTheme02TransportTitle(title: string): string {
  return title.replace(/\s*이용\s*시\s*$/, "").replace(/\s*안내\s*$/, "");
}

const SUBWAY_LINE_BREAK = /^(.*?전방에서)\s*(.+)$/;

function prepareTheme02Transport(transport: readonly VenueTransport[]): VenueTransport[] {
  return transport.map((section) => {
    if (!section.title.includes("지하철")) {
      return section;
    }

    const breakIndex = section.lines.findIndex((line) => line.includes("전방에서"));
    if (breakIndex === -1) {
      return section;
    }

    const breakLine = section.lines[breakIndex];
    const match = breakLine.match(SUBWAY_LINE_BREAK);
    if (!match) {
      return section;
    }

    const head = match[1];
    const tailParts = [match[2], ...section.lines.slice(breakIndex + 1)].filter(
      (part) => part.trim().length > 0,
    );
    const tail = tailParts.join(" ");

    return {
      ...section,
      lines: tail ? [head, tail] : [head],
    };
  });
}

function renderTheme02TransportHtml(transport: readonly VenueTransport[]): string {
  const preparedTransport = prepareTheme02Transport(transport);

  return `
    <div
      class="mt-10 space-y-1 text-left text-[14px] font-light leading-[1.6] tracking-tight text-[#111111]"
    >
      ${renderTransportHtml(preparedTransport, {
        sectionClass: () => "flex items-start gap-x-5 py-3",
        renderTitle: (title) =>
          `<p class="m-0 w-[48px] shrink-0 font-medium text-[#111111]">${formatTheme02TransportTitle(title)}</p>`,
        linesClass: "m-0 min-w-0 flex-1 text-[#111111]",
        lineClass: "m-0 text-[#111111]",
        groupBusLinesInline: true,
        busLineSplitBefore: ["express"],
        busLineClass: {
          trunk: "tracking-wide text-[12px]",
          branch: "tracking-wide text-[12px]",
          general: "text-[12px]",
          express: "tracking-wide text-[12px]",
          village: "text-[12px]",
        },
      })}
    </div>`;
}

function renderTheme02MapNavHtml(venue: Venue): string {
  const linkClass =
    "block w-full border-b border-[#6D6D6D]/50 py-2 text-right text-[14px] font-light tracking-tight text-[#6D6D6D] no-underline";

  return `
    <div class="mt-8 flex justify-end">
      <div class="inline-grid mb-12">
      <a
        data-map="naver"
        href="https://map.naver.com/p/search/${enc(venue.name)}/place/${venue.naverPlaceId}"
        target="_blank"
        rel="noopener noreferrer"
        class="${linkClass}"
      >
        네이버 지도
      </a>
      <a
        data-map="kakao"
        href="https://map.kakao.com/?q=${enc(venue.name)}"
        target="_blank"
        rel="noopener noreferrer"
        class="${linkClass}"
      >
        카카오맵
      </a>
      <a
        data-map="tmap"
        href="tmap://route?goalname=${enc(venue.name)}&amp;goalx=${venue.lng}&amp;goaly=${venue.lat}"
        rel="noopener noreferrer"
        class="${linkClass}"
      >
        티맵
      </a>
      </div>
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
  const saveTheDateHtml =
    saveTheDateLines.length > 0
      ? `<p class="m-0 mb-[8px]">${saveTheDateLines[0]}</p>${
          saveTheDateLines.length > 1
            ? `<div class="space-y-1">${saveTheDateLines
                .slice(1)
                .map((line) => `<p class="m-0">${line}</p>`)
                .join("")}</div>`
            : ""
        }`
      : "";

  const formatParentsLine = (parents: string, relation: string) =>
    `${parents.replace(/ · /g, ' <span class="font-medium">·</span> ')} ${relation}`;

  return `
  <article class="font-pretendard">
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
        class="pointer-events-none absolute inset-0 pb-10 text-[#FFF4C2]"
      >
        <header aria-label="청첩장 타이틀">
          <h1
            class="mt-[76px] mb-0 mx-[35px] font-ultra text-[clamp(32px,6.8vw,28px)] leading-[1.05] tracking-[-0.01em]"
          >
            ${heroTitleHtml}
          </h1>
          <div
            class="mt-[18px] mx-[35px] space-y-1 font-questrial text-[16px] leading-[1.55] tracking-[0.02em]"
            aria-label="예식 일시·장소"
          >
            ${heroSubtitleHtml}
          </div>
        </header>
      </div>

      <section
        class="pointer-events-none absolute inset-x-0 bottom-0 pb-[58px] text-center text-[#FFF4C2]"
        aria-label="신랑 신부"
      >
        <p
          class="m-0 font-quattrocento text-[16px] font-bold tracking-[0.06em]"
        >
          ${coupleEnHtml}
        </p>
      </section>
    </section>

    <section
      class="-mx-[46px] flex min-h-[560px] w-[calc(100%+92px)] flex-col justify-center bg-cover bg-center px-8 py-32 text-center font-pretendard text-[#111111]"
      style="background-image: url('${themeImageUrl(themeId, "background01.png")}')"
      aria-label="예식 안내"
    >
      <h2
        class="m-0 mb-14 font-quattrocento text-[12px] font-bold uppercase tracking-[0.1em]"
      >
        Save the Date
      </h2>

      <div
        class="mb-16 text-[13px] leading-[1.85] tracking-tight"
      >
        ${saveTheDateHtml}
      </div>

      <div
        class="mb-16 grid grid-cols-2 gap-4 text-[13px] font-light leading-[1.75] tracking-tight"
        aria-label="신랑 신부"
      >
        <div>
          <p class="m-0 mb-[6px]">
            ${formatParentsLine(config.invitation.groomParents.parents, config.invitation.groomParents.relation)}
          </p>
          <p class="m-0">신랑 <span class="text-[16px] font-normal ml-1">${config.invitation.groomParents.name}</span></p>
        </div>
        <div>
          <p class="m-0 mb-[6px]">
            ${formatParentsLine(config.invitation.brideParents.parents, config.invitation.brideParents.relation)}
          </p>
          <p class="m-0">신부 <span class="text-[16px] font-normal ml-1">${config.invitation.brideParents.name}</span></p>
        </div>
      </div>

      <div
        class="space-y-1 text-[13px] font-normal leading-[1.75] tracking-tight"
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
          class="mx-auto my-24 block w-full h-auto"
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
          class="m-0 w-full font-noto text-[14px] leading-snug tracking-tight text-[#111111]"
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
      class="-mx-[46px] mt-32 mb-32 bg-[#F9F8F2] px-8 py-12 text-left"
      aria-label="오시는 길"
    >
      <header class="pb-8 mt-12">
        <p
          class="${theme02MelodramaTitleClass()}"
        >
          Location
        </p>
      </header>

      <div class="text-right text-[#111111]">
        <p class="m-0 text-[16px] font-medium tracking-tight">
          ${venue.name}
        </p>
        <p
          class="m-0 mt-2 flex flex-wrap items-center justify-end gap-x-1.5 text-[16px] tracking-tight text-[#5D5D5D]"
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
              class="block h-[12px] w-[12px] opacity-80"
              decoding="async"
              aria-hidden="true"
            />
          </button>
        </p>
        <p class="m-0 mt-1 text-[14px] tracking-tight text-[#5D5D5D]">
          Tel. ${venue.tel}
        </p>
      </div>

      <div
        id="venue-map"
        class="h-[220px] w-full overflow-hidden rounded-sm bg-[#F7F7F7]"
        role="img"
        aria-label="${venue.name} 위치 지도"
      ></div>

      ${renderTheme02TransportHtml(venue.transport)}

      ${renderTheme02MapNavHtml(venue)}
    </section>

    ${renderGiftAccountsHtml(config.accounts, themeId)}

    ${renderInformationHtml(config.information, themeId)}

    <div class="relative -mx-[46px] w-[calc(100%+92px)]">
      <div
        class="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style="background-image: url('${themeImageUrl(themeId, "background02.png")}')"
        aria-hidden="true"
      ></div>
      <div class="relative px-[25px] pt-24 pb-12">
        ${renderQuoteHtml(config.quote, themeId)}

        ${renderShareHtml(themeId)}
      </div>
    </div>
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
  initShare(config.id, config.share);
}
