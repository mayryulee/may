import { initAccountGift, renderGiftAccountsHtml } from "./sections/account-gift";
import { initCalendarCountdown } from "../../packages/shared/calendar-countdown";
import { initGallery, renderGalleryHtml } from "./sections/gallery";
import {
  initInformationCarousel,
  renderInformationHtml,
} from "./sections/information";
import { initLocation, renderLocationHtml } from "./sections/location";
import { renderQuoteHtml } from "./sections/quote";
import { initShare, renderShareHtml } from "./sections/share";
import type { ClientConfig, ThemeId } from "../../packages/shared/types";
import { clientImageUrl, themeImageUrl } from "../../packages/shared/types";

export function renderPageHtml(config: ClientConfig, themeId: ThemeId): string {
  const heroTitleLines =
    config.header.heroTitleLines ?? [config.header.titleImageAlt];
  const heroSubtitleLines =
    config.header.heroSubtitleLines ?? [
      config.dateDisplay.fullDateKo,
      config.dateDisplay.venueShort,
    ];

  const heroTitleHtml = heroTitleLines
    .map((line) => `<span class="block">${line}</span>`)
    .join("");
  const heroSubtitleHtml = heroSubtitleLines
    .map((line) => `<p class="m-0">${line}</p>`)
    .join("");

  const coupleEnHtml = `${config.couple.groomEn} <span class="font-medium">&amp;</span> ${config.couple.brideEn}`;

  const saveTheDateLines =
    config.invitation.introLines ?? config.invitation.lines.slice(0, 4);
  const saveTheDateHtml =
    saveTheDateLines.length > 0
      ? `<p class="m-0 mb-[8px]">${saveTheDateLines[0]}</p>${
          saveTheDateLines.length > 1
            ? `<div class="space-y-[4px]">${saveTheDateLines
                .slice(1)
                .map((line) => `<p class="m-0">${line}</p>`)
                .join("")}</div>`
            : ""
        }`
      : "";

  const formatParentsLine = (parents: string, relation: string) =>
    `${parents.replace(/ · /g, ' <span class="font-medium">·</span> ')} ${relation}`;

  return /* html */ `
  <article class="font-pretendard">
    <section class="-mt-[28px] relative w-full" aria-label="타이틀">
      <img
        class="block w-full h-auto"
        src="${clientImageUrl(config.id, config.hero.image)}"
        alt="${config.hero.alt}"
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
    </section>

    <section
      class="flex min-h-[560px] w-full flex-col justify-center bg-cover bg-center px-[32px] py-[128px] text-center font-pretendard text-[#111111]"
      style="background-image: url('${themeImageUrl(themeId, "background01.png")}')"
      aria-label="예식안내 초대"
    >
      <h2 class="m-0 mb-[56px] font-quattrocento text-[12px] font-bold uppercase tracking-[0.1em]">
        Save the Date
      </h2>
      <div class="mb-[64px] text-[13px] leading-[1.85] tracking-tight">
        ${saveTheDateHtml}
      </div>

      <div class="mb-[64px] grid grid-cols-2 gap-[16px] text-[13px] font-light leading-[1.75] tracking-tight">
        <p class="m-0 mb-[6px]">
          ${formatParentsLine(config.invitation.groomParents.parents, config.invitation.groomParents.relation)}
        </p>
        <p class="m-0">신랑 <span class="text-[16px] font-normal ml-[4px]">${config.invitation.groomParents.name}</span></p>
        <p class="m-0 mb-[6px]">
          ${formatParentsLine(config.invitation.brideParents.parents, config.invitation.brideParents.relation)}
        </p>
        <p class="m-0">신부 <span class="text-[16px] font-normal ml-[4px]">${config.invitation.brideParents.name}</span></p>
      </div>

      <div class="space-y-[4px] text-[13px] font-normal leading-[1.75] tracking-tight">
        <p class="m-0">${config.venue.address}</p>
        <p class="m-0">${config.dateDisplay.venueShort}</p>
        <p class="m-0">${config.dateDisplay.fullDateKo}</p>
      </div>
    </section>

    <section class="bg-[#F7F7F7] py-[48px] text-center" aria-label="캘린더">
      <div class="w-full px-[69px] text-center">
        <img
          class="mx-auto my-[96px] block w-full h-auto"
          src="${clientImageUrl(config.id, config.calendar.image)}"
          alt="${config.calendar.alt}"
          width="777"
          height="912"
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>

    ${renderGalleryHtml(config.id, config.gallery)}

    ${renderLocationHtml(config, themeId)}

    ${renderGiftAccountsHtml(config.accounts)}

    ${renderInformationHtml(config.information)}

    <div class="relative -mx-[46px] w-[calc(100%+92px)]">
      <div
        class="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style="background-image: url('${themeImageUrl(themeId, "background02.png")}')"
        aria-hidden="true"
      ></div>
      <div class="relative px-[25px] pt-[96px] pb-[48px]">
        ${renderQuoteHtml(config.quote)}

        ${renderShareHtml()}
      </div>
    </div>
  </article>
`;
}

export function initPage(
  root: ParentNode,
  config: ClientConfig,
  themeId: ThemeId,
): void {
  const weddingAt = new Date(config.weddingAt);

  initCalendarCountdown(root, weddingAt);
  initGallery(root, config.id, config.gallery);
  initLocation(root, config.venue);
  initAccountGift(root);
  initInformationCarousel(root, config.information);
  initShare(config.id, config.share);
}
