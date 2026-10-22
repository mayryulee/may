import { initVenueMap } from "../../../packages/shared/venue-map";
import type {
  LocationTransportSection,
  ShuttleInfo,
  ShuttleStop,
  Venue,
} from "../../../packages/shared/types";
import { themeIconUrl, venueLocationForTheme, venueSearchName } from "../../../packages/shared/types";

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

const BUS_LINE_PREFIX = /^(간선|지선|광역|일반|직행|좌석|마을|공항|심야|순환)\s*:/;

/** lines 안의 빈 문자열("") 다음 줄 위에 두는 간격 */
const LINE_GAP_CLASS = "mt-[8px]";

/**
 * `**텍스트**` → 살짝 두껍게. 제주명조는 단일 굵기라 font-weight 대신 얇은 외곽선으로 표현
 */
function renderEmphasis(line: string): string {
  return line.replace(
    /\*\*(.+?)\*\*/g,
    '<span class="[-webkit-text-stroke:0.4px_currentColor]">$1</span>',
  );
}

function busLineClass(line: string, gapBefore: boolean): string {
  const base = "m-0 tracking-[-0.06em]";
  const kind = line.match(BUS_LINE_PREFIX)?.[1];
  const classes = [base];
  if (kind) classes.push("text-[12px]");
  if (gapBefore || kind === "간선") classes.push(LINE_GAP_CLASS);
  return classes.join(" ");
}

function renderTransportSection(
  section: LocationTransportSection,
  index: number,
  total: number,
): string {
  const sectionClass =
    index < total - 1 ? "border-b-[1px] border-[#dddddd] py-[32px]" : "pt-[32px]";
  let gapBefore = false;
  const lines = section.lines
    .map((line, i) => {
      if (line === "") {
        gapBefore = i > 0;
        return "";
      }
      const html = `<p class="${busLineClass(line, gapBefore)}">${renderEmphasis(line)}</p>`;
      gapBefore = false;
      return html;
    })
    .join("");

  return /* html */ `
    <div class="${sectionClass}">
      ${renderTransportLabel(section.label)}
      <div class="m-0 mt-[8px]">${lines}</div>
    </div>`;
}

const SHUTTLE_DEFAULT_TITLE = "전세버스 탑승 안내";

function renderTransportHtml(
  transport: readonly LocationTransportSection[],
  shuttle?: ShuttleInfo,
): string {
  const total = transport.length + (shuttle ? 1 : 0);
  const sections = transport
    .map((section, i) => renderTransportSection(section, i, total))
    .join("");
  return sections + (shuttle ? renderShuttleButton(shuttle) : "");
}

/** 지도 버튼과 같은 흰 버튼 */
function renderShuttleButton(shuttle: ShuttleInfo): string {
  return /* html */ `
    <div class="pt-[32px]">
      <button
        type="button"
        data-shuttle-open
        class="flex h-[44px] w-full items-center justify-center rounded-[6px] border-[0px] bg-white text-[15px] tracking-tighter text-[#111111]"
      >
        ${shuttle.title ?? SHUTTLE_DEFAULT_TITLE}
      </button>
    </div>`;
}

function renderShuttleStop(stop: ShuttleStop): string {
  return /* html */ `
    <div>
      ${stop.label ? `<p class="m-0 mb-[6px] text-[12px] font-medium text-[#111111]">${stop.label}</p>` : ""}
      <p class="m-0 flex flex-wrap items-baseline gap-x-[8px]">
        <span class="text-[14px] font-medium text-[#111111]">${stop.place}</span>
        <span class="text-[12px] font-extralight text-[#5D5D5D]">${stop.address}</span>
      </p>
      ${stop.time ? `<p class="m-0 mt-[8px] text-[13px] text-[#111111]">${stop.time}</p>` : ""}
    </div>`;
}

const SHUTTLE_ARROW = /* html */ `<p class="m-0 my-[10px] text-center text-[14px] text-[#AAAAAA]" aria-hidden="true">↓</p>`;

/** 연락처 팝업과 같은 스타일 — 내용이 길면 카드 안에서 스크롤 */
function renderShuttleModalHtml(shuttle: ShuttleInfo): string {
  const intro = (shuttle.introLines ?? [])
    .map((line) => `<p class="m-0">${line}</p>`)
    .join("");
  const groups = shuttle.groups
    .map(
      (group) => /* html */ `
        <div class="mt-[12px] rounded-[8px] bg-white px-[20px] py-[20px] text-left">
          <p class="m-0 text-[15px] font-medium text-[#111111]">${group.title}</p>
          ${group.note ? `<p class="m-0 mt-[6px] text-[12px] font-extralight leading-relaxed text-[#888888]">${group.note}</p>` : ""}
          <!-- w-fit: 화살표가 카드가 아니라 탑승 장소 텍스트 너비 기준 가운데 -->
          <div class="mt-[16px] w-fit">${group.stops.map(renderShuttleStop).join(SHUTTLE_ARROW)}</div>
        </div>`,
    )
    .join("");
  const notice = (shuttle.noticeLines ?? [])
    .map((line) => `<p class="m-0">${line}</p>`)
    .join("");

  return /* html */ `
    <div
      id="shuttle-modal"
      class="fixed inset-0 z-[110] hidden"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shuttle-modal-title"
    >
      <div class="absolute inset-0 bg-black/35" data-shuttle-close></div>
      <div class="relative mx-auto flex h-full max-w-[400px] items-center px-[24px] py-[40px]">
        <div class="relative flex max-h-full w-full flex-col rounded-[8px] bg-[#F7F7F7] text-center font-pretendard tracking-tight shadow-lg">
          <button
            type="button"
            data-shuttle-close
            class="absolute top-[16px] right-[16px] z-[1] inline-flex h-[32px] w-[32px] items-center justify-center border-[0px] bg-transparent p-0 font-pretendard text-[20px] tracking-tight text-[#999999]"
            aria-label="닫기"
          >
            ×
          </button>
          <div class="overflow-y-auto px-[24px] pt-[32px] pb-[24px]">
            <h2 id="shuttle-modal-title" class="m-0 text-[16px] font-medium tracking-tight text-[#111111]">
              ${shuttle.title ?? SHUTTLE_DEFAULT_TITLE}
            </h2>
            ${intro ? `<div class="mt-[8px] text-[12px] font-extralight leading-relaxed text-[#888888]">${intro}</div>` : ""}
            <div class="mt-[12px]">${groups}</div>
            ${notice ? `<div class="mt-[20px] text-[12px] font-extralight leading-relaxed text-[#888888]">${notice}</div>` : ""}
            <button
              type="button"
              data-shuttle-close
              class="mt-[24px] w-full rounded-[8px] border-[0px] bg-[#111111] py-[13px] font-pretendard text-[14px] font-normal tracking-tight text-white"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

function initShuttleModal(root: ParentNode): void {
  const modal = root.querySelector<HTMLElement>("#shuttle-modal");
  if (!modal) return;

  const setOpen = (open: boolean) => {
    modal.classList.toggle("hidden", !open);
    modal.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("overflow-hidden", open);
  };

  root.querySelector("[data-shuttle-open]")?.addEventListener("click", () => setOpen(true));
  modal.querySelectorAll("[data-shuttle-close]").forEach((el) => {
    el.addEventListener("click", () => setOpen(false));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) setOpen(false);
  });
}

export function renderLocationHtml(venue: Venue): string {
  const { transport } = venueLocationForTheme(venue, THEME_ID);
  const searchName = venueSearchName(venue);
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
        <p class="m-0 font-optima text-[30px] font-normal uppercase leading-tight text-[#111111]">Location</p>
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
          href="https://map.kakao.com/?q=${enc(searchName)}"
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
          href="https://map.naver.com/p/search/${enc(searchName)}/place/${venue.naverPlaceId}"
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
          href="tmap://route?goalname=${enc(searchName)}&amp;goalx=${venue.lng}&amp;goaly=${venue.lat}"
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
        ${renderTransportHtml(transport, venue.shuttle)}
      </div>
      ${venue.shuttle ? renderShuttleModalHtml(venue.shuttle) : ""}
    </section>`;
}

export function initLocation(root: ParentNode, venue: Venue): void {
  initVenueMap(root, venue, { fallbackFontClass: "font-jeju" });
  initShuttleModal(root);
}
