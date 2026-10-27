import { defineConfig, devices } from '@playwright/test';

/* Desktop browsers every suite runs against. */
const browsers = [
  { name: 'chromium', device: devices['Desktop Chrome'] },
  { name: 'firefox', device: devices['Desktop Firefox'] },
  { name: 'webkit', device: devices['Desktop Safari'] },
];

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI; keep local load on the shared demo shop moderate. */
  workers: process.env.CI ? 1 : 4,
  /* The shop is a shared remote demo instance, so allow for slower responses. */
  timeout: 60_000,
  expect: { timeout: 10_000 },
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['list'], ['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Czech storefront of the system under test; override with BASE_URL. Keep the trailing slash. */
    baseURL: process.env.BASE_URL ?? 'https://prestashop.tesena.com/cs/',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    /* Registers a brand-new customer (e2e registration test) and stores its credentials
       for the dependent login/logout and cart tests. Runs once per test run. */
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    /* Per browser: smoke tests run standalone, e2e tests wait for the registered customer. */
    ...browsers.flatMap(({ name, device }) => [
      {
        name: `${name}-smoke`,
        testDir: './tests/smoke',
        use: { ...device },
      },
      {
        name: `${name}-e2e`,
        testDir: './tests/e2e',
        use: { ...device },
        dependencies: ['setup'],
      },
    ]),
  ],
});
