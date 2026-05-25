import "./test-style.css";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app not found");

app.innerHTML = `
  <div class="banner">
    <h1>테스트 페이지</h1>
    <p>레이아웃·뷰포트·링크 이동이 정상인지 확인하는 용도입니다.</p>
    <div class="check">
      <span aria-hidden="true">✓</span>
      <span><code style="color:inherit;font-size:0.85em;">/test.html</code> 로 접속한 상태입니다.</span>
    </div>
    <div class="nav-row">
      <a href="/">메인으로 돌아가기</a>
    </div>
  </div>
`;
