import db from "../data/database.js";

export function buildReportHtml(report) {

    const today = new Date().toLocaleDateString();

    const topProductsRows = report.topProducts.map(product => `
        <tr>
            <td>${product.product}</td>
            <td>€${Number(product.revenue).toFixed(2)}</td>
        </tr>
    `).join("");

    const dailyRows = report.ordersPerDay.map(day => `
        <tr>
            <td>${day.date}</td>
            <td>${day.orders}</td>
        </tr>
    `).join("");

    const orders = db.prepare(`
        SELECT *
        FROM orders
        ORDER BY created_at DESC
    `).all();

    const orderRows = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.product}</td>
            <td>€${Number(order.amount).toFixed(2)}</td>
            <td>${new Date(order.created_at).toLocaleDateString()}</td>
        </tr>
    `).join("");

    return `
<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8">

    <title>Shop Sales Report</title>

    <style>

        @page {
            size: A4;
            margin: 20mm;
        }

        body {
            font-family: Arial, sans-serif;
            color: #222;
            margin: 0;
        }

        h1 {
            margin-bottom: 5px;
        }

        .date {
            color: #666;
            margin-bottom: 30px;
        }

        .summary {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
        }

        .card {
            border: 1px solid #ddd;
            padding: 20px;
            width: 200px;
        }

        .card h2 {
            margin: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background: #f2f2f2;
        }

        tr {
            break-inside: avoid;
        }

        thead {
            display: table-header-group;
        }

        .section {
            margin-top: 30px;
        }

    </style>

</head>

<body>

    <h1>Shop Sales Report</h1>

    <div class="date">
        Report generated: ${today}
    </div>

    <div class="summary">

        <div class="card">
            <h2>${report.totalOrders}</h2>
            <p>Total Orders</p>
        </div>

        <div class="card">
            <h2>€${Number(report.totalRevenue).toFixed(2)}</h2>
            <p>Total Revenue</p>
        </div>

    </div>

    <div class="section">

        <h2>Top 5 Products by Revenue</h2>

        <table>

            <thead>
                <tr>
                    <th>Product</th>
                    <th>Revenue</th>
                </tr>
            </thead>

            <tbody>
                ${topProductsRows}
            </tbody>

        </table>

    </div>

    <div class="section">

        <h2>Orders Per Day - Last 7 Days</h2>

        <table>

            <thead>
                <tr>
                    <th>Date</th>
                    <th>Orders</th>
                </tr>
            </thead>

            <tbody>
                ${dailyRows}
            </tbody>

        </table>

    </div>

    <div class="section">

        <h2>All Orders</h2>

        <table>

            <thead>
                <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Date</th>
                </tr>
            </thead>

            <tbody>
                ${orderRows}
            </tbody>

        </table>

    </div>

</body>

</html>
    `;
}