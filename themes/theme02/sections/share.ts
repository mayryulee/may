import { initShare } from "../../../packages/shared/kakao-share";
import { themeIconUrl } from "../../../packages/shared/types";

export { initShare };

export function renderShareHtml(): string {
  return /* html */ `
    <section
      id="share"
      class="mt-[48px] text-center font-pretendard"
      aria-label="청첩장 공유"
    >
      <div class="mx-auto max-w-full space-y-[16px]">
        <button
          type="button"
          id="share-kakao"
          class="block w-full border-[1px] border-[#75818D] bg-transparent py-[14px] font-pretendard text-[14px] font-normal tracking-tight text-[#343A40]"
        >
          카카오톡 공유하기
        </button>
        <button
          type="button"
          id="share-copy-link"
          class="flex w-full items-center justify-center gap-[8px] bg-white py-[14px] font-pretendard text-[14px] font-normal tracking-tight text-[#343A40]"
        >
          청첩장 링크 복사하기
          <img
            src="${themeIconUrl("theme02", "copy.svg")}"
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
        class="theme-toggle-target mx-auto mt-[80px] block h-auto w-[201px]"
        src="${themeIconUrl("theme02", "copyright.svg")}"
        alt="© FOR MAY"
        width="201"
        height="12"
        decoding="async"
        draggable="false"
        data-theme-toggle
      />
    </section>`;
}
