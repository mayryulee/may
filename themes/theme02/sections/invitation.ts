import type { ClientConfig } from "../../../packages/shared/types";
import { themeImageUrl } from "../../../packages/shared/types";

const THEME_ID = "theme02" as const;

function formatParentsLine(parents: string, relation: string): string {
  return `${parents.replace(/ · /g, " · ")} ${relation}`;
}

function renderSaveTheDateHtml(lines: readonly string[]): string {
  if (lines.length === 0) return "";

  return `<p class="m-0 mb-[8px]">${lines[0]}</p>${
    lines.length > 1
      ? `<div class="space-y-[4px]">${lines
          .slice(1)
          .map((line) => `<p class="m-0">${line}</p>`)
          .join("")}</div>`
      : ""
  }`;
}

function renderCoupleSide(
  label: "신랑" | "신부",
  parents: ClientConfig["invitation"]["groomParents"],
): string {
  return `
    <div class="flex flex-col items-center">
      <p class="m-0 text-center text-[13px] font-light leading-[1.75] tracking-tight">
        ${formatParentsLine(parents.parents, parents.relation)}
      </p>
      <p class="m-0 flex items-baseline justify-center gap-x-[8px] text-[13px] font-light leading-[1.75] tracking-tight">
        <span>${label}</span>
        <span class="text-[16px] font-normal">${parents.name}</span>
      </p>
    </div>`;
}

export function renderInvitationHtml(
  invitation: ClientConfig["invitation"],
  dateDisplay: ClientConfig["dateDisplay"],
  venue: ClientConfig["venue"],
): string {
  const saveTheDateLines =
    invitation.introLines ?? invitation.lines.slice(0, 4);
  const backgroundSrc = themeImageUrl(THEME_ID, "background01.png");

  return /* html */ `
    <section
      class="flex min-h-[560px] w-full flex-col items-center justify-center bg-cover bg-center px-[30px] pt-[124px] pb-[130px] text-center font-pretendard text-[#111111]"
      style="background-image: url('${backgroundSrc}')"
      aria-label="예식안내 초대"
    >
      <h2 class="m-0 mb-[52px] font-quattrocento text-[12px] font-bold uppercase tracking-[0.1em]">
        Save the Date
      </h2>
      <div class="mb-[64px] text-[13px] leading-[1.8] tracking-tight">
        ${renderSaveTheDateHtml(saveTheDateLines)}
      </div>

      <div class="mb-[64px] flex justify-center gap-x-[56px]">
        ${renderCoupleSide("신랑", invitation.groomParents)}
        ${renderCoupleSide("신부", invitation.brideParents)}
      </div>

      <div class="space-y-[4px] text-[13px] font-normal leading-[1.75] tracking-tight">
        <p class="m-0">${venue.address}</p>
        <p class="m-0">${dateDisplay.venueShort}</p>
        <p class="m-0">${dateDisplay.fullDateKo}</p>
      </div>
    </section>`;
}
