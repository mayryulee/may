import type { ClientConfig } from "./types";

export function renderQuoteHtml(quote: ClientConfig["quote"]): string {
  const stanzas = quote.stanzas
    .map((stanza) => {
      const lines = stanza
        .map((line) => `<p class="m-0">${line}</p>`)
        .join("");
      return `<div class="space-y-0.5">${lines}</div>`;
    })
    .join("");

  return `
    <section
      class="-mx-[46px] bg-[#1E2531] px-[25px] py-14 text-center font-noto text-white"
      aria-label="명언"
    >
      <div class="space-y-5 text-[0.78rem] font-normal leading-[1.95] tracking-tight">
        ${stanzas}
      </div>
      <p
        class="m-0 mt-10 text-[0.68rem] font-normal tracking-tight text-white/70"
      >
        ${quote.attribution}
      </p>
    </section>`;
}
