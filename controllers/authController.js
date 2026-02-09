import { pool } from "../services/database/databaseService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM User WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      token
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
}
