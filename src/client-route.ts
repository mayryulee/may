import { isThemeSlug } from "@shared/types";
import { CLIENT_BY_SLUG, DEFAULT_CLIENT_SLUG } from "@shared/generated/client-registry";

/** 예전 테마 slug URL(/grace 등) → 미리보기용 client slug */
const LEGACY_THEME_SLUG_TO_CLIENT: Record<string, string> = {
  grace: "sample01",
  tender: "sample02",
  veil: "sample02",
};

export function pathForClient(slug: string): string {
  return `/${slug}`;
}

export function resolveClientSlugFromPath(pathname: string): string | null {
  const segment = pathname.replace(/^\/+|\/+$/g, "").split("/")[0] ?? "";
  if (!segment) return null;

  if (segment in CLIENT_BY_SLUG) return segment;

  if (isThemeSlug(segment)) {
    const mapped = LEGACY_THEME_SLUG_TO_CLIENT[segment];
    if (mapped && mapped in CLIENT_BY_SLUG) return mapped;
  }

  return null;
}

/** `/` 또는 알 수 없는 경로면 기본 client slug로 맞춥니다. */
export function syncClientPath(defaultSlug = DEFAULT_CLIENT_SLUG): string {
  const fromPath = resolveClientSlugFromPath(window.location.pathname);
  const slug = fromPath ?? defaultSlug;

  if (!fromPath) {
    const target = pathForClient(slug);
    window.history.replaceState(null, "", target);
  }

  return slug;
}
