const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

const db = new sqlite3.Database("./school.db", (err) => {
    if (err) console.error(err.message);
    console.log("เชื่อมต่อฐานข้อมูลสำเร็จ");
});

db.run(\CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    problem TEXT,
    status TEXT DEFAULT 'รอดำเนินการ'
)\);

app.post("/api/report", (req, res) => {
    const { name, problem } = req.body;
    db.run(
        \INSERT INTO reports (name, problem) VALUES (?, ?)\,
        [name, problem],
        function(err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ id: this.lastID, name, problem, status: "รอดำเนินการ" });
        }
    );
});

app.get("/api/reports", (req, res) => {
    db.all(\SELECT * FROM reports\, [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(\Server running at http://localhost:\\);
});
