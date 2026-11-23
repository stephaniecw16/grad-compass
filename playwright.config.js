import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  workers: 2,
  timeout: 45000,
  expect: { timeout: 10000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:5198',
    actionTimeout: 10000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'python3 serve.py --port 5198',
    url: 'http://127.0.0.1:5198/',
    reuseExistingServer: false,
    stdout: 'ignore',
    stderr: 'ignore',
    env: {
      SUPABASE_URL: 'https://fictional.supabase.co',
      SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test_fixture',
    },
  },
});
