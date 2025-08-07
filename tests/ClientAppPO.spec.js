 const {test, expect} = require('@playwright/test');
 const {customtest} = require('../utils/test-base'); //a file to declare constant fixture saying testDataForOrder -> using as data in json file

 const {POManager} = require('../pageobjects/POManager');
 //Json->string->js object
 const dataSet =  JSON.parse(JSON.stringify(require("../utils/placeorderTestdata.json")));

// Test case 1 read data from json file 
const data1 = dataSet[0];
 test(`${data1.testID} - ${data1.testDescription}`, async ({page})=>
 {
   const poManager = new POManager(page);
    //js file- Login js, DashboardPage
     const products = page.locator(".card-body");
     const loginPage = poManager.getLoginPage();
     await loginPage.goTo();
     await loginPage.validLogin(data1.username,data1.password);
     const dashboardPage = poManager.getDashboardPage();
     await dashboardPage.searchProductAddCart(data1.productName);
     await dashboardPage.navigateToCart();

    const cartPage = poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(data1.productName);
    await cartPage.Checkout();

    const ordersReviewPage = poManager.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect("ind","India");
    const orderId = await ordersReviewPage.SubmitAndGetOrderId();
   console.log(orderId);
   await dashboardPage.navigateToOrders();
   const ordersHistoryPage = poManager.getOrdersHistoryPage();
   await ordersHistoryPage.searchOrderAndSelect(orderId);
   expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy(); 
    
 });

 
/*TC 2 using custom test fixture (read data from test-base.js)
testDataForOrder in test-base.js is provided by the fixture at runtime so should reference them inside the test function,
must use a placeholder for the test name, then set the title dynamically inside the test using test.info().title. */

customtest(`placeoder`, async ({ page, testDataForOrder }) => {
  // Now you have access to testDataForOrder inside the test
  test.info().title = `${testDataForOrder.testID} - ${testDataForOrder.Description}`;

  const poManager = new POManager(page);
  const loginPage = poManager.getLoginPage();
  await loginPage.goTo();
  await loginPage.validLogin(testDataForOrder.username, testDataForOrder.password);
  const dashboardPage = poManager.getDashboardPage();
  await dashboardPage.searchProductAddCart(testDataForOrder.productName);
  await dashboardPage.navigateToCart();

  const cartPage = poManager.getCartPage();
  await cartPage.VerifyProductIsDisplayed(testDataForOrder.productName);
  await cartPage.Checkout();
});
  

//test files will trigger parallel
//individual tests in the file will run in sequence

 



 

