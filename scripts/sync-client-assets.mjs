import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const publicImagesDir = resolve(root, "public", "images");
const publicThemeAssetsDir = resolve(root, "public", "theme-assets");
const themesDir = resolve(root, "themes");
const clientsDir = resolve(root, "clients");

function listClientIds() {
  return readdirSync(clientsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "_template")
    .map((entry) => entry.name)
    .filter((id) => existsSync(resolve(clientsDir, id, "config.ts")))
    .sort();
}

function clearDir(dir) {
  mkdirSync(dir, { recursive: true });
  if (!existsSync(dir)) return;
  for (const file of readdirSync(dir)) {
    rmSync(resolve(dir, file), { recursive: true, force: true });
  }
}

function copyDirContents(from, to) {
  mkdirSync(to, { recursive: true });
  for (const file of readdirSync(from)) {
    cpSync(resolve(from, file), resolve(to, file));
  }
}

const clientIds = listClientIds();
if (clientIds.length === 0) {
  console.error("No client image folders found in clients/");
  process.exit(1);
}

clearDir(publicImagesDir);

for (const id of clientIds) {
  const from = resolve(clientsDir, id, "images");
  if (!existsSync(from)) {
    console.error(`Client images not found: ${from}`);
    process.exit(1);
  }
  copyDirContents(from, resolve(publicImagesDir, id));
}

clearDir(publicThemeAssetsDir);
for (const themeId of readdirSync(themesDir)) {
  const themeDir = resolve(themesDir, themeId);
  const imagesFrom = resolve(themeDir, "images");
  const iconsFrom = resolve(themeDir, "icons");

  if (existsSync(imagesFrom)) {
    copyDirContents(imagesFrom, resolve(publicThemeAssetsDir, themeId, "images"));
  }
  if (existsSync(iconsFrom)) {
    copyDirContents(iconsFrom, resolve(publicThemeAssetsDir, themeId, "icons"));
  }
}

console.log(
  `Synced clients [${clientIds.join(", ")}] → public/images/{id}/, theme assets → public/theme-assets/`,
);
