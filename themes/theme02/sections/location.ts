import { initVenueMap } from "../../../packages/shared/venue-map";
import type { LocationTransportSection, Venue } from "../../../packages/shared/types";
import { themeIconUrl, venueLocationForTheme } from "../../../packages/shared/types";
const THEME_ID = "theme02" as const;

const enc = (s: string) => encodeURIComponent(s);

const BUS_LINE_PREFIX = /^(간선|지선|일반|직행|마을)\s*:/;

function transportLineClass(line: string): string {
  const base = "m-0 text-[#111111]";
  if (!BUS_LINE_PREFIX.test(line)) return base;

  const kind = line.match(/^(간선|지선|일반|직행|마을)/)?.[1];
  if (kind === "간선") return `${base} text-[12px] mt-[4px]`;
  if (kind) return `${base} text-[12px]`;
  return base;
}

function renderTransportSection(section: LocationTransportSection): string {
  const lines = section.lines
    .map((line) => `<p class="${transportLineClass(line)}">${line}</p>`)
    .join("");

  return `
    <div class="flex items-start gap-x-[20px] py-[10px]">
      <p class="m-0 w-[48px] shrink-0 font-medium text-[#111111]">${section.label}</p>
      <div class="m-0 min-w-[0px] flex-1 text-[#111111]">${lines}</div>
    </div>`;
}

function renderTransportHtml(transport: readonly LocationTransportSection[]): string {
  return transport.map((section) => renderTransportSection(section)).join("");
}

function renderMapNavHtml(venue: Venue): string {
  const linkClass =
    "block w-full pt-[8px] text-right text-[14px] font-light tracking-tight text-[#6D6D6D] no-underline";
  const lineClass = "mt-[4px] block h-px w-full bg-[#6D6D6D]/50";

  const renderMapLink = (attrs: string, label: string, showLine = true) => `
        <a ${attrs} class="${linkClass}">
          ${label}
          ${showLine ? `<span class="${lineClass}" aria-hidden="true"></span>` : ""}
        </a>`;

  return `
    <div class="mt-[10px] flex justify-end">
      <div class="inline-grid">
        ${renderMapLink(
          `data-map="naver"
          href="https://map.naver.com/p/search/${enc(venue.name)}/place/${venue.naverPlaceId}"
          target="_blank"
          rel="noopener noreferrer"`,
          "네이버 지도",
        )}
        ${renderMapLink(
          `data-map="kakao"
          href="https://map.kakao.com/?q=${enc(venue.name)}"
          target="_blank"
          rel="noopener noreferrer"`,
          "카카오맵",
        )}
        ${renderMapLink(
          `data-map="tmap"
          href="tmap://route?goalname=${enc(venue.name)}&amp;goalx=${venue.lng}&amp;goaly=${venue.lat}"
          rel="noopener noreferrer"`,
          "티맵",
          false,
        )}
      </div>
    </div>`;
}

export function renderLocationHtml(venue: Venue): string {
  const { transport } = venueLocationForTheme(venue, THEME_ID);

  return /* html */ `
    <section
      class="bg-[#F9F8F2] px-[25px] pt-[77px] pb-[72px] text-left"
      aria-label="오시는 길"
    >
      <header class="pb-[32px] mt-[48px]">
        <p class="mb-0 mx-0 font-melodrama text-[38px] uppercase leading-none tracking-normal text-[#111111]">Location</p>
      </header>

      <div class="text-right text-[#111111]">
        <p class="m-0 text-[16px] font-medium tracking-tight">${venue.name}</p>
        <p
          class="m-0 mt-[6px] flex flex-wrap items-center justify-end gap-x-[6px] text-[16px] tracking-tight text-[#5D5D5D]"
        >
          <span>${venue.address}</span>
          <button
            id="copy-address"
            type="button"
            class="inline-flex shrink-0 items-center justify-center rounded-[4px] border-[0px] bg-transparent p-0"
            aria-label="주소 복사"
          >
            <img
              src="${themeIconUrl(THEME_ID, "btn-copy.svg")}"
              alt=""
              class="block h-[12px] w-[12px] opacity-80"
              decoding="async"
              aria-hidden="true"
            />
          </button>
        </p>
        <p class="m-0 mt-[1px] text-[14px] tracking-tight text-[#5D5D5D]">
          Tel. ${venue.tel}
        </p>
      </div>

      <div
        id="venue-map"
        class="mt-[30px] h-[220px] -mx-[25px] w-[calc(100%+50px)] overflow-hidden bg-[#F7F7F7]"
        role="img"
        aria-label="${venue.name} 위치 지도"
      ></div>

      <div class="mt-[30px] space-y-[4px] text-left text-[14px] font-light leading-[1.6] tracking-tight text-[#111111]">
        ${renderTransportHtml(transport)}
      </div>

      ${renderMapNavHtml(venue)}
    </section>`;
}

export function initLocation(root: ParentNode, venue: Venue): void {
  initVenueMap(root, venue, { fallbackFontClass: "font-pretendard" });
}
