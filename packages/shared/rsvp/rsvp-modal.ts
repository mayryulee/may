import { mountCopyToast, showCopyToast } from "../copy-toast";
import {
  dismissRsvpForToday,
  hasSubmittedRsvp,
  isRsvpDismissedToday,
  submitRsvp,
  type RsvpAttending,
} from "../rsvp-store";
import { rsvpIcons } from "./rsvp-icons";
import { rsvpIntroCtaClass, rsvpSubmitBtnClass } from "./rsvp-button-styles";
import type { ClientConfig, ThemeId } from "../types";

const DEFAULT_SUBTITLE_LINES = [
  "축하의 마음으로 참석해주시는",
  "모든 분들을 귀하게 모실 수 있도록",
  "참석 의사를 전달 부탁드립니다.",
] as const;

/** theme01 방명록 모달과 동일한 인풋 스타일 */
const RSVP_FIELD =
  "w-full rounded-[8px] border-[0px] bg-[#F7F7F7] px-[16px] py-[14px] text-[14px] font-extralight tracking-tight text-[#111111] outline-none placeholder:text-[#aaaaaa]";
const RSVP_TEXTAREA =
  "min-h-[120px] w-full resize-none rounded-[8px] border-[0px] bg-[#F7F7F7] px-[16px] py-[14px] text-[14px] font-extralight leading-[1.75] tracking-tight text-[#111111] outline-none placeholder:text-[#aaaaaa]";
const MODAL_SHELL =
  "fixed inset-0 z-[100] hidden font-pretendard";
const MODAL_CARD =
  "relative w-full rounded-[8px] bg-white px-[24px] py-[32px] text-center font-pretendard tracking-tight shadow-lg";
const CLOSE_BTN =
  "absolute top-[16px] right-[16px] inline-flex h-[32px] w-[32px] items-center justify-center border-[0px] bg-transparent p-0 font-pretendard text-[20px] tracking-tight text-[#999999]";
const DISMISS_CLOSE_MS = 320;

function setBodyScrollLocked(locked: boolean): void {
  document.body.classList.toggle("overflow-hidden", locked);
}

function showModal(el: HTMLElement | null): void {
  if (!el) return;
  el.classList.remove("hidden");
  el.setAttribute("aria-hidden", "false");
  setBodyScrollLocked(true);
}

function hideModal(el: HTMLElement | null): void {
  if (!el) return;
  el.classList.add("hidden");
  el.setAttribute("aria-hidden", "true");
  setBodyScrollLocked(false);
}

function syncGuestCountVisibility(root: ParentNode): void {
  const attending = root.querySelector<HTMLSelectElement>(
    '#rsvp-form select[name="attending"]',
  );
  const guestWrap = root.querySelector<HTMLElement>("#rsvp-guest-count-wrap");
  if (!attending || !guestWrap) return;
  guestWrap.classList.toggle("hidden", attending.value === "no");
}

function fieldValue(form: HTMLFormElement, name: string): string {
  const el = form.elements.namedItem(name);
  if (el instanceof RadioNodeList) return String(el.value ?? "");
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    return el.value;
  }
  if (el instanceof HTMLSelectElement) return el.value;
  return "";
}

function isRsvpFormReady(form: HTMLFormElement): boolean {
  const name = fieldValue(form, "name").trim();
  const attending = fieldValue(form, "attending");
  if (!name || !attending) return false;
  if (attending === "yes" && !fieldValue(form, "guestCount")) return false;
  return true;
}

function syncRsvpSubmit(root: ParentNode): void {
  const form = root.querySelector<HTMLFormElement>("#rsvp-form");
  const button = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!form || !button) return;
  button.disabled = !isRsvpFormReady(form);
}

function bindSubmitSync(
  form: HTMLFormElement | null,
  sync: () => void,
): void {
  if (!form) return;
  form.addEventListener("input", sync);
  form.addEventListener("change", sync);
  form.addEventListener("compositionend", sync);
}

function resolveSubtitleLines(config: ClientConfig): string[] {
  if (config.rsvp?.subtitleLines?.length) return config.rsvp.subtitleLines;
  if (config.rsvp?.subtitle?.trim()) return [config.rsvp.subtitle.trim()];
  return [...DEFAULT_SUBTITLE_LINES];
}

function renderSubtitleHtml(lines: string[]): string {
  return lines
    .map(
      (line) =>
        `<p class="m-0 text-[12px] font-extralight leading-[1.7] tracking-tight text-[#888888]">${line}</p>`,
    )
    .join("");
}

function renderDetailRow(icon: string, text: string): string {
  return /* html */ `
    <li class="flex items-center justify-start gap-[6px] text-left text-[12px] font-extralight leading-relaxed tracking-tight text-[#888888]">
      ${icon}
      <span>${text}</span>
    </li>`;
}

export function renderRsvpOverlayHtml(config: ClientConfig, themeId: ThemeId): string {
  if (!config.rsvp?.enabled) return "";

  const introCtaClass = rsvpIntroCtaClass(themeId);
  const submitBtnClass = rsvpSubmitBtnClass(themeId);

  const { couple, dateDisplay, venue } = config;
  const title = config.rsvp.title ?? "참석 의사 전달";
  const subtitleHtml = renderSubtitleHtml(resolveSubtitleLines(config));

  const guestOptions = [1, 2, 3, 4, 5]
    .map((n) => `<option value="${n}">${n}명</option>`)
    .join("");

  return /* html */ `
    <div
      id="rsvp-intro-modal"
      class="${MODAL_SHELL}"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rsvp-intro-title"
    >
      <div class="absolute inset-0 bg-black/35" data-rsvp-close="intro"></div>
      <div class="relative mx-auto flex h-full max-w-[400px] items-center px-[24px] py-[40px]">
        <div class="${MODAL_CARD}">
          <button
            type="button"
            data-rsvp-close="intro"
            class="${CLOSE_BTN}"
            aria-label="닫기"
          >
            ×
          </button>
          <h2 id="rsvp-intro-title" class="m-0 text-[16px] font-medium tracking-tight text-[#111111]">
            ${title}
          </h2>
          <div class="mt-[8px] space-y-[2px]">
            ${subtitleHtml}
          </div>

          <hr class="mx-auto my-[20px] w-full border-0 border-t border-[#eeeeee]" />

          <ul class="m-0 list-none space-y-[10px] p-0 text-left">
            ${renderDetailRow(rsvpIcons.heart, `신랑 ${couple.groomKo} &amp; 신부 ${couple.brideKo}`)}
            ${renderDetailRow(rsvpIcons.calendar, `${dateDisplay.fullDateKo} ${dateDisplay.time}`)}
            ${renderDetailRow(rsvpIcons.location, venue.name)}
          </ul>

          <button
            type="button"
            id="rsvp-open-form"
            class="${introCtaClass}"
          >
            참석 의사 전달하기
          </button>

          <button
            type="button"
            id="rsvp-dismiss-today"
            class="mt-[16px] inline-flex w-full items-center justify-center gap-[6px] border-[0px] bg-transparent p-0 font-pretendard text-[12px] font-extralight tracking-tight text-[#999999]"
          >
            <span id="rsvp-dismiss-check" class="inline-flex" aria-hidden="true">${rsvpIcons.checkbox}</span>
            오늘 하루 보지 않기
          </button>
        </div>
      </div>
    </div>

    <div
      id="rsvp-form-modal"
      class="${MODAL_SHELL}"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rsvp-form-title"
    >
      <div class="absolute inset-0 bg-black/35" data-rsvp-close="form"></div>
      <div class="relative mx-auto flex h-full max-w-[400px] items-center px-[24px] py-[40px]">
        <div class="${MODAL_CARD}">
          <button
            type="button"
            data-rsvp-close="form"
            class="${CLOSE_BTN}"
            aria-label="닫기"
          >
            ×
          </button>
          <h2 id="rsvp-form-title" class="m-0 text-[16px] font-medium tracking-tight text-[#111111]">
            참석 의사 전달하기
          </h2>
          <p class="m-0 mt-[8px] text-[12px] font-extralight tracking-tight text-[#888888]">
            결혼식 준비에 참고하도록 전달해 주세요.
          </p>

          <form id="rsvp-form" class="mt-[24px] space-y-[10px] text-left">
            <input
              name="name"
              type="text"
              maxlength="30"
              required
              placeholder="성함을 입력해주세요"
              class="${RSVP_FIELD}"
            />
            <select name="attending" class="${RSVP_FIELD}">
              <option value="yes">참석할게요</option>
              <option value="no">참석이 어려워요</option>
            </select>
            <div id="rsvp-guest-count-wrap">
              <select name="guestCount" class="${RSVP_FIELD}">
                ${guestOptions}
              </select>
            </div>
            <textarea
              name="message"
              maxlength="200"
              rows="4"
              placeholder="축하의 마음을 전해주세요"
              class="${RSVP_TEXTAREA}"
            ></textarea>
            <p id="rsvp-error" class="m-0 hidden text-center text-[11px] tracking-tight text-[#c44]"></p>
            <button type="submit" disabled class="${submitBtnClass}">제출하기</button>
          </form>
        </div>
      </div>
    </div>
  `;
}

export function initRsvp(root: ParentNode, config: ClientConfig): void {
  if (!config.rsvp?.enabled) return;

  mountCopyToast();

  const clientId = config.id;
  const intro = root.querySelector<HTMLElement>("#rsvp-intro-modal");
  const formModal = root.querySelector<HTMLElement>("#rsvp-form-modal");
  const form = root.querySelector<HTMLFormElement>("#rsvp-form");
  const errorEl = root.querySelector<HTMLElement>("#rsvp-error");

  const shouldAutoOpen =
    config.rsvp.showOnLoad !== false &&
    !hasSubmittedRsvp(clientId) &&
    !isRsvpDismissedToday(clientId);

  if (shouldAutoOpen) {
    requestAnimationFrame(() => showModal(intro));
  }

  root.querySelector("#rsvp-open-form")?.addEventListener("click", () => {
    hideModal(intro);
    showModal(formModal);
    syncGuestCountVisibility(root);
    syncRsvpSubmit(root);
  });

  root.querySelector("#rsvp-dismiss-today")?.addEventListener("click", (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    if (btn.disabled) return;

    const checkEl = root.querySelector<HTMLElement>("#rsvp-dismiss-check");
    btn.disabled = true;
    if (checkEl) checkEl.innerHTML = rsvpIcons.checkboxChecked;

    window.setTimeout(() => {
      dismissRsvpForToday(clientId);
      hideModal(intro);
      btn.disabled = false;
      if (checkEl) checkEl.innerHTML = rsvpIcons.checkbox;
    }, DISMISS_CLOSE_MS);
  });

  root.querySelectorAll("[data-rsvp-close]").forEach((el) => {
    el.addEventListener("click", () => {
      const target = el.getAttribute("data-rsvp-close");
      if (target === "intro") hideModal(intro);
      if (target === "form") hideModal(formModal);
    });
  });

  bindSubmitSync(form, () => {
    syncGuestCountVisibility(root);
    syncRsvpSubmit(root);
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form || !errorEl) return;

    errorEl.classList.add("hidden");
    errorEl.textContent = "";

    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const attending = String(fd.get("attending") ?? "yes") as RsvpAttending;
    const guestCount =
      attending === "no" ? 0 : Math.min(10, Math.max(1, Number(fd.get("guestCount")) || 1));
    const message = String(fd.get("message") ?? "").trim();

    if (!name) {
      errorEl.textContent = "성함을 입력해 주세요.";
      errorEl.classList.remove("hidden");
      return;
    }

    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const ok = await submitRsvp(clientId, {
      name,
      attending,
      guestCount,
      message: message || undefined,
    });

    if (!ok) {
      syncRsvpSubmit(root);
      errorEl.textContent = "전송에 실패했습니다. 잠시 후 다시 시도해 주세요.";
      errorEl.classList.remove("hidden");
      return;
    }

    hideModal(formModal);
    showCopyToast("참석 의사가 전달되었습니다.");
  });
}
