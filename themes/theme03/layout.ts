import { initAccountGift, renderGiftAccountsHtml } from "./sections/account-gift";
import { renderCalendarHtml } from "./sections/calendar";
import { renderClosingHtml } from "./sections/closing";
import { initGallery, renderGalleryHtml } from "./sections/gallery";
import { renderHeroHtml } from "./sections/hero";
import {
  initInformationCarousel,
  renderInformationHtml,
} from "./sections/information";
import { renderInvitationHtml } from "./sections/invitation";
import { initLocation, renderLocationHtml } from "./sections/location";
import { initShare } from "./sections/share";
import type { ClientConfig, ThemeId } from "../../packages/shared/types";

export function renderPageHtml(config: ClientConfig, _themeId: ThemeId): string {
  return /* html */ `
  <article class="font-pretendard">
    ${renderHeroHtml(
      config.id,
      config.header,
      config.hero,
      config.couple,
      config.dateDisplay,
    )}

    ${renderInvitationHtml(config.invitation, config.dateDisplay, config.venue)}

    ${renderCalendarHtml(config.calendar)}

    ${renderGalleryHtml(config.id, config.gallery)}

    ${renderLocationHtml(config.venue)}

    ${renderGiftAccountsHtml(config.accounts)}

    ${renderInformationHtml(config.information)}

    ${renderClosingHtml(config.quote)}
  </article>
`;
}

export function initPage(
  root: ParentNode,
  config: ClientConfig,
  _themeId: ThemeId,
): void {
  initGallery(root, config.id, config.gallery);
  initLocation(root, config.venue);
  initAccountGift(root);
  initInformationCarousel(root, config.information);
  initShare(config.id, config.share);
}
