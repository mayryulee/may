import { initShare } from "../../../packages/shared/kakao-share";
import { themeIconUrl } from "../../../packages/shared/types";

export { initShare };

export function renderShareHtml(): string {
  return `
    <section
      id="share"
      class="mt-[48px] pb-[32px] text-center font-pretendard"
      aria-label="청첩장 공유"
    >
      <div class="mx-auto max-w-full space-y-[10px]">
        <button
          type="button"
          id="share-kakao"
          class="block w-full rounded-[8px] border-[0px] bg-[#FCE777] py-[14px] font-pretendard text-[14px] font-medium tracking-tight text-[#191919]"
        >
          카카오톡으로 청첩장 전하기
        </button>
        <button
          type="button"
          id="share-copy-link"
          class="flex w-full items-center justify-center gap-[8px] rounded-[8px] border-[0px] bg-[#F7F7F7] py-[14px] font-pretendard text-[14px] font-normal tracking-tight text-[#111111]"
        >
          청첩장 링크 복사하기
          <img
            src="${themeIconUrl("theme01", "copy.svg")}"
            alt=""
            width="17"
            height="17"
            class="block h-[17px] w-[17px]"
            decoding="async"
            aria-hidden="true"
          />
        </button>
      </div>
      <img
        class="theme-toggle-target mx-auto mt-[40px] block h-auto w-[201px]"
        src="${themeIconUrl("theme01", "copyright.svg")}"
        alt="© FOR MAY"
        width="201"
        height="12"
        decoding="async"
        draggable="false"
        data-theme-toggle
      />
    </section>`;
}
