const TOAST_ID = "copy-toast";

export const COPY_TOAST = {
  address: "주소를 복사했습니다.",
  account: "계좌번호를 복사했습니다.",
  failed: "복사에 실패했습니다.",
} as const;

const CHECK_ICON = `
  <svg width="8" height="6" viewBox="0 0 12 9" fill="none" aria-hidden="true">
    <path
      d="M1 4.5L4.2 7.7L11 1"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>`;

function renderCopyToastHtml(): string {
  return `
    <div
      id="${TOAST_ID}"
      class="pointer-events-none fixed inset-x-0 bottom-[calc(44px+env(safe-area-inset-bottom))] z-[200] flex justify-center px-6 opacity-0 translate-y-3"
      role="status"
      aria-live="polite"
      hidden
    >
      <div
        class="flex max-w-[min(100%,320px)] items-center gap-2.5 rounded-[10px] border border-[#e6e6e6] bg-white px-4 py-3 shadow-[0_2px_14px_rgba(0,0,0,0.08)]"
      >
        <span
          class="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#111111]"
          aria-hidden="true"
        >
          ${CHECK_ICON}
        </span>
        <p
          data-copy-toast-message
          class="m-0 font-pretendard text-[12px] font-normal leading-none tracking-tight text-[#111111]"
        ></p>
      </div>
    </div>`;
}

let copyToastTimer: number | undefined;
let copyToastHideTimer: number | undefined;

export function mountCopyToast(): void {
  if (document.getElementById(TOAST_ID)) return;
  document.body.insertAdjacentHTML("beforeend", renderCopyToastHtml());
}

export async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      /* in-app 브라우저 등 fallback */
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!ok) throw new Error("copy failed");
}

function resetToastEnter(toast: HTMLElement): void {
  toast.style.transition = "none";
  toast.classList.remove("opacity-100", "translate-y-0");
  toast.classList.add("opacity-0", "translate-y-3");
  void toast.offsetHeight;
  toast.style.transition = "";
}

function hideToast(toast: HTMLElement): void {
  toast.style.transition = "opacity 220ms ease-out, transform 220ms ease-out";
  toast.classList.remove("opacity-100", "translate-y-0");
  toast.classList.add("opacity-0", "translate-y-3");

  copyToastHideTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 220);
}

export function showCopyToast(message: string): void {
  mountCopyToast();
  const toast = document.getElementById(TOAST_ID);
  const messageEl = toast?.querySelector<HTMLElement>("[data-copy-toast-message]");
  if (!toast || !messageEl) return;

  if (copyToastTimer) window.clearTimeout(copyToastTimer);
  if (copyToastHideTimer) window.clearTimeout(copyToastHideTimer);

  messageEl.textContent = message;
  toast.hidden = false;
  resetToastEnter(toast);

  toast.style.transition =
    "transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms ease-out";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.remove("opacity-0", "translate-y-3");
      toast.classList.add("opacity-100", "translate-y-0");
    });
  });

  copyToastTimer = window.setTimeout(() => {
    hideToast(toast);
  }, 1800);
}
