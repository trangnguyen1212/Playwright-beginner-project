const { After, Before, AfterStep, Status } = require('@cucumber/cucumber');
const playwright = require('@playwright/test');
import { CustomWorld } from '../support/word';
import { ITestStepHookParameter } from '@cucumber/cucumber';

Before(async function (this: CustomWorld) {
  // This hook will be executed before all scenarios
  console.log("i am first");
  // Store the browser instance on this in the Before hook
  this.browser = await playwright.chromium.launch({ headless: false }); // Save browser to this
  const context = await this.browser.newContext();
  this.page = await context.newPage();
});
AfterStep(async function (this: CustomWorld, { result }: ITestStepHookParameter) {
  // This hook will be executed after all steps, and take a screenshot on step failure
  if (result?.status === Status.FAILED) {
    const buffer = await this.page.screenshot();
    await this.page.screenshot({ path: 'screenshot1.png' });
    this.attach(buffer.toString('base64'), 'base64:image/png');
    console.log("Screenshot logged")

  }
});
After(async function (this: CustomWorld) {
  // Assuming this.driver is a selenium webdriver
  console.log("i am last");
  if (this.page) {
    await this.page.close();
  }
  if (this.browser) {
    await this.browser.close();
  }

});


