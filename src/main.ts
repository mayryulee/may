import "./index.css";
import { initCalendarCountdown } from "./calendar-countdown";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app not found");

app.innerHTML = `
  <article>
    <header class="relative mr-3" aria-label="청첩장 타이틀">
      <img
        class="block w-full h-auto"
        src="/images/title.png"
        alt="Starting our life Together"
        width="878"
        height="486"
        decoding="async"
      />
      <div
        class="absolute right-0 bottom-3 flex flex-col items-end font-cabinet text-[0.8rem] leading-normal font-normal tracking-[0.16em] text-[#111111]"
        aria-label="예식 연월일"
      >
        <span class="block">2027</span>
        <span class="block">04.25</span>
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
        <span class="block">27.04.25</span>
        <span class="mt-[0.12em] block">am 11:00</span>
      </p>
      <div
        class="mt-[1.35rem] font-noto text-[0.76rem] leading-[1.75] tracking-tight"
      >
        <p class="m-0">2027년 4월 25일 일요일 오전 11시</p>
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
        class="mt-8 text-[0.84rem] font-extralight leading-[2.1] tracking-tight text-[#333333]"
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
        class="-mx-[46px] mt-16 mb-0 block w-[calc(100%+92px)] max-w-none"
        src="/images/sub01.png"
        alt="웨딩 사진"
        loading="lazy"
        decoding="async"
      />
    </section>

    <section
      class="-mx-[46px] bg-[#F7F7F7] py-12 text-center"
      aria-label="예식까지 남은 시간"
    >
      <div class="w-full px-[69px] text-center">
        <img
          class="mx-auto block w-full h-auto"
          src="/images/calendar.png"
          alt="2027년 4월 예식 일정"
          width="777"
          height="912"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div class="mt-8 w-full px-[69px] text-center">
        <div
          class="mx-auto h-px w-full bg-[#dddddd]"
          aria-hidden="true"
        ></div>

        <div
          class="mx-auto mt-8 w-full px-8"
          aria-live="polite"
          aria-atomic="true"
        >
          <div
            class="grid w-full grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-end justify-items-center gap-x-1"
          >
            <div class="w-full text-center">
              <p
                class="m-0 font-cormorant text-dday-label font-normal uppercase tracking-[0.22em] text-[#999999]"
              >
                Days
              </p>
              <p
                id="count-days"
                class="m-0 mt-1 w-full font-dm text-dday-num font-semibold leading-none tabular-nums text-[#111111] transition-opacity duration-300"
              >
                000
              </p>
            </div>
            <span class="pb-1 font-dm text-dday-colon leading-none text-[#111111]"
              >:</span
            >
            <div class="w-full text-center">
              <p
                class="m-0 font-cormorant text-dday-label font-normal uppercase tracking-[0.22em] text-[#999999]"
              >
                Hour
              </p>
              <p
                id="count-hours"
                class="m-0 mt-1 w-full font-dm text-dday-num font-semibold leading-none tabular-nums text-[#111111] transition-opacity duration-300"
              >
                00
              </p>
            </div>
            <span class="pb-1 font-dm text-dday-colon leading-none text-[#111111]"
              >:</span
            >
            <div class="w-full text-center">
              <p
                class="m-0 font-cormorant text-dday-label font-normal uppercase tracking-[0.22em] text-[#999999]"
              >
                Min
              </p>
              <p
                id="count-mins"
                class="m-0 mt-1 w-full font-dm text-dday-num font-semibold leading-none tabular-nums text-[#111111] transition-opacity duration-300"
              >
                00
              </p>
            </div>
            <span class="pb-1 font-dm text-dday-colon leading-none text-[#111111]"
              >:</span
            >
            <div class="w-full text-center">
              <p
                class="m-0 font-cormorant text-dday-label font-normal uppercase tracking-[0.22em] text-[#999999]"
              >
                Sec
              </p>
              <p
                id="count-secs"
                class="m-0 mt-1 w-full font-dm text-dday-num font-semibold leading-none tabular-nums text-[#111111] transition-opacity duration-300"
              >
                00
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full px-[69px] pt-10 text-center">
        <p
          class="m-0 w-full font-noto text-[1.03rem] leading-snug tracking-tight text-[#111111]"
        >
          정호 <span class="text-[#111111]" aria-hidden="true">♥</span> 채현
          결혼식이
          <span id="d-day-count" class="font-medium text-[#4a6fa5]">0</span>일
          남았습니다.
        </p>
      </div>
    </section>
  </article>
`;

initCalendarCountdown(app);
