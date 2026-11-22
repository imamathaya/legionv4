import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    launchOptions: process.env.LEGION_CHROMIUM_PATH
      ? { executablePath: process.env.LEGION_CHROMIUM_PATH, args: ["--no-sandbox"] }
      : {},
  },
  webServer: [
    {
      command: "pnpm docs:dev",
      url: "http://localhost:3000/docs/components/button",
      reuseExistingServer: true,
      timeout: 180_000,
    },
    {
      command: "pnpm --filter copy-consumer dev",
      url: "http://localhost:3001",
      reuseExistingServer: true,
      timeout: 180_000,
    },
  ],
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
