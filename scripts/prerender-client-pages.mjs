import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const distDir = resolve(root, "dist");
const manifestPath = resolve(root, "packages/shared/generated/client-manifest.json");
const redirectsPath = resolve(distDir, "_redirects");

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

  const redirectLines = [];

  for (const client of manifest.clients) {
    const outDir = resolve(distDir, client.slug);
    mkdirSync(outDir, { recursive: true });
    const html = applyMeta(baseHtml, client, baseUrl);
    writeFileSync(resolve(outDir, "index.html"), html, "utf8");
    redirectLines.push(`/${client.slug}    /${client.slug}/index.html   200`);
  }

  redirectLines.push(`/    /grace/    302`);
  redirectLines.push(`/*    /index.html   200`);

  writeFileSync(redirectsPath, `${redirectLines.join("\n")}\n`, "utf8");

  console.log(
    `Prerendered ${manifest.clients.length} client pages → dist/{slug}/index.html`,
  );
}

main();
