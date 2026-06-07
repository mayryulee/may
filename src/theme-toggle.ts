const HOLD_MS = 800;

let bound = false;

/** © FOR MAY 로고를 길게 누르면 sample01 ↔ sample02 전환 */
export function bindThemeToggle(
  root: ParentNode,
  onToggle: () => void,
): void {
  if (bound) return;
  bound = true;

  let holdTimer: number | undefined;

  const clearHold = (): void => {
    if (holdTimer !== undefined) {
      window.clearTimeout(holdTimer);
      holdTimer = undefined;
    }
  };

  const isToggleTarget = (el: EventTarget | null): el is HTMLElement =>
    el instanceof HTMLElement && Boolean(el.closest("[data-theme-toggle]"));

  root.addEventListener("pointerdown", (e) => {
    if (!isToggleTarget(e.target)) return;
    const pe = e as PointerEvent;
    if (pe.pointerType === "mouse" && pe.button !== 0) return;

    clearHold();
    holdTimer = window.setTimeout(() => {
      holdTimer = undefined;
      onToggle();
    }, HOLD_MS);
  });

  root.addEventListener("pointerup", clearHold);
  root.addEventListener("pointercancel", clearHold);

  root.addEventListener("contextmenu", (e) => {
    if (isToggleTarget(e.target)) e.preventDefault();
  });
}
