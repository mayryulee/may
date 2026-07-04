import { initShare } from "../../../packages/shared/share";
import { themeIconUrl } from "../../../packages/shared/types";

export { initShare };

export function renderShareHtml(): string {
  return /* html */ `
    <section
      id="share"
      class="pb-[56px] px-[30px] text-center font-pretendard"
      aria-label="청첩장 공유"
    >
      <div class="mx-auto max-w-full space-y-[16px]">
        <button
          type="button"
          id="share-kakao-link"
          class="flex w-full items-center justify-center gap-[8px] border-[1px] border-[#6F7A83] bg-transparent py-[14px] font-pretendard text-[14px] font-normal tracking-tight text-[#343A40]"
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
            src="${themeIconUrl("theme02", "btn-copy.svg")}"
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
        class="theme-toggle-target mx-auto mt-[81px] block h-auto w-[180px]"
        src="${themeIconUrl("theme02", "copyright.svg")}"
        alt="© MAY"
        width="201"
        height="12"
        decoding="async"
        draggable="false"
        data-theme-toggle
      />
    </section>`;
}
