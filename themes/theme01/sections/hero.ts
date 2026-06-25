import type { ClientConfig } from "../../../packages/shared/types";
import { clientImageUrl, themeImageUrl } from "../../../packages/shared/types";

const THEME_ID = "theme01" as const;

export function renderHeroHtml(
  clientId: string,
  header: ClientConfig["header"],
  hero: ClientConfig["hero"],
): string {
  const titleSrc = themeImageUrl(THEME_ID, "title.png");
  const heroSrc = clientImageUrl(clientId, hero.image);

  return /* html */ `
    <section aria-label="타이틀">
      <header class="pl-[45px] pt-[53px] pr-[62px] pb-[40px]">
        <div class="relative">
          <img
            class="block w-full h-auto"
            src="${titleSrc}"
            alt="${header.titleImageAlt}"
            width="878"
            height="486"
            decoding="async"
          />
          <div
            class="absolute right-0 bottom-[10px] flex flex-col items-end font-questrial text-[12px] font-normal tracking-wider"
            aria-label="예식 연월일"
          >
            <span class="block">${header.year}</span>
            <span class="block">${header.monthDay}</span>
          </div>
        </div>
      </header>

      <img
        class="block w-full px-[46px] object-cover object-center"
        src="${heroSrc}"
        alt="${hero.alt}"
        width="400"
        height="533"
        decoding="async"
      />
    </section>`;
}
