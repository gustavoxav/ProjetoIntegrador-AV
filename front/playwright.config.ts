import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
    timeout: 30000,
  use: {
    browserName: 'chromium',
    headless: false,
  },
} );