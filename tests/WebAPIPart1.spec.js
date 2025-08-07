const {test, expect, request} = require('@playwright/test');
const {APiUtils} = require('../utils/APiUtils');
// loginPayLoad array contains user and pass
const loginPayLoad = {userEmail:"trangntt121293@gmail.com",userPassword:"Iamking@000"}; // if incorrect, create a account at https://rahulshettyacademy.com/client/auth/register
// oder array contains country and productOrderedId
const orderPayLoad = {orders:[{country:"Vietnam",productOrderedId:"67a8dde5c0d3e6622a297cc8"}]};

// Interact with the Web by using API not using json file (REST API using json file as POSTMAN)
let response;
// Precondtion: create order 
test.beforeAll( async()=>
{
   // initialize the API context 
   const apiContext = await request.newContext();
   // initialize the API util class containing common methods and call 2 parameters apiContext,loginPayLoad (as contrustor)
   const apiUtils = new APiUtils(apiContext,loginPayLoad);
   // inside each method in the API util, we use the apiContext and loginPayload to send reeponse and get the token
   response =  await apiUtils.createOrder(orderPayLoad);

})


// Verify order history, summary steps: 
/*
 1. need to authentication, You log in via API to get a token (response.token).

 2. Then inject that token into the browser’s localStorage.

 3. So when the app loads, it thinks you're already logged in, skipping the login UI.
*/
// insert the argument page to the test function
test('@API Place the order', async ({page})=>
{ 
    // a Playwright function that injects JavaScript into the page before any scripts are run  
    // Ass running code right before window.onload or document.ready — ideal for things like authentication tokens.
    page.addInitScript(value => {
        // Open the local storage by "Window" then stores a value (value) under the key 'token' in the browser's localStorage. 
        window.localStorage.setItem('token',value);
    }, 
    // This is the value passed from Node.js/Playwright side (your test) into the browser. It becomes value in the above arrow function.
    response.token ); 
    // Set localStorage directly before navigation
    await page.goto('about:blank');
    // Go to web page check the order placed
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const rows = await page.locator("tbody tr"); 

    for(let i =0; i<await rows.count(); ++i)
    {
        const rowOrderId =await rows.nth(i).locator("th").textContent();
        if (response.orderId.includes(rowOrderId))
        {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }
    //Verify if order created is shown in history page 
    const orderIdDetails =await page.locator(".col-text").textContent();
    //await page.pause();
    expect(response.orderId.includes(orderIdDetails)).toBeTruthy();

});

