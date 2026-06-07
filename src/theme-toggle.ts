const HOLD_MS = 800;

let bound = false;

/**
 * 화면 왼쪽 하단 고정 영역을 길게 누르면 theme01 ↔ theme02 전환.
 * (더블탭 줌을 피하기 위해 3탭 대신 롱프레스 사용)
 */
export function bindThemeToggle(onToggle: () => void): void {
  if (bound) return;
  bound = true;

  const zone = document.createElement("div");
  zone.id = "theme-toggle-zone";
  zone.setAttribute("aria-hidden", "true");
  document.body.appendChild(zone);

  let holdTimer: number | undefined;

  const clearHold = (): void => {
    if (holdTimer !== undefined) {
      window.clearTimeout(holdTimer);
      holdTimer = undefined;
    }
  };

  zone.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    clearHold();
    holdTimer = window.setTimeout(() => {
      holdTimer = undefined;
      onToggle();
    }, HOLD_MS);
  });

  zone.addEventListener("pointerup", clearHold);
  zone.addEventListener("pointercancel", clearHold);
  zone.addEventListener("pointerleave", clearHold);
}
