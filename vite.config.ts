import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { defineConfig } from "vite";

/** 카카오·SNS 미리보기: og:image 는 절대 URL 필요 (Netlify 빌드 시 URL 환경변수 사용) */
function ogMetaPlugin(): Plugin {
  return {
    name: "og-meta",
    transformIndexHtml(html) {
      const siteUrl = (
        process.env.URL ||
        process.env.DEPLOY_URL ||
        process.env.VITE_SITE_URL ||
        "http://localhost:5173"
      ).replace(/\/$/, "");
      // const imageUrlH = `${siteUrl}/images/coverh01.jpg`;
      const imageUrlV = `${siteUrl}/images/coverv01.jpg`;
      return html
        .replaceAll("__OG_SITE_URL__", siteUrl)
        // .replaceAll("__OG_IMAGE_URL_H__", imageUrlH);
        .replaceAll("__OG_IMAGE_URL_V__", imageUrlV);
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), ogMetaPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        test: resolve(__dirname, "test.html"),
      },
    },
  },
});
