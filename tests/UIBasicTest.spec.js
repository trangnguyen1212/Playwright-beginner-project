const { test, expect } = require('@playwright/test');



//test.use({ browserName: 'webkit'});
// test - annotation to define test case 
test('@Web Browser Context-Validating Error login', async ({ browser }) => {
   //Create instance of browser : Chrome  => get the name of browser in config.js
      const context = await browser.newContext();
      
      const page = await context.newPage();
      // page.route('**/*.{jpg,png,jpeg}',route=> route.abort());
      //css 
      const userName = page.locator('#username'); //id
      const signIn = page.locator("#signInBtn");
      const cardTitles = page.locator(".card-body a"); //class
      // 
      page.on('request', request => console.log(request.url()));
      page.on('response', response => console.log(response.url(), response.status()));
      // Go to page
      await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
      console.log(await page.title());

      // enter username and pass
      await userName.fill("rahulshetty");
      await page.locator("[type='password']").fill("learning");
      await signIn.click();
      // VP: error message due to invalid credentials
      console.log(await page.locator("[style*='block']").textContent());
      await expect(page.locator("[style*='block']")).toContainText('Incorrect');
      //type - fill
      await userName.fill("");
      await userName.fill("rahulshettyacademy");
      await signIn.click();
      // multiple card body
      // <div class='card-body'>product 1</div>
      // <div class='card-body'>product 2</div>
      console.log(await cardTitles.first().textContent()); // first element -> .ntn(0)
      console.log(await cardTitles.nth(1).textContent()); // second element
      const allTitles = await cardTitles.allTextContents();

      console.log(allTitles);

});


test('@Web UI Controls', async ({ page }) => {
   await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
   const userName = page.locator('#username');
   const signIn = page.locator("#signInBtn");
   const documentLink = page.locator("[href*='documents-request']");
   // select drop down list
   const dropdown = page.locator("select.form-control");
   await dropdown.selectOption("consult");
   // click radio button 
   await page.locator(".radiotextsty").last().click();
   await page.locator("#okayBtn").click();
   // Verify the radio button is checked 
   console.log(await page.locator(".radiotextsty").last().isChecked());
   await expect(page.locator(".radiotextsty").last()).toBeChecked();
   // click other radio button
   await page.locator("#terms").click();
   await expect(page.locator("#terms")).toBeChecked();
   // uncheck the radio button selected
   await page.locator("#terms").uncheck();
   // verify the radio button is unchecked -> return false
   expect(await page.locator("#terms").isChecked()).toBeFalsy();
   // Verify attribute class with value '"blinkingText"
   await expect(documentLink).toHaveAttribute("class", "blinkingText");
});


// Hnading child windows and tab by switching browser context
test('@Child windows hadl', async ({ browser }) => {
   const context = await browser.newContext();
   const page = await context.newPage();
   const userName = page.locator('#username');
   await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
   const documentLink = page.locator("[href*='documents-request']");

   //  Promise.all([ ... ]) : – to avoid a race condition.
   // The result of context.waitForEvent('page') 
   const [newPage] = Promise.all(
      [
         context.waitForEvent('page'),//listen for any new page pending,rejected,fulfilled
         documentLink.click(), // open new page

      ])//new page is opened

   // split a text after @: mentor@rahulshet...
   const text = await newPage.locator(".red").textContent();
   const arrayText = text.split("@");
   const domain = arrayText[1].split(" ")[0]
   console.log(domain);
   // input domain in the username
   await page.locator("#username").type(domain);
   await page.pause();
   console.log(await page.locator("#username").textContent());
});































