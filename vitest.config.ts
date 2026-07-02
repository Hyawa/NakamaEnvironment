import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    reporters: ["verbose"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/games/basketclone/gameplay/**/*.ts"],
      exclude: ["src/games/basketclone/tests/**"],
    },
  },
});