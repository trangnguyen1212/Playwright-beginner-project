const { test, expect } = require('@playwright/test');




test('@Webst Client App login', async ({ page }) => {
   //js file- Login js, DashboardPage
   const email = "anshika@gmail.com";
   const productName = 'ZARA COAT 3';
   await page.goto("https://rahulshettyacademy.com/client");
   // locator
   const products = page.locator(".card-body")
   await page.locator("#userEmail").fill(email);
   await page.locator("#userPassword").fill("Iamking@000");
   await page.locator("[value='Login']").click();
   // wait until the page fully loaded and make sure elements are vidible - networkidle is one of the options
   await page.waitForLoadState('networkidle');
   // wait for only single element
   await page.locator(".card-body b").first().waitFor();
   const titles = await page.locator(".card-body b").allTextContents();
   console.log(titles); 

   // click btn Add to cart on the product name above ZARA COAT 3
   const count = await products.count();
   for (let i = 0; i < count; ++i) {
      if (await products.nth(i).locator("b").textContent() === productName) {
         //add to cart
         await products.nth(i).locator("text= Add To Cart").click();
         break;
      }
   }

   await page.locator("[routerlink*='cart']").click();
   //await page.pause();
   // wait until page loaded then show the first li element 
   await page.locator("div li").first().waitFor();
   // verify text zara coat 3 is visible 
   const bool = await page.locator("h3:has-text('zara coat 3')").isVisible();
   expect(bool).toBeTruthy();

   await page.locator("text=Checkout").click();
   // select the text "India" containing characters inputed "ind" in the Country dropdown list
   await page.locator("[placeholder*='Country']").pressSequentially("ind");
   
   const dropdown = page.locator(".ta-results");
   await dropdown.waitFor();
   // count number of options in the dropdown
   const optionsCount = await dropdown.locator("button").count();
   for (let i = 0; i < optionsCount; ++i) {
      const text = await dropdown.locator("button").nth(i).textContent();
      // if btn in the i index contains text "India
      if (text === " India") {
         await dropdown.locator("button").nth(i).click();
         break;
      }
   }

   // click Order button
   expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
   await page.locator(".action__submit").click();
   await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
   const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
   console.log(orderId);

   // click button order history
   await page.locator("button[routerlink*='myorders']").click();
   await page.locator("tbody").waitFor();
   const rows = await page.locator("tbody tr");


   for (let i = 0; i < await rows.count(); ++i) {
      // assign the order id in each row to a variable
      const rowOrderId = await rows.nth(i).locator("th").textContent();
      // if the id in the row contains the other order id when user placed the order in step click order button
      if (orderId.includes(rowOrderId)) {
         await rows.nth(i).locator("button").first().click();
         break;
      }
   }
   // verify the order id shouw in the order detail
   const orderIdDetails = await page.locator(".col-text").textContent();
   expect(orderId.includes(orderIdDetails)).toBeTruthy();

});








