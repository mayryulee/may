import type { GalleryImage, ThemeId } from "./types";
import { clientImageUrl } from "./types";
import { sectionTitleEnClass, theme02MelodramaTitleClass, themeBodyFontClass } from "./section-heading";

const POPUP_IMAGE_MAX = 99;

const GALLERY_ARROW_PREV_CLASS =
  "absolute top-1/2 left-4 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-[2rem] leading-none text-white/70";

const GALLERY_ARROW_NEXT_CLASS =
  "absolute top-1/2 right-4 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-[2rem] leading-none text-white/70";

const THEME02_GALLERY_ARROW_PREV_CLASS =
  "absolute top-1/2 left-1 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-[2rem] leading-none text-white/70";

const THEME02_GALLERY_ARROW_NEXT_CLASS =
  "absolute top-1/2 right-1 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-[2rem] leading-none text-white/70";

function renderGalleryThumb(
  clientId: string,
  image: GalleryImage,
  index: number,
): string {
  const src = clientImageUrl(clientId, image.src);
  return `
    <button
      type="button"
      data-gallery-open="${index}"
      class="block w-full overflow-hidden border-0 bg-transparent p-0"
      aria-label="${image.alt} 크게 보기"
    >
      <img
        class="aspect-[3/4] w-full object-cover object-center"
        src="${src}"
        alt="${image.alt}"
        loading="lazy"
        decoding="async"
        draggable="false"
      />
    </button>`;
}

function renderTheme02GalleryHtml(
  clientId: string,
  images: readonly GalleryImage[],
): string {
  const first = images[0];
  const firstSrc = first ? clientImageUrl(clientId, first.src) : "";
  const firstAlt = first?.alt ?? "";
  const hideNext = images.length <= 1;

  return `
    <section
      id="gallery"
      class="-mx-[46px] mt-32 px-8 text-left"
      aria-label="갤러리"
    >
      <header class="pb-10">
        <p
          class="${theme02MelodramaTitleClass()}"
        >
          Gallery
        </p>
      </header>

      <div class="relative w-full" data-gallery-carousel>
        <button
          type="button"
          data-gallery-prev
          class="${THEME02_GALLERY_ARROW_PREV_CLASS}"
          aria-label="이전 사진"
          hidden
        >
          ‹
        </button>
        <button
          type="button"
          data-gallery-next
          class="${THEME02_GALLERY_ARROW_NEXT_CLASS}"
          aria-label="다음 사진"
          ${hideNext ? "hidden" : ""}
        >
          ›
        </button>
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
    </section>`;
}

function renderTheme01GalleryHtml(
  clientId: string,
  images: readonly GalleryImage[],
  themeId: ThemeId,
): string {
  const thumbs = images.map((img, i) => renderGalleryThumb(clientId, img, i)).join("");

  return `
    <section
      id="gallery"
      class="-mx-[46px] mt-32 px-[25px] pb-14 text-center"
      aria-label="갤러리"
    >
      <header class="pb-10">
        <p
          class="${sectionTitleEnClass(themeId)}"
        >
          Gallery
        </p>
        <p
          class="m-0 mt-2.5 ${themeBodyFontClass(themeId)} text-[1rem] tracking-tight"
        >
          갤러리
        </p>
      </header>

      <div class="grid grid-cols-2 gap-2.5">
        ${thumbs}
      </div>

      <button
        type="button"
        id="gallery-more"
        class="mt-10 border-0 bg-transparent p-0 font-pretendard text-[0.9rem] tracking-normal"
      >
        더보기 +
      </button>
    </section>

    <div
      id="gallery-lightbox"
      class="fixed inset-0 z-[100] hidden"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
      aria-label="갤러리 사진 보기"
    >
      <div
        class="absolute inset-0 bg-black/90"
        data-gallery-close
      ></div>
      <div
        class="relative mx-auto flex h-full max-w-[430px] items-center justify-center px-4 py-12"
      >
        <button
          type="button"
          data-gallery-close
          class="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center border-0 bg-transparent p-0 text-[1.75rem] leading-none text-white/80"
          aria-label="닫기"
        >
          ×
        </button>
        <button
          type="button"
          data-gallery-prev
          class="${GALLERY_ARROW_PREV_CLASS}"
          aria-label="이전 사진"
        >
          ‹
        </button>
        <button
          type="button"
          data-gallery-next
          class="${GALLERY_ARROW_NEXT_CLASS}"
          aria-label="다음 사진"
        >
          ›
        </button>
        <img
          id="gallery-lightbox-image"
          class="max-h-[min(85vh,720px)] w-full object-contain"
          alt=""
          decoding="async"
        />
      </div>
    </div>`;
}

export function renderGalleryHtml(
  clientId: string,
  images: readonly GalleryImage[],
  themeId: ThemeId,
): string {
  if (themeId === "theme02") {
    return renderTheme02GalleryHtml(clientId, images);
  }
  return renderTheme01GalleryHtml(clientId, images, themeId);
}

function popupImageUrl(clientId: string, index: number): string {
  return clientImageUrl(clientId, `galleryp${String(index).padStart(2, "0")}.png`);
}

function probeImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const probe = new Image();
    probe.onload = () => resolve(true);
    probe.onerror = () => resolve(false);
    probe.src = url;
  });
}

async function discoverPopupImages(clientId: string): Promise<string[]> {
  const urls: string[] = [];

  for (let i = 1; i <= POPUP_IMAGE_MAX; i++) {
    const url = popupImageUrl(clientId, i);
    if (!(await probeImage(url))) break;
    urls.push(url);
  }

  return urls;
}

function initTheme02Gallery(
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
    prev.hidden = activeIndex === 0;
    next.hidden = activeIndex === resolved.length - 1;
  }

  function showImage(index: number): void {
    if (index < 0 || index >= resolved.length) return;

    activeIndex = index;
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

function initTheme01Gallery(
  root: ParentNode,
  clientId: string,
  images: readonly GalleryImage[],
): void {
  const section = root.querySelector("#gallery");
  const lightbox = root.querySelector<HTMLElement>("#gallery-lightbox");
  const imageEl = root.querySelector<HTMLImageElement>("#gallery-lightbox-image");
  const moreBtn = root.querySelector<HTMLButtonElement>("#gallery-more");
  if (!section || !lightbox || !imageEl || !moreBtn) {
    return;
  }

  const lb = lightbox;
  const img = imageEl;
  const more = moreBtn;
  const resolved = images.map((image) => ({
    src: clientImageUrl(clientId, image.src),
    alt: image.alt,
  }));

  let activeIndex = 0;
  let touchStartX = 0;
  let popupUrls: string[] = [];
  let popupReady = false;

  function allSlides(): { src: string; alt: string }[] {
    const popupSlides = popupUrls.map((src, i) => ({
      src,
      alt: `갤러리 사진 ${resolved.length + i + 1}`,
    }));
    return [...resolved, ...popupSlides];
  }

  function totalCount(): number {
    return resolved.length + (popupReady ? popupUrls.length : 0);
  }

  async function ensurePopupUrls(): Promise<string[]> {
    if (!popupReady) {
      popupUrls = await discoverPopupImages(clientId);
      popupReady = true;
      more.hidden = popupUrls.length === 0;
    }
    return popupUrls;
  }

  function showImage(index: number): void {
    const total = totalCount();
    if (total === 0) return;

    activeIndex = ((index % total) + total) % total;
    const slide = allSlides()[activeIndex];
    img.src = slide.src;
    img.alt = slide.alt;
  }

  function openLightbox(index: number): void {
    showImage(index);
    lb.classList.remove("hidden");
    lb.setAttribute("aria-hidden", "false");
    document.body.classList.add("overflow-hidden");
  }

  function closeLightbox(): void {
    lb.classList.add("hidden");
    lb.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overflow-hidden");
    img.removeAttribute("src");
  }

  void ensurePopupUrls();

  section.querySelectorAll<HTMLButtonElement>("[data-gallery-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.galleryOpen);
      if (Number.isNaN(index)) return;
      openLightbox(index);
    });
  });

  more.addEventListener("click", () => {
    void (async () => {
      const urls = await ensurePopupUrls();
      if (urls.length === 0) return;
      openLightbox(resolved.length);
    })();
  });

  lb.querySelectorAll("[data-gallery-close]").forEach((el) => {
    el.addEventListener("click", closeLightbox);
  });

  lb.querySelector("[data-gallery-prev]")?.addEventListener("click", () => {
    showImage(activeIndex - 1);
  });

  lb.querySelector("[data-gallery-next]")?.addEventListener("click", () => {
    showImage(activeIndex + 1);
  });

  lb.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0]?.clientX ?? 0;
    },
    { passive: true },
  );

  lb.addEventListener(
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

  window.addEventListener("keydown", (e) => {
    if (lb.classList.contains("hidden")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showImage(activeIndex - 1);
    if (e.key === "ArrowRight") showImage(activeIndex + 1);
  });
}

export function initGallery(
  root: ParentNode,
  clientId: string,
  images: readonly GalleryImage[],
  themeId: ThemeId,
): void {
  if (themeId === "theme02") {
    initTheme02Gallery(root, clientId, images);
    return;
  }
  initTheme01Gallery(root, clientId, images);
}
