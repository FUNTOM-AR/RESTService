import { pool } from "../services/database/databaseService.js";

// --- User CRUD ---
export async function getUsers(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM User");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get users", error: err.message });
  }
}

export async function createUser(req, res) {
  try {
    const { email, password } = req.body;
    const [result] = await pool.query(
      "INSERT INTO User (email, password) VALUES (?, ?)",
      [email, password]
    );

    const [[user]] = await pool.query(
      "SELECT * FROM User WHERE user_id = ?",
      [result.insertId]
    );

    const token = generateToken(user);
    res.status(201).json({ ...user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user", error: err.message });
  }
}

export async function updateUser(req, res) {
  try {
    const { email, password } = req.body;

    const picked = { email, password };
    const cleaned = Object.fromEntries(Object.entries(picked).filter(([, v]) => v !== undefined));

    if (Object.keys(cleaned).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    await pool.query("UPDATE User SET ? WHERE user_id = ?", [cleaned, req.params.id]);

    const [[updatedUser]] = await pool.query(
      "SELECT * FROM User WHERE user_id = ?",
      [req.params.id]
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user", error: err.message });
  }
}

export async function deleteUser(req, res) {
  try {
    await pool.query("DELETE FROM User WHERE user_id = ?", [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
}
