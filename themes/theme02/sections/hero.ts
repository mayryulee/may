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
    <section class="relative w-full" aria-label="타이틀">
      <img
        class="block w-full h-auto"
        src="${heroSrc}"
        alt="${hero.alt}"
        width="400"
        height="533"
        decoding="async"
      />

      <div class="absolute inset-0 pb-[40px] text-[#FFF4C2]">
        <header>
          <h1 class="pt-[76px] px-[35px] font-ultra text-[30px] leading-[1.25]">
            ${heroTitleHtml}
          </h1>
          <div class="mt-[18px] mx-[35px] space-y-[4px] font-questrial text-[14px] leading-[1.2] tracking-wider">
            ${heroSubtitleHtml}
          </div>
        </header>
      </div>

      <div class="absolute inset-x-0 bottom-0 pb-[58px] text-center text-[#FFF4C2]">
        <p class="m-0 font-quattrocento text-[16px] font-bold tracking-wider">
          ${coupleEnHtml}
        </p>
      </div>
    </section>`;
}
