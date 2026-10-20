/**
 * 클라이언트 사진을 웹용으로 줄입니다 (긴 변 1600px, JPEG 품질 82, EXIF 회전 반영·메타데이터 제거).
 * 원본은 프로젝트 밖 ~/Desktop/may_originals/<clientId>/ 에 먼저 백업합니다.
 * 파일명·확장자(.png)는 그대로 유지합니다 (코드가 파일명으로 참조).
 *
 * 사용법: npm run resize:images -- <clientId> [파일명 ...]
 *   파일명 생략 시 gallery*, galleryp*, main*, sub* 전부 처리 (cover/calendar 는 제외)
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const MAX_EDGE = 1600;
const QUALITY = 82;

const [clientId, ...files] = process.argv.slice(2);
if (!clientId) {
  console.error("사용법: npm run resize:images -- <clientId> [파일명 ...]");
  process.exit(1);
}

const imagesDir = resolve(root, "clients", clientId, "images");
if (!existsSync(imagesDir)) {
  console.error(`폴더 없음: ${imagesDir}`);
  process.exit(1);
}

const targets =
  files.length > 0
    ? files
    : readdirSync(imagesDir).filter((f) => /^(gallery|galleryp|main|sub)\d*\.(png|jpe?g)$/i.test(f));

const backupDir = resolve(homedir(), "Desktop", "may_originals", clientId);
mkdirSync(backupDir, { recursive: true });

for (const file of targets) {
  const path = resolve(imagesDir, file);
  const before = statSync(path).size;
  const meta = await sharp(path).metadata();
  const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);

  if (longEdge <= MAX_EDGE && before < 600_000) {
    console.log(`${file}: 이미 작음 (${longEdge}px, ${Math.round(before / 1e3)}KB) — 건너뜀`);
    continue;
  }

  const backupPath = resolve(backupDir, file);
  if (!existsSync(backupPath)) copyFileSync(path, backupPath);

  const out = await sharp(readFileSync(path))
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer();
  writeFileSync(path, out);
  console.log(`${file}: ${(before / 1e6).toFixed(1)}MB → ${Math.round(out.length / 1e3)}KB`);
}

console.log(`원본 백업: ${backupDir}`);
