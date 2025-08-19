const fs = require('fs');
const path = require('path'); 


const resultsDir = path.join(__dirname, '..', 'allure-results');
const reportDir = path.join(__dirname, '..', 'allure-report');
const indexPath = path.join(reportDir, 'index.html'); // this stays as template

function waitForFile(file, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (fs.existsSync(file)) {
        return resolve(); // ✅ file found
      }
      if (Date.now() - start > timeout) {
        return reject(new Error(`Timeout: ${file} not found within ${timeout}ms`));
      }
      setTimeout(check, 200); // 🔄 check every 200ms
    };
    check();
  });
} 
(async () => {
  // Step 1 — Find the first result JSON file
  const targetSpec = process.env.SPEC_FILE_NAME; // fallback if not set

const files = fs.readdirSync(resultsDir).filter(f => f.endsWith('-result.json'));
let matchedFile = null;

for (const file of files) {
  const filePath = path.join(resultsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    const json = JSON.parse(content);
    if (
      (json.fullName && json.fullName.includes(targetSpec)) ||
      (Array.isArray(json.titlePath) && json.titlePath.some(t => t.includes(targetSpec)))
    ) {
      matchedFile = filePath;
      break;
    }
  } catch (e) {}
}

if (!matchedFile) {
  console.error(`No test result JSON found in allure-results matching ${targetSpec}.`);
  process.exit(1);
}

const testData = JSON.parse(fs.readFileSync(matchedFile, 'utf8')); 

  // Step 2 — Extract spec file name
  let baseName = 'playwright-report';
  if (testData.fullName) {
    const match = testData.fullName.match(/([^\/\\]+)\.spec\.(js|ts)/);
    if (match) {
      baseName = match[1]; // just the test name without extension
    }
  }

  // Step 3 — Read index.html as template and update content
  let html = fs.readFileSync(indexPath, 'utf8'); // always read the template
  html = html.replace(/<title>Allure Report<\/title>/, `<title>${baseName}</title>`);
  html = html.replace(/<h1[^>]*>Allure Report<\/h1>/, `<h1>${baseName}</h1>`);

  // Step 4 — Save to a new file, don’t rename index.html 
  const newFileName = `${baseName}.html`;
  const newFilePath = path.join(reportDir, newFileName);  
  fs.writeFileSync(newFilePath, html, 'utf8');

  // Step 5 — Optionally, wait for the file and log
  try {
    await waitForFile(newFilePath); // ⏳ wait until file exists
    console.log(`✅ File created: ${newFilePath}`);
  } catch (err) {
    console.error(`❌ ${err.message}`);
  }
})();