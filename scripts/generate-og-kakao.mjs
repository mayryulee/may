import sharp from "sharp";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PREVIEW_CLIENT_IDS } from "./preview-clients.mjs";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const buildClientId = process.env.CLIENT || "sample01";
const clientIds = [...new Set([...PREVIEW_CLIENT_IDS, buildClientId])];

const OUTPUT_WIDTH = 600;
const OUTPUT_HEIGHT = 800;

for (const clientId of clientIds) {
  const sourcePath = resolve(root, "clients", clientId, "images", "coverv01.png");
  const outputDir = resolve(root, "public", "images", clientId);
  const outputPath = resolve(outputDir, "og-kakao.png");

  if (!existsSync(sourcePath)) {
    console.error(`Cover image not found: ${sourcePath}`);
    process.exit(1);
  }

  mkdirSync(outputDir, { recursive: true });

  await sharp(sourcePath)
    .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, { fit: "cover", position: "centre" })
    .png()
    .toFile(outputPath);

  console.log(`OG portrait image: ${outputPath} (${OUTPUT_WIDTH}x${OUTPUT_HEIGHT})`);
}
