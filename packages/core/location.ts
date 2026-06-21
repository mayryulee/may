import { copyText, COPY_TOAST, showCopyToast } from "./copy-toast";
import { themeBodyFontClass } from "./section-heading";
import type { ThemeId, Venue } from "./types";

const enc = (s: string) => encodeURIComponent(s);

function buildMapLinks(venue: Venue, siteAppName: string) {
  return {
    kakao: {
      app: `kakaomap://search?q=${enc(venue.name)}&p=${venue.lat},${venue.lng}`,
      web: `https://map.kakao.com/?q=${enc(venue.name)}`,
      webMobile: `http://m.map.kakao.com/scheme/search?q=${enc(venue.name)}&p=${venue.lat},${venue.lng}`,
    },
    naver: {
      app: `nmap://place?id=${venue.naverPlaceId}&appname=${siteAppName}`,
      web: `https://map.naver.com/p/search/${enc(venue.name)}/place/${venue.naverPlaceId}`,
    },
    tmap: {
      app: `tmap://route?goalname=${enc(venue.name)}&goalx=${venue.lng}&goaly=${venue.lat}`,
      androidIntent: `intent://route?goalname=${enc(venue.name)}&goalx=${venue.lng}&goaly=${venue.lat}#Intent;scheme=tmap;package=com.skt.tmap.ku;end`,
      store: "https://play.google.com/store/apps/details?id=com.skt.tmap.ku",
      storeIos: "https://apps.apple.com/app/id431589174",
    },
  } as const;
}

type KakaoMaps = {
  maps: {
    LatLng: new (lat: number, lng: number) => unknown;
    Map: new (
      el: HTMLElement,
      opts: { center: unknown; level: number },
    ) => unknown;
    Marker: new (opts: { position: unknown }) => { setMap: (map: unknown) => void };
  };
};

declare global {
  interface Window {
    kakao?: KakaoMaps;
  }
}

function isMobileDevice(): boolean {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent);
}

function openMapNavigation(
  appUrl: string,
  webUrl: string,
  storeUrl?: string,
): void {
  if (!isMobileDevice()) {
    window.open(webUrl, "_blank", "noopener,noreferrer");
    return;
  }

  const fallback = storeUrl ?? webUrl;
  let appOpened = false;
  const onHide = () => {
    if (document.visibilityState === "hidden") appOpened = true;
  };
  document.addEventListener("visibilitychange", onHide);
  window.location.href = appUrl;
  window.setTimeout(() => {
    document.removeEventListener("visibilitychange", onHide);
    if (!appOpened) window.location.href = fallback;
  }, 1200);
}

function openTmapNavigation(links: ReturnType<typeof buildMapLinks>): void {
  const tmapStoreUrl = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    ? links.tmap.storeIos
    : links.tmap.store;

  if (!isMobileDevice()) {
    window.open(tmapStoreUrl, "_blank", "noopener,noreferrer");
    return;
  }
  const appUrl = isAndroid() ? links.tmap.androidIntent : links.tmap.app;
  openMapNavigation(appUrl, links.tmap.app, tmapStoreUrl);
}

function initMapButtons(root: ParentNode, links: ReturnType<typeof buildMapLinks>): void {
  const kakao = root.querySelector<HTMLAnchorElement>('[data-map="kakao"]');
  if (kakao) {
    kakao.href = links.kakao.web;
    kakao.addEventListener("click", (e) => {
      if (isMobileDevice()) {
        e.preventDefault();
        openMapNavigation(
          links.kakao.app,
          links.kakao.webMobile,
          links.kakao.web,
        );
      }
    });
  }

  const naver = root.querySelector<HTMLAnchorElement>('[data-map="naver"]');
  if (naver) {
    naver.href = links.naver.web;
    naver.addEventListener("click", (e) => {
      if (isMobileDevice()) {
        e.preventDefault();
        openMapNavigation(links.naver.app, links.naver.web);
      }
    });
  }

  const tmap = root.querySelector<HTMLAnchorElement>('[data-map="tmap"]');
  if (tmap) {
    tmap.href = links.tmap.app;
    tmap.addEventListener("click", (e) => {
      e.preventDefault();
      openTmapNavigation(links);
    });
  }
}

function loadKakaoMapsSdk(appKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.kakao?.maps) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-maps="true"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Kakao Maps SDK load failed")),
      );
      return;
    }
    const script = document.createElement("script");
    script.dataset.kakaoMaps = "true";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao?.maps
        ? resolve()
        : reject(new Error("Kakao Maps SDK unavailable"));
    };
    script.onerror = () => reject(new Error("Kakao Maps SDK load failed"));
    document.head.appendChild(script);
  });
}

function initKakaoMap(
  container: HTMLElement,
  appKey: string,
  venue: Venue,
): Promise<void> {
  return loadKakaoMapsSdk(appKey).then(
    () =>
      new Promise((resolve, reject) => {
        const { kakao } = window;
        if (!kakao?.maps) {
          reject(new Error("Kakao Maps SDK unavailable"));
          return;
        }
        const mapsApi = kakao.maps as KakaoMaps["maps"] & {
          load: (cb: () => void) => void;
        };
        mapsApi.load(() => {
          const center = new mapsApi.LatLng(venue.lat, venue.lng);
          const map = new mapsApi.Map(container, { center, level: 3 });
          const marker = new mapsApi.Marker({ position: center });
          marker.setMap(map);
          resolve();
        });
      }),
  );
}

function initMapFallback(
  container: HTMLElement,
  webUrl: string,
  themeId: ThemeId,
): void {
  const link = document.createElement("a");
  link.href = webUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.className =
    `flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-2 bg-[#F7F7F7] ${themeBodyFontClass(themeId)} text-[0.78rem] font-extralight text-[#666666] no-underline`;
  link.innerHTML = `
    <span class="text-[1.5rem]" aria-hidden="true">📍</span>
    <span>지도 보기 (카카오맵)</span>
    <span class="text-[0.68rem] text-[#999999]">VITE_KAKAO_MAP_APP_KEY 설정 시 이 영역에 지도가 표시됩니다</span>
  `;
  container.replaceChildren(link);
}

export function initLocation(root: ParentNode, venue: Venue, themeId: ThemeId): void {
  const siteAppName =
    import.meta.env.VITE_SITE_APP_NAME?.trim() || "formayletter.netlify.app";
  const links = buildMapLinks(venue, siteAppName);

  initMapButtons(root, links);

  const mapEl = root.querySelector<HTMLElement>("#venue-map");
  if (mapEl) {
    const appKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY as string | undefined;
    if (appKey?.trim()) {
      initKakaoMap(mapEl, appKey.trim(), venue).catch(() =>
        initMapFallback(mapEl, links.kakao.web, themeId),
      );
    } else {
      initMapFallback(mapEl, links.kakao.web, themeId);
    }
  }

  const copyBtn = root.querySelector<HTMLButtonElement>("#copy-address");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await copyText(venue.address);
        showCopyToast(COPY_TOAST.address);
      } catch {
        showCopyToast(COPY_TOAST.failed);
      }
    });
  }
}

/** 버스 노선 유형 — lines 텍스트 "간선 : …" 접두어 기준 */
export type BusLineCategory =
  | "trunk" // 간선 (343, 401 등)
  | "branch" // 지선 (4319 등)
  | "general" // 일반 (11-3, 917 등)
  | "express" // 직행 (500-2, 9407 등)
  | "village"; // 마을 (강남01, 강남06 등)

const BUS_LINE_PREFIXES: Record<string, BusLineCategory> = {
  간선: "trunk",
  지선: "branch",
  일반: "general",
  직행: "express",
  마을: "village",
};

export function getBusLineCategory(line: string): BusLineCategory | null {
  const match = line.match(/^(간선|지선|일반|직행|마을)\s*:/);
  if (!match) return null;
  return BUS_LINE_PREFIXES[match[1]] ?? null;
}

export type BusLineClassNames = {
  trunk: string;
  branch: string;
  general: string;
  express: string;
  village: string;
};

export type TransportHtmlStyles = {
  sectionClass: (index: number, total: number) => string;
  renderTitle: (title: string) => string;
  linesClass: string;
  lineClass: string;
  /** 버스 노선 유형별 추가 클래스 — 미지정 유형은 lineClass만 적용 */
  busLineClass?: Partial<BusLineClassNames>;
  /** 버스 노선(간선·지선 등)을 / 구분 인라인으로 묶어 표시 */
  groupBusLinesInline?: boolean;
  /** 해당 유형 노선 직전에서 줄바꿈 (예: 직행 직전) */
  busLineSplitBefore?: readonly BusLineCategory[];
};

function resolveLineClass(line: string, styles: TransportHtmlStyles): string {
  const category = getBusLineCategory(line);
  if (!category) return styles.lineClass;

  const busClass = styles.busLineClass?.[category];
  return busClass ? `${styles.lineClass} ${busClass}`.trim() : styles.lineClass;
}

function inlineBusLineClass(line: string, styles: TransportHtmlStyles): string {
  const category = getBusLineCategory(line);
  if (!category) return styles.lineClass.replace(/\bm-0\b/g, "").trim();

  const busClass = styles.busLineClass?.[category];
  const base = styles.lineClass.replace(/\bm-0\b/g, "").trim();
  return busClass ? `${base} ${busClass}`.trim() : base;
}

export function renderGroupedTransportLinesHtml(
  lines: readonly string[],
  styles: Pick<TransportHtmlStyles, "lineClass" | "busLineClass" | "busLineSplitBefore">,
): string {
  const styleCtx = styles as TransportHtmlStyles;
  const chunks: string[] = [];
  let busRun: string[] = [];

  const flushBusRun = () => {
    if (busRun.length === 0) return;

    const inner = busRun
      .map((line, index) => {
        const sep = index === 0 ? "" : `<span aria-hidden="true"> / </span>`;
        return `${sep}<span class="${inlineBusLineClass(line, styleCtx)}">${line}</span>`;
      })
      .join("");

    chunks.push(`<p class="${styles.lineClass}">${inner}</p>`);
    busRun = [];
  };

  for (const line of lines) {
    const busCategory = getBusLineCategory(line);
    if (busCategory) {
      if (
        busRun.length > 0 &&
        styles.busLineSplitBefore?.includes(busCategory)
      ) {
        flushBusRun();
      }
      busRun.push(line);
    } else {
      flushBusRun();
      chunks.push(`<p class="${styles.lineClass}">${line}</p>`);
    }
  }

  flushBusRun();
  return chunks.join("");
}

export function renderTransportHtml(
  transport: readonly Venue["transport"][number][],
  styles: TransportHtmlStyles,
): string {
  const total = transport.length;

  return transport
    .map((section, i) => {
      const lines = styles.groupBusLinesInline
        ? renderGroupedTransportLinesHtml(section.lines, styles)
        : section.lines
            .map((line) => `<p class="${resolveLineClass(line, styles)}">${line}</p>`)
            .join("");

      return `
        <div class="${styles.sectionClass(i, total)}">
          ${styles.renderTitle(section.title)}
          <div class="${styles.linesClass}">${lines}</div>
        </div>`;
    })
    .join("");
}
