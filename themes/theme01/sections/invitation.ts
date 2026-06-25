import type { ClientConfig } from "../../../packages/shared/types";
import { clientImageUrl } from "../../../packages/shared/types";

function renderInvitationLines(lines: readonly string[]): string {
  return lines
    .map((line, i) => {
      const margin = i === 3 ? "mt-[24px] m-0" : "m-0";
      return /* html */ `<p class="${margin}">${line}</p>`;
    })
    .join("");
}

export function renderInvitationHtml(
  clientId: string,
  invitation: ClientConfig["invitation"],
): string {
  const subImageSrc = clientImageUrl(clientId, invitation.subImage);

  return /* html */ `
    <section class="pt-[60px] text-center" aria-label="초대">
      <div class="mx-auto flex h-[22px] w-[78px] items-center justify-center rounded-[50%] border-[0.5px] border-[#111111]">
        <span class="font-sans text-[7.5px] font-normal uppercase tracking-[0.13em]">
          INVITATION
        </span>
      </div>
      <h2 class="mt-[16px] text-[18px] tracking-normal">
        소중한 분들을 초대합니다
      </h2>
      <div class="mt-[42px] text-[13px] leading-[1.8] tracking-tighter text-black">
        ${renderInvitationLines(invitation.lines)}
      </div>
      <div class="mx-auto mt-[40px] h-px w-[50px] bg-[#d4d4d4]" aria-hidden="true"></div>

      <div class="px-[114px] mt-[40px] w-full space-y-[3px] text-[13px] font-normal leading-[1.54] tracking-tighter">
        <p class="m-0 flex items-baseline justify-between">
          <span class="text-left flex gap-0">
            <span class="font-medium">${invitation.groomParents.parents}</span>
            <span class="text-[#6E6E6E]">의</span>
          </span>
          <span class="inline-flex items-baseline justify-end gap-x-[6px] text-right">
            <span class="text-[#6E6E6E]">${invitation.groomParents.relation}</span>
            <span class="font-medium">${invitation.groomParents.name}</span>
          </span>
        </p>
        <p class="m-0 flex items-baseline justify-between">
          <span class="text-left flex gap-0">
            <span class="">${invitation.brideParents.parents}</span>
            <span class="text-[#6E6E6E]">의</span>
          </span>
          <span class="inline-flex items-baseline justify-end gap-x-[10px] text-right">
            <span class="text-[#6E6E6E]">${invitation.brideParents.relation}</span>
            <span class="">${invitation.brideParents.name}</span>
          </span>
        </p>
      </div>

      <img
        class="mt-[100px] mb-0 block w-full"
        src="${subImageSrc}"
        alt="${invitation.subImageAlt}"
        loading="lazy"
        decoding="async"
      />
    </section>`;
}
