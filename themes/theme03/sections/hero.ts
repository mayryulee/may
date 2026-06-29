import type { ClientConfig } from "../../../packages/shared/types";
import { clientImageUrl } from "../../../packages/shared/types";

const THEME_HERO_IMAGE = "main02.png";

export function renderHeroHtml(
  clientId: string,
  _header: ClientConfig["header"],
  hero: ClientConfig["hero"],
  couple: ClientConfig["couple"],
  _dateDisplay: ClientConfig["dateDisplay"],
): string {
  // const heroTitleLines =
  //   header.heroTitleLines ?? [header.titleImageAlt];
  // const heroSubtitleLines =
  //   header.heroSubtitleLines ?? [
  //     dateDisplay.fullDateKo,
  //     dateDisplay.venueShort,
  //   ];
  //
  // const heroSubtitleHtml = heroSubtitleLines
  //   .map((line) => `<p class="m-0">${line}</p>`)
  //   .join("");

  const coupleEnHtml = `${couple.groomEn} &amp; ${couple.brideEn}`;
  const heroSrc = clientImageUrl(clientId, THEME_HERO_IMAGE);

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

      <div class="absolute inset-0">
        <header class="pt-[47px] text-center">
          <p class="m-0 font-sackers text-[24px] leading-none">
            ${coupleEnHtml}
          </p>
        </header>

        <div class="absolute inset-x-0 bottom-0 pb-[44px] text-center">
          <h1 class="m-0 font-photograph text-[58px] text-[#FFFFFF] leading-[1.1] tracking-[0.08em]">
            Wedding Day
          </h1>
          <div class="mt-[18px] space-y-[4px] font-questrial text-[14px] text-[#FFFFFF] leading-[1.5] tracking-wide">
            <p class="m-0">2029.04.25 SAT 11:00 AM</p>
            <p class="m-0">At Noblevalenti Daechi</p>
          </div>
        </div>
      </div>
    </section>`;
}
