import express from "express";
import path from "path";
import fs from "fs";

import db from "./data/database.js";
import { getReportData } from "./utils/reportData.js";
import { buildReportHtml } from "./utils/reportHtml.js";
import { generatePdf } from "./utils/generatePdf.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {

    res.json({
        status: "ok"
    });

});

aapp.post("/reports", async (req, res) => {

    try {

        const force = req.body?.force === true;

        if (!force) {

            const existingReport = db.prepare(`
                SELECT *
                FROM reports
                WHERE DATE(created_at) = DATE('now')
                ORDER BY id DESC
                LIMIT 1
            `).get();

            if (existingReport) {

                return res.status(200).json({
                    id: existingReport.id,
                    file: `/reports/${existingReport.id}/file`
                });

            }

        }

        const reportData = getReportData();

        const html = buildReportHtml(reportData);

        const reportsFolder = path.join(
            process.cwd(),
            "reports"
        );

        if (!fs.existsSync(reportsFolder)) {
            fs.mkdirSync(reportsFolder);
        }

        const reportIdResult = db.prepare(`
            SELECT COALESCE(MAX(id), 0) + 1 AS nextId
            FROM reports
        `).get();

        const reportId = reportIdResult.nextId;

        const fileName = `${reportId}.pdf`;

        const filePath = path.join(
            reportsFolder,
            fileName
        );

        await generatePdf(
            html,
            filePath
        );

        const fileLink = `/reports/${reportId}/file`;

        db.prepare(`
            INSERT INTO reports
            (path, created_at)
            VALUES (?, ?)
        `).run(
            filePath,
            new Date().toISOString()
        );

        res.status(201).json({
            id: reportId,
            file: fileLink
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to generate report"
        });

    }

});
app.get("/reports/:id", (req, res) => {

    const id = Number(req.params.id);

    const report = db.prepare(`
        SELECT *
        FROM reports
        WHERE id = ?
    `).get(id);

    if (!report) {

        return res.status(404).json({
            error: "Report not found"
        });

    }

    res.json({
        id: report.id,
        path: report.path,
        created_at: report.created_at,
        file: `/reports/${report.id}/file`
    });

});

app.get("/reports/:id/file", (req, res) => {

    const id = Number(req.params.id);

    const report = db.prepare(`
        SELECT *
        FROM reports
        WHERE id = ?
    `).get(id);

    if (!report) {

        return res.status(404).json({
            error: "Report not found"
        });

    }

    if (!fs.existsSync(report.path)) {

        return res.status(404).json({
            error: "Report file not found"
        });

    }

    res.sendFile(
        path.resolve(report.path)
    );

});

app.listen(3000, () => {

    console.log(
        "Server running on http://localhost:3000"
    );

});