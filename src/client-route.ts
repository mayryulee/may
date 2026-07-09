import { isThemeSlug, themeIdFromSlug, type ThemeId } from "@shared/types";
import { CLIENT_BY_SLUG } from "@shared/generated/client-registry";

/** 접속 시 기본 미리보기 경로 */
export const DEFAULT_PREVIEW_PATH = "/grace";

/** 테마 slug URL(/grace 등) → 미리보기용 client slug */
const THEME_SLUG_TO_CLIENT: Record<string, string> = {
  grace: "sample01",
  tender: "sample02",
  veil: "sample02",
};

export function pathForClient(slug: string): string {
  return `/${slug}`;
}

function pathSegment(pathname: string): string {
  return pathname.replace(/^\/+|\/+$/g, "").split("/")[0] ?? "";
}

export function resolveClientSlugFromPath(pathname: string): string | null {
  const segment = pathSegment(pathname);
  if (!segment) return null;

  if (segment in CLIENT_BY_SLUG) return segment;

  if (isThemeSlug(segment)) {
    const mapped = THEME_SLUG_TO_CLIENT[segment];
    if (mapped && mapped in CLIENT_BY_SLUG) return mapped;
  }

  return null;
}

/** 테마 미리보기 URL이면 해당 themeId, 아니면 null (client config.theme 사용) */
export function resolveThemeIdFromPath(pathname: string): ThemeId | null {
  const segment = pathSegment(pathname);
  if (isThemeSlug(segment)) return themeIdFromSlug(segment);
  return null;
}

/** `/` 또는 알 수 없는 경로면 기본 미리보기 경로(/grace)로 맞춥니다. */
export function syncClientPath(): string {
  const fromPath = resolveClientSlugFromPath(window.location.pathname);

  if (!fromPath) {
    window.history.replaceState(null, "", DEFAULT_PREVIEW_PATH);
    return resolveClientSlugFromPath(DEFAULT_PREVIEW_PATH)!;
  }

  return fromPath;
}
