import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      "@shared": resolve(__dirname, "packages/shared"),
      "@themes": resolve(__dirname, "themes"),
    },
  },
  server: {
    allowedHosts: ["blank-crowbar-gave.ngrok-free.dev"],
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
});
