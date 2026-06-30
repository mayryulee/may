import "./index.css";
import sample01Config from "../clients/sample01/config";
import sample02Config from "../clients/sample02/config";
import * as theme01 from "@themes/theme01/layout";
import * as theme02 from "@themes/theme02/layout";
import * as theme03 from "@themes/theme03/layout";
import type { ThemeId } from "@shared/types";
import { bindThemeToggle } from "./theme-toggle";

const themes = {
  theme01,
  theme02,
  theme03,
} as const;

const THEME_CYCLE: ThemeId[] = ["theme01", "theme02", "theme03"];

const previewClients = {
  sample01: sample01Config,
  sample02: sample02Config,
} as const;

type PreviewClientId = keyof typeof previewClients;

/** 미리보기: 테마별 고정 클라이언트 (theme01 → sample01, theme02/03 → sample02) */
const THEME_CLIENT: Record<ThemeId, PreviewClientId> = {
  theme01: "sample01",
  theme02: "sample02",
  theme03: "sample02",
};

const mayClient = window.__MAY_CLIENT__;
const buildClientId = (mayClient?.clientId ?? "sample01") as PreviewClientId;
const themeOverride = mayClient?.themeOverride?.trim();
const initialClientId: PreviewClientId =
  buildClientId in previewClients ? buildClientId : "sample01";

const appEl = document.querySelector<HTMLDivElement>("#app");
if (!appEl) throw new Error("#app not found");

const app = appEl;
let activeThemeId: ThemeId;

function resolveInitialTheme(): ThemeId {
  const fromEnv = themeOverride as ThemeId | undefined;
  if (fromEnv && fromEnv in themes) return fromEnv;
  return previewClients[initialClientId].theme;
}

function nextThemeId(current: ThemeId): ThemeId {
  const index = THEME_CYCLE.indexOf(current);
  const next = index === -1 ? 0 : (index + 1) % THEME_CYCLE.length;
  return THEME_CYCLE[next]!;
}

function mountPage(themeId: ThemeId): void {
  const clientId = THEME_CLIENT[themeId];
  const config = previewClients[clientId];
  const theme = themes[themeId];

  if (!theme) {
    throw new Error(`Unknown theme: ${themeId}`);
  }

  app.innerHTML = theme.renderPageHtml(config, themeId);
  theme.initPage(app, config, themeId);
  activeThemeId = themeId;
}

mountPage(resolveInitialTheme());

bindThemeToggle(app, () => {
  mountPage(nextThemeId(activeThemeId));
});
