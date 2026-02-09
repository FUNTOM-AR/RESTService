import { pool } from "../services/database/databaseService.js";

// --- Therapist CRUD ---
export async function getTherapists(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT t.therapist_id, t.name, u.user_id, u.email, u.role
      FROM Therapist t
      JOIN User u ON t.user_id = u.user_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createTherapist(req, res) {
  try {
    const { name, user_id } = req.body;

    // Validate that the user exists and has the 'therapist' role
    const [[user]] = await pool.query(
      "SELECT * FROM User WHERE user_id = ? AND role = 'therapist'",
      [user_id]
    );

    if (!user) {
      return res.status(400).json({ message: "Invalid user_id or user is not a therapist" });
    }

    const [result] = await pool.query(
      "INSERT INTO Therapist (name, user_id) VALUES (?, ?)",
      [name, user_id]
    );

    const [[therapist]] = await pool.query(
      "SELECT * FROM Therapist WHERE therapist_id = ?",
      [result.insertId]
    );

    res.status(201).json(therapist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateTherapist(req, res) {
  try {
    const { name, user_id } = req.body;

    const picked = { name, user_id };
    const cleaned = Object.fromEntries(
      Object.entries(picked).filter(([_, v]) => v !== undefined)
    );

    if (cleaned.user_id) {
      // Validate user_id exists and is a therapist
      const [[user]] = await pool.query(
        "SELECT * FROM User WHERE user_id = ? AND role = 'therapist'",
        [cleaned.user_id]
      );
      if (!user) {
        return res.status(400).json({ message: "Invalid user_id or user is not a therapist" });
      }
    }

    if (Object.keys(cleaned).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    await pool.query("UPDATE Therapist SET ? WHERE therapist_id = ?", [cleaned, req.params.id]);

    const [[updatedTherapist]] = await pool.query(
      "SELECT * FROM Therapist WHERE therapist_id = ?",
      [req.params.id]
    );

    res.status(200).json(updatedTherapist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update therapist", error: err.message });
  }
}

export async function deleteTherapist(req, res) {
  try {
    await pool.query("DELETE FROM Therapist WHERE therapist_id = ?", [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
