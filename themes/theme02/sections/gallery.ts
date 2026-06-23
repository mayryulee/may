import { melodramaTitleClass } from "../tokens";
import type { GalleryImage } from "../../../packages/shared/types";
import { clientImageUrl } from "../../../packages/shared/types";

const GALLERY_ARROW_BASE =
  "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-white/90";

const GALLERY_ARROW_PREV_CLASS = `${GALLERY_ARROW_BASE} left-1`;
const GALLERY_ARROW_NEXT_CLASS = `${GALLERY_ARROW_BASE} right-1`;
const GALLERY_ARROW_PREV_HIDDEN_CLASS =
  "opacity-0 pointer-events-none transition-opacity duration-200";

function galleryArrowIcon(direction: "prev" | "next"): string {
  const path = direction === "next" ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6";
  return `<svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="${path}" />
          </svg>`;
}

export function renderGalleryHtml(
  clientId: string,
  images: readonly GalleryImage[],
): string {
  const first = images[0];
  const firstSrc = first ? clientImageUrl(clientId, first.src) : "";
  const firstAlt = first?.alt ?? "";

  return `
    <section
      id="gallery"
      class="-mx-[46px] mt-32 px-8 text-left"
      aria-label="갤러리"
    >
      <header class="pb-10">
        <p class="${melodramaTitleClass}">Gallery</p>
      </header>

      <div class="relative w-full">
        <div class="relative z-0" data-gallery-carousel>
          <img
            id="gallery-carousel-image"
            class="block aspect-[3/4] w-full object-cover object-center"
            src="${firstSrc}"
            alt="${firstAlt}"
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        </div>
        <button
          type="button"
          data-gallery-next
          class="${GALLERY_ARROW_NEXT_CLASS}"
          aria-label="다음 사진"
        >
          ${galleryArrowIcon("next")}
        </button>
        <button
          type="button"
          data-gallery-prev
          class="${GALLERY_ARROW_PREV_CLASS} ${GALLERY_ARROW_PREV_HIDDEN_CLASS}"
          aria-label="이전 사진"
        >
          ${galleryArrowIcon("prev")}
        </button>
      </div>
    </section>`;
}

export function initGallery(
  root: ParentNode,
  clientId: string,
  images: readonly GalleryImage[],
): void {
  const section = root.querySelector("#gallery");
  const carousel = root.querySelector<HTMLElement>("[data-gallery-carousel]");
  const imageEl = root.querySelector<HTMLImageElement>("#gallery-carousel-image");
  const prevBtn = root.querySelector<HTMLButtonElement>("[data-gallery-prev]");
  const nextBtn = root.querySelector<HTMLButtonElement>("[data-gallery-next]");
  if (!section || !carousel || !imageEl || !prevBtn || !nextBtn || images.length === 0) {
    return;
  }

  const img = imageEl;
  const prev = prevBtn;
  const next = nextBtn;
  const resolved = images.map((image) => ({
    src: clientImageUrl(clientId, image.src),
    alt: image.alt,
  }));

  let activeIndex = 0;
  let touchStartX = 0;

  function updateArrows(): void {
    const hasMultiple = resolved.length > 1;
    const showPrev = hasMultiple && activeIndex > 0;
    prev.classList.toggle("opacity-0", !showPrev);
    prev.classList.toggle("pointer-events-none", !showPrev);
    next.classList.toggle("opacity-0", !hasMultiple);
    next.classList.toggle("pointer-events-none", !hasMultiple);
  }

  function showImage(index: number): void {
    if (resolved.length === 0) return;

    activeIndex = ((index % resolved.length) + resolved.length) % resolved.length;
    const slide = resolved[activeIndex];
    img.src = slide.src;
    img.alt = slide.alt;
    updateArrows();
  }

  prev.addEventListener("click", () => {
    showImage(activeIndex - 1);
  });

  next.addEventListener("click", () => {
    showImage(activeIndex + 1);
  });

  carousel.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0]?.clientX ?? 0;
    },
    { passive: true },
  );

  carousel.addEventListener(
    "touchend",
    (e) => {
      const touchEndX = e.changedTouches[0]?.clientX ?? 0;
      const delta = touchEndX - touchStartX;
      if (Math.abs(delta) < 40) return;
      if (delta > 0) showImage(activeIndex - 1);
      else showImage(activeIndex + 1);
    },
    { passive: true },
  );

  updateArrows();
}
