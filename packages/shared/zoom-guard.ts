/**
 * 모바일 확대 방지.
 * - viewport meta(user-scalable=no)는 iOS Safari가 무시하므로 JS로 핀치 제스처를 막습니다.
 * - 더블탭 확대는 CSS `touch-action: manipulation`(index.css)으로 막습니다.
 * - 사진 길게 누르기(미리보기 확대·저장 메뉴)는 index.css + contextmenu 차단으로 막습니다.
 */
export function initZoomGuard(): void {
  // iOS Safari 핀치 확대
  for (const type of ["gesturestart", "gesturechange", "gestureend"]) {
    document.addEventListener(type, (e) => e.preventDefault(), { passive: false });
  }

  // Android 등: 두 손가락 터치 이동 차단
  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length > 1) e.preventDefault();
    },
    { passive: false },
  );

  // 사진 길게 누르기 메뉴 차단
  document.addEventListener("contextmenu", (e) => {
    if (e.target instanceof HTMLImageElement) e.preventDefault();
  });
}
