import { initVenueMap } from "../../../packages/shared/venue-map";
import type {
  ClientConfig,
  LocationTransportSection,
  ThemeId,
  Venue,
} from "../../../packages/shared/types";
import { themeIconUrl, venueLocationForTheme } from "../../../packages/shared/types";
import { bodyFontClass, melodramaTitleClass } from "../tokens";

const enc = (s: string) => encodeURIComponent(s);

function renderTransportSection(section: LocationTransportSection): string {
  const lines = section.lines
    .map((line) => `<p class="m-0 text-[#111111]">${line}</p>`)
    .join("");

  return `
    <div class="flex items-start gap-x-[20px] py-[12px]">
      <p class="m-0 w-[48px] shrink-0 font-medium text-[#111111]">${section.label}</p>
      <div class="m-0 min-w-[0px] flex-1 text-[#111111]">${lines}</div>
    </div>`;
}

function renderTransportHtml(transport: readonly LocationTransportSection[]): string {
  return transport.map((section) => renderTransportSection(section)).join("");
}

function renderMapNavHtml(venue: Venue): string {
  const linkClass =
    "block w-full border-b-[1px] border-[#6D6D6D]/50 py-[8px] text-right text-[14px] font-light tracking-tight text-[#6D6D6D] no-underline";
  return `
    <div class="mt-[32px] flex justify-end">
      <div class="inline-grid mb-[48px]">
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

export function renderLocationHtml(config: ClientConfig, themeId: ThemeId): string {
  const { venue } = config;
  const { transport } = venueLocationForTheme(venue, themeId);

  return /* html */ `
    <section
      class="mt-[128px] mb-[128px] bg-[#F9F8F2] px-[32px] py-[48px] text-left"
      aria-label="오시는 길"
    >
      <header class="pb-[32px] mt-[48px]">
        <p class="${melodramaTitleClass}">Location</p>
      </header>

      <div class="text-right text-[#111111]">
        <p class="m-0 text-[16px] font-medium tracking-tight">${venue.name}</p>
        <p
          class="m-0 mt-[8px] flex flex-wrap items-center justify-end gap-x-[6px] text-[16px] tracking-tight text-[#5D5D5D]"
        >
          <span>${venue.address}</span>
          <button
            id="copy-address"
            type="button"
            class="inline-flex shrink-0 items-center justify-center rounded-[4px] border-[0px] bg-transparent p-0"
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
        <p class="m-0 mt-[4px] text-[14px] tracking-tight text-[#5D5D5D]">
          Tel. ${venue.tel}
        </p>
      </div>

      <div
        id="venue-map"
        class="-mx-[32px] mt-[24px] h-[220px] w-[calc(100%+64px)] overflow-hidden bg-[#F7F7F7]"
        role="img"
        aria-label="${venue.name} 위치 지도"
      ></div>

      <div class="mt-[40px] space-y-[4px] text-left text-[14px] font-light leading-[1.6] tracking-tight text-[#111111]">
        ${renderTransportHtml(transport)}
      </div>

      ${renderMapNavHtml(venue)}
    </section>`;
}

export function initLocation(root: ParentNode, venue: Venue): void {
  initVenueMap(root, venue, { fallbackFontClass: bodyFontClass });
}
