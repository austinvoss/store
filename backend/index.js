const express = require("express");
const { Pool } = require("pg");

const app = express();
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

// Fetch all products
app.get("/api/products", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM Products");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Fetch all products with sorting and filtering
app.get("/api/products", async (req, res) => {
  const { sort, category, min_price, max_price } = req.query;
  let query = "SELECT * FROM Products WHERE 1=1";
  let values = [];

  if (category) {
    query += " AND category = $" + (values.length + 1);
    values.push(category);
  }

  if (min_price) {
    query += " AND price >= $" + (values.length + 1);
    values.push(min_price);
  }

  if (max_price) {
    query += " AND price <= $" + (values.length + 1);
    values.push(max_price);
  }

  if (sort === "price_asc") {
    query += " ORDER BY price ASC";
  } else if (sort === "price_desc") {
    query += " ORDER BY price DESC";
  }

  try {
    const { rows } = await pool.query(query, values);
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
    const { rows } = await pool.query("SELECT * FROM Cart WHERE user_id = $1", [
      user_id,
    ]);
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
