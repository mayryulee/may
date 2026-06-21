import type { ThemeId } from "./types";

const theme01SectionTitleEn =
  "m-0 font-optima text-[30px] font-normal uppercase leading-tight tracking-normal text-[#111111]";

const defaultSectionTitleEn =
  "m-0 font-cormorant text-[1.05rem] font-normal uppercase tracking-[0.38em] text-[#111111]";

export function sectionTitleEnClass(themeId: ThemeId): string {
  return themeId === "theme01" ? theme01SectionTitleEn : defaultSectionTitleEn;
}
