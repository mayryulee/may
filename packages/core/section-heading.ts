import type { ThemeId } from "./types";

const theme01SectionTitleEn =
  "m-0 font-optima text-[30px] font-normal uppercase leading-tight tracking-normal text-[#111111]";

const theme02SectionTitleEn =
  "mt-10 mb-0 mx-0 font-cormorant text-[1.05rem] font-normal uppercase tracking-[0.38em] text-[#111111]";

export function sectionTitleEnClass(themeId: ThemeId): string {
  if (themeId === "theme01") return theme01SectionTitleEn;
  return theme02SectionTitleEn;
}

/** theme02 Gallery·Location 등 Melodrama 영문 타이틀 */
export function theme02MelodramaTitleClass(): string {
  return "mb-0 mx-0 font-melodrama text-[2.5rem] uppercase leading-none tracking-normal text-[#111111]";
}

/** 테마별 본문 기본 폰트 (font-* 클래스 미지정 시 상속용) */
export function themeBodyFontClass(themeId: ThemeId): string {
  return themeId === "theme01" ? "font-noto" : "font-pretendard";
}
