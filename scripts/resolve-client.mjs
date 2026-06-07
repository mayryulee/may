import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");

export function resolveClient(clientId = process.env.CLIENT || "sample") {
  const clientDir = resolve(root, "clients", clientId);
  if (!existsSync(resolve(clientDir, "config.ts"))) {
    throw new Error(`Unknown client: ${clientId}`);
  }

  const themeOverride = process.env.THEME?.trim();
  return { clientId, clientDir, themeOverride };
}
