import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { defineConfig } from "vite";

/** 카카오·SNS 미리보기: og:image 는 절대 URL 필요 (Netlify 빌드 시 URL 환경변수 사용) */
function ogMetaPlugin(): Plugin {
  return {
    name: "og-meta",
    transformIndexHtml(html) {
      // DEPLOY_URL 은 배포별 미리보기 주소라 OG 이미지 404 원인이 될 수 있음
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
        .replaceAll("__OG_IMAGE_URL__", imageUrl);
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
