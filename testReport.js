import { getReportData } from "./utils/reportData.js";
import { buildReportHtml } from "./utils/reportHtml.js";
import { generatePdf } from "./utils/generatePdf.js";

const report = getReportData();

const html = buildReportHtml(report);

await generatePdf(
    html,
    "reports/test.pdf"
);

console.log("PDF generated successfully!");