import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { defineConfig, loadEnv } from "vite";
import { resolveClient } from "./scripts/client";

function injectClientPlugin(
  clientId: string,
  themeOverride: string | undefined,
): Plugin {
  const payload = JSON.stringify({ clientId, themeOverride: themeOverride ?? "" });

  return {
    name: "inject-client",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return html.replace(
          "<head>",
          `<head>\n    <script>window.__MAY_CLIENT__=${payload}</script>`,
        );
      },
    },
  };
}

function readClientMeta(configPath: string) {
  const src = readFileSync(configPath, "utf8");

  const metaBlock = src.match(/meta:\s*\{([\s\S]*?)\n\s*\},/)?.[1] ?? "";

  const pickInMeta = (field: string) => {
    const match = metaBlock.match(new RegExp(`${field}:\\s*"([^"]*)"`));
    return match?.[1] ?? "";
  };

  return {
    title: pickInMeta("title"),
    description: pickInMeta("description"),
    ogSiteName: pickInMeta("ogSiteName"),
    ogTitle: pickInMeta("ogTitle"),
    ogDescription: pickInMeta("ogDescription"),
    ogImageAlt: pickInMeta("ogImageAlt"),
    twitterTitle: pickInMeta("twitterTitle"),
    twitterDescription: pickInMeta("twitterDescription"),
  };
}

function resolveSiteUrl(env: Record<string, string>): string {
  return (
    env.SITE_URL ||
    env.VITE_SITE_URL ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.URL ||
    "http://localhost:5173"
  ).replace(/\/$/, "");
}

type ClientMeta = ReturnType<typeof readClientMeta>;

/** 카카오·SNS 미리보기: og:image 는 절대 URL 필요 (.env 또는 Netlify URL 환경변수) */
function ogMetaPlugin(
  siteUrl: string,
  clientId: string,
  clientMeta: ClientMeta,
): Plugin {
  return {
    name: "og-meta",
    transformIndexHtml(html) {
      const imageUrl = `${siteUrl}/images/${clientId}/og-kakao.png?v=3`;

      return html
        .replaceAll("__OG_SITE_URL__", siteUrl)
        .replaceAll("__OG_IMAGE_URL__", imageUrl)
        .replaceAll("__META_TITLE__", clientMeta.title)
        .replaceAll("__META_DESCRIPTION__", clientMeta.description)
        .replaceAll("__META_OG_SITE_NAME__", clientMeta.ogSiteName)
        .replaceAll("__META_OG_TITLE__", clientMeta.ogTitle)
        .replaceAll("__META_OG_DESCRIPTION__", clientMeta.ogDescription)
        .replaceAll("__META_OG_IMAGE_ALT__", clientMeta.ogImageAlt)
        .replaceAll("__META_TWITTER_TITLE__", clientMeta.twitterTitle)
        .replaceAll("__META_TWITTER_DESCRIPTION__", clientMeta.twitterDescription);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const { clientId, clientDir } = resolveClient(env.CLIENT);
  const themeOverride = env.THEME?.trim();
  const clientMeta = readClientMeta(resolve(clientDir, "config.ts"));
  const siteUrl = resolveSiteUrl(env);

  return {
    plugins: [
      injectClientPlugin(clientId, themeOverride),
      tailwindcss(),
      ogMetaPlugin(siteUrl, clientId, clientMeta),
    ],
    define: {
      "import.meta.env.VITE_THEME_OVERRIDE": JSON.stringify(themeOverride ?? ""),
    },
    resolve: {
      alias: {
        "@client": clientDir,
        "@shared": resolve(__dirname, "packages/shared"),
        "@themes": resolve(__dirname, "themes"),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          test: resolve(__dirname, "test.html"),
        },
      },
    },
  };
});
