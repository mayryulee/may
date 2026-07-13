import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const distDir = resolve(root, "dist");
const manifestPath = resolve(root, "packages/shared/generated/client-manifest.json");
const redirectsPath = resolve(distDir, "_redirects");

/** 테마 미리보기 slug → 클라이언트 id (src/client-route.ts와 동기화 유지) */
const PREVIEW_SLUG_TO_CLIENT_ID = {
  grace: "sample01",
  tender: "sample02",
  veil: "sample02",
};

function siteUrl() {
  return (
    process.env.SITE_URL ||
    process.env.VITE_SITE_URL ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.URL ||
    "https://mayletter.site"
  ).replace(/\/$/, "");
}

function applyMeta(html, client, baseUrl) {
  const imageUrl = `${baseUrl}/images/${client.id}/${client.meta.ogImage}`;
  const pageUrl = `${baseUrl}/${client.slug}`;

  return html
    .replaceAll("__META_TITLE__", client.meta.title)
    .replaceAll("__META_DESCRIPTION__", client.meta.description)
    .replaceAll("__META_OG_SITE_NAME__", client.meta.ogSiteName)
    .replaceAll("__META_OG_TITLE__", client.meta.ogTitle)
    .replaceAll("__META_OG_DESCRIPTION__", client.meta.ogDescription)
    .replaceAll("__META_OG_IMAGE_ALT__", client.meta.ogImageAlt)
    .replaceAll("__META_TWITTER_TITLE__", client.meta.twitterTitle)
    .replaceAll("__META_TWITTER_DESCRIPTION__", client.meta.twitterDescription)
    .replaceAll("__OG_SITE_URL__", pageUrl)
    .replaceAll("__OG_IMAGE_URL__", imageUrl);
}

function main() {
  const indexPath = resolve(distDir, "index.html");
  if (!existsSync(indexPath)) {
    throw new Error("dist/index.html not found — run vite build first");
  }
  if (!existsSync(manifestPath)) {
    throw new Error("client-manifest.json not found — run generate-client-registry first");
  }

  const baseHtml = readFileSync(indexPath, "utf8");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const baseUrl = siteUrl();

  const clientById = new Map(manifest.clients.map((c) => [c.id, c]));
  const redirectLines = [];

  const writePage = (slug, client) => {
    const outDir = resolve(distDir, slug);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(resolve(outDir, "index.html"), applyMeta(baseHtml, client, baseUrl), "utf8");
    redirectLines.push(`/${slug}    /${slug}/index.html   200`);
  };

  for (const client of manifest.clients) {
    writePage(client.slug, client);
  }

  // 미리보기 slug(grace/tender/veil)도 매핑된 클라이언트 메타로 프리렌더
  for (const [slug, clientId] of Object.entries(PREVIEW_SLUG_TO_CLIENT_ID)) {
    const client = clientById.get(clientId);
    if (client) writePage(slug, client);
  }

  // 루트 index.html에도 기본 클라이언트 메타를 심어 플레이스홀더 노출 방지
  // (루트 공유 및 SPA 폴백(/* → /index.html) 모두 올바른 OG 메타를 갖게 됨)
  const defaultClient =
    manifest.clients.find((c) => c.slug === manifest.defaultSlug) || manifest.clients[0];
  writeFileSync(indexPath, applyMeta(baseHtml, defaultClient, baseUrl), "utf8");

  redirectLines.push(`/*    /index.html   200`);

  writeFileSync(redirectsPath, `${redirectLines.join("\n")}\n`, "utf8");

  console.log(
    `Prerendered ${manifest.clients.length} client pages + ${Object.keys(PREVIEW_SLUG_TO_CLIENT_ID).length} preview slugs, root meta = ${defaultClient.slug}`,
  );
}

main();
