import "./index.css";
import sample01Config from "../clients/sample01/config";
import sample02Config from "../clients/sample02/config";
import * as theme01 from "@themes/theme01/layout";
import * as theme02 from "@themes/theme02/layout";
import type { ClientConfig, ThemeId } from "@shared/types";
import { bindThemeToggle } from "./theme-toggle";

const themes = {
  theme01,
  theme02,
} as const;

const previewClients = {
  sample01: sample01Config,
  sample02: sample02Config,
} as const;

type PreviewClientId = keyof typeof previewClients;

const mayClient = window.__MAY_CLIENT__;
const buildClientId = (mayClient?.clientId ?? "sample01") as PreviewClientId;
const themeOverride = mayClient?.themeOverride?.trim();
const initialClientId: PreviewClientId =
  buildClientId in previewClients ? buildClientId : "sample01";

const appEl = document.querySelector<HTMLDivElement>("#app");
if (!appEl) throw new Error("#app not found");

const app = appEl;
let activeClientId = initialClientId;

function mountClient(clientId: PreviewClientId): void {
  const config: ClientConfig = previewClients[clientId];
  const themeId: ThemeId = (themeOverride as ThemeId | undefined) || config.theme;
  const theme = themes[themeId];

  if (!theme) {
    throw new Error(`Unknown theme: ${themeId}`);
  }

  app.innerHTML = theme.renderPageHtml(config, themeId);
  theme.initPage(app, config, themeId);
  activeClientId = clientId;
}

mountClient(initialClientId);

bindThemeToggle(app, () => {
  const next: PreviewClientId =
    activeClientId === "sample01" ? "sample02" : "sample01";
  mountClient(next);
});
