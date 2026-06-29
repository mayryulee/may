/**
 * Theme 03 (theme03) 디자인 토큰
 * - Figma 수치 동기화를 위해 타입 스케일/간격/색상 기준점을 한 곳에 모은다.
 */
export const tenderTokens = {
  color: {
    textPrimary: "#111111",
  },
  typography: {
    bodyFontClass: "font-pretendard",
    sectionTitleEnClass:
      "mt-[40px] mb-0 mx-0 font-cormorant text-[17px] font-normal uppercase tracking-[0.38em] text-[#111111]",
    melodramaTitleClass:
      "mb-0 mx-0 font-melodrama text-[38px] uppercase leading-none tracking-normal text-[#111111]",
  },
  spacing: {
    sectionY: "py-[48px]",
  },
} as const;

/** legacy alias: 기존 import 호환 */
export const bodyFontClass = tenderTokens.typography.bodyFontClass;
/** legacy alias: 기존 import 호환 */
export const sectionTitleEnClass = tenderTokens.typography.sectionTitleEnClass;
/** legacy alias: 기존 import 호환 */
export const melodramaTitleClass = tenderTokens.typography.melodramaTitleClass;
