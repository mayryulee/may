import type { ClientConfig, ThemeId } from "./types";
import { clientOgImageUrl, themeIconUrl } from "./types";
import { copyText, COPY_TOAST, mountCopyToast, showCopyToast } from "./copy-toast";

type ShareConfig = ClientConfig["share"];

type KakaoShareSdk = {
  init: (key: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (payload: Record<string, unknown>) => void;
    sendScrap: (payload: Record<string, unknown>) => void;
    sendCustom: (payload: Record<string, unknown>) => void;
  };
};

declare global {
  interface Window {
    Kakao?: KakaoShareSdk;
  }
}

function siteUrl(): string {
  const fromEnv = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "");
  return fromEnv || window.location.origin.replace(/\/$/, "");
}

function sharePageUrl(): string {
  return `${siteUrl()}/`;
}

function shareImageUrl(clientId: string): string {
  return `${siteUrl()}${clientOgImageUrl(clientId)}`;
}

function kakaoJsKey(): string | undefined {
  const key =
    import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY ||
    import.meta.env.VITE_KAKAO_MAP_APP_KEY;
  return key?.trim() || undefined;
}

function shareTemplateId(): number | undefined {
  const raw = import.meta.env.VITE_KAKAO_SHARE_TEMPLATE_ID?.trim();
  if (!raw) return undefined;
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : undefined;
}

type ShareMethod = "custom" | "scrap";

function shareMethod(): ShareMethod {
  const mode = import.meta.env.VITE_KAKAO_SHARE_METHOD?.trim().toLowerCase();
  return mode === "scrap" ? "scrap" : "custom";
}

function buildTemplateArgs(
  url: string,
  clientId: string,
  share: ShareConfig,
): Record<string, string> {
  const image = shareImageUrl(clientId);
  return {
    title: share.title,
    description: share.description,
    image,
    imageUrl: image,
    link: url,
    web_url: url,
  };
}

function loadKakaoSdk(): Promise<KakaoShareSdk> {
  const jsKey = kakaoJsKey();
  if (!jsKey) {
    return Promise.reject(new Error("Kakao JavaScript key missing"));
  }

  return new Promise((resolve, reject) => {
    const existing = window.Kakao;
    if (existing?.isInitialized()) {
      resolve(existing);
      return;
    }

    const prior = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-share="true"]',
    );
    if (prior) {
      prior.addEventListener("load", () => {
        const kakao = window.Kakao;
        if (!kakao) {
          reject(new Error("Kakao SDK unavailable"));
          return;
        }
        if (!kakao.isInitialized()) kakao.init(jsKey);
        resolve(kakao);
      });
      prior.addEventListener("error", () =>
        reject(new Error("Kakao SDK load failed")),
      );
      return;
    }

    const script = document.createElement("script");
    script.dataset.kakaoShare = "true";
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js";
    script.crossOrigin = "anonymous";
    script.onload = () => {
      const kakao = window.Kakao;
      if (!kakao) {
        reject(new Error("Kakao SDK unavailable"));
        return;
      }
      if (!kakao.isInitialized()) kakao.init(jsKey);
      resolve(kakao);
    };
    script.onerror = () => reject(new Error("Kakao SDK load failed"));
    document.head.appendChild(script);
  });
}

async function shareViaKakaoTalk(
  clientId: string,
  share: ShareConfig,
): Promise<void> {
  const url = sharePageUrl();
  const kakao = await loadKakaoSdk();
  const templateId = shareTemplateId();

  if (templateId) {
    if (shareMethod() === "scrap") {
      kakao.Share.sendScrap({ requestUrl: url, templateId });
    } else {
      kakao.Share.sendCustom({
        templateId,
        templateArgs: buildTemplateArgs(url, clientId, share),
      });
    }
    return;
  }

  kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: share.title,
      description: share.description,
      imageUrl: shareImageUrl(clientId),
      imageWidth: share.imageWidth,
      imageHeight: share.imageHeight,
      link: { mobileWebUrl: url, webUrl: url },
    },
    buttons: [
      {
        title: "모바일 청첩장 보기",
        link: { mobileWebUrl: url, webUrl: url },
      },
    ],
  });
}

function copyrightLogoAttrs(themeId: ThemeId): {
  className: string;
  width: number;
  height: number;
} {
  if (themeId === "theme01") {
    return {
      className: "theme-toggle-target mx-auto mt-10 block h-auto w-[201px]",
      width: 201,
      height: 12,
    };
  }

  return {
    className: "theme-toggle-target mx-auto mt-20 block h-auto w-[201px]",
    width: 201,
    height: 12,
  };
}

async function shareFallback(share: ShareConfig): Promise<void> {
  const url = sharePageUrl();
  if (navigator.share) {
    await navigator.share({
      title: share.title,
      text: share.description,
      url,
    });
    return;
  }
  await copyText(url);
  showCopyToast(COPY_TOAST.address);
}

export function renderShareHtml(themeId: ThemeId): string {
  const copyrightLogo = copyrightLogoAttrs(themeId);
  const isTheme02 = themeId === "theme02";
  const sectionClass = isTheme02
    ? "mt-12 text-center font-pretendard"
    : "mt-12 pb-8 text-center font-pretendard";
  const kakaoButtonClass = isTheme02
    ? "block w-full border border-[#75818D] bg-transparent py-3.5 font-pretendard text-[14px] font-normal tracking-tight text-[#343A40]"
    : "block w-full rounded-lg border-0 bg-[#FCE777] py-3.5 font-pretendard text-[14px] font-medium tracking-tight text-[#191919]";
  const copyButtonClass = isTheme02
    ? "flex w-full items-center justify-center gap-2 bg-white py-3.5 font-pretendard text-[14px] font-normal tracking-tight text-[#343A40]"
    : "flex w-full items-center justify-center gap-2 rounded-lg border-0 bg-[#F7F7F7] py-3.5 font-pretendard text-[14px] font-normal tracking-tight text-[#111111]";
  const buttonsWrapClass = isTheme02
    ? "mx-auto max-w-full space-y-4"
    : "mx-auto max-w-full space-y-2.5";
  const kakaoLabel = isTheme02 ? "카카오톡 공유하기" : "카카오톡으로 청첩장 전하기";

  return `
    <section
      id="share"
      class="${sectionClass}"
      aria-label="청첩장 공유"
    >
      <div class="${buttonsWrapClass}">
        <button
          type="button"
          id="share-kakao"
          class="${kakaoButtonClass}"
        >
          ${kakaoLabel}
        </button>
        <button
          type="button"
          id="share-copy-link"
          class="${copyButtonClass}"
        >
          청첩장 링크 복사하기
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
      </div>
      <img
        class="${copyrightLogo.className}"
        src="${themeIconUrl(themeId, "copyright.svg")}"
        alt="© FOR MAY"
        width="${copyrightLogo.width}"
        height="${copyrightLogo.height}"
        decoding="async"
        draggable="false"
        data-theme-toggle
      />
    </section>`;
}

export function initShare(clientId: string, share: ShareConfig): void {
  mountCopyToast();

  document.querySelector("#share-kakao")?.addEventListener("click", async () => {
    try {
      await shareViaKakaoTalk(clientId, share);
    } catch {
      try {
        await shareFallback(share);
      } catch {
        /* Web Share 취소 등 */
      }
    }
  });

  document.querySelector("#share-copy-link")?.addEventListener("click", async () => {
    try {
      await copyText(sharePageUrl());
      showCopyToast(COPY_TOAST.address);
    } catch {
      showCopyToast(COPY_TOAST.failed);
    }
  });
}
