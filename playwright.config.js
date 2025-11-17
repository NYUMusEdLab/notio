const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Configuration for Notio
 * Constitution Compliance Implementation - Cross-browser E2E Testing
 *
 * Requirements:
 * - T011: Cross-browser testing (chromium, firefox, webkit)
 * - T012: Audio testing support for Tone.js
 * - E2E tests must complete in <30s each
 * - Audio latency <50ms, notation rendering <200ms
 */

module.exports = defineConfig({
  // Test directory
  testDir: './e2e',

  // Timeout per test (30s requirement from Constitution)
  timeout: 30000,

  // Run tests in parallel by default
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI for more stability
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],

  // Shared settings for all projects
  use: {
    // Base URL for tests
    baseURL: 'http://localhost:3000',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Take screenshot on failure
    screenshot: 'only-on-failure',

    // T012: Audio testing configuration for Tone.js
    launchOptions: {
      args: [
        '--autoplay-policy=no-user-gesture-required',
        '--use-fake-device-for-media-stream',
      ],
      // DON'T mute audio - we need to test audio latency
      ignoreDefaultArgs: ['--mute-audio'],
    },
  },

  // T011: Configure for three browsers (chromium, firefox, webkit)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile Safari (iOS) - Important for educational devices
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 13'] },
    // },
  ],

  // Web server configuration
  webServer: {
    command: 'yarn start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
