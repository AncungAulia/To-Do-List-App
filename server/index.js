const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Middleware
app.use(cors({
  origin: ["https://to-do-list-gold-six-63.vercel.app"],
  credentials: true
}));
app.use(express.json());

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  console.log("Received token:", token);

  if (!token) {
    return res.status(403).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

/* ROUTES */

// Auth Routes
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO Users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password_hash]
    );

    res.status(201).json({
      message: "Registration successful! Please login to continue.",
      email: email,
    });
  } catch (err) {
    console.log(err.message);
    if (err.code === "23505") {
      return res.status(400).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await pool.query("SELECT * FROM Users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const payload = {
      user_id: user.rows[0].user_id,
      name: user.rows[0].name,
    };

    const expirationTime = rememberMe ? "7d" : "1h";

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: expirationTime,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      expiresIn: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Todo Routes
app.post("/todos", verifyToken, async (req, res) => {
  try {
    const { title, description, due_date, priority } = req.body;
    const user_id = req.user.user_id;

    // Validate input
    if (!title || !description || !priority) {
      return res.status(400).json({
        error: "Title, description, and priority are required",
      });
    }

    const newTodo = await pool.query(
      "INSERT INTO Todos (user_id, title, description, due_date, priority, is_complete, created_at) VALUES ($1, $2, $3, $4, $5, FALSE, CURRENT_TIMESTAMP) RETURNING *",
      [user_id, title, description, due_date, priority]
    );

    res.status(201).json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/todos", verifyToken, async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const todos = await pool.query(
      "SELECT * FROM Todos WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );

    res.status(200).json(todos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/todos/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;

    const todo = await pool.query(
      "SELECT * FROM todos WHERE todo_id = $1 AND user_id = $2",
      [id, user_id]
    );

    if (todo.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

app.put("/todos/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;
    const { title, description, due_date, priority, is_complete } = req.body;

    // Validate input
    if (!title || !description || !priority) {
      return res.status(400).json({
        error: "Title, description, and priority are required",
      });
    }

    // First check if todo exists and belongs to user
    const todoExists = await pool.query(
      "SELECT * FROM Todos WHERE todo_id = $1 AND user_id = $2",
      [id, user_id]
    );

    if (todoExists.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const updatedTodo = await pool.query(
      "UPDATE Todos SET title = $1, description = $2, due_date = $3, priority = $4, is_complete = $5, updated_at = CURRENT_TIMESTAMP WHERE todo_id = $6 AND user_id = $7 RETURNING *",
      [title, description, due_date, priority, is_complete, id, user_id]
    );

    res.status(200).json(updatedTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

app.delete("/todos/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;

    // First check if todo exists and belongs to user
    const todoExists = await pool.query(
      "SELECT * FROM Todos WHERE todo_id = $1 AND user_id = $2",
      [id, user_id]
    );

    if (todoExists.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    await pool.query("DELETE FROM Todos WHERE todo_id = $1 AND user_id = $2", [
      id,
      user_id,
    ]);

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

/* USER ROUTES */

// Get user profile
app.get("/user/profile", verifyToken, async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const user = await pool.query(
      "SELECT user_id, name, email FROM Users WHERE user_id = $1",
      [user_id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Update user name
app.put("/user/update-name", verifyToken, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }

    const updatedUser = await pool.query(
      "UPDATE Users SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING user_id, name, email",
      [name, user_id]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Name updated successfully",
      user: updatedUser.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Update user password
app.put("/user/update-password", verifyToken, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Current password and new password are required",
      });
    }

    // Get current user data
    const user = await pool.query(
      "SELECT password_hash FROM Users WHERE user_id = $1",
      [user_id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(
      currentPassword,
      user.rows[0].password_hash
    );

    if (!validPassword) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Update password
    await pool.query(
      "UPDATE Users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2",
      [newPasswordHash, user_id]
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(5000, '0.0.0.0' , () => {
  console.log("Server is running on port 5000");
});
