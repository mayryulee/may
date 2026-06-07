import "./index.css";
import clientConfig from "@client/config";
import * as theme01 from "@themes/theme01/layout";
import * as theme02 from "@themes/theme02/layout";
import type { ThemeId } from "@core/types";
import { bindThemeToggle } from "./theme-toggle";

const themes = {
  theme01,
  theme02,
} as const;

const themeOverride = import.meta.env.VITE_THEME_OVERRIDE as ThemeId | "";
const initialThemeId = themeOverride || clientConfig.theme;

if (!themes[initialThemeId]) {
  throw new Error(`Unknown theme: ${initialThemeId}`);
}

const appEl = document.querySelector<HTMLDivElement>("#app");
if (!appEl) throw new Error("#app not found");

const app = appEl;
let activeThemeId = initialThemeId;

function mount(themeId: ThemeId): void {
  const theme = themes[themeId];
  app.innerHTML = theme.renderPageHtml(clientConfig);
  theme.initPage(app, clientConfig);
  activeThemeId = themeId;
}

mount(initialThemeId);

bindThemeToggle(() => {
  const next: ThemeId = activeThemeId === "theme01" ? "theme02" : "theme01";
  mount(next);
});
