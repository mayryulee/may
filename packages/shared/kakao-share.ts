import type { ClientConfig } from "./types";
import { clientOgImageUrl } from "./types";
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
