import { copyText, COPY_TOAST, showCopyToast } from "./copy-toast";
import type { Venue } from "./types";

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

function initMapFallback(container: HTMLElement, webUrl: string): void {
  const link = document.createElement("a");
  link.href = webUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.className =
    "flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-2 bg-[#e8edf2] font-noto text-[0.78rem] font-extralight text-[#666666] no-underline";
  link.innerHTML = `
    <span class="text-[1.5rem]" aria-hidden="true">📍</span>
    <span>지도 보기 (카카오맵)</span>
    <span class="text-[0.68rem] text-[#999999]">VITE_KAKAO_MAP_APP_KEY 설정 시 이 영역에 지도가 표시됩니다</span>
  `;
  container.replaceChildren(link);
}

export function initLocation(root: ParentNode, venue: Venue): void {
  const siteAppName =
    import.meta.env.VITE_SITE_APP_NAME?.trim() || "formayletter.netlify.app";
  const links = buildMapLinks(venue, siteAppName);

  initMapButtons(root, links);

  const mapEl = root.querySelector<HTMLElement>("#venue-map");
  if (mapEl) {
    const appKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY as string | undefined;
    if (appKey?.trim()) {
      initKakaoMap(mapEl, appKey.trim(), venue).catch(() =>
        initMapFallback(mapEl, links.kakao.web),
      );
    } else {
      initMapFallback(mapEl, links.kakao.web);
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

export function renderTransportHtml(
  transport: readonly Venue["transport"][number][],
): string {
  return transport
    .map((section, i) => {
      const border =
        i < transport.length - 1
          ? "border-b border-[#dddddd] py-5"
          : "pt-5";
      const lines = section.lines
        .map((line) => `<p class="m-0">${line}</p>`)
        .join("");
      return `
        <div class="${border}">
          <p class="m-0 font-medium text-[#111111]">${section.title}</p>
          <div class="m-0 mt-2">${lines}</div>
        </div>`;
    })
    .join("");
}
