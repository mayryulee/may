import "./index.css";
import { initAccountGift, renderGiftAccountsHtml } from "./account-gift";
import { initCalendarCountdown } from "./calendar-countdown";
import { initGallery, renderGalleryHtml } from "./gallery";
import { initGuestbook, renderGuestbookHtml } from "./guestbook";
import {
  initInformationCarousel,
  renderInformationHtml,
} from "./information-carousel";
import { initLocation } from "./location";
import { renderQuoteHtml } from "./quote";
import { initShare, renderShareHtml } from "./share";

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

    ${renderGalleryHtml()}

    <section
      class="-mx-[46px] bg-[#F7F7F7] px-[25px] py-12 text-center"
      aria-label="오시는 길"
    >
      <header class="pb-8">
        <p
          class="m-0 font-cormorant text-[1.05rem] font-normal uppercase tracking-[0.38em] text-[#111111]"
        >
          Location
        </p>
      </header>

      <div class="font-noto text-[#111111]">
        <p class="m-0 text-[0.92rem] font-normal tracking-tight">
          노블발렌티 대치점
        </p>
        <p
          class="m-0 mt-3 flex flex-wrap items-center justify-center gap-x-1.5 text-[0.78rem] font-extralight tracking-tight text-[#333333]"
        >
          <span>서울 강남구 영동대로 325</span>
          <button
            id="copy-address"
            type="button"
            class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded border-0 bg-transparent p-0"
            aria-label="주소 복사"
          >
            <img
              src="/icons/copy.svg"
              alt=""
              width="17"
              height="17"
              class="block h-[17px] w-[17px]"
              decoding="async"
              aria-hidden="true"
            />
          </button>
        </p>
        <p class="m-0 mt-2 text-[0.76rem] font-extralight tracking-tight text-[#666666]">
          Tel. 02-539-0400
        </p>
      </div>

      <div
        id="venue-map"
        class="mt-6 h-[220px] w-full overflow-hidden rounded-sm bg-[#e8edf2]"
        role="img"
        aria-label="노블발렌티 대치점 위치 지도"
      ></div>

      <div class="mt-3 grid grid-cols-3 gap-2">
        <a
          data-map="kakao"
          href="https://map.kakao.com/?q=%EB%85%B8%EB%B8%94%EB%B0%9C%EB%A0%8C%ED%8B%B0%20%EB%8C%80%EC%B9%98%EC%A0%90"
          target="_blank"
          rel="noopener noreferrer"
          class="flex flex-col items-center justify-center gap-1.5 rounded-md bg-white py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.08)] no-underline"
        >
          <span
            class="flex h-7 w-7 items-center justify-center rounded bg-[#FEE500] text-[0.55rem] font-bold text-[#3B1E1E]"
            aria-hidden="true"
            >K</span
          >
          <span class="font-noto text-[0.72rem] font-extralight text-[#111111]"
            >카카오</span
          >
        </a>
        <a
          data-map="naver"
          href="https://map.naver.com/p/search/%EB%85%B8%EB%B8%94%EB%B0%9C%EB%A0%8C%ED%8B%B0%20%EB%8C%80%EC%B9%98%EC%A0%90/place/1634613412"
          target="_blank"
          rel="noopener noreferrer"
          class="flex flex-col items-center justify-center gap-1.5 rounded-md bg-white py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.08)] no-underline"
        >
          <span
            class="flex h-7 w-7 items-center justify-center rounded bg-[#03C75A] text-[0.7rem] font-bold text-white"
            aria-hidden="true"
            >N</span
          >
          <span class="font-noto text-[0.72rem] font-extralight text-[#111111]"
            >네이버</span
          >
        </a>
        <a
          data-map="tmap"
          href="tmap://route?goalname=%EB%85%B8%EB%B8%94%EB%B0%9C%EB%A0%8C%ED%8B%B0%20%EB%8C%80%EC%B9%98%EC%A0%90&amp;goalx=127.060155&amp;goaly=37.505686"
          rel="noopener noreferrer"
          class="flex flex-col items-center justify-center gap-1.5 rounded-md bg-white py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.08)] no-underline"
        >
          <span
            class="flex h-7 w-7 items-center justify-center rounded bg-[#E4002B] text-[0.65rem] font-bold text-white"
            aria-hidden="true"
            >T</span
          >
          <span class="font-noto text-[0.72rem] font-extralight text-[#111111]"
            >T MAP</span
          >
        </a>
      </div>

      <div
        class="mt-10 space-y-0 border-t border-[#dddddd] text-left font-noto text-[0.76rem] font-extralight leading-[1.85] tracking-tight text-[#333333]"
      >
        <div class="border-b border-[#dddddd] py-5">
          <p class="m-0 font-medium text-[#111111]">자가용 이용 시</p>
          <p class="m-0 mt-2">내비게이션 &apos;노블발렌티 대치점&apos; 검색</p>
          <p class="m-0">서울 강남구 영동대로 325 (대치동 983-1)</p>
        </div>
        <div class="border-b border-[#dddddd] py-5">
          <p class="m-0 font-medium text-[#111111]">버스 이용 시</p>
          <p class="m-0 mt-2">
            휘문고교사거리 하차 후 학여울역 방향 100m 직전
          </p>
          <p class="m-0">간선 : 343, 401</p>
          <p class="m-0">지선 : 4319</p>
          <p class="m-0">일반 : 11-3, 917</p>
          <p class="m-0">직행 : 500-2, 9407, 9507, 9607</p>
          <p class="m-0">마을 : 강남01, 강남06</p>
        </div>
        <div class="border-b border-[#dddddd] py-5">
          <p class="m-0 font-medium text-[#111111]">지하철 이용 시</p>
          <p class="m-0 mt-2">
            2호선 삼성역 3번 출구 30m 전방에서 셔틀버스 운행
          </p>
          <p class="m-0">(수시운행, 도보 이용시 7분 소요)</p>
        </div>
        <div class="pt-5">
          <p class="m-0 font-medium text-[#111111]">주차장 안내</p>
          <p class="m-0 mt-2">건물 내 지하주차장 이용 안내</p>
        </div>
      </div>
    </section>

    ${renderGiftAccountsHtml()}

    ${renderInformationHtml()}

    ${renderGuestbookHtml()}

    ${renderQuoteHtml()}

    ${renderShareHtml()}
  </article>
`;

initCalendarCountdown(app);
initGallery(app);
initLocation(app);
initAccountGift(app);
initInformationCarousel(app);
initGuestbook(app);
initShare();
