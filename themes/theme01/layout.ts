import { initAccountGift, renderGiftAccountsHtml } from "./sections/account-gift";
import { initCalendar, renderCalendarHtml } from "./sections/calendar";
import { renderCoupleHtml } from "./sections/couple";
import { initGallery, renderGalleryHtml } from "./sections/gallery";
import { initGuestbook, renderGuestbookHtml } from "./sections/guestbook";
import { renderHeroHtml } from "./sections/hero";
import {
  initInformationCarousel,
  renderInformationHtml,
} from "./sections/information";
import { renderInvitationHtml } from "./sections/invitation";
import { initLocation, renderLocationHtml } from "./sections/location";
import { renderQuoteHtml } from "./sections/quote";
import { initShare, renderShareHtml } from "./sections/share";
import { renderWeddingDateHtml } from "./sections/wedding-date";
import { initRsvp, renderRsvpOverlayHtml } from "../../packages/shared/rsvp/rsvp-modal";
import type { ClientConfig, ThemeId } from "../../packages/shared/types";

export function renderPageHtml(config: ClientConfig, _themeId: ThemeId): string {
  return /* html */ `
  <article class="font-jeju">
    ${renderHeroHtml(config.id, config.header, config.hero)}

    ${renderCoupleHtml(config.couple)}

    ${renderWeddingDateHtml(config.dateDisplay)}

    ${renderInvitationHtml(config.id, config.invitation)}

    ${renderCalendarHtml(config.id, config.calendar, config.couple)}

    ${renderGalleryHtml(config.id, config.gallery)}

    ${renderLocationHtml(config.venue)}

    ${renderGiftAccountsHtml(config.accounts)}

    ${renderInformationHtml(config.information)}

    ${renderGuestbookHtml()}

    ${renderQuoteHtml(config.quote)}

    ${renderShareHtml()}
  </article>
  ${renderRsvpOverlayHtml(config, _themeId)}
`;
}

export function initPage(
  root: ParentNode,
  config: ClientConfig,
  _themeId: ThemeId,
): void {
  initCalendar(root, new Date(config.weddingAt));
  initGallery(root, config.id, config.gallery);
  initLocation(root, config.venue);
  initAccountGift(root);
  initInformationCarousel(root, config.information);
  initGuestbook(root, config.id);
  initShare(config);
  initRsvp(document, config);
}
