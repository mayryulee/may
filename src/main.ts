import "./index.css";
import * as theme01 from "@themes/theme01/layout";
import * as theme02 from "@themes/theme02/layout";
import * as theme03 from "@themes/theme03/layout";
import type { ThemeId } from "@shared/types";
import { CLIENT_BY_SLUG } from "@shared/generated/client-registry";
import {
  DEFAULT_PREVIEW_PATH,
  resolveClientSlugFromPath,
  resolveThemeIdFromPath,
  syncClientPath,
} from "./client-route";
import { applyDocumentMeta } from "./document-meta";

const themes = {
  theme01,
  theme02,
  theme03,
} as const;

const appEl = document.querySelector<HTMLDivElement>("#app");
if (!appEl) throw new Error("#app not found");

const app = appEl;

function mountClient(slug: string, pathname = window.location.pathname): void {
  const config = CLIENT_BY_SLUG[slug];
  if (!config) {
    app.innerHTML = `<p class="p-8 text-center text-sm text-[#888888]">청첩장을 찾을 수 없습니다.</p>`;
    return;
  }

  const themeId = resolveThemeIdFromPath(pathname) ?? (config.theme as ThemeId);
  const theme = themes[themeId];
  if (!theme) {
    throw new Error(`Unknown theme: ${themeId}`);
  }

  applyDocumentMeta(config, slug);
  app.innerHTML = theme.renderPageHtml(config, themeId);
  theme.initPage(app, config, themeId);
}

function bootstrap(): void {
  const slug = syncClientPath();
  mountClient(slug);
}

bootstrap();

window.addEventListener("popstate", () => {
  const pathname = window.location.pathname;
  const slug =
    resolveClientSlugFromPath(pathname) ?? resolveClientSlugFromPath(DEFAULT_PREVIEW_PATH)!;
  mountClient(slug, pathname);
});
