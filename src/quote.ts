export function renderQuoteHtml(): string {
  return `
    <section
      class="-mx-[46px] bg-[#1E2531] px-[25px] py-14 text-center font-noto text-white"
      aria-label="명언"
    >
      <div class="space-y-5 text-[0.78rem] font-normal leading-[1.95] tracking-tight">
        <div class="space-y-0.5">
          <p class="m-0">사랑은 짧은 세월에 변하지 않고</p>
          <p class="m-0">운명이 다할 때까지 견디는것</p>
        </div>
        <p class="m-0">만일 이것이 틀렸다면, 그렇게 밝혀졌다면</p>
        <div class="space-y-0.5">
          <p class="m-0">나는 글을 쓰지 않았고,</p>
          <p class="m-0">그 누구도 사랑을 안했다네</p>
        </div>
      </div>
      <p
        class="m-0 mt-10 text-[0.68rem] font-normal tracking-tight text-white/70"
      >
        셰익스피어 소네트 116
      </p>
    </section>`;
}
