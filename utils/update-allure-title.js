const fs = require('fs');
const path = require('path');

const resultsDir = path.join(__dirname, '..', 'allure-results');
const reportDir = path.join(__dirname, '..', 'test-results/report');
const indexPath = path.join(reportDir, 'index.html');
console.log(`file index`, indexPath)

// Step 1 — Find the first result JSON file
const files = fs.readdirSync(resultsDir).filter(f => f.endsWith('-result.json'));
if (files.length === 0) {
  console.error('No test result JSON found in allure-results.');
  process.exit(1);
}

const firstResultPath = path.join(resultsDir, files[0]);
const testData = JSON.parse(fs.readFileSync(firstResultPath, 'utf8'));

// Step 2 — Extract spec file name
let baseName = 'playwright-report';
if (testData.fullName) {
  const match = testData.fullName.match(/([^\/\\]+)\.spec\.(js|ts)/);
  if (match) {
    baseName = match[1]; // just the test name without extension
  }
}

const newFileName = `${baseName}.html`;
const newFilePath = path.join(reportDir, newFileName);  

// Step 3 — Update <title> and <h1> in index.html
let html = fs.readFileSync(indexPath, 'utf8');
html = html.replace(/<title>Allure Report<\/title>/, `<title>${baseName}</title>`);
html = html.replace(/<h1[^>]*>Allure Report<\/h1>/, `<h1>${baseName}</h1>`);

// Save the updated HTML content back to index.html
fs.writeFileSync(indexPath, html, 'utf8');

// Step 4 — Rename index.html to <spec-name>.html
if (fs.existsSync(newFilePath)) {
  fs.unlinkSync(newFilePath); // Remove if already exists
}

try {
  fs.renameSync(indexPath, newFilePath);
  console.log(`✅ Updated title and renamed file to: ${newFileName}`);
} catch (err) {
  console.error(`❌ Failed to rename file: ${err.message}`);
}

console.log(`✅ Updated title and renamed file to: ${newFileName}`);
