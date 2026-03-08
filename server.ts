import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Database
  const db = new Database("nutrivida.db");
  
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      age INTEGER,
      weight REAL,
      height REAL,
      goals TEXT,
      conditions TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      paymentMethod TEXT,
      status TEXT DEFAULT 'Confirmed',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  app.use(express.json());

  // API Routes
  app.post("/api/appointments", (req, res) => {
    try {
      const { 
        fullName, email, phone, age, weight, height, 
        goals, conditions, date, time, paymentMethod 
      } = req.body;

      const stmt = db.prepare(`
        INSERT INTO appointments (
          fullName, email, phone, age, weight, height, 
          goals, conditions, date, time, paymentMethod
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        fullName, email, phone, age, weight, height, 
        goals, conditions, date, time, paymentMethod
      );

      res.status(201).json({ id: result.lastInsertRowid, status: 'success' });
    } catch (error) {
      console.error("Error saving appointment:", error);
      res.status(500).json({ error: "Failed to save appointment" });
    }
  });

  app.get("/api/appointments", (req, res) => {
    try {
      const appointments = db.prepare("SELECT * FROM appointments ORDER BY createdAt DESC").all();
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
