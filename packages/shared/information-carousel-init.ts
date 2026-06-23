import type { InformationSlide } from "./types";

export function initInformationCarousel(
  root: ParentNode,
  slides: readonly InformationSlide[],
): void {
  const section = root.querySelector("#information");
  const track = root.querySelector<HTMLElement>("#info-track");
  const prevBtn = root.querySelector<HTMLButtonElement>("#info-prev");
  const nextBtn = root.querySelector<HTMLButtonElement>("#info-next");
  const dots = root.querySelectorAll<HTMLButtonElement>("[data-info-dot]");
  const slideEls = root.querySelectorAll<HTMLElement>("[data-info-slide]");

  if (!section || !track || !prevBtn || !nextBtn) return;

  let index = 0;
  const total = slides.length;
  let touchStartX = 0;

  const goTo = (next: number): void => {
    index = (next + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;

    slideEls.forEach((slide, i) => {
      slide.setAttribute("aria-hidden", String(i !== index));
    });

    dots.forEach((dot, i) => {
      const active = i === index;
      dot.setAttribute("aria-selected", String(active));
      dot.classList.toggle("bg-[#555555]", active);
      dot.classList.toggle("bg-[#dddddd]", !active);
    });

    const showPrev = index > 0;
    prevBtn.classList.toggle("opacity-0", !showPrev);
    prevBtn.classList.toggle("pointer-events-none", !showPrev);
  };

  nextBtn.addEventListener("click", () => goTo(index + 1));
  prevBtn.addEventListener("click", () => goTo(index - 1));

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const i = Number(dot.dataset.infoDot);
      if (!Number.isNaN(i)) goTo(i);
    });
  });

  track.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0]?.clientX ?? 0;
    },
    { passive: true },
  );

  track.addEventListener(
    "touchend",
    (e) => {
      const touchEndX = e.changedTouches[0]?.clientX ?? 0;
      const delta = touchStartX - touchEndX;
      if (Math.abs(delta) < 40) return;
      if (delta > 0) goTo(index + 1);
      else goTo(index - 1);
    },
    { passive: true },
  );
}
