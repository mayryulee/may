import sharp from "sharp";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const sourcePath = resolve(root, "public/images/coverv01.png");
const outputPath = resolve(root, "public/images/og-kakao.png");

/** 카카오톡 링크 미리보기(2:1)에서 세로 이미지 전체가 보이도록 레터박스 */
const CANVAS_W = 1200;
const CANVAS_H = 600;
const BG = "#ffffff";

const resized = await sharp(sourcePath)
  .resize({
    height: CANVAS_H,
    fit: "inside",
    withoutEnlargement: false,
  })
  .toBuffer({ resolveWithObject: true });

const left = Math.floor((CANVAS_W - resized.info.width) / 2);
const top = Math.floor((CANVAS_H - resized.info.height) / 2);

await sharp({
  create: {
    width: CANVAS_W,
    height: CANVAS_H,
    channels: 3,
    background: BG,
  },
})
  .composite([{ input: resized.data, left, top }])
  .png()
  .toFile(outputPath);

console.log(`OG Kakao image: ${outputPath} (${CANVAS_W}x${CANVAS_H})`);
