// Config vitest: risolve l'alias "@/..." (tsconfig paths) anche a runtime nei test.
// Necessario da quando lib/llm.ts è importato come valore (non solo tipi) da mapper/contracts.
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
});
