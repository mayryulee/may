import type { ClientConfig } from "../../../packages/shared/types";

export function renderQuoteHtml(quote: ClientConfig["quote"]): string {
  const stanzas = quote.stanzas
    .map((stanza) => {
      const lines = stanza.map((line) => `<p class="m-0">${line}</p>`).join("");
      return `<div class="space-y-[2px]">${lines}</div>`;
    })
    .join("");

  return /* html */ `
    <section id="quote" class="bg-[#1E2531] px-[64px] py-[84px] text-center text-white" aria-label="명언">
      <div class="space-y-[20px] text-[16px] font-normal leading-[1.8] tracking-[-0.1em]">
        ${stanzas}
      </div>
      <p class="m-0 mt-[45px] text-[16px] font-normal tracking-[-0.1em] text-white/60">
        ${quote.attribution}
      </p>
    </section>`;
}
