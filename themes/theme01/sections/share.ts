import { initShare } from "../../../packages/shared/share";
import { themeIconUrl } from "../../../packages/shared/types";

export { initShare };

export function renderShareHtml(): string {
  return /* html */ `
    <section
      id="share"
      class="pt-[46px] pb-[56px] px-[30px] text-center font-pretendard"
      aria-label="청첩장 공유"
    >
      <div class="mx-auto max-w-full space-y-[17px]">
        <button
          type="button"
          id="share-kakao-link"
          class="flex w-full items-center justify-center gap-[8px] rounded-[8px] border-[0px] bg-[#FBE66B] py-[13px] font-pretendard text-[16px] text-[#15181F]"
        >
          카카오톡으로 청첩장 전하기
        </button>
        <button
          type="button"
          id="share-copy-link"
          class="flex w-full items-center justify-center gap-[8px] rounded-[8px] border-[0px] bg-[#F7F7F7] py-[13px] font-pretendard text-[16px] text-[#15181F]"
        >
          청첩장 링크 복사하기
          <img
            src="${themeIconUrl("theme01", "btn-copy.svg")}"
            alt=""
            width="16"
            height="16"
            class="block"
            decoding="async"
            aria-hidden="true"
          />
        </button>
      </div>
      <img
        class="theme-toggle-target mx-auto mt-[84px] block h-auto w-[180px]"
        src="${themeIconUrl("theme01", "copyright.svg")}"
        alt="© MAY"
        width="201"
        height="12"
        decoding="async"
        draggable="false"
        data-theme-toggle
      />
    </section>`;
}
