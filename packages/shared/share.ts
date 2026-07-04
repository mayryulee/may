import { copyText, COPY_TOAST, mountCopyToast, showCopyToast } from "./copy-toast";
import type { ClientConfig } from "./types";

const KAKAO_SDK_SRC = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js";
const KAKAO_SDK_SCRIPT_ID = "kakao-js-sdk";

function siteUrl(): string {
  if (import.meta.env.DEV) {
    const fromDevEnv = import.meta.env.VITE_DEV_SITE_URL?.replace(/\/$/, "");
    if (fromDevEnv) return fromDevEnv;
  }

  const fromEnv = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "");
  return fromEnv || window.location.origin.replace(/\/$/, "");
}

function sharePageUrl(): string {
  return `${siteUrl()}/`;
}

function shareImageUrl(config: ClientConfig): string {
  const imageFile = config.meta.ogImage || "coverh01.png";
  return `${siteUrl()}/images/${config.id}/${imageFile}`;
}

function loadKakaoSdk(): Promise<void> {
  if (window.Kakao) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(KAKAO_SDK_SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Kakao SDK load failed")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = KAKAO_SDK_SCRIPT_ID;
    script.src = KAKAO_SDK_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Kakao SDK load failed"));
    document.head.appendChild(script);
  });
}

async function copyShareUrlFallback(): Promise<void> {
  await copyText(sharePageUrl());
  showCopyToast(COPY_TOAST.address);
}

async function shareToKakao(config: ClientConfig): Promise<void> {
  const javascriptKey =
    import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY || import.meta.env.VITE_KAKAO_MAP_APP_KEY;
  const templateId = getKakaoTemplateId();

  if (!javascriptKey || !Number.isInteger(templateId) || templateId <= 0) {
    await copyShareUrlFallback();
    return;
  }

  await loadKakaoSdk();

  const kakao = window.Kakao;
  if (!kakao?.Share?.sendCustom) {
    await copyShareUrlFallback();
    return;
  }

  if (!kakao.isInitialized()) {
    kakao.init(javascriptKey);
  }

  kakao.Share.sendCustom({
    templateId,
    templateArgs: {
      THU: shareImageUrl(config),
      TITLE: config.share.title || config.meta.ogTitle || config.meta.title,
      DESC: config.share.description || config.meta.ogDescription || config.meta.description,
      URL: sharePageUrl(),
    },
  });
}

function getKakaoTemplateId(): number {
  const variant = import.meta.env.VITE_KAKAO_SHARE_TEMPLATE_VARIANT || "vertical";
  const templateId =
    variant === "horizontal"
      ? import.meta.env.VITE_KAKAO_SHARE_TEMPLATE_ID_HORIZONTAL
      : import.meta.env.VITE_KAKAO_SHARE_TEMPLATE_ID_VERTICAL ||
        import.meta.env.VITE_KAKAO_SHARE_TEMPLATE_ID;

  return Number(templateId);
}

export function initShare(config: ClientConfig): void {
  mountCopyToast();

  document.querySelector("#share-kakao-link")?.addEventListener("click", async () => {
    try {
      await shareToKakao(config);
    } catch {
      try {
        await copyShareUrlFallback();
      } catch {
        showCopyToast(COPY_TOAST.failed);
      }
    }
  });

  document.querySelector("#share-copy-link")?.addEventListener("click", async () => {
    try {
      await copyShareUrlFallback();
    } catch {
      showCopyToast(COPY_TOAST.failed);
    }
  });
}
