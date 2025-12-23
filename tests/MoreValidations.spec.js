   const {test,expect} = require('@playwright/test')
/* Add tag to run all cases in parallel -> log show: Running 3 workers
test.describe.configure({mode:'parallel'});
*/ 
/* Add tag all the tests sequentially following the order like Test 1 -> run test 2 -> test 3
helpful if test case are dependent on each other. Ex: Test 1 create data for test 2 to use
test.describe.configure({mode:'serial'});
*/

test("@Web Popup validations",async({page})=>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    // await page.goto("http://google.com");
// Navigate back and forward page
    // await page.goBack();
    // await page.goForward();
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();

    await expect(page.locator("#displayed-text")).toBeHidden();
   // await page.pause();
   // click OK in the alert dialog - in case of closing dialog -> dialog.dismiss()
    page.on('dialog',dialog => dialog.accept());
    // click confirm button in UI
    await page.locator("#confirmbtn").click();
    await page.locator("#mousehover").hover();
    // The frame opens
    const framesPage = page.frameLocator("#courses-iframe");
    // click the link in the frame
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
     const textCheck =await framesPage.locator(".text h2").textContent();
    console.log(textCheck.split(" ")[1]);


})

test("Screenshot & Visual comparision",async({page})=>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator('#displayed-text').screenshot({path:'partialScreenshot.png'});
    await page.locator("#hide-textbox").click();
    await page.screenshot({path: 'screenshot.png'});
    await expect(page.locator("#displayed-text")).toBeHidden();
});
//screenshot -store -> screenshot -> 
test('visual',async({page})=>
{
    //make payment -when you 0 balance
      await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    expect(await page.screenshot()).toMatchSnapshot('landing.png');

})





