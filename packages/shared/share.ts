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
  return siteUrl();
}

function getKakaoTemplateVariant(): "vertical" | "horizontal" {
  return import.meta.env.VITE_KAKAO_SHARE_TEMPLATE_VARIANT === "horizontal"
    ? "horizontal"
    : "vertical";
}

/** coverv001=세로형, coverh001=가로형 — 카카오 THU는 쿼리스트링 없는 URL만 허용 */
function shareImageUrl(config: ClientConfig): string {
  const variant = getKakaoTemplateVariant();
  const imageFile = variant === "horizontal" ? "coverh001.png" : "coverv001.png";
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
    throw new Error("Kakao share config is missing");
  }

  await loadKakaoSdk();

  const kakao = window.Kakao;
  if (!kakao) {
    throw new Error("Kakao SDK is unavailable");
  }

  if (!kakao.isInitialized()) {
    kakao.init(javascriptKey);
  }

  if (!kakao.Share?.sendCustom) {
    throw new Error("Kakao Share SDK is unavailable");
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
  const variant = getKakaoTemplateVariant();
  const templateId =
    variant === "horizontal"
      ? import.meta.env.VITE_KAKAO_SHARE_TEMPLATE_ID_HORIZONTAL
      : import.meta.env.VITE_KAKAO_SHARE_TEMPLATE_ID_VERTICAL ||
        import.meta.env.VITE_KAKAO_SHARE_TEMPLATE_ID;

  return Number(templateId);
}

function kakaoShareErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string") return error;
  if (typeof error === "object" && error) {
    const maybeMessage =
      "message" in error && typeof error.message === "string" ? error.message : undefined;
    const maybeMsg = "msg" in error && typeof error.msg === "string" ? error.msg : undefined;
    const maybeCode = "code" in error ? String(error.code) : undefined;
    return [maybeCode, maybeMessage || maybeMsg].filter(Boolean).join(": ");
  }
  return "알 수 없는 오류";
}

export function initShare(config: ClientConfig): void {
  mountCopyToast();
  void loadKakaoSdk().catch(() => {
    /* 클릭 시 다시 시도하고 실패 메시지를 보여줍니다. */
  });

  document.querySelector("#share-kakao-link")?.addEventListener("click", async () => {
    try {
      await shareToKakao(config);
    } catch (error) {
      console.error(error);
      showCopyToast(`카카오 공유 실패: ${kakaoShareErrorMessage(error)}`);
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
