import type { ThemeId } from "../types";

const TENDER_BTN =
  "border-[1px] border-[#75818D] bg-transparent py-[13px] font-pretendard text-[14px] font-normal tracking-tight text-[#343A40] transition-colors duration-200";

const GRACE_PRIMARY_BTN =
  "rounded-[8px] border-[1px] border-transparent bg-[#111111] py-[13px] font-pretendard text-[14px] font-medium tracking-tight text-white transition-colors duration-200";

const GRACE_SUBMIT_BTN =
  "rounded-[8px] border-[0px] bg-[#111111] py-[13px] font-pretendard text-[14px] font-normal tracking-tight text-white transition-colors duration-200";

function isTenderTheme(themeId: ThemeId): boolean {
  return themeId === "theme02" || themeId === "theme03";
}

/** intro 팝업 — 참석 의사 전달하기 */
export function rsvpIntroCtaClass(themeId: ThemeId): string {
  if (isTenderTheme(themeId)) {
    return `rsvp-primary-btn rsvp-primary-btn--outline mt-[24px] block w-full ${TENDER_BTN}`;
  }
  return `rsvp-primary-btn mt-[24px] block w-full ${GRACE_PRIMARY_BTN}`;
}

/** 제출 폼 — 제출하기 */
export function rsvpSubmitBtnClass(themeId: ThemeId): string {
  if (isTenderTheme(themeId)) {
    return `rsvp-submit rsvp-submit--outline mt-[8px] w-full block ${TENDER_BTN}`;
  }
  return `rsvp-submit mt-[8px] w-full ${GRACE_SUBMIT_BTN}`;
}
