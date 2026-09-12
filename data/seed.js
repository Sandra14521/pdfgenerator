import db from "./database.js";

const products = [
    "Laptop",
    "Keyboard",
    "Mouse",
    "Headphones",
    "Monitor",
    "USB Cable"
];

const customers = [
    "John",
    "Mary",
    "Peter",
    "Grace",
    "David",
    "Sarah",
    "Daniel",
    "Anne"
];

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomAmount() {
    return Math.floor(Math.random() * 196) + 5;
}

function randomDate() {
    const date = new Date();

    const daysAgo = Math.floor(Math.random() * 30);

    date.setDate(date.getDate() - daysAgo);

    return date.toISOString();
}

db.exec("DELETE FROM orders");

const insert = db.prepare(`
    INSERT INTO orders
    (customer, product, amount, created_at)
    VALUES (?, ?, ?, ?)
`);

for (let i = 0; i < 200; i++) {
    insert.run(
        randomItem(customers),
        randomItem(products),
        randomAmount(),
        randomDate()
    );
}

const result = db.prepare(
    "SELECT COUNT(*) AS count FROM orders"
).get();

console.log(`Orders in database: ${result.count}`);