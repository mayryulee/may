import type { GalleryImage, ThemeId } from "./types";
import { clientImageUrl } from "./types";
import { sectionTitleEnClass } from "./section-heading";

const POPUP_IMAGE_MAX = 99;

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

export function renderGalleryHtml(
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
          class="m-0 mt-2.5 font-noto text-[1rem] tracking-tight"
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
          class="absolute top-1/2 left-1 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-[2rem] leading-none text-white/70"
          aria-label="이전 사진"
        >
          ‹
        </button>
        <button
          type="button"
          data-gallery-next
          class="absolute top-1/2 right-1 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-[2rem] leading-none text-white/70"
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
    </div>

    <div
      id="gallery-popup-lightbox"
      class="fixed inset-0 z-[100] hidden"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
      aria-label="갤러리 더보기"
    >
      <div
        class="relative mx-auto flex h-full max-w-[430px] items-center justify-center bg-black/90 px-4 py-12"
      >
        <button
          type="button"
          data-gallery-popup-close
          class="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center border-0 bg-transparent p-0 text-[1.75rem] leading-none text-white/80"
          aria-label="닫기"
        >
          ×
        </button>
        <img
          id="gallery-popup-image"
          class="max-h-[min(85vh,720px)] w-full object-contain"
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
  const lightbox = root.querySelector<HTMLElement>("#gallery-lightbox");
  const imageEl = root.querySelector<HTMLImageElement>("#gallery-lightbox-image");
  const moreBtn = root.querySelector<HTMLButtonElement>("#gallery-more");
  const popupLightbox = root.querySelector<HTMLElement>("#gallery-popup-lightbox");
  const popupImageEl = root.querySelector<HTMLImageElement>("#gallery-popup-image");
  if (!section || !lightbox || !imageEl || !moreBtn || !popupLightbox || !popupImageEl) {
    return;
  }

  const lb = lightbox;
  const img = imageEl;
  const popupLb = popupLightbox;
  const popupImg = popupImageEl;
  const resolved = images.map((image) => ({
    src: clientImageUrl(clientId, image.src),
    alt: image.alt,
  }));

  let activeIndex = 0;
  let touchStartX = 0;
  let popupUrls: string[] | null = null;
  let popupIndex = 0;

  function showImage(index: number): void {
    const total = resolved.length;
    activeIndex = (index + total) % total;
    const image = resolved[activeIndex];
    img.src = image.src;
    img.alt = image.alt;
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

  function closePopup(): void {
    popupLb.classList.add("hidden");
    popupLb.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overflow-hidden");
    popupImg.removeAttribute("src");
    popupIndex = 0;
  }

  function showPopupImage(): void {
    if (!popupUrls || popupIndex >= popupUrls.length) {
      closePopup();
      return;
    }

    popupImg.src = popupUrls[popupIndex];
    popupImg.alt = `갤러리 사진 ${popupIndex + 1}`;
  }

  function openPopup(): void {
    void (async () => {
      if (!popupUrls) {
        popupUrls = await discoverPopupImages(clientId);
      }
      if (popupUrls.length === 0) return;

      popupIndex = 0;
      popupLb.classList.remove("hidden");
      popupLb.setAttribute("aria-hidden", "false");
      document.body.classList.add("overflow-hidden");
      showPopupImage();
    })();
  }

  function advancePopup(): void {
    if (!popupUrls || popupUrls.length === 0) {
      closePopup();
      return;
    }

    if (popupIndex >= popupUrls.length - 1) {
      closePopup();
      return;
    }

    popupIndex += 1;
    showPopupImage();
  }

  popupImg.addEventListener("error", closePopup);

  section.querySelectorAll<HTMLButtonElement>("[data-gallery-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.galleryOpen);
      if (Number.isNaN(index)) return;
      openLightbox(index);
    });
  });

  moreBtn.addEventListener("click", openPopup);

  lb.querySelectorAll("[data-gallery-close]").forEach((el) => {
    el.addEventListener("click", closeLightbox);
  });

  lb.querySelector("[data-gallery-prev]")?.addEventListener("click", () => {
    showImage(activeIndex - 1);
  });

  lb.querySelector("[data-gallery-next]")?.addEventListener("click", () => {
    showImage(activeIndex + 1);
  });

  popupLb.querySelector("[data-gallery-popup-close]")?.addEventListener("click", (e) => {
    e.stopPropagation();
    closePopup();
  });

  popupLb.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest("[data-gallery-popup-close]")) return;
    if (target.id === "gallery-popup-image") return;
    advancePopup();
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
    if (!popupLb.classList.contains("hidden")) {
      if (e.key === "Escape") closePopup();
      return;
    }

    if (lb.classList.contains("hidden")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showImage(activeIndex - 1);
    if (e.key === "ArrowRight") showImage(activeIndex + 1);
  });
}
