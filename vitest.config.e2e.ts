import path from "node:path";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // só isso de diferença (pegar testes apenas com essa extensão)
    include: ["**/*.e2e-spec.ts"],
    globals: true,
    root: "./",
    setupFiles: ["./test/setup-e2e.ts"], // arquivo que roda antes dos testes
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Mapeia @ para o diretório src
    },
  },
  plugins: [
    swc.vite({
      module: { type: "es6" },
    }),
  ],
});
