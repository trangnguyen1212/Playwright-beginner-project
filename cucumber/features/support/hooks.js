const { After, Before, AfterStep, Status } = require('@cucumber/cucumber');
const playwright = require('@playwright/test');

/*The reason many Chromium browsers open is because in your Before hook, you are creating a new browser instance for each scenario, but you are not saving the browser instance to this (the Cucumber World).
So, in your After hook, this.browser is always undefined and never closed.
Only the pages are closed, but the browser processes remain open.
*/
Before(async function () {
  // This hook will be executed before all scenarios
  console.log("i am first"); 
  // Store the browser instance on this in the Before hook
  this.browser = await playwright.chromium.launch({ headless: false }); // Save browser to this
  const context = await this.browser.newContext();
  this.page = await context.newPage();
});

AfterStep(async function ({ result }) {
  // This hook will be executed after all steps, and take a screenshot on step failure
  if (result.status === Status.FAILED) {
    const buffer = await this.page.screenshot();
    await this.page.screenshot({ path: 'screenshot1.png' });
    this.attach(buffer.toString('base64'), 'base64:image/png');
    console.log("Screenshot logged")

  }
});
After(async function () {
  // Assuming this.driver is a selenium webdriver
  console.log("i am last");
  if (this.page) {
    await this.page.close();
  }
  if (this.browser) {
    await this.browser.close();
  }

});


