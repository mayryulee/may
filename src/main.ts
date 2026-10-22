import "./index.css";
import * as theme01 from "@themes/theme01/layout";
import * as theme02 from "@themes/theme02/layout";
import * as theme03 from "@themes/theme03/layout";
import type { ThemeId } from "@shared/types";
import { CLIENT_LOADERS } from "@shared/generated/client-loaders";
import {
  DEFAULT_PREVIEW_PATH,
  isClientExpired,
  resolveClientSlugFromPath,
  resolveThemeIdFromPath,
  syncClientPath,
} from "./client-route";
import { applyDocumentMeta } from "./document-meta";
import { initZoomGuard } from "@shared/zoom-guard";
import { initBgm } from "@shared/bgm";

const themes = {
  theme01,
  theme02,
  theme03,
} as const;

const appEl = document.querySelector<HTMLDivElement>("#app");
if (!appEl) throw new Error("#app not found");

const app = appEl;

function renderExpired(): void {
  document.title = "청첩장 열람 기간 종료";
  app.innerHTML = /* html */ `
    <div class="flex min-h-dvh flex-col items-center justify-center px-[30px] text-center font-pretendard">
      <p class="m-0 text-[16px] font-medium tracking-tight text-[#111111]">열람 기간이 종료된 청첩장입니다</p>
      <p class="m-0 mt-[8px] text-[13px] font-extralight tracking-tight text-[#888888]">
        보내주신 축하의 마음에 감사드립니다.
      </p>
    </div>`;
}

/** 접속한 청첩장의 config 만 내려받음 (클라이언트별 청크). 만료됐으면 불러오지 않음 */
async function mountClient(slug: string, pathname = window.location.pathname): Promise<void> {
  if (isClientExpired(slug)) {
    renderExpired();
    return;
  }
  const config = await CLIENT_LOADERS[slug]?.();
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
  initBgm(config);
}

function bootstrap(): void {
  initZoomGuard();
  const slug = syncClientPath();
  void mountClient(slug);
}

bootstrap();

window.addEventListener("popstate", () => {
  const pathname = window.location.pathname;
  const slug =
    resolveClientSlugFromPath(pathname) ?? resolveClientSlugFromPath(DEFAULT_PREVIEW_PATH)!;
  void mountClient(slug, pathname);
});
