import type { ClientConfig } from "../../../packages/shared/types";
import { themeImageUrl } from "../../../packages/shared/types";
import { renderQuoteHtml } from "./quote";
import { renderShareHtml } from "./share";

const THEME_ID = "theme02" as const;

export function renderClosingHtml(quote: ClientConfig["quote"]): string {
  const backgroundSrc = themeImageUrl(THEME_ID, "background02.png");

  return /* html */ `
    <div class="relative -mx-[46px] w-[calc(100%+92px)]">
      <div
        class="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style="background-image: url('${backgroundSrc}')"
        aria-hidden="true"
      ></div>
      <div class="relative px-[25px] pt-[96px] pb-[48px]">
        ${renderQuoteHtml(quote)}

        ${renderShareHtml()}
      </div>
    </div>`;
}
