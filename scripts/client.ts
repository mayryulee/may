/**
 * .env 의 CLIENT 값으로 어떤 청첩장 데이터를 쓸지 정합니다.
 * (예: CLIENT=sample01 → 테마1, CLIENT=sample02 → 테마2)
 *
 * - Vite(dev): vite.config 에서 loadEnv() 로 읽은 값을 넘깁니다 → .env 수정 시 자동 재시작
 * - Node 스크립트(sync 등): 인자 없이 호출하면 .env 를 직접 읽습니다
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");

export type ResolvedClient = {
  clientId: string;
  clientDir: string;
  themeOverride: string | undefined;
};

/** Node 스크립트용 — 셸/배포 환경에 이미 있는 값은 덮어쓰지 않음 */
function loadEnvFile(filename = ".env") {
  const path = resolve(root, filename);
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

/**
 * @param clientId Vite loadEnv() 등에서 넘긴 값. 없으면 .env / process.env 를 사용
 */
export function resolveClient(clientId?: string): ResolvedClient {
  if (clientId === undefined) {
    loadEnvFile();
  }

  const id = clientId?.trim() || process.env.CLIENT?.trim() || "sample01";
  const clientDir = resolve(root, "clients", id);
  if (!existsSync(resolve(clientDir, "config.ts"))) {
    throw new Error(`Unknown client: ${id}`);
  }

  const themeOverride = process.env.THEME?.trim();
  return { clientId: id, clientDir, themeOverride };
}
