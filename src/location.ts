/** 예식장 좌표·주소 (지도 링크·임베드 공통) */
export const VENUE = {
  name: "노블발렌티 대치점",
  address: "서울 강남구 영동대로 325",
  addressFull: "서울 강남구 영동대로 325 (대치동 983-1)",
  tel: "02-539-0400",
  lat: 37.505686,
  lng: 127.060155,
  /** 네이버 지도 장소 ID (map.naver.com/p/search/.../place/ 이 값) */
  naverPlaceId: "1634613412",
} as const;

const enc = (s: string) => encodeURIComponent(s);

const SITE_APPNAME = "formayletter.netlify.app";

/**
 * 지도 앱 바로가기 — API 키 불필요 (앱 URL 스킴 + 웹 딥링크)
 * 카카오: link/map 은 좌표만 열리고 검색어 미적용 → ?q= 검색 URL 사용
 * 네이버: v5/search 보다 place ID 상세 URL이 안정적
 * T맵: tmap:// 스킴 (웹 route URL 없음), 미설치 시 스토어
 */
export const MAP_LINKS = {
  kakao: {
    app: `kakaomap://search?q=${enc(VENUE.name)}&p=${VENUE.lat},${VENUE.lng}`,
    web: `https://map.kakao.com/?q=${enc(VENUE.name)}`,
    webMobile: `http://m.map.kakao.com/scheme/search?q=${enc(VENUE.name)}&p=${VENUE.lat},${VENUE.lng}`,
  },
  naver: {
    app: `nmap://place?id=${VENUE.naverPlaceId}&appname=${SITE_APPNAME}`,
    web: `https://map.naver.com/p/search/${enc(VENUE.name)}/place/${VENUE.naverPlaceId}`,
  },
  tmap: {
    app: `tmap://route?goalname=${enc(VENUE.name)}&goalx=${VENUE.lng}&goaly=${VENUE.lat}`,
    androidIntent: `intent://route?goalname=${enc(VENUE.name)}&goalx=${VENUE.lng}&goaly=${VENUE.lat}#Intent;scheme=tmap;package=com.skt.tmap.ku;end`,
    store:
      "https://play.google.com/store/apps/details?id=com.skt.tmap.ku",
    storeIos: "https://apps.apple.com/app/id431589174",
  },
} as const;

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

function tmapStoreUrl(): string {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
    ? MAP_LINKS.tmap.storeIos
    : MAP_LINKS.tmap.store;
}

function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent);
}

/** 모바일: 앱 스킴 시도 → 실패 시 웹/스토어. PC: 웹만 */
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

function openTmapNavigation(): void {
  if (!isMobileDevice()) {
    window.open(tmapStoreUrl(), "_blank", "noopener,noreferrer");
    return;
  }
  const appUrl = isAndroid()
    ? MAP_LINKS.tmap.androidIntent
    : MAP_LINKS.tmap.app;
  openMapNavigation(appUrl, MAP_LINKS.tmap.app, tmapStoreUrl());
}

function initMapButtons(root: ParentNode): void {
  const kakao = root.querySelector<HTMLAnchorElement>('[data-map="kakao"]');
  if (kakao) {
    kakao.href = MAP_LINKS.kakao.web;
    kakao.addEventListener("click", (e) => {
      if (isMobileDevice()) {
        e.preventDefault();
        openMapNavigation(
          MAP_LINKS.kakao.app,
          MAP_LINKS.kakao.webMobile,
          MAP_LINKS.kakao.web,
        );
      }
    });
  }

  const naver = root.querySelector<HTMLAnchorElement>('[data-map="naver"]');
  if (naver) {
    naver.href = MAP_LINKS.naver.web;
    naver.addEventListener("click", (e) => {
      if (isMobileDevice()) {
        e.preventDefault();
        openMapNavigation(MAP_LINKS.naver.app, MAP_LINKS.naver.web);
      }
    });
  }

  const tmap = root.querySelector<HTMLAnchorElement>('[data-map="tmap"]');
  if (tmap) {
    tmap.href = MAP_LINKS.tmap.app;
    tmap.addEventListener("click", (e) => {
      e.preventDefault();
      openTmapNavigation();
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

function initKakaoMap(container: HTMLElement, appKey: string): Promise<void> {
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
          const center = new mapsApi.LatLng(VENUE.lat, VENUE.lng);
          const map = new mapsApi.Map(container, { center, level: 3 });
          const marker = new mapsApi.Marker({ position: center });
          marker.setMap(map);
          resolve();
        });
      }),
  );
}

function initMapFallback(container: HTMLElement): void {
  const link = document.createElement("a");
  link.href = MAP_LINKS.kakao.web;
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

export function initLocation(root: ParentNode): void {
  initMapButtons(root);

  const mapEl = root.querySelector<HTMLElement>("#venue-map");
  if (mapEl) {
    const appKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY as string | undefined;
    if (appKey?.trim()) {
      initKakaoMap(mapEl, appKey.trim()).catch(() => initMapFallback(mapEl));
    } else {
      initMapFallback(mapEl);
    }
  }

  const copyBtn = root.querySelector<HTMLButtonElement>("#copy-address");
  const feedback = root.querySelector<HTMLElement>("#copy-address-feedback");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(VENUE.address);
        if (feedback) {
          feedback.textContent = "주소가 복사되었습니다";
          window.setTimeout(() => {
            feedback.textContent = "";
          }, 2000);
        }
      } catch {
        if (feedback) feedback.textContent = "복사에 실패했습니다";
      }
    });
  }
}
