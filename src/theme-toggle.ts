const TAP_COUNT = 3;
const TAP_WINDOW_MS = 600;

/** © FOR MAY 로고 영역 3탭으로 theme01 ↔ theme02 전환 */
export function bindThemeToggle(
  root: ParentNode,
  onToggle: () => void,
): void {
  let tapCount = 0;
  let tapTimer: number | undefined;

  const resetTaps = (): void => {
    tapCount = 0;
    if (tapTimer !== undefined) {
      window.clearTimeout(tapTimer);
      tapTimer = undefined;
    }
  };

  const target = root.querySelector<HTMLElement>("[data-theme-toggle]");
  if (!target) return;

  target.addEventListener("pointerup", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    tapCount += 1;
    if (tapTimer !== undefined) window.clearTimeout(tapTimer);
    tapTimer = window.setTimeout(resetTaps, TAP_WINDOW_MS);

    if (tapCount >= TAP_COUNT) {
      resetTaps();
      onToggle();
    }
  });
}
