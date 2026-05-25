import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app not found");

app.innerHTML = `
  <article class="invite">
    <header>
      <div class="starting-row">
        <span class="starting-word">Starting</span>
        <span class="starting-rule" aria-hidden="true"></span>
      </div>
      <p class="our-life">our life</p>
      <div class="together-row">
        <h1 class="together">Together</h1>
        <div class="date-corner" aria-label="예식 연월일">
          <span>2026</span>
          <span>04.25</span>
        </div>
      </div>
    </header>

    <div class="photo-placeholder" role="img" aria-label="웨딩 사진 자리"></div>

    <section class="names" aria-label="신랑 신부">
      <p class="names-en">Jeongho &amp; Chaehyun</p>
      <p class="names-ko">신랑 김정호&nbsp;&nbsp;&nbsp;신부 박채현</p>
    </section>

    <div class="section-divider" aria-hidden="true"></div>

    <section class="save-block" aria-label="예식 일시·장소">
      <div class="save-date-title">
        <span class="save-word">SAVE</span>
        <span class="save-the">the</span>
        <span class="save-word">DATE</span>
      </div>
      <p class="event-datetime">
        <span class="date-line">26.04.25</span>
        <span class="time-line">am 11:00</span>
      </p>
      <div class="event-footer">
        <p>2026년 4월 25일 토요일 오전 11시</p>
        <p>노블발렌티 대치점 단독홀</p>
      </div>
    </section>
  </article>
`;
