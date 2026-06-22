import type { ClientConfig, ThemeId } from "./types";
import { themeBodyFontClass } from "./section-heading";

export function renderQuoteHtml(
  quote: ClientConfig["quote"],
  themeId: ThemeId,
): string {
  const stanzas = quote.stanzas
    .map((stanza) => {
      const lines = stanza
        .map((line) => `<p class="m-0">${line}</p>`)
        .join("");
      return `<div class="space-y-0.5">${lines}</div>`;
    })
    .join("");

  const isTheme02 = themeId === "theme02";
  const stanzasContainerClass = isTheme02
    ? "space-y-5 text-[14px] font-normal leading-[1.8] tracking-tight"
    : "space-y-5 text-[14px] font-normal leading-[1.8] tracking-tight";
  const sectionClass = isTheme02
    ? `pb-12 text-center ${themeBodyFontClass(themeId)} text-[#424141]`
    : `-mx-[46px] bg-[#1E2531] px-[25px] py-16 text-center ${themeBodyFontClass(themeId)} text-white`;
  const attributionClass = isTheme02
    ? "m-0 mt-10 text-[14px] font-normal tracking-tight text-[#5D5D5D]"
    : "m-0 mt-10 text-[14px] font-normal tracking-tight text-white/70";

  return `
    <section
      class="${sectionClass}"
      aria-label="명언"
    >
      <div class="${stanzasContainerClass}">
        ${stanzas}
      </div>
      <p
        class="${attributionClass}"
      >
        ${quote.attribution}
      </p>
    </section>`;
}
