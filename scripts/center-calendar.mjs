/**
 * theme01 달력 이미지(calendar.png) 가로 가운데 맞춤.
 * 이미지마다 요일·날짜 칸이 좌우로 치우쳐 있어(제작자·템플릿마다 다름) 화면에서 가운데로 안 보이는 문제 보정.
 *
 * 맨 윗줄(요일 행)에서 첫 글자(일)와 마지막 글자(토)의 중심을 찾아, 두 칸의 가운데가 이미지 가운데에 오도록
 * 반대쪽에 투명 여백을 덧붙인다. clients/ 원본은 그대로 두고 public/images 사본만 고친다.
 */
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

/** 이 값(px) 이하로 치우친 건 보정하지 않음 */
const MIN_SHIFT = 2;
/** 요일 글자 사이 빈 칸이 이보다 넓으면 다른 글자로 봄 */
const GLYPH_GAP = 8;

function isInk(data, i) {
  return data[i + 3] > 40 && data[i] + data[i + 1] + data[i + 2] < 600;
}

/** 요일 행(위에서 처음 잉크가 나오는 가로 띠)의 첫·마지막 글자 중심의 가운데 x */
function headerGridCenter(data, width, height) {
  const rowHasInk = (y) => {
    for (let x = 0; x < width; x++) if (isInk(data, (y * width + x) * 4)) return true;
    return false;
  };
  let top = 0;
  while (top < height && !rowHasInk(top)) top++;
  let bottom = top;
  while (bottom < height && rowHasInk(bottom)) bottom++;
  if (top >= height) return null;

  const columns = [];
  for (let x = 0; x < width; x++) {
    let ink = false;
    for (let y = top; y < bottom && !ink; y++) ink = isInk(data, (y * width + x) * 4);
    columns.push(ink);
  }

  const glyphs = [];
  let start = -1;
  let lastInk = -GLYPH_GAP - 1;
  for (let x = 0; x < width; x++) {
    if (!columns[x]) continue;
    if (x - lastInk > GLYPH_GAP) {
      if (start >= 0) glyphs.push([start, lastInk]);
      start = x;
    }
    lastInk = x;
  }
  if (start >= 0) glyphs.push([start, lastInk]);
  if (glyphs.length < 2) return null;

  const center = ([a, b]) => (a + b) / 2;
  return (center(glyphs[0]) + center(glyphs[glyphs.length - 1])) / 2;
}

/** @returns 보정한 픽셀 수 (양수 = 오른쪽에 여백 추가, 음수 = 왼쪽에 추가, 0 = 그대로) */
export async function centerCalendarImage(path) {
  const input = readFileSync(path);
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const gridCenter = headerGridCenter(data, info.width, info.height);
  if (gridCenter === null) return 0;

  const offset = Math.round(gridCenter - info.width / 2);
  if (Math.abs(offset) <= MIN_SHIFT) return 0;

  const pad = Math.abs(offset) * 2;
  const output = await sharp(input)
    .ensureAlpha()
    .extend({
      left: offset < 0 ? pad : 0,
      right: offset > 0 ? pad : 0,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  writeFileSync(path, output);
  return offset > 0 ? pad : -pad;
}
