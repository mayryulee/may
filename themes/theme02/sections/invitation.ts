import type { ClientConfig } from "../../../packages/shared/types";
import { themeImageUrl } from "../../../packages/shared/types";

const THEME_ID = "theme02" as const;

function formatParentsLine(parents: string, relation: string): string {
  return `${parents.replace(/ · /g, ' <span class="font-medium">·</span> ')} ${relation}`;
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
      class="flex min-h-[560px] w-full flex-col justify-center bg-cover bg-center px-[32px] py-[128px] text-center font-pretendard text-[#111111]"
      style="background-image: url('${backgroundSrc}')"
      aria-label="예식안내 초대"
    >
      <h2 class="m-0 mb-[56px] font-quattrocento text-[12px] font-bold uppercase tracking-[0.1em]">
        Save the Date
      </h2>
      <div class="mb-[64px] text-[13px] leading-[1.85] tracking-tight">
        ${renderSaveTheDateHtml(saveTheDateLines)}
      </div>

      <div class="mb-[64px] grid grid-cols-2 gap-[16px] text-[13px] font-light leading-[1.75] tracking-tight">
        <p class="m-0 mb-[6px]">
          ${formatParentsLine(invitation.groomParents.parents, invitation.groomParents.relation)}
        </p>
        <p class="m-0">신랑 <span class="text-[16px] font-normal ml-[4px]">${invitation.groomParents.name}</span></p>
        <p class="m-0 mb-[6px]">
          ${formatParentsLine(invitation.brideParents.parents, invitation.brideParents.relation)}
        </p>
        <p class="m-0">신부 <span class="text-[16px] font-normal ml-[4px]">${invitation.brideParents.name}</span></p>
      </div>

      <div class="space-y-[4px] text-[13px] font-normal leading-[1.75] tracking-tight">
        <p class="m-0">${venue.address}</p>
        <p class="m-0">${dateDisplay.venueShort}</p>
        <p class="m-0">${dateDisplay.fullDateKo}</p>
      </div>
    </section>`;
}
