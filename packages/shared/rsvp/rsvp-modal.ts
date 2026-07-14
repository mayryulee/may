import { mountCopyToast, showCopyToast } from "../copy-toast";
import {
  dismissRsvpForToday,
  hasSubmittedRsvp,
  isRsvpDismissedToday,
  submitRsvp,
  type RsvpAttending,
  type RsvpMeal,
  type RsvpSide,
} from "../rsvp-store";
import { rsvpIcons } from "./rsvp-icons";
import { rsvpIntroCtaClass, rsvpSubmitBtnClass } from "./rsvp-button-styles";
import type { ClientConfig, ThemeId } from "../types";

const DEFAULT_SUBTITLE_LINES = [
  "축하의 마음으로 참석해주시는",
  "모든 분들을 귀하게 모실 수 있도록",
  "참석 의사를 전달 부탁드립니다.",
] as const;

/** 방명록 모달과 동일한 인풋 스타일 */
const RSVP_FIELD =
  "may-form-control w-full rounded-[8px] border-[0px] bg-[#F7F7F7] px-[16px] py-[14px] text-[14px] font-extralight tracking-tight text-[#111111] outline-none placeholder:text-[#aaaaaa]";
const RSVP_TEXTAREA =
  "may-form-control min-h-[120px] w-full resize-none rounded-[8px] border-[0px] bg-[#F7F7F7] px-[16px] py-[14px] text-[14px] font-extralight leading-[1.75] tracking-tight text-[#111111] outline-none placeholder:text-[#aaaaaa]";
const RSVP_FIELD_GROUP = "flex flex-col gap-[8px]";
const RSVP_FIELD_LABEL =
  "m-0 block text-[12px] font-extralight tracking-tight text-[#888888]";
const RSVP_TOGGLE_TRACK =
  "flex w-full gap-[3px] rounded-[8px] bg-[#F2F2F2] p-[3px]";
const RSVP_TOGGLE_OPTION =
  "relative m-0 flex min-w-0 flex-1 cursor-pointer items-center justify-center";
const RSVP_TOGGLE_INPUT =
  "peer absolute inset-0 z-10 m-0 h-full w-full cursor-pointer opacity-0";
const RSVP_TOGGLE_PILL =
  "block w-full rounded-[6px] py-[10px] text-center text-[13px] font-extralight tracking-tight text-[#888888] transition-[background-color,box-shadow,color,font-weight] duration-150 peer-checked:bg-white peer-checked:font-medium peer-checked:text-[#111111] peer-checked:shadow-[0_1px_3px_rgba(0,0,0,0.08)]";
const MODAL_SHELL =
  "fixed inset-0 z-[100] hidden font-pretendard"
const MODAL_CARD =
  "relative w-full rounded-[8px] bg-white px-[24px] text-center font-pretendard tracking-tight shadow-lg";
const CLOSE_BTN =
  "absolute top-[16px] right-[16px] inline-flex h-[32px] w-[32px] items-center justify-center border-[0px] bg-transparent p-0 font-pretendard text-[20px] tracking-tight text-[#999999]";
const DISMISS_CLOSE_MS = 320;

type ToggleOption = { value: string; label: string };

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

function renderToggleGroup(
  name: string,
  label: string,
  options: ToggleOption[],
  selected: string,
): string {
  const pills = options
    .map((opt) => {
      const checked = opt.value === selected ? " checked" : "";
      return /* html */ `
        <label class="${RSVP_TOGGLE_OPTION}">
          <input
            type="radio"
            name="${name}"
            value="${opt.value}"
            class="${RSVP_TOGGLE_INPUT}"
            ${checked}
          />
          <span class="${RSVP_TOGGLE_PILL}">${opt.label}</span>
        </label>`;
    })
    .join("");

  return /* html */ `
    <div class="${RSVP_FIELD_GROUP}" role="group" aria-label="${label}">
      <p class="${RSVP_FIELD_LABEL}">${label}</p>
      <div class="${RSVP_TOGGLE_TRACK}" role="radiogroup" aria-label="${label}">
        ${pills}
      </div>
    </div>`;
}

function syncGuestCountVisibility(root: ParentNode): void {
  const attending = root.querySelector<HTMLInputElement>(
    '#rsvp-form input[name="attending"]:checked',
  );
  const isAttending = attending?.value !== "no";
  const guestWrap = root.querySelector<HTMLElement>("#rsvp-guest-count-wrap");
  const mealWrap = root.querySelector<HTMLElement>("#rsvp-meal-wrap");
  guestWrap?.classList.toggle("hidden", !isAttending);
  mealWrap?.classList.toggle("hidden", !isAttending);
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
  const side = fieldValue(form, "side");
  const attending = fieldValue(form, "attending");
  if (!name || !side || !attending) return false;
  if (attending === "yes") {
    const guestCount = Number(fieldValue(form, "guestCount"));
    if (!Number.isFinite(guestCount) || guestCount < 1) return false;
    if (!fieldValue(form, "meal")) return false;
  }
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
      <div class="relative mx-auto flex h-full max-w-[400px] items-center px-[24px] py-[24px]">
        <div class="${MODAL_CARD} pt-[32px] pb-[22px]">
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
            class="mt-[20px] inline-flex w-full items-center justify-center gap-[6px] border-[0px] bg-transparent p-0 font-pretendard text-[12px] font-extralight tracking-tight text-[#999999]"
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
        <div class="${MODAL_CARD} max-h-full overflow-y-auto py-[32px]">
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

          <form id="rsvp-form" class="mt-[24px] flex flex-col gap-[16px] text-left">
            <input
              name="name"
              type="text"
              maxlength="30"
              required
              placeholder="성함을 입력해주세요"
              class="${RSVP_FIELD}"
            />
            ${renderToggleGroup(
              "side",
              "어느 분의 하객이신가요?",
              [
                { value: "groom", label: "신랑" },
                { value: "bride", label: "신부" },
              ],
              "groom",
            )}
            ${renderToggleGroup(
              "attending",
              "참석 가능하신가요?",
              [
                { value: "yes", label: "참석 가능" },
                { value: "no", label: "참석 불가" },
              ],
              "yes",
            )}
            <div id="rsvp-meal-wrap">
              ${renderToggleGroup(
                "meal",
                "식사를 하실 예정인가요?",
                [
                  { value: "yes", label: "네" },
                  { value: "no", label: "아니요" },
                  { value: "undecided", label: "미정" },
                ],
                "yes",
              )}
            </div>
            <div id="rsvp-guest-count-wrap" class="${RSVP_FIELD_GROUP}">
              <label class="${RSVP_FIELD_LABEL}" for="rsvp-guest-count">
                동행 인원 수를 작성해주세요
              </label>
              <input
                id="rsvp-guest-count"
                name="guestCount"
                type="text"
                inputmode="numeric"
                maxlength="2"
                class="${RSVP_FIELD}"
              />
            </div>
            <textarea
              name="message"
              maxlength="100"
              rows="4"
              placeholder="축하의 마음을 전해주세요"
              class="${RSVP_TEXTAREA}"
            ></textarea>
            <p id="rsvp-error" class="m-0 hidden text-center text-[11px] tracking-tight text-[#c44]"></p>
            <button type="submit" disabled class="${submitBtnClass}">작성 완료</button>
          </form>
        </div>
      </div>
    </div>
  `;
}

export function initRsvp(root: ParentNode, config: ClientConfig, themeId: ThemeId): void {
  if (!config.rsvp?.enabled) return;

  mountCopyToast();

  const clientId = config.id;
  const intro = root.querySelector<HTMLElement>("#rsvp-intro-modal");
  const formModal = root.querySelector<HTMLElement>("#rsvp-form-modal");
  const form = root.querySelector<HTMLFormElement>("#rsvp-form");
  const errorEl = root.querySelector<HTMLElement>("#rsvp-error");

  const shouldAutoOpen =
    config.rsvp.showOnLoad !== false &&
    !hasSubmittedRsvp(clientId, themeId) &&
    !isRsvpDismissedToday(clientId, themeId);

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
      dismissRsvpForToday(clientId, themeId);
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

  root
    .querySelector<HTMLInputElement>("#rsvp-guest-count")
    ?.addEventListener("input", (e) => {
      const input = e.currentTarget as HTMLInputElement;
      const digits = input.value.replace(/\D/g, "");
      if (input.value !== digits) input.value = digits;
    });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form || !errorEl) return;

    errorEl.classList.add("hidden");
    errorEl.textContent = "";

    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const sideRaw = String(fd.get("side") ?? "");
    const side: RsvpSide | null =
      sideRaw === "groom" || sideRaw === "bride" ? sideRaw : null;
    const attending = String(fd.get("attending") ?? "yes") as RsvpAttending;
    const mealRaw = String(fd.get("meal") ?? "");
    const meal: RsvpMeal | undefined =
      attending === "yes" &&
      (mealRaw === "yes" || mealRaw === "no" || mealRaw === "undecided")
        ? mealRaw
        : undefined;
    const guestCount =
      attending === "no" ? 0 : Math.min(10, Math.max(1, Number(fd.get("guestCount")) || 1));
    const message = String(fd.get("message") ?? "").trim();

    if (!name) {
      errorEl.textContent = "성함을 입력해 주세요.";
      errorEl.classList.remove("hidden");
      return;
    }

    if (!side) {
      errorEl.textContent = "신랑측 또는 신부측을 선택해 주세요.";
      errorEl.classList.remove("hidden");
      return;
    }

    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const ok = await submitRsvp(clientId, themeId, {
      name,
      side,
      attending,
      guestCount,
      meal,
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
