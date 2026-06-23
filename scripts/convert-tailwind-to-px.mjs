/**
 * Tailwind rem-scale → px (class="..." 및 class 상수만 변환)
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

const SPACING = {
  0: 0, 0.5: 2, 1: 4, 1.5: 6, 2: 8, 2.5: 10, 3: 12, 3.5: 14, 4: 16, 5: 20,
  6: 24, 7: 28, 8: 32, 9: 36, 10: 40, 11: 44, 12: 48, 14: 56, 16: 64, 20: 80,
  24: 96, 28: 112, 32: 128, 36: 144, 40: 160, 44: 176, 48: 192, 52: 208, 56: 224,
  60: 240, 64: 256, 72: 288, 80: 320, 96: 384,
};

const SPACING_PREFIXES = [
  "inset", "inset-x", "inset-y", "top", "right", "bottom", "left",
  "m", "mx", "my", "mt", "mb", "ml", "mr", "p", "px", "py", "pt", "pb", "pl", "pr",
  "gap", "gap-x", "gap-y", "space-x", "space-y",
  "w", "min-w", "max-w", "h", "min-h", "max-h", "size",
];

const TEXT_PX = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, "2xl": 24, "3xl": 30, "4xl": 36 };
const ROUNDED_PX = { sm: 2, md: 6, lg: 8, xl: 12, "2xl": 16, "3xl": 24 };

const TRANSLATE_Y = { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48 };

function pxValue(scale) {
  return scale in SPACING ? SPACING[scale] : null;
}

function convertToken(token) {
  if (!token || token.includes("${")) return token;

  let t = token.replace(/(-?\d*\.?\d+)rem/g, (_, n) => `${Math.round(Number(n) * 16)}px`);

  const neg = t.startsWith("-");
  const body = neg ? t.slice(1) : t;

  const frac = body.match(/^(top|right|bottom|left|inset-x|inset-y|inset)-(\d+)\/(\d+)$/);
  if (frac) {
    const pct = (Number(frac[2]) / Number(frac[3])) * 100;
    const val = Number.isInteger(pct) ? `${pct}%` : `${pct.toFixed(4).replace(/\.?0+$/, "")}%`;
    return `${neg ? "-" : ""}${frac[1]}-[${val}]`;
  }

  for (const prefix of SPACING_PREFIXES) {
    const m = body.match(new RegExp(`^${prefix}-(\\d+(?:\\.\\d+)?)$`));
    if (!m) continue;
    const px = pxValue(m[1]);
    if (px === null) continue;
    return px === 0 ? `${neg ? "-" : ""}${prefix}-0` : `${neg ? "-" : ""}${prefix}-[${px}px]`;
  }

  const text = body.match(/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl)$/);
  if (text) return `text-[${TEXT_PX[text[1]]}px]`;

  if (body === "rounded") return "rounded-[4px]";
  if (body === "rounded-full") return "rounded-[9999px]";
  const rounded = body.match(/^rounded-(sm|md|lg|xl|2xl|3xl)$/);
  if (rounded) return `rounded-[${ROUNDED_PX[rounded[1]]}px]`;

  const ty = body.match(/^translate-y-(\d+(?:\.\d+)?)$/);
  if (ty) {
    const px = pxValue(ty[1]);
    if (px !== null) return `translate-y-[${px}px]`;
  }

  if (body === "border") return "border-[1px]";
  const border = body.match(/^border-(\d+)$/);
  if (border) return `border-[${border[1]}px]`;

  return token;
}

function convertClassString(str) {
  return str
    .split(/\s+/)
    .filter(Boolean)
    .map(convertToken)
    .join(" ");
}

function processInterpolated(classes) {
  return classes
    .split(/(\$\{[^}]+\})/g)
    .map((part) => (part.startsWith("${") ? part : convertClassString(part)))
    .join("");
}

function convertClassAttrValue(value) {
  return value.includes("${") ? processInterpolated(value) : convertClassString(value);
}

function processContent(content) {
  let out = content;

  out = out.replace(/class="([^"]*)"/g, (_, cls) => `class="${convertClassAttrValue(cls)}"`);

  out = out.replace(/className\s*=\s*`([^`]*)`/g, (_, cls) => {
    return `className = \`${cls.includes("${") ? processInterpolated(cls) : convertClassString(cls)}\``;
  });

  // const FOO = "class string" (한 줄, tailwind 패턴)
  out = out.replace(
    /^(\s*const\s+\w+\s*=\s*)"([^"]+)";?\s*$/gm,
    (match, prefix, cls) => {
      if (!/\b(mt-|mb-|px-|py-|gap-|rounded|text-|h-|w-|top-|leading-|tracking-|duration-|translate-y-)/.test(cls)) {
        return match;
      }
      return `${prefix}"${convertClassString(cls)}";`;
    },
  );

  // const FOO = `...${VAR}...` (gallery arrows 등)
  out = out.replace(
    /^(\s*const\s+\w+\s*=\s*)`([^`]+)`;?\s*$/gm,
    (match, prefix, cls) => {
      if (!/\b(left-|right-|top-|h-|w-|mt-|px-)/.test(cls)) return match;
      return `${prefix}\`${cls.includes("${") ? processInterpolated(cls) : convertClassString(cls)}\`;`;
    },
  );

  // 삼항/문자열 리터럴 내 짧은 class 문자열: "mt-6 m-0"
  out = out.replace(
    /"([^"]*\b(?:mt|mb|ml|mr|mx|my|pt|pb|pl|pr|px|py|gap|rounded|border|py|pt)-[^"]*)"/g,
    (match, cls) => {
      if (cls.includes("${") || cls.includes("http") || cls.length > 200) return match;
      const converted = convertClassString(cls);
      return converted === cls ? match : `"${converted}"`;
    },
  );

  return out;
}

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (["node_modules", "dist", ".git"].includes(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, files);
    else if ([".ts", ".html"].includes(extname(name))) files.push(path);
  }
  return files;
}

const files = [
  ...walk(join(ROOT, "themes")),
  ...walk(join(ROOT, "packages/shared")),
  ...walk(join(ROOT, "src")),
  join(ROOT, "index.html"),
].filter((f) => statSync(f).isFile());

let changed = 0;
for (const file of files) {
  const before = readFileSync(file, "utf8");
  const after = processContent(before);
  if (after !== before) {
    writeFileSync(file, after);
    changed++;
    console.log("updated:", file.replace(ROOT, ""));
  }
}

console.log(`Done. ${changed} file(s).`);
