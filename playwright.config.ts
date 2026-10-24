import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config({path: '.env'})

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  reporter: 'html',
  timeout: 180000,
  expect: {
    timeout: 5000
  },
  use: {
    locale: 'pl-PL',
    baseURL: process.env.BASE_URL || 'https://testyautomatyczne.telemedi.com',
    trace: 'retain-on-failure-and-retries',
    headless: true,
    testIdAttribute: 'id'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
