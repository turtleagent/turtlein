import { defineConfig } from "@playwright/test";

const BASE_URL =
  process.env.PLAYWRIGHT_BASE_URL ?? "https://turtlein.vercel.app";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: 1,
  use: {
    baseURL: BASE_URL,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
