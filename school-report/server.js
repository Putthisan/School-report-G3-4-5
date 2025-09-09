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
  console.log("????????????????????????");
});

db.run(`CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  problem TEXT,
  status TEXT DEFAULT '???????????'
)`);

app.post("/api/report", (req, res) => {
  const { name, problem } = req.body;
  db.run(
    `INSERT INTO reports (name, problem) VALUES (?, ?)`,
    [name, problem],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID, name, problem, status: "???????????" });
    }
  );
});

app.get("/api/reports", (req, res) => {
  db.all(`SELECT * FROM reports`, [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

app.put("/api/report/:id", (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  db.run(
    `UPDATE reports SET status = ? WHERE id = ?`,
    [status, id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
