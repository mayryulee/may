import { initVenueMap } from "../../../packages/shared/venue-map";
import type { ClientConfig, LocationTransportSection, ThemeId, Venue } from "../../../packages/shared/types";
import { themeIconUrl, venueLocationForTheme } from "../../../packages/shared/types";
import { bodyFontClass, sectionTitleEnClass } from "../tokens";

const enc = (s: string) => encodeURIComponent(s);

const TRANSPORT_TITLE_SUFFIXES = [" 이용 시", " 안내"] as const;

function renderTransportLabel(label: string): string {
  for (const suffix of TRANSPORT_TITLE_SUFFIXES) {
    if (label.endsWith(suffix)) {
      const head = label.slice(0, -suffix.length);
      return `<p class="m-0 text-[16px] text-[#111111]"><span class="font-medium">${head}</span><span class="font-extralight">${suffix}</span></p>`;
    }
  }

  return `<p class="m-0 font-medium text-[16px] text-[#111111]">${label}</p>`;
}

const BUS_LINE_PREFIX = /^(간선|지선|일반|직행|마을)\s*:/;

function busLineClass(line: string): string {
  const base = "m-0";
  if (!BUS_LINE_PREFIX.test(line)) return base;

  const kind = line.match(/^(간선|지선|일반|직행|마을)/)?.[1];
  if (kind === "간선") return `${base} text-[12px] mt-[8px]`;
  if (kind) return `${base} text-[12px]`;
  return base;
}

function renderTransportSection(
  section: LocationTransportSection,
  index: number,
  total: number,
): string {
  const sectionClass =
    index < total - 1 ? "border-b-[1px] border-[#dddddd] py-[32px]" : "pt-[24px]";
  const lines = section.lines
    .map((line) => `<p class="${busLineClass(line)}">${line}</p>`)
    .join("");

  return `
    <div class="${sectionClass}">
      ${renderTransportLabel(section.label)}
      <div class="m-0 mt-[8px]">${lines}</div>
    </div>`;
}

function renderTransportHtml(transport: readonly LocationTransportSection[]): string {
  const total = transport.length;
  return transport.map((section, i) => renderTransportSection(section, i, total)).join("");
}

export function renderLocationHtml(config: ClientConfig, themeId: ThemeId): string {
  const { venue } = config;
  const { transport } = venueLocationForTheme(venue, themeId);

  return `
    <section
      class="-mx-[46px] bg-[#F7F7F7] px-[25px] py-[48px] text-center"
      aria-label="오시는 길"
    >
      <header class="pb-[32px]">
        <p class="${sectionTitleEnClass}">Location</p>
      </header>

      <div class="font-noto text-[#111111]">
        <p class="m-0 mb-[12px] text-[14px] font-normal tracking-tight">${venue.name}</p>
        <p
          class="m-0 mt-[8px] flex flex-wrap items-center justify-center gap-x-[6px] text-[14px] font-extralight tracking-tight text-[#5D5D5D]"
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
              class="block h-[13px] w-[13px] mx-[4px]"
              decoding="async"
              aria-hidden="true"
            />
          </button>
        </p>
        <p class="m-0 mt-[4px] font-zalando-sans text-[14px] font-extralight tracking-tight text-[#666666]">
          Tel. ${venue.tel}
        </p>
      </div>

      <div
        id="venue-map"
        class="-mx-[25px] mt-[24px] h-[220px] w-[calc(100%+50px)] overflow-hidden bg-[#F7F7F7]"
        role="img"
        aria-label="${venue.name} 위치 지도"
      ></div>

      <div class="mt-[12px] flex items-center justify-center gap-[16px]">
        <a
          data-map="kakao"
          href="https://map.kakao.com/?q=${enc(venue.name)}"
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-[40px] w-[109px] shrink-0 items-center justify-center rounded-[6px] bg-white no-underline"
          aria-label="카카오맵"
        >
          <img
            src="${themeIconUrl(themeId, "navi-kakao.svg")}"
            alt=""
            width="69"
            height="24"
            class="block h-[24px] w-auto max-w-full object-contain"
            decoding="async"
            aria-hidden="true"
          />
        </a>
        <a
          data-map="naver"
          href="https://map.naver.com/p/search/${enc(venue.name)}/place/${venue.naverPlaceId}"
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-[40px] w-[109px] shrink-0 items-center justify-center rounded-[6px] bg-white no-underline"
          aria-label="네이버 지도"
        >
          <img
            src="${themeIconUrl(themeId, "navi-naver.svg")}"
            alt=""
            width="69"
            height="24"
            class="block h-[24px] w-auto max-w-full object-contain"
            decoding="async"
            aria-hidden="true"
          />
        </a>
        <a
          data-map="tmap"
          href="tmap://route?goalname=${enc(venue.name)}&amp;goalx=${venue.lng}&amp;goaly=${venue.lat}"
          rel="noopener noreferrer"
          class="flex h-[40px] w-[109px] shrink-0 items-center justify-center rounded-[6px] bg-white no-underline"
          aria-label="T MAP"
        >
          <img
            src="${themeIconUrl(themeId, "navi-tmap.svg")}"
            alt=""
            width="74"
            height="24"
            class="block h-[24px] w-auto max-w-full object-contain"
            decoding="async"
            aria-hidden="true"
          />
        </a>
      </div>

      <div class="mt-[40px] mx-[32px] space-y-[0px] text-left font-noto text-[14px] leading-[1.85]">
        ${renderTransportHtml(transport)}
      </div>
    </section>`;
}

export function initLocation(root: ParentNode, venue: Venue): void {
  initVenueMap(root, venue, { fallbackFontClass: bodyFontClass });
}
