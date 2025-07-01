import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  timeout: 30000,
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        headless: false,
        storageState: 'playwright/.auth/gerente.json',
      },
      dependencies: ['setup'],
    },
  ],
});