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
    );

    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      time TEXT NOT NULL,
      calories TEXT NOT NULL,
      image TEXT NOT NULL,
      description TEXT NOT NULL,
      ingredients TEXT NOT NULL, -- JSON string
      instructions TEXT NOT NULL, -- JSON string
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      why TEXT NOT NULL,
      lookFor TEXT NOT NULL,
      image TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed initial data if empty
  const recipeCount = db.prepare("SELECT COUNT(*) as count FROM recipes").get() as { count: number };
  if (recipeCount.count === 0) {
    const initialRecipes = [
      {
        title: 'Quinoa & Avocado Power Bowl',
        category: 'Vegan',
        time: '20 min',
        calories: '450 kcal',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
        description: 'A nutrient-dense bowl packed with plant-based protein and healthy fats.',
        ingredients: JSON.stringify(['1 cup cooked quinoa', '1/2 ripe avocado, sliced', '1/2 cup chickpeas, rinsed', '1/4 cup shredded carrots', 'Handful of baby spinach', 'Lemon-tahini dressing']),
        instructions: JSON.stringify(['Place cooked quinoa as the base of the bowl.', 'Arrange avocado, chickpeas, carrots, and spinach on top.', 'Drizzle with lemon-tahini dressing.', 'Season with salt and pepper to taste.'])
      },
      {
        title: 'Grilled Salmon with Asparagus',
        category: 'High Protein',
        time: '25 min',
        calories: '380 kcal',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=600',
        description: 'Omega-3 rich salmon paired with seasonal greens for metabolic health.',
        ingredients: JSON.stringify(['6 oz salmon fillet', '1 bunch asparagus, trimmed', '1 tbsp olive oil', '1 clove garlic, minced', 'Lemon wedges', 'Fresh dill']),
        instructions: JSON.stringify(['Preheat grill or pan to medium-high heat.', 'Season salmon and asparagus with olive oil, garlic, salt, and pepper.', 'Grill salmon for 4-5 minutes per side until cooked through.', 'Grill asparagus for 3-5 minutes until tender-crisp.', 'Serve with fresh lemon and dill.'])
      }
    ];
    const insertRecipe = db.prepare("INSERT INTO recipes (title, category, time, calories, image, description, ingredients, instructions) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    initialRecipes.forEach(r => insertRecipe.run(r.title, r.category, r.time, r.calories, r.image, r.description, r.ingredients, r.instructions));
  }

  const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  if (productCount.count === 0) {
    const initialProducts = [
      {
        name: 'Extra Virgin Olive Oil',
        category: 'Pantry',
        why: 'High in monounsaturated fats and antioxidants. Essential for heart health and reducing inflammation.',
        lookFor: 'Cold-pressed, dark glass bottle, and a recent harvest date.',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600'
      },
      {
        name: 'Greek Yogurt (Plain)',
        category: 'Proteins',
        why: 'Excellent source of probiotics for gut health and high-quality protein for muscle maintenance.',
        lookFor: 'Zero added sugars, live active cultures, and preferably organic.',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600'
      }
    ];
    const insertProduct = db.prepare("INSERT INTO products (name, category, why, lookFor, image) VALUES (?, ?, ?, ?, ?)");
    initialProducts.forEach(p => insertProduct.run(p.name, p.category, p.why, p.lookFor, p.image));
  }

  app.use(express.json());

  // --- Auth API ---
  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    // Hardcoded credentials for demo purposes
    if (email === 'admin@nutrivida.com' && password === 'admin123') {
      res.json({ success: true, user: { email: 'admin@nutrivida.com', name: 'Dr. Elena' } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });

  // --- Appointments API ---
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

  app.put("/api/appointments/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { fullName, email, phone, age, weight, height, goals, conditions, date, time, status } = req.body;
      db.prepare(`
        UPDATE appointments SET 
        fullName = ?, email = ?, phone = ?, age = ?, weight = ?, height = ?, goals = ?, conditions = ?, date = ?, time = ?, status = ?
        WHERE id = ?
      `).run(fullName, email, phone, age, weight, height, goals, conditions, date, time, status, id);
      res.json({ status: 'success' });
    } catch (error) {
      res.status(500).json({ error: "Failed to update appointment" });
    }
  });

  app.delete("/api/appointments/:id", (req, res) => {
    try {
      const { id } = req.params;
      db.prepare("DELETE FROM appointments WHERE id = ?").run(id);
      res.json({ status: 'success' });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete appointment" });
    }
  });

  // --- Recipes API ---
  app.get("/api/recipes", (req, res) => {
    try {
      const recipes = db.prepare("SELECT * FROM recipes ORDER BY createdAt DESC").all();
      const parsedRecipes = recipes.map((r: any) => ({
        ...r,
        ingredients: JSON.parse(r.ingredients),
        instructions: JSON.parse(r.instructions)
      }));
      res.json(parsedRecipes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recipes" });
    }
  });

  app.post("/api/recipes", (req, res) => {
    try {
      const { title, category, time, calories, image, description, ingredients, instructions } = req.body;
      const result = db.prepare(`
        INSERT INTO recipes (title, category, time, calories, image, description, ingredients, instructions)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(title, category, time, calories, image, description, JSON.stringify(ingredients), JSON.stringify(instructions));
      res.status(201).json({ id: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to create recipe" });
    }
  });

  app.put("/api/recipes/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { title, category, time, calories, image, description, ingredients, instructions } = req.body;
      db.prepare(`
        UPDATE recipes SET title = ?, category = ?, time = ?, calories = ?, image = ?, description = ?, ingredients = ?, instructions = ?
        WHERE id = ?
      `).run(title, category, time, calories, image, description, JSON.stringify(ingredients), JSON.stringify(instructions), id);
      res.json({ status: 'success' });
    } catch (error) {
      res.status(500).json({ error: "Failed to update recipe" });
    }
  });

  app.delete("/api/recipes/:id", (req, res) => {
    try {
      const { id } = req.params;
      db.prepare("DELETE FROM recipes WHERE id = ?").run(id);
      res.json({ status: 'success' });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete recipe" });
    }
  });

  // --- Products API ---
  app.get("/api/products", (req, res) => {
    try {
      const products = db.prepare("SELECT * FROM products ORDER BY createdAt DESC").all();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/products", (req, res) => {
    try {
      const { name, category, why, lookFor, image } = req.body;
      const result = db.prepare(`
        INSERT INTO products (name, category, why, lookFor, image)
        VALUES (?, ?, ?, ?, ?)
      `).run(name, category, why, lookFor, image);
      res.status(201).json({ id: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, why, lookFor, image } = req.body;
      db.prepare(`
        UPDATE products SET name = ?, category = ?, why = ?, lookFor = ?, image = ?
        WHERE id = ?
      `).run(name, category, why, lookFor, image, id);
      res.json({ status: 'success' });
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", (req, res) => {
    try {
      const { id } = req.params;
      db.prepare("DELETE FROM products WHERE id = ?").run(id);
      res.json({ status: 'success' });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
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
