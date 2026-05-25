import "./index.css";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app not found");

app.innerHTML = `
  <article>
    <header class="mb-0.5">
      <div class="flex items-center gap-2.5">
        <span
          class="font-cabinet text-[3.5rem] mr-6 leading-none font-light tracking-[0.01em] whitespace-nowrap italic"
          style="font-synthesis: style"
          >Starting</span
        >
        <span
          class="mt-[0.14em] h-px min-w-10 flex-1 bg-[#111111]"
          aria-hidden="true"
        ></span>
      </div>
      <p
        class="mt-[0.7rem] mr-12 text-right font-optima text-[2.9rem] leading-tight font-medium tracking-[-0.02em] lowercase"
      >
        our life
      </p>
      <div
        class="mt-6 grid grid-cols-[1fr_auto_1fr] items-end gap-1"
      >
        <div aria-hidden="true"></div>
        <h1
          class="m-0 p-0 text-center font-snell text-[clamp(3rem,18vw,4rem)] leading-[0.82] font-semibold tracking-tight"
        >
          Together
        </h1>
        <div
          class="flex flex-col items-end justify-self-end font-cabinet text-[0.9rem] leading-normal font-normal tracking-[0.16em]"
          aria-label="예식 연월일"
        >
          <span class="block">2026</span>
          <span class="block">04.25</span>
        </div>
      </div>
    </header>

    <img
      class="mt-[3.3rem] mb-6 block aspect-[3/4] w-full object-cover object-center"
      src="/images/main01.png"
      alt="Jeongho와 Chaehyun 웨딩 사진"
      width="430"
      height="573"
      decoding="async"
    />

    <section class="text-center" aria-label="신랑 신부">
      <p class="m-0 font-dm text-[0.92rem] tracking-[0.08em]">
        Jeongho &amp; Chaehyun
      </p>
      <p
        class="mt-[0.65rem] font-noto text-[0.88rem] leading-relaxed tracking-[0.18em]"
      >
        신랑 김정호&nbsp;&nbsp;&nbsp;신부 박채현
      </p>
    </section>

    <div
      class="mx-auto my-[1.35rem] mb-[1.15rem] h-9 w-px bg-[#111111]"
      aria-hidden="true"
    ></div>

    <section class="text-center" aria-label="예식 일시·장소">
      <div class="flex flex-wrap items-baseline justify-center gap-1.5">
        <span class="font-dm text-[0.72rem] font-medium tracking-[0.22em]"
          >SAVE</span
        >
        <span
          class="font-great -translate-y-[0.05em] text-[1.05rem] tracking-wide"
          >the</span
        >
        <span class="font-dm text-[0.72rem] font-medium tracking-[0.22em]"
          >DATE</span
        >
      </div>
      <p
        class="mt-[0.85rem] font-cormorant text-[clamp(2.1rem,10.5vw,2.85rem)] leading-tight tracking-wide"
      >
        <span class="block">26.04.25</span>
        <span class="mt-[0.12em] block">am 11:00</span>
      </p>
      <div
        class="mt-[1.35rem] font-noto text-[0.76rem] leading-[1.75] tracking-tight"
      >
        <p class="m-0">2026년 4월 25일 토요일 오전 11시</p>
        <p class="m-0">노블발렌티 대치점 단독홀</p>
      </div>
    </section>

    <section class="mt-20 text-center font-noto" aria-label="초대 인사">
      <div
        class="mx-auto h-[60px] w-px bg-[#d4d4d4]"
        aria-hidden="true"
      ></div>

      <div
        class="mx-auto mt-6 flex h-7 w-[8.75rem] items-center justify-center rounded-[50%] border border-[#111111]"
      >
        <span class="font-dm text-[0.62rem] font-normal tracking-[0.22em]"
          >INVITATION</span
        >
      </div>

      <h2
        class="mt-8 text-[1rem] font-medium tracking-tight text-[#111111]"
      >
        소중한 분들을 초대합니다
      </h2>

      <div
        class="mt-8 px-1 text-[0.84rem] font-extralight leading-[2.1] tracking-tight text-[#333333]"
      >
        <p class="m-0">봄 햇살이 함께 했던 지난날,</p>
        <p class="m-0">여러 해의 봄날 처럼</p>
        <p class="m-0">앞으로도 햇살같은 봄날을 함께 하려 합니다.</p>
        <p class="mt-8 m-0">부디 귀한 시간 내주시어 저희의 봄날에 함께</p>
        <p class="m-0">축복 해주시면 감사하겠습니다.</p>
      </div>

      <div
        class="mx-auto mt-10 h-px w-10 bg-[#d4d4d4]"
        aria-hidden="true"
      ></div>

      <div
        class="mt-10 space-y-3 text-[0.86rem] font-extralight tracking-tight text-[#111111]"
      >
        <p class="m-0 flex flex-wrap items-baseline justify-center gap-x-6">
          <span>김종욱 · 최은희의</span>
          <span>아들</span>
          <span>김정호</span>
        </p>
        <p class="m-0 flex flex-wrap items-baseline justify-center gap-x-6">
          <span>박중호 · 김혜진의</span>
          <span>딸</span>
          <span>박채현</span>
        </p>
      </div>

      <img
        class="mt-16 block w-full"
        src="/images/main02.png"
        alt="웨딩 사진"
        loading="lazy"
        decoding="async"
      />
    </section>
  </article>
`;
