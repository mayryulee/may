/** 예식 일시 (한국 시간) */
export const WEDDING_AT = new Date("2027-04-25T11:00:00+09:00");

const MS_DAY = 86_400_000;
const MS_HOUR = 3_600_000;
const MS_MIN = 60_000;

/** KST 기준 날짜(자정)까지 남은 '일' — 하단 멘트용 */
function getCalendarDaysUntil(target: Date, now = new Date()): number {
  const toKstMidnight = (d: Date) => {
    const [y, m, day] = d
      .toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" })
      .split("-")
      .map(Number);
    return Date.UTC(y, m - 1, day);
  };
  const diff = toKstMidnight(target) - toKstMidnight(now);
  return Math.max(0, Math.round(diff / MS_DAY));
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function pad3(n: number): string {
  return String(n).padStart(3, "0");
}

export function initCalendarCountdown(root: ParentNode = document): void {
  const daysEl = root.querySelector<HTMLElement>("#count-days");
  const hoursEl = root.querySelector<HTMLElement>("#count-hours");
  const minsEl = root.querySelector<HTMLElement>("#count-mins");
  const secsEl = root.querySelector<HTMLElement>("#count-secs");
  const dDayEl = root.querySelector<HTMLElement>("#d-day-count");

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  const tick = () => {
    const diff = Math.max(0, WEDDING_AT.getTime() - Date.now());

    const days = Math.floor(diff / MS_DAY);
    const hours = Math.floor((diff % MS_DAY) / MS_HOUR);
    const mins = Math.floor((diff % MS_HOUR) / MS_MIN);
    const secs = Math.floor((diff % MS_MIN) / 1000);

    daysEl.textContent = pad3(days);
    hoursEl.textContent = pad2(hours);
    minsEl.textContent = pad2(mins);
    secsEl.textContent = pad2(secs);

    if (dDayEl) {
      dDayEl.textContent = String(getCalendarDaysUntil(WEDDING_AT));
    }
  };

  tick();
  window.setInterval(tick, 1000);
}
