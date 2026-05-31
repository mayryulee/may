import { copyText, COPY_TOAST, mountCopyToast, showCopyToast } from "./copy-toast";

const SHARE = {
  title: "정호♥채현 결혼합니다.",
  description: "4월 25일 토요일 낮 11시 노블발렌티 대치점",
  imagePath: "/images/coverv01.png",
} as const;

type KakaoShareSdk = {
  init: (key: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (payload: Record<string, unknown>) => void;
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

function kakaoJsKey(): string | undefined {
  const key =
    import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY ||
    import.meta.env.VITE_KAKAO_MAP_APP_KEY;
  return key?.trim() || undefined;
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

async function shareViaKakaoTalk(): Promise<void> {
  const url = sharePageUrl();
  const kakao = await loadKakaoSdk();

  kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: SHARE.title,
      description: SHARE.description,
      imageUrl: `${siteUrl()}${SHARE.imagePath}`,
      link: {
        mobileWebUrl: url,
        webUrl: url,
      },
    },
    buttons: [
      {
        title: "청첩장 보기",
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
    ],
  });
}

async function shareFallback(): Promise<void> {
  const url = sharePageUrl();
  if (navigator.share) {
    await navigator.share({
      title: SHARE.title,
      text: SHARE.description,
      url,
    });
    return;
  }
  await copyText(url);
  showCopyToast(COPY_TOAST.address);
}

export function renderShareHtml(): string {
  return `
    <section
      id="share"
      class="mt-12 pb-8 text-center font-noto"
      aria-label="청첩장 공유"
    >
      <div class="space-y-2.5">
        <button
          type="button"
          id="share-kakao"
          class="block w-full rounded-lg border-0 bg-[#FEE500] py-4 font-noto text-[0.82rem] font-medium tracking-tight text-[#191919]"
        >
          카카오톡으로 청첩장 전하기
        </button>
        <button
          type="button"
          id="share-copy-link"
          class="inline-flex w-full items-center justify-center gap-2 rounded-lg border-0 bg-[#F5F5F5] py-4 font-noto text-[0.82rem] font-normal tracking-tight text-[#111111]"
        >
          청첩장 링크 복사하기
          <img
            src="/icons/copy.svg"
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
        class="mx-auto mt-12 block h-auto w-[5.875rem]"
        src="/icons/copyright.svg"
        alt="© FOR MAY"
        width="94"
        height="19"
        decoding="async"
      />
    </section>`;
}

export function initShare(): void {
  mountCopyToast();

  document.querySelector("#share-kakao")?.addEventListener("click", async () => {
    try {
      await shareViaKakaoTalk();
    } catch {
      try {
        await shareFallback();
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
