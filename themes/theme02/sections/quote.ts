import type { ClientConfig } from "../../../packages/shared/types";
import { bodyFontClass } from "../tokens";

export function renderQuoteHtml(quote: ClientConfig["quote"]): string {
  const stanzas = quote.stanzas
    .map((stanza) => {
      const lines = stanza.map((line) => `<p class="m-0">${line}</p>`).join("");
      return `<div class="space-y-[2px]">${lines}</div>`;
    })
    .join("");

  return `
    <section
      class="pb-[48px] text-center text-[#424141]"
      aria-label="명언"
    >
      <div class="space-y-[20px] text-[14px] font-normal leading-[1.8] tracking-tight">
        ${stanzas}
      </div>
      <p class="m-0 mt-[40px] text-[14px] font-normal tracking-tight text-[#5D5D5D]">
        ${quote.attribution}
      </p>
    </section>`;
}
