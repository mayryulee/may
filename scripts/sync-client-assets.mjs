import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { centerCalendarImage } from "./center-calendar.mjs";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const publicImagesDir = resolve(root, "public", "images");
const publicAudioDir = resolve(root, "public", "audio");
const publicThemeAssetsDir = resolve(root, "public", "theme-assets");
const themesDir = resolve(root, "themes");
const clientsDir = resolve(root, "clients");
/** 공용 배경음악 모음 — 고객 config의 bgm.src 에 여기 파일명을 지정 */
const audioLibraryDir = resolve(root, "assets", "audio");

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

  // 달력 이미지 가로 가운데 보정 (public 사본만)
  const calendarPath = resolve(publicImagesDir, id, "calendar.png");
  if (existsSync(calendarPath)) {
    const padded = await centerCalendarImage(calendarPath);
    if (padded !== 0) {
      console.log(`[${id}] calendar.png 가운데 보정: ${padded > 0 ? "오른쪽" : "왼쪽"}에 ${Math.abs(padded)}px 여백`);
    }
  }
}

clearDir(publicAudioDir);
const audioFiles = existsSync(audioLibraryDir)
  ? readdirSync(audioLibraryDir).filter((f) => !f.startsWith("."))
  : [];
// macOS는 한글 파일명을 NFD로 저장 → 배포 서버(Linux)·config(NFC)와 맞추기 위해 NFC로 복사
const audioNames = audioFiles.map((f) => f.normalize("NFC"));
audioFiles.forEach((file, i) =>
  cpSync(resolve(audioLibraryDir, file), resolve(publicAudioDir, audioNames[i])),
);

for (const id of clientIds) {
  const src = readFileSync(resolve(clientsDir, id, "config.ts"), "utf8")
    .split("\n")
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n");
  const bgmSrc = src.match(/bgm:\s*\{[^}]*?src:\s*"([^"]+)"/)?.[1]?.normalize("NFC");
  if (bgmSrc && !audioNames.includes(bgmSrc)) {
    console.error(
      `[${id}] bgm.src "${bgmSrc}" not found in assets/audio/ (available: ${audioNames.join(", ") || "none"})`,
    );
    process.exit(1);
  }
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
  `Synced clients [${clientIds.join(", ")}] → public/images/{id}/ + assets/audio → public/audio/, theme assets → public/theme-assets/`,
);
