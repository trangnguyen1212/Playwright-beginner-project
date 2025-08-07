const { test, expect, request } = require('@playwright/test');
const { APiUtils } = require('../utils/APiUtils');
const loginPayLoad = { userEmail: "trangntt121293@gmail.com", userPassword: "Iamking@000" };
const orderPayLoad = { orders: [{ country: "India", productOrderedId: "67a8dde5c0d3e6622a297cc8" }] };
const fakePayLoadOrders = { data: [], message: "No Orders" };

let response;
test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APiUtils(apiContext, loginPayLoad);
  response = await apiUtils.createOrder(orderPayLoad);

})


//create order is success
test('@SP Place the order', async ({ page }) => {
  page.addInitScript(value => {

    window.localStorage.setItem('token', value);
  }, response.token);
  await page.goto('about:blank');
  await page.goto("https://rahulshettyacademy.com/client");

/* This code below intercepts the order history API call and returns a fake response, 
allowing you to test how your app behaves when there are no orders. */

// page.route(url, handler)
// Intercepts all network requests matching the given URL pattern. In this case, it catches all requests to the order history API endpoint.
  await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
    // async route: This function is called every time a matching request is made.
    async route => {
      // This fetches the original response from the server (but don’t use its body, just its metadata like status and headers).
      const response = await page.request.fetch(route.request());
      // Prepares a fake response body (here, an empty order list with a message).
      let body = JSON.stringify(fakePayLoadOrders);
      /* Sends a custom response to the browser: 
      Uses the original response’s status and headers.
      Replaces the body with your fake data "let body"*/ 
      route.fulfill(
        {
          response,
          body, 

        });
      //intercepting response -APi response-> { playwright fakeresponse}->browser->render data on front end
    });

  await page.locator("button[routerlink*='myorders']").click();
  await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*")

  console.log(await page.locator(".mt-4").textContent());
 

});

