import type { ClientConfig } from "@shared/types";

function siteUrl(): string {
  if (import.meta.env.DEV) {
    const fromDevEnv = import.meta.env.VITE_DEV_SITE_URL?.replace(/\/$/, "");
    if (fromDevEnv) return fromDevEnv;
  }
  const fromEnv = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "");
  return fromEnv || window.location.origin.replace(/\/$/, "");
}

function setMeta(
  attr: "name" | "property",
  key: string,
  value: string,
): void {
  if (!value) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

/** 브라우저 탭·SNS 재방문용 런타임 메타 (크롤러는 prerender HTML 사용) */
export function applyDocumentMeta(config: ClientConfig, slug: string): void {
  const base = siteUrl();
  const pageUrl = `${base}/${slug}`;
  const imageFile = config.meta.ogImage || "cover.png";
  const imageUrl = `${base}/images/${config.id}/${imageFile}`;
  const { meta } = config;

  document.title = meta.title;

  setMeta("name", "description", meta.description);
  setMeta("name", "thumbnail", imageUrl);
  setMeta("property", "og:url", pageUrl);
  setMeta("property", "og:title", meta.ogTitle || meta.title);
  setMeta("property", "og:description", meta.ogDescription || meta.description);
  setMeta("property", "og:image", imageUrl);
  setMeta("property", "og:site_name", meta.ogSiteName);
  setMeta("property", "og:image:secure_url", imageUrl);
  setMeta("property", "og:image:alt", meta.ogImageAlt);
  setMeta("name", "twitter:title", meta.twitterTitle || meta.ogTitle || meta.title);
  setMeta("name", "twitter:description", meta.twitterDescription || meta.ogDescription || meta.description);
  setMeta("name", "twitter:image", imageUrl);
}
