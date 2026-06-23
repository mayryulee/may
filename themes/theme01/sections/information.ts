import { initInformationCarousel } from "../../../packages/shared/information-carousel-init";
import type { InformationSlide } from "../../../packages/shared/types";
import { bodyFontClass, sectionTitleEnClass } from "../tokens";

export { initInformationCarousel };

function renderSlide(slide: InformationSlide, index: number): string {
  const body =
    slide.lines.length > 0
      ? `<div class="mt-5 space-y-0.5 ${bodyFontClass} text-[12px] font-extralight leading-[1.85] tracking-tight text-[#5D5D5D]">
          ${slide.lines.map((line) => `<p class="m-0">${line}</p>`).join("")}
        </div>`
      : "";

  return `
    <div
      class="w-full shrink-0 px-6 py-9 text-center"
      data-info-slide="${index}"
      aria-hidden="${index === 0 ? "false" : "true"}"
    >
      <p class="m-0 ${bodyFontClass} text-[16px] font-semibold tracking-tight text-[#111111]">
        ${slide.title}
      </p>
      ${body}
    </div>`;
}

export function renderInformationHtml(slides: readonly InformationSlide[]): string {
  const slideHtml = slides.map((slide, index) => renderSlide(slide, index)).join("");

  return `
    <section
      id="information"
      class="-mx-[46px] bg-[#F7F7F7] px-[25px] py-12 text-center"
      aria-label="안내 사항"
    >
      <header>
        <p class="${sectionTitleEnClass}">Information</p>
        <p class="m-0 mt-2.5 ${bodyFontClass} text-[16px] tracking-noraml text-[#5D5D5D]">
          결혼식에 관련하여 사전 안내 드립니다
        </p>
      </header>

      <div class="relative mx-auto mt-8 max-w-full">
        <div class="min-h-[184px] overflow-hidden rounded-sm bg-white shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
          <div
            id="info-track"
            class="flex transition-transform duration-350 ease-out"
            style="transform: translateX(0%)"
          >
            ${slideHtml}
          </div>
        </div>

        <button
          type="button"
          id="info-next"
          class="absolute top-1/2 right-1 flex h-10 w-10 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-[#cccccc]"
          aria-label="다음 안내"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>

        <button
          type="button"
          id="info-prev"
          class="absolute top-1/2 left-1 flex h-10 w-10 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-[#cccccc] opacity-0 pointer-events-none transition-opacity duration-200"
          aria-label="이전 안내"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      </div>

      <div
        id="info-dots"
        class="mt-5 flex items-center justify-center gap-2"
        role="tablist"
        aria-label="안내 슬라이드"
      >
        ${slides.map(
          (_, i) => `
        <button
          type="button"
          role="tab"
          data-info-dot="${i}"
          aria-label="${i + 1}번째 안내"
          aria-selected="${i === 0 ? "true" : "false"}"
          class="h-2 w-2 rounded-full border-0 p-0 transition-colors duration-200 ${i === 0 ? "bg-[#555555]" : "bg-[#dddddd]"}"
        ></button>`,
        ).join("")}
      </div>
    </section>`;
}
