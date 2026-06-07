import sharp from "sharp";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const clientId = process.env.CLIENT || "sample";
const sourcePath = resolve(root, "clients", clientId, "images", "coverv01.png");
const outputPath = resolve(root, "public", "images", "og-kakao.png");

/** 카카오 커스텀 템플릿 3:4 세로 영역(600×800)에 맞춘 OG 이미지 */
const OUTPUT_WIDTH = 600;
const OUTPUT_HEIGHT = 800;

if (!existsSync(sourcePath)) {
  console.error(`Cover image not found: ${sourcePath}`);
  process.exit(1);
}

await sharp(sourcePath)
  .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, { fit: "cover", position: "centre" })
  .png()
  .toFile(outputPath);

console.log(`OG portrait image: ${outputPath} (${OUTPUT_WIDTH}x${OUTPUT_HEIGHT})`);
