import { initVenueMap } from "../../../packages/shared/venue-map";
import type { LocationTransportSection, Venue } from "../../../packages/shared/types";
import { themeIconUrl, venueLocationForTheme } from "../../../packages/shared/types";

const THEME_ID = "theme01" as const;

const enc = (s: string) => encodeURIComponent(s);

const TRANSPORT_TITLE_SUFFIXES = [" 이용 시", " 안내"] as const;

function renderTransportLabel(label: string): string {
  for (const suffix of TRANSPORT_TITLE_SUFFIXES) {
    if (label.endsWith(suffix)) {
      const head = label.slice(0, -suffix.length);
      return /* html */ `<p class="m-0 text-[16px] tracking-tighter"><span class="font-bold">${head}</span><span class="font-extralight">${suffix}</span></p>`;
    }
  }

  return /* html */ `<p class="m-0 font-bold text-[16px] tracking-tighter">${label}</p>`;
}

const BUS_LINE_PREFIX = /^(간선|지선|일반|직행|마을)\s*:/;

function busLineClass(line: string): string {
  const base = "m-0 tracking-[-0.08em]";
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
    index < total - 1 ? "border-b-[1px] border-[#dddddd] py-[32px]" : "pt-[32px]";
  const lines = section.lines
    .map((line) => `<p class="${busLineClass(line)}">${line}</p>`)
    .join("");

  return /* html */ `
    <div class="${sectionClass}">
      ${renderTransportLabel(section.label)}
      <div class="m-0 mt-[8px]">${lines}</div>
    </div>`;
}

function renderTransportHtml(transport: readonly LocationTransportSection[]): string {
  const total = transport.length;
  return transport.map((section, i) => renderTransportSection(section, i, total)).join("");
}

export function renderLocationHtml(venue: Venue): string {
  const { transport } = venueLocationForTheme(venue, THEME_ID);
  const copyIconSrc = themeIconUrl(THEME_ID, "btn-copy.svg");
  const kakaoIconSrc = themeIconUrl(THEME_ID, "navi-kakao.svg");
  const naverIconSrc = themeIconUrl(THEME_ID, "navi-naver.svg");
  const tmapIconSrc = themeIconUrl(THEME_ID, "navi-tmap.svg");

  return /* html */ `
    <section
      class="bg-[#F7F7F7] py-[80px] text-center"
      aria-label="오시는 길"
    >
      <header class="mb-[40px]">
        <p class="m-0 font-optima text-[30px] font-normal uppercase leading-tight tracking-normal text-[#111111]">Location</p>
      </header>

      <div class="">
        <p class="m-0 mb-[18px] text-[16px] tracking-tighter">${venue.name}</p>
        <p class="m-0 flex items-center justify-center gap-x-[6px] text-[#5D5D5D]">
          <span class="text-[16px] tracking-tighter">${venue.address}</span>
          <button
            id="copy-address"
            type="button"
            class="inline-flex shrink-0 items-center justify-center rounded-[4px] border-[0px] bg-transparent p-0"
            aria-label="주소 복사"
          >
            <img
              src="${copyIconSrc}"
              alt=""
              class="block h-[11px] w-[11px] mb-[2px]"
              decoding="async"
              aria-hidden="true"
            />
          </button>
        </p>
        <p class="m-0 mt-[8px] font-zalando-sans text-[14px] font-light tracking-tight text-[#5D5D5D]">
          Tel. ${venue.tel}
        </p>
      </div>

      <div
        id="venue-map"
        class="mt-[60px] mb-[26px] h-[220px] w-full overflow-hidden bg-[#F7F7F7]"
        role="img"
        aria-label="${venue.name} 위치 지도"
      ></div>

      <div class="mt-[12px] flex justify-center px-[31px] gap-[18px]">
        <a
          data-map="kakao"
          href="https://map.kakao.com/?q=${enc(venue.name)}"
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-[40px] w-[109px] shrink-0 items-center justify-center rounded-[6px] bg-white no-underline"
          aria-label="카카오맵"
        >
          <img
            src="${kakaoIconSrc}"
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
            src="${naverIconSrc}"
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
            src="${tmapIconSrc}"
            alt=""
            width="74"
            height="24"
            class="block h-[24px] w-auto max-w-full object-contain"
            decoding="async"
            aria-hidden="true"
          />
        </a>
      </div>

      <div class="mt-[50px] mx-[47px] space-y-[0px] text-left text-[14px] leading-[1.85] tracking-tighter">
        ${renderTransportHtml(transport)}
      </div>
    </section>`;
}

export function initLocation(root: ParentNode, venue: Venue): void {
  initVenueMap(root, venue, { fallbackFontClass: "font-jeju" });
}
