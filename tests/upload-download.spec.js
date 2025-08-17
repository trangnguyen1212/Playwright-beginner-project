const ExcelJs = require('exceljs');
const { test, expect } = require('@playwright/test');
const path = require('path');

// Read excel file
async function readExcel(worksheet,searchText)
{
    let output = {row:-1,column:-1};
    worksheet.eachRow((row,rowNumber) =>
    {
          row.eachCell((cell,colNumber) =>
          {
              if(cell.value === searchText)
              {
                  output.row=rowNumber;
                  output.column=colNumber;
              } 
          }) 
    })
    return output;
}
// Export excel file
async function writeExcelTest(searchText,replaceText,change,filePath)
{
    
  const workbook = new ExcelJs.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet('Sheet1');
  const output= await readExcel(worksheet,searchText);

  const cell = worksheet.getCell(output.row,output.column+change.colChange);
  cell.value = replaceText;
  await workbook.xlsx.writeFile(filePath);

}


//update Mango Price to 350. 
//writeExcelTest("Mango",350,{rowChange:0,colChange:2},"/Users/trangnguyen/Documents/plyawright/Playwright-beginner-project/doawnload/download.xlsx");
test('Upload download excel validation',async ({page})=>
{
  const outputDir = path.join(__dirname, '..', 'doawnload');
  const filePath = path.join(outputDir, 'download.xlsx');
  const textSearch = 'Mango';
  const updateValue = '350';
  await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
  const [ download ] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download' }).click()
  ]);

  // Save the downloaded file to a specific location
  await download.saveAs(filePath); 
  // update value of Mango in the excel file
  writeExcelTest(textSearch,updateValue,{rowChange:0,colChange:2},filePath);
  const fileInput = page.locator("#fileinput");
  await fileInput.waitFor({ state: 'visible' });
  // upload file (setInputFiles means setting the file(s) to the <input type="file"> element)
  await fileInput.setInputFiles(filePath);
  const textlocator = page.getByText(textSearch);
  const desiredRow = await page.getByRole('row').filter({has :textlocator });
  await expect(desiredRow.locator("#cell-4-undefined")).toContainText(updateValue);


})







