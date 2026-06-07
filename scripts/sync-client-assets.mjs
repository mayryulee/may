import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const clientId = process.env.CLIENT || "sample";
const clientImagesDir = resolve(root, "clients", clientId, "images");
const publicImagesDir = resolve(root, "public", "images");

if (!existsSync(clientImagesDir)) {
  console.error(`Client images not found: ${clientImagesDir}`);
  process.exit(1);
}

mkdirSync(publicImagesDir, { recursive: true });

for (const file of readdirSync(publicImagesDir)) {
  rmSync(resolve(publicImagesDir, file));
}

for (const file of readdirSync(clientImagesDir)) {
  cpSync(resolve(clientImagesDir, file), resolve(publicImagesDir, file));
}

console.log(`Synced ${clientId} images → public/images/`);
