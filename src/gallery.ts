const GALLERY_IMAGES = [
  { src: "/images/gallery01.png", alt: "갤러리 사진 1" },
  { src: "/images/gallery02.png", alt: "갤러리 사진 2" },
  { src: "/images/gallery03.png", alt: "갤러리 사진 3" },
  { src: "/images/gallery04.png", alt: "갤러리 사진 4" },
  { src: "/images/gallery05.png", alt: "갤러리 사진 5" },
  { src: "/images/gallery06.png", alt: "갤러리 사진 6" },
] as const;

function renderGalleryThumb(image: (typeof GALLERY_IMAGES)[number], index: number): string {
  return `
    <button
      type="button"
      data-gallery-open="${index}"
      class="block w-full overflow-hidden border-0 bg-transparent p-0"
      aria-label="${image.alt} 크게 보기"
    >
      <img
        class="aspect-[3/4] w-full object-cover object-center"
        src="${image.src}"
        alt="${image.alt}"
        loading="lazy"
        decoding="async"
        draggable="false"
      />
    </button>`;
}

export function renderGalleryHtml(): string {
  const thumbs = GALLERY_IMAGES.map(renderGalleryThumb).join("");

  return `
    <section
      id="gallery"
      class="-mx-[46px] mt-16 px-[25px] pb-14 text-center"
      aria-label="갤러리"
    >
      <header class="pb-10">
        <p
          class="m-0 font-cormorant text-[1.05rem] font-normal uppercase tracking-[0.38em] text-[#111111]"
        >
          Gallery
        </p>
        <p
          class="m-0 mt-2.5 font-noto text-[0.72rem] font-extralight tracking-[0.12em] text-[#666666]"
        >
          갤러리
        </p>
      </header>

      <div class="grid grid-cols-2 gap-2.5">
        ${thumbs}
      </div>

      <p
        class="m-0 mt-10 font-noto text-[0.78rem] font-extralight tracking-[0.06em] text-[#111111]"
      >
        더보기 +
      </p>
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
    </div>`;
}

export function initGallery(root: ParentNode): void {
  const section = root.querySelector("#gallery");
  const lightbox = root.querySelector<HTMLElement>("#gallery-lightbox");
  const imageEl = root.querySelector<HTMLImageElement>("#gallery-lightbox-image");
  if (!section || !lightbox || !imageEl) return;

  const lb = lightbox;
  const img = imageEl;

  let activeIndex = 0;
  let touchStartX = 0;

  function showImage(index: number): void {
    const total = GALLERY_IMAGES.length;
    activeIndex = (index + total) % total;
    const image = GALLERY_IMAGES[activeIndex];
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

  section.querySelectorAll<HTMLButtonElement>("[data-gallery-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.galleryOpen);
      if (Number.isNaN(index)) return;
      openLightbox(index);
    });
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

  lb.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0]?.clientX ?? 0;
  }, { passive: true });

  lb.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0]?.clientX ?? 0;
    const delta = touchEndX - touchStartX;
    if (Math.abs(delta) < 40) return;
    if (delta > 0) showImage(activeIndex - 1);
    else showImage(activeIndex + 1);
  }, { passive: true });

  window.addEventListener("keydown", (e) => {
    if (lb.classList.contains("hidden")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showImage(activeIndex - 1);
    if (e.key === "ArrowRight") showImage(activeIndex + 1);
  });
}
