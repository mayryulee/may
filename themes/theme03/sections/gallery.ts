import type { GalleryImage } from "../../../packages/shared/types";
import { clientImageUrl } from "../../../packages/shared/types";

const GALLERY_ARROW_BASE =
  "absolute top-[50%] z-[10] flex h-[40px] w-[40px] -translate-y-[50%] items-center justify-center border-[0px] bg-transparent p-0 text-white/90";
const GALLERY_ARROW_PREV_CLASS = `${GALLERY_ARROW_BASE} left-[4px]`;
const GALLERY_ARROW_NEXT_CLASS = `${GALLERY_ARROW_BASE} right-[4px]`;
const GALLERY_ARROW_PREV_HIDDEN_CLASS =
  "opacity-0 pointer-events-none transition-opacity duration-200";

function galleryArrowIcon(direction: "prev" | "next"): string {
  const path = direction === "next" ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6";
  return `<svg
            class="h-[20px] w-[20px]"
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

function renderGalleryLightboxHtml(): string {
  return /* html */ `
    <div
      id="gallery-lightbox"
      class="fixed inset-0 z-[100] hidden"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
      aria-label="갤러리 사진 보기"
    >
      <div class="absolute inset-0 bg-black/90" data-gallery-close></div>
      <div class="relative mx-auto flex h-full max-w-[400px] items-center justify-center px-[8px] py-[48px]">
        <button
          type="button"
          data-gallery-close
          class="absolute top-[16px] right-[16px] z-[10] inline-flex h-[40px] w-[40px] items-center justify-center border-[0px] bg-transparent p-0 text-[28px] leading-none text-white/80"
          aria-label="닫기"
        >
          ×
        </button>
        <div class="relative w-fit max-w-full">
          <button
            type="button"
            data-gallery-lightbox-prev
            class="${GALLERY_ARROW_PREV_CLASS}${GALLERY_ARROW_PREV_HIDDEN_CLASS}"
            aria-label="이전 사진"
          >
            ${galleryArrowIcon("prev")}
          </button>
          <button
            type="button"
            data-gallery-lightbox-next
            class="${GALLERY_ARROW_NEXT_CLASS}"
            aria-label="다음 사진"
          >
            ${galleryArrowIcon("next")}
          </button>
          <img
            id="gallery-lightbox-image"
            class="block max-h-[min(85vh,720px)] max-w-full w-auto h-auto"
            alt=""
            decoding="async"
          />
        </div>
      </div>
    </div>`;
}

export function renderGalleryHtml(
  clientId: string,
  images: readonly GalleryImage[],
): string {
  const first = images[0];
  const firstSrc = first ? clientImageUrl(clientId, first.src) : "";
  const firstAlt = first?.alt ?? "";

  return /* html */ `
    <section
      id="gallery"
      class="pt-[103px] pb-[123px] px-[25px] text-left"
      aria-label="갤러리"
    >
      <header class="mb-[30px]">
        <p class="mb-0 mx-0 font-melodrama text-[38px] uppercase leading-none tracking-normal text-[#111111]">Gallery</p>
      </header>

      <div class="relative w-full">
        <div class="relative z-0" data-gallery-carousel>
          <button
            type="button"
            data-gallery-open
            class="block w-full overflow-hidden border-[0px] bg-transparent p-0"
            aria-label="갤러리 사진 크게 보기"
          >
            <img
              id="gallery-carousel-image"
              class="block aspect-[3/4] w-full object-cover object-center"
              src="${firstSrc}"
              alt="${firstAlt}"
              loading="lazy"
              decoding="async"
              draggable="false"
            />
          </button>
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
          class="${GALLERY_ARROW_PREV_CLASS}${GALLERY_ARROW_PREV_HIDDEN_CLASS}"
          aria-label="이전 사진"
        >
          ${galleryArrowIcon("prev")}
        </button>
      </div>
    </section>
    ${renderGalleryLightboxHtml()}`;
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
  const openBtn = root.querySelector<HTMLButtonElement>("[data-gallery-open]");
  const lightbox = root.querySelector<HTMLElement>("#gallery-lightbox");
  const lightboxImage = root.querySelector<HTMLImageElement>("#gallery-lightbox-image");
  const lightboxPrevBtn = root.querySelector<HTMLButtonElement>("[data-gallery-lightbox-prev]");
  const lightboxNextBtn = root.querySelector<HTMLButtonElement>("[data-gallery-lightbox-next]");
  if (
    !section ||
    !carousel ||
    !imageEl ||
    !prevBtn ||
    !nextBtn ||
    !openBtn ||
    !lightbox ||
    !lightboxImage ||
    !lightboxPrevBtn ||
    !lightboxNextBtn ||
    images.length === 0
  ) {
    return;
  }

  const img = imageEl;
  const prev = prevBtn;
  const next = nextBtn;
  const lb = lightbox;
  const lbImg = lightboxImage;
  const lbPrev = lightboxPrevBtn;
  const lbNext = lightboxNextBtn;
  const resolved = images.map((image) => ({
    src: clientImageUrl(clientId, image.src),
    alt: image.alt,
  }));

  let activeIndex = 0;
  let touchStartX = 0;
  let lightboxTouchStartX = 0;

  function updateArrows(): void {
    const hasMultiple = resolved.length > 1;
    const showPrev = hasMultiple && activeIndex > 0;
    prev.classList.toggle("opacity-0", !showPrev);
    prev.classList.toggle("pointer-events-none", !showPrev);
    next.classList.toggle("opacity-0", !hasMultiple);
    next.classList.toggle("pointer-events-none", !hasMultiple);
  }

  function updateLightboxArrows(index: number): void {
    const hasMultiple = resolved.length > 1;
    const showPrev = hasMultiple && index > 0;
    lbPrev.classList.toggle("opacity-0", !showPrev);
    lbPrev.classList.toggle("pointer-events-none", !showPrev);
    lbNext.classList.toggle("opacity-0", !hasMultiple);
    lbNext.classList.toggle("pointer-events-none", !hasMultiple);
  }

  function showImage(index: number): void {
    if (resolved.length === 0) return;

    activeIndex = ((index % resolved.length) + resolved.length) % resolved.length;
    const slide = resolved[activeIndex];
    img.src = slide.src;
    img.alt = slide.alt;
    updateArrows();
  }

  function showLightboxImage(index: number): void {
    if (resolved.length === 0) return;

    activeIndex = ((index % resolved.length) + resolved.length) % resolved.length;
    const slide = resolved[activeIndex];
    lbImg.src = slide.src;
    lbImg.alt = slide.alt;
    updateLightboxArrows(activeIndex);
  }

  function openLightbox(): void {
    showLightboxImage(activeIndex);
    lb.classList.remove("hidden");
    lb.setAttribute("aria-hidden", "false");
    document.body.classList.add("overflow-hidden");
  }

  function closeLightbox(): void {
    lb.classList.add("hidden");
    lb.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overflow-hidden");
    lbImg.removeAttribute("src");
    showImage(activeIndex);
  }

  openBtn.addEventListener("click", openLightbox);

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

  lb.querySelectorAll("[data-gallery-close]").forEach((el) => {
    el.addEventListener("click", closeLightbox);
  });

  lbPrev.addEventListener("click", () => {
    showLightboxImage(activeIndex - 1);
  });

  lbNext.addEventListener("click", () => {
    showLightboxImage(activeIndex + 1);
  });

  lb.addEventListener(
    "touchstart",
    (e) => {
      lightboxTouchStartX = e.changedTouches[0]?.clientX ?? 0;
    },
    { passive: true },
  );

  lb.addEventListener(
    "touchend",
    (e) => {
      const touchEndX = e.changedTouches[0]?.clientX ?? 0;
      const delta = touchEndX - lightboxTouchStartX;
      if (Math.abs(delta) < 40) return;
      if (delta > 0) showLightboxImage(activeIndex - 1);
      else showLightboxImage(activeIndex + 1);
    },
    { passive: true },
  );

  window.addEventListener("keydown", (e) => {
    if (lb.classList.contains("hidden")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showLightboxImage(activeIndex - 1);
    if (e.key === "ArrowRight") showLightboxImage(activeIndex + 1);
  });

  updateArrows();
}
