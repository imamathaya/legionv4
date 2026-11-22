import { chromium, defineConfig, devices } from "@playwright/test";

const productionServers = process.env.LEGION_E2E_PROD === "1";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    launchOptions: {
      executablePath: process.env.LEGION_CHROMIUM_PATH ?? chromium.executablePath(),
      args: ["--no-sandbox"],
    },
  },
  webServer: productionServers
    ? [
        {
          command: "pnpm --filter @legionv4/docs start",
          url: "http://localhost:3000/docs/components/button",
          reuseExistingServer: true,
          timeout: 180_000,
        },
        {
          command: "pnpm --filter copy-consumer start",
          url: "http://localhost:3001",
          reuseExistingServer: true,
          timeout: 180_000,
        },
      ]
    : [
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
