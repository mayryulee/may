import type { GalleryImage } from "../../../packages/shared/types";
import { clientImageUrl, themeIconUrl } from "../../../packages/shared/types";

const THEME_ID = "theme01" as const;

const POPUP_IMAGE_MAX = 99;
const GALLERY_MORE_BATCH_SIZE = 4;

const GALLERY_ARROW_BASE =
  "absolute top-[50%] z-[10] flex h-[40px] w-[40px] -translate-y-[50%] items-center justify-center border-[0px] bg-transparent p-0 text-white/90";
const GALLERY_ARROW_PREV_CLASS = `${GALLERY_ARROW_BASE} left-[4px]`;
const GALLERY_ARROW_NEXT_CLASS = `${GALLERY_ARROW_BASE} right-[4px]`;
const GALLERY_ARROW_PREV_HIDDEN_CLASS =
  "opacity-0 pointer-events-none transition-opacity duration-200";
function galleryArrowIcon(direction: "prev" | "next"): string {
  const path = direction === "next" ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6";
  return /* html */ `<svg
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

function renderGalleryThumb(
  clientId: string,
  image: GalleryImage,
  index: number,
): string {
  const src = clientImageUrl(clientId, image.src);
  return /* html */ `
    <button
      type="button"
      data-gallery-open="${index}"
      class="block w-full overflow-hidden border-[0px] bg-transparent p-0"
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

export function renderGalleryHtml(
  clientId: string,
  images: readonly GalleryImage[],
): string {
  const thumbs = images.map((img, i) => renderGalleryThumb(clientId, img, i)).join("");
  const plusBtnSrc = themeIconUrl(THEME_ID, "btn-plus.svg");

  return /* html */ `
    <section id="gallery" class="pt-[100px] px-[25px] pb-[140px] text-center" aria-label="갤러리">
        <p class="m-0 font-optima text-[30px] uppercase">Gallery</p>
        <p class="m-0 mt-[16px] mb-[47px] text-[16px] tracking-tighter">
          갤러리
        </p>

      <div id="gallery-grid" class="grid grid-cols-2 gap-[18px]">
        ${thumbs}
      </div>

      <button
        type="button"
        id="gallery-more"
        class="mx-auto mt-[30px] flex items-center justify-center border-[0px] bg-transparent p-0"
        aria-label="갤러리 더보기"
      >
        <img
          src="${plusBtnSrc}"
          alt=""
          width="57"
          height="17"
          class="block h-auto w-full"
          decoding="async"
          aria-hidden="true"
        />
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
      <div class="absolute inset-0 bg-black/90" data-gallery-close></div>
      <div class="relative mx-auto flex h-full max-w-[400px] items-center justify-center py-[48px]">
        <button
          type="button"
          data-gallery-close
          class="absolute top-[16px] right-[16px] z-[10] inline-flex h-[40px] w-[40px] items-center justify-center border-[0px] bg-transparent p-0 text-[28px] leading-none text-white/80"
          aria-label="닫기"
        >
          ×
        </button>
        <button
          type="button"
          data-gallery-prev
          class="${GALLERY_ARROW_PREV_CLASS}${GALLERY_ARROW_PREV_HIDDEN_CLASS}"
          aria-label="이전 사진"
        >
          ${galleryArrowIcon("prev")}
        </button>
        <button
          type="button"
          data-gallery-next
          class="${GALLERY_ARROW_NEXT_CLASS}"
          aria-label="다음 사진"
        >
          ${galleryArrowIcon("next")}
        </button>
        <img
          id="gallery-lightbox-image"
          class="relative z-0 max-h-[min(85vh,720px)] w-full object-contain"
          alt=""
          decoding="async"
        />
      </div>
    </div>`;
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

export function initGallery(
  root: ParentNode,
  clientId: string,
  images: readonly GalleryImage[],
): void {
  const section = root.querySelector("#gallery");
  const grid = section?.querySelector<HTMLElement>("#gallery-grid");
  const lightbox = root.querySelector<HTMLElement>("#gallery-lightbox");
  const imageEl = root.querySelector<HTMLImageElement>("#gallery-lightbox-image");
  const moreBtn = root.querySelector<HTMLButtonElement>("#gallery-more");
  if (!section || !grid || !lightbox || !imageEl || !moreBtn) {
    return;
  }

  const galleryGrid = grid;
  const lb = lightbox;
  const img = imageEl;
  const more = moreBtn;
  const prevBtn = lb.querySelector<HTMLButtonElement>("[data-gallery-prev]");
  const nextBtn = lb.querySelector<HTMLButtonElement>("[data-gallery-next]");
  const resolved = images.map((image) => ({
    src: clientImageUrl(clientId, image.src),
    alt: image.alt,
  }));

  let activeIndex = 0;
  let touchStartX = 0;
  let popupUrls: string[] = [];
  let popupReady = false;
  let revealedPopupCount = 0;

  function allSlides(): { src: string; alt: string }[] {
    const revealed = popupUrls.slice(0, revealedPopupCount).map((src, i) => ({
      src,
      alt: `갤러리 사진 ${resolved.length + i + 1}`,
    }));
    return [...resolved, ...revealed];
  }

  function totalCount(): number {
    return resolved.length + revealedPopupCount;
  }

  function updateMoreButton(): void {
    if (!popupReady) return;
    more.hidden = revealedPopupCount >= popupUrls.length;
  }

  async function ensurePopupUrls(): Promise<string[]> {
    if (!popupReady) {
      popupUrls = await discoverPopupImages(clientId);
      popupReady = true;
      updateMoreButton();
    }
    return popupUrls;
  }

  function bindThumbOpen(btn: HTMLButtonElement): void {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.galleryOpen);
      if (Number.isNaN(index)) return;
      openLightbox(index);
    });
  }

  async function appendMoreImages(): Promise<void> {
    await ensurePopupUrls();
    const batch = popupUrls.slice(
      revealedPopupCount,
      revealedPopupCount + GALLERY_MORE_BATCH_SIZE,
    );
    if (batch.length === 0) return;

    batch.forEach((_, i) => {
      const popupIndex = revealedPopupCount + i + 1;
      const index = resolved.length + revealedPopupCount + i;
      const filename = `galleryp${String(popupIndex).padStart(2, "0")}.png`;
      const alt = `갤러리 사진 ${index + 1}`;
      const html = renderGalleryThumb(clientId, { src: filename, alt }, index);
      const template = document.createElement("template");
      template.innerHTML = html.trim();
      const btn = template.content.firstElementChild as HTMLButtonElement | null;
      if (btn) {
        bindThumbOpen(btn);
        galleryGrid.appendChild(btn);
      }
    });

    revealedPopupCount += batch.length;
    updateMoreButton();
    updateArrows();
  }

  function updateArrows(): void {
    if (!prevBtn || !nextBtn) return;
    const total = totalCount();
    const hasMultiple = total > 1;
    const showPrev = hasMultiple && activeIndex > 0;
    prevBtn.classList.toggle("opacity-0", !showPrev);
    prevBtn.classList.toggle("pointer-events-none", !showPrev);
    nextBtn.classList.toggle("opacity-0", !hasMultiple);
    nextBtn.classList.toggle("pointer-events-none", !hasMultiple);
  }

  function showImage(index: number): void {
    const total = totalCount();
    if (total === 0) return;

    activeIndex = ((index % total) + total) % total;
    const slide = allSlides()[activeIndex];
    img.src = slide.src;
    img.alt = slide.alt;
    updateArrows();
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

  section.querySelectorAll<HTMLButtonElement>("[data-gallery-open]").forEach(bindThumbOpen);

  more.addEventListener("click", () => {
    void appendMoreImages();
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
