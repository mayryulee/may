import sharp from "sharp";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const sourcePath = resolve(root, "public/images/coverv01.png");
const outputPath = resolve(root, "public/images/og-kakao.png");

/** 카카오 공유·OG용 세로 썸네일 (원본 3:4 비율 유지, 레터박스 없음) */
const OUTPUT_WIDTH = 800;

const source = sharp(sourcePath);
const meta = await source.metadata();
const sourceW = meta.width ?? 928;
const sourceH = meta.height ?? 1232;
const outputHeight = Math.round((OUTPUT_WIDTH * sourceH) / sourceW);

await source
  .resize(OUTPUT_WIDTH, outputHeight, { fit: "fill" })
  .png()
  .toFile(outputPath);

console.log(`OG portrait image: ${outputPath} (${OUTPUT_WIDTH}x${outputHeight})`);
