import type { ClientConfig } from "../../../packages/shared/types";
import { clientImageUrl } from "../../../packages/shared/types";

export function renderHeroHtml(
  clientId: string,
  header: ClientConfig["header"],
  hero: ClientConfig["hero"],
  couple: ClientConfig["couple"],
  dateDisplay: ClientConfig["dateDisplay"],
): string {
  const heroTitleLines =
    header.heroTitleLines ?? [header.titleImageAlt];
  const heroSubtitleLines =
    header.heroSubtitleLines ?? [
      dateDisplay.fullDateKo,
      dateDisplay.venueShort,
    ];

  const heroTitleHtml = heroTitleLines
    .map((line) => `<span class="block">${line}</span>`)
    .join("");
  const heroSubtitleHtml = heroSubtitleLines
    .map((line) => `<p class="m-0">${line}</p>`)
    .join("");

  const coupleEnHtml = `${couple.groomEn} <span class="font-medium">&amp;</span> ${couple.brideEn}`;
  const heroSrc = clientImageUrl(clientId, hero.image);

  return /* html */ `
    <section class="-mt-[28px] relative w-full" aria-label="타이틀">
      <img
        class="block w-full h-auto"
        src="${heroSrc}"
        alt="${hero.alt}"
        width="400"
        height="533"
        decoding="async"
      />

      <div class="pointer-events-none absolute inset-0 pb-[40px] text-[#FFF4C2]">
        <header>
          <h1 class="mt-[76px] mb-0 mx-[35px] font-ultra text-[clamp(32px,6.8vw,28px)] leading-[1.05] tracking-[-0.01em]">
            ${heroTitleHtml}
          </h1>
          <div class="mt-[18px] mx-[35px] space-y-[4px] font-questrial text-[16px] leading-[1.55] tracking-[0.02em]">
            ${heroSubtitleHtml}
          </div>
        </header>
      </div>

      <div class="pointer-events-none absolute inset-x-0 bottom-0 pb-[58px] text-center text-[#FFF4C2]">
        <p class="m-0 font-quattrocento text-[16px] font-bold tracking-[0.06em]">
          ${coupleEnHtml}
        </p>
      </div>
    </section>`;
}
