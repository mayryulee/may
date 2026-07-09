import type { ThemeId } from "./types";

/** localStorage 키에 쓰는 클라이언트·테마 단위 스코프 */
export function storageScope(clientId: string, themeId: ThemeId): string {
  return `${clientId}:${themeId}`;
}
