import { chromium } from "playwright";

export async function generatePdf(html, filePath) {

    const browser = await chromium.launch();

    try {

        const page = await browser.newPage();

        await page.setContent(html);

        await page.pdf({
            path: filePath,
            format: "A4",
            printBackground: true
        });

    } finally {

        await browser.close();

    }
}