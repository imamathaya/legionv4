import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./packages/ui/test/setup.ts"],
    include: ["packages/ui/test/**/*.test.tsx"],
    restoreMocks: true,
  },
});
