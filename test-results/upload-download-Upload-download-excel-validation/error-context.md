# Test info

- Name: Upload download excel validation
- Location: D:\IT Knownledge\Javascript\1. Playwright\Playwright-beginner-project\tests\upload-download.spec.js:39:1

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toContainText(expected)

Locator: getByRole('row').filter({ has: getByText('Mango') }).locator('#cell-4-undefined')
Expected string: "350"
Received string: "299"
Call log:
  - expect.toContainText with timeout 5000ms
  - waiting for getByRole('row').filter({ has: getByText('Mango') }).locator('#cell-4-undefined')
    9 × locator resolved to <div role="cell" data-column-id="4" id="cell-4-undefined" data-tag="allowRowEvents" class="sc-hLQSwg sc-eDLKkx sc-jTQCzO kyDEvf gfKXFa cJTPDY rdt_TableCell">…</div>
      - unexpected value "299"

    at D:\IT Knownledge\Javascript\1. Playwright\Playwright-beginner-project\tests\upload-download.spec.js:60:57
```

# Page snapshot

```yaml
- banner:
  - 'heading "RAHUL SHETTY ACADEMY PRACTISE Note: Data will be reset after page refresh." [level=1]'
- table:
  - rowgroup:
    - row "S No ▲ Fruit Name ▲ Color ▲ Price ▲ Season ▲":
      - columnheader "S No ▲"
      - columnheader "Fruit Name ▲"
      - columnheader "Color ▲"
      - columnheader "Price ▲"
      - columnheader "Season ▲"
  - rowgroup:
    - row "1 Mango Yellow 299 Summer":
      - cell "1"
      - cell "Mango"
      - cell "Yellow"
      - cell "299"
      - cell "Summer"
    - row "2 Apple Red 345 Winter":
      - cell "2"
      - cell "Apple"
      - cell "Red"
      - cell "345"
      - cell "Winter"
    - row "3 Papaya Orange 187 Spring":
      - cell "3"
      - cell "Papaya"
      - cell "Orange"
      - cell "187"
      - cell "Spring"
    - row "4 Banana Yellow 69 All":
      - cell "4"
      - cell "Banana"
      - cell "Yellow"
      - cell "69"
      - cell "All"
    - row "5 Kivi Green 399 Winter":
      - cell "5"
      - cell "Kivi"
      - cell "Green"
      - cell "399"
      - cell "Winter"
    - row "6 Orange Orange 199 Summer":
      - cell "6"
      - cell "Orange"
      - cell "Orange"
      - cell "199"
      - cell "Summer"
- navigation:
  - text: "Rows per page:"
  - combobox "Rows per page:":
    - option "10" [selected]
    - option "15"
    - option "20"
    - option "25"
    - option "30"
  - img
  - text: 1-6 of 6
  - button "First Page" [disabled]
  - button "Previous Page" [disabled]
  - button "Next Page" [disabled]
  - button "Last Page" [disabled]
- button "Download"
- button "Choose File"
- alert:
  - img
  - text: No rows found.
- button "close"
- progressbar "notification timer"
```

# Test source

```ts
   1 | const ExcelJs = require('exceljs');
   2 | const { test, expect } = require('@playwright/test');
   3 |
   4 | // Read excel file
   5 | async function readExcel(worksheet,searchText)
   6 | {
   7 |     let output = {row:-1,column:-1};
   8 |     worksheet.eachRow((row,rowNumber) =>
   9 |     {
  10 |           row.eachCell((cell,colNumber) =>
  11 |           {
  12 |               if(cell.value === searchText)
  13 |               {
  14 |                   output.row=rowNumber;
  15 |                   output.column=colNumber;
  16 |               } 
  17 |           }) 
  18 |     })
  19 |     return output;
  20 | }
  21 | // Export excel file
  22 | async function writeExcelTest(searchText,replaceText,change,filePath)
  23 | {
  24 |     
  25 |   const workbook = new ExcelJs.Workbook();
  26 |   await workbook.xlsx.readFile(filePath);
  27 |   const worksheet = workbook.getWorksheet('Sheet1');
  28 |   const output= await readExcel(worksheet,searchText);
  29 |
  30 |   const cell = worksheet.getCell(output.row,output.column+change.colChange);
  31 |   cell.value = replaceText;
  32 |   await workbook.xlsx.writeFile(filePath);
  33 |
  34 | }
  35 |
  36 |
  37 | //update Mango Price to 350. 
  38 | //writeExcelTest("Mango",350,{rowChange:0,colChange:2},"/Users/rahulshetty/downloads/excelTest.xlsx");
  39 | test('Upload download excel validation',async ({page})=>
  40 | {
  41 |   const filePath = "D:/IT Knownledge/Javascript/1. Playwright/Playwright-beginner-project/doawnload/download.xlsx";
  42 |   const textSearch = 'Mango';
  43 |   const updateValue = '350';
  44 |   await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
  45 |   const [ download ] = await Promise.all([
  46 |     page.waitForEvent('download'),
  47 |     page.getByRole('button', { name: 'Download' }).click()
  48 |   ]);
  49 |
  50 |   // Save the downloaded file to a specific location
  51 |   await download.saveAs(filePath); 
  52 |   // update value of Mango in the excel file
  53 |   writeExcelTest(textSearch,updateValue,{rowChange:0,colChange:2},filePath);
  54 |   const fileInput = page.locator("#fileinput");
  55 |   await fileInput.waitFor({ state: 'visible' });
  56 |   // upload file (setInputFiles means setting the file(s) to the <input type="file"> element)
  57 |   await fileInput.setInputFiles(filePath);
  58 |   const textlocator = page.getByText(textSearch);
  59 |   const desiredRow = await page.getByRole('row').filter({has :textlocator });
> 60 |   await expect(desiredRow.locator("#cell-4-undefined")).toContainText(updateValue);
     |                                                         ^ Error: Timed out 5000ms waiting for expect(locator).toContainText(expected)
  61 |
  62 |
  63 | })
  64 |
  65 |
  66 |
  67 |
  68 |
  69 |
  70 |
  71 |
```