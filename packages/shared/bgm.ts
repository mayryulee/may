import { bgmUrl, type ClientConfig } from "./types";

const ROOT_ID = "bgm-control";

const ICON_ON = /* html */ `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9 18V5l11-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="17" cy="16" r="3" />
  </svg>`;

const ICON_OFF = /* html */ `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9 18V5l11-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="17" cy="16" r="3" />
    <path d="M3 3l18 18" />
  </svg>`;

let cleanup: (() => void) | null = null;

/**
 * 배경음악 + 우측 상단 재생/정지 버튼.
 * 모바일 브라우저는 자동재생을 막기 때문에 자동재생이 거부되면
 * 사용자의 첫 터치/클릭 시점에 재생을 시작합니다.
 */
export function initBgm(config: ClientConfig): void {
  cleanup?.();
  cleanup = null;

  const bgm = config.bgm;
  if (!bgm?.src) return;

  const audio = new Audio(bgmUrl(bgm.src));
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = bgm.volume ?? 0.5;

  const wrap = document.createElement("div");
  wrap.id = ROOT_ID;
  wrap.className =
    "pointer-events-none fixed inset-x-0 top-0 z-[90] mx-auto max-w-[400px]";
  wrap.innerHTML = /* html */ `
    <button
      type="button"
      class="pointer-events-auto absolute top-[12px] right-[12px] inline-flex h-[36px] w-[36px] items-center justify-center rounded-full border-[0px] bg-white/70 p-0 text-[#555555] shadow-[0_1px_4px_rgba(0,0,0,0.12)] backdrop-blur-[4px]"
    ></button>`;
  const button = wrap.querySelector("button")!;
  document.body.appendChild(wrap);

  /** 사용자가 직접 끈 경우 자동 재생 시도를 하지 않음 */
  let userMuted = false;
  /** 탭 전환으로 일시정지된 경우에만 복귀 시 다시 재생 */
  let pausedByHidden = false;

  const render = () => {
    const playing = !audio.paused;
    button.innerHTML = playing ? ICON_ON : ICON_OFF;
    button.setAttribute("aria-label", playing ? "배경음악 끄기" : "배경음악 켜기");
    button.setAttribute("aria-pressed", String(playing));
  };

  const play = () => audio.play().catch(() => render());

  const unlockEvents = ["touchend", "click", "keydown"] as const;
  const removeUnlock = () => {
    for (const type of unlockEvents) document.removeEventListener(type, onFirstInteraction, true);
  };
  function onFirstInteraction(e: Event) {
    // 음악 버튼 자체를 누른 경우는 버튼 핸들러가 처리
    if (button.contains(e.target as Node)) return;
    if (userMuted) return removeUnlock();
    // 스크롤 끝의 touchend 등은 재생 허용으로 인정되지 않을 수 있어 성공할 때까지 대기 유지
    audio.play().then(removeUnlock, () => render());
  }

  const onButtonClick = () => {
    removeUnlock();
    if (audio.paused) {
      userMuted = false;
      void play();
    } else {
      userMuted = true;
      audio.pause();
    }
  };

  const onVisibilityChange = () => {
    if (document.hidden) {
      if (!audio.paused) {
        pausedByHidden = true;
        audio.pause();
      }
    } else if (pausedByHidden) {
      pausedByHidden = false;
      void play();
    }
  };

  button.addEventListener("click", onButtonClick);
  audio.addEventListener("play", render);
  audio.addEventListener("pause", render);
  audio.addEventListener("error", () => wrap.remove());
  document.addEventListener("visibilitychange", onVisibilityChange);

  render();

  if (bgm.autoplay !== false) {
    for (const type of unlockEvents) document.addEventListener(type, onFirstInteraction, true);
    audio.play().then(removeUnlock, () => render());
  }

  cleanup = () => {
    removeUnlock();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    audio.pause();
    audio.src = "";
    wrap.remove();
  };
}
