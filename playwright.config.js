// @ts-check
import { defineConfig, devices } from '@playwright/test'; 
import dotenv from 'dotenv'; // npm install dotenv  

/**
 * Use the package'dotenv' to read environment variables from file .env: (Refer: https://github.com/motdotla/dotenv)
 */
// Example: 
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */

dotenv.config();

const timeInMin = 40 * 1000;
const config =  defineConfig({
    testDir: './tests',
    //https://playwright.dev/docs/test-timeouts
    // timeout applied for every steps 
    //timeout: 40 * 1000,
    timeout: (process.env.TEST_TIMEOUT, 10) * timeInMin,
    // timeout for asert validation
    expect: {

    },
     
    use: {
      // because browserName is string so need to define specific type for it 
      browserName: /** @type {'chromium' | 'firefox' | 'webkit' | undefined} */ (process.env.BROWSER?.toLowerCase()),
      //browserName: 'chromium', 
      headless: false,
     

      /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
      trace: 'on-first-retry',
        screenshot: { 
        mode: "only-on-failure",
        fullPage: true,
      },
      video: "retain-on-failure",

    }, 
    outputDir: "./test-results/failure", 
    preserveOutput: "failures-only",
    reportSlowTests: null,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
   reporter: [
    ["dot"],
    ["allure-playwright", {
      detail: false,
      suiteTitle: false,
      environmentInfo: {
        OS: process.platform.toUpperCase(),
        BROWSER: process.env.BROWSER ? process.env.BROWSER.toUpperCase() : "CHROMIUM",
        BASE_URL: process.env.BASE_URL,
      },
    }],
    ['html', { open: 'never', outputFolder: "./test-results/report" }]
    
  ],
    
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,

    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    
 

  /* Configure projects for major browsers */
  
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // }, 

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

module.exports = config;