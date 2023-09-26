const cors = require("cors");
const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcrypt"); // Import bcrypt for hashing
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for generating JWTs

const app = express();
app.use(cors());
const port = 3001; // You can choose any port

// PostgreSQL connection
const pool = new Pool({
  user: "voss",
  host: "localhost",
  database: "voss",
  port: 5432,
});

// Middleware to parse JSON
app.use(express.json());

// Fetch all products with optional filters
app.get("/api/products", async (req, res) => {
  const { sort, category } = req.query;
  let query = "SELECT * FROM Products WHERE 1=1";
  let values = [];

  if (category) {
    query += " AND category = ANY($1)";
    values.push(category.split(","));
  }

  if (sort === "price_asc") {
    query += " ORDER BY price ASC";
  } else if (sort === "price_desc") {
    query += " ORDER BY price DESC";
  }

  try {
    const { rows } = await pool.query(query, values.length ? [values] : []);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Fetch a single product by ID
app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM Products WHERE id = $1", [
      id,
    ]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).send("Product not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Add an item to the cart
app.post("/api/cart", async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO Cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [user_id, product_id, quantity]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Fetch all cart items for a specific user
app.get("/api/cart/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM CartView WHERE user_id = $1",
      [user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Update quantity of a cart item
app.put("/api/cart/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE Cart SET quantity = $1 WHERE id = $2 RETURNING *",
      [quantity, id]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).send("Cart item not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Remove an item from the cart
app.delete("/api/cart/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query("DELETE FROM Cart WHERE id = $1", [
      id,
    ]);
    if (rowCount > 0) {
      res.send("Item removed successfully");
    } else {
      res.status(404).send("Cart item not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Checkout cart items
app.post("/api/checkout/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    // Your logic to handle checkout, e.g., creating an order, marking cart items as purchased, etc.
    res.send("Checkout successful");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Define a sign-up endpoint
app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user into the database
    const { rows } = await pool.query(
      "INSERT INTO Users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Define a login endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const { rows } = await pool.query("SELECT * FROM Users WHERE email = $1", [
      email,
    ]);
    const user = rows[0];

    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    // Validate the password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).send("Invalid email or password");
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
