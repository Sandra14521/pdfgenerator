 PDF Report Generator
A Node.js backend application that generates sales reports from SQLite data and converts them into PDF files using Playwright.

Dataset
This project uses the shop dataset.

The database contains approximately 200 randomly generated orders.

Each order contains:
- Customer
- Product
- Amount
- Created date

 Technologies
- Node.js
- Express
- SQLite
- Playwright
- Chromium

Project Structure
```text
data/
    database.js
    seed.js

reports/

utils/
    generatePdf.js
    reportData.js
    reportHtml.js

server.js
testReport.js
