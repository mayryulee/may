import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { resolveClient } from "./scripts/resolve-client.mjs";

const { clientId, clientDir, themeOverride } = resolveClient();

function readClientMeta(configPath: string) {
  const src = readFileSync(configPath, "utf8");
  const pick = (field: string) => {
    const match = src.match(new RegExp(`${field}:\\s*"([^"]*)"`));
    return match?.[1] ?? "";
  };

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

const clientMeta = readClientMeta(resolve(clientDir, "config.ts"));

/** 카카오·SNS 미리보기: og:image 는 절대 URL 필요 (Netlify 빌드 시 URL 환경변수 사용) */
function ogMetaPlugin(): Plugin {
  return {
    name: "og-meta",
    transformIndexHtml(html) {
      const siteUrl = (
        process.env.SITE_URL ||
        process.env.VITE_SITE_URL ||
        process.env.DEPLOY_PRIME_URL ||
        process.env.URL ||
        "http://localhost:5173"
      ).replace(/\/$/, "");
      const imageUrl = `${siteUrl}/images/og-kakao.png?v=3`;

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

export default defineConfig({
  plugins: [tailwindcss(), ogMetaPlugin()],
  define: {
    "import.meta.env.VITE_THEME_OVERRIDE": JSON.stringify(themeOverride ?? ""),
    "import.meta.env.VITE_CLIENT_ID": JSON.stringify(clientId),
  },
  resolve: {
    alias: {
      "@client": clientDir,
      "@core": resolve(__dirname, "packages/core"),
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
});
