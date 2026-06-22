import "./index.css";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app not found");

app.innerHTML = `
  <div
    class="rounded-xl border border-white/[0.08] bg-white/[0.06] px-[18px] py-4"
  >
    <h1 class="m-0 mb-1.5 text-[18px] font-semibold">테스트 페이지</h1>
    <p class="m-0 text-[14px] text-[#a8a29a]">
      레이아웃·뷰포트·링크 이동이 정상인지 확인하는 용도입니다.
    </p>
    <div class="mt-4 flex items-start gap-2 text-[14px] text-[#86efac]">
      <span aria-hidden="true">✓</span>
      <span class="text-[#a8a29a]"
        ><code class="text-[0.85em] text-inherit">/test.html</code> 로 접속한
        상태입니다.</span
      >
    </div>
    <div class="mt-5">
      <a
        href="/"
        class="text-[14px] text-[#c4b5a0] underline-offset-[3px] hover:underline"
        >메인으로 돌아가기</a
      >
    </div>
  </div>
`;
