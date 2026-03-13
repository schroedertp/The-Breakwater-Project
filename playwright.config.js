const { defineConfig, devices } = require('/opt/node22/lib/node_modules/playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  // Serve the static files via Python's built-in HTTP server
  webServer: {
    command: 'python3 -m http.server 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
