const DEFAULT_THRESHOLD = 40;

export type SwipeDirection = "prev" | "next";

/**
 * Horizontal swipe on touch devices. Ignores mostly-vertical gestures (page scroll).
 * `consumeSwipe` is true once after a successful swipe — use it to suppress a follow-up click
 * when the swipe target is also a button.
 */
export function bindHorizontalSwipe(
  el: HTMLElement,
  onSwipe: (direction: SwipeDirection) => void,
  threshold = DEFAULT_THRESHOLD,
): { consumeSwipe: () => boolean } {
  let startX = 0;
  let startY = 0;
  let swiped = false;

  el.addEventListener(
    "touchstart",
    (e) => {
      swiped = false;
      const t = e.changedTouches[0];
      startX = t?.clientX ?? 0;
      startY = t?.clientY ?? 0;
    },
    { passive: true },
  );

  el.addEventListener(
    "touchend",
    (e) => {
      const t = e.changedTouches[0];
      const dx = (t?.clientX ?? 0) - startX;
      const dy = (t?.clientY ?? 0) - startY;
      if (Math.abs(dx) < threshold || Math.abs(dx) <= Math.abs(dy)) return;
      swiped = true;
      onSwipe(dx > 0 ? "prev" : "next");
    },
    { passive: true },
  );

  return {
    consumeSwipe: () => {
      if (!swiped) return false;
      swiped = false;
      return true;
    },
  };
}
