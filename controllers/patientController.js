import { pool } from "../services/database/databaseService.js";

// --- Patient CRUD ---
export async function getPatients(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT p.patient_id, p.name, p.amputation_type, p.start_date,
             p.therapist_id, u.user_id, u.email, u.role
      FROM Patient p
      JOIN User u ON p.user_id = u.user_id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get patients", error: err.message });
  }
}

export async function createPatient(req, res) {
  try {
    const { name, amputation_type, start_date, therapist_id, user_id } = req.body;

    // Validate user_id exists and is a patient
    const [[user]] = await pool.query(
      "SELECT * FROM User WHERE user_id = ? AND role = 'patient'",
      [user_id]
    );
    if (!user) {
      return res.status(400).json({ message: "Invalid user_id or user is not a patient" });
    }

    const [result] = await pool.query(
      "INSERT INTO Patient (name, amputation_type, start_date, therapist_id, user_id) VALUES (?, ?, ?, ?, ?)",
      [name, amputation_type, start_date, therapist_id, user_id]
    );

    const [[patient]] = await pool.query(
      "SELECT * FROM Patient WHERE patient_id = ?",
      [result.insertId]
    );

    res.status(201).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create patient", error: err.message });
  }
}

export async function updatePatient(req, res) {
  try {
    const { name, amputation_type, start_date, therapist_id, user_id } = req.body;

    const picked = { name, amputation_type, start_date, therapist_id, user_id };
    const cleaned = Object.fromEntries(
      Object.entries(picked).filter(([_, v]) => v !== undefined)
    );

    if (cleaned.user_id) {
      const [[user]] = await pool.query(
        "SELECT * FROM User WHERE user_id = ? AND role = 'patient'",
        [cleaned.user_id]
      );
      if (!user) {
        return res.status(400).json({ message: "Invalid user_id or user is not a patient" });
      }
    }

    if (Object.keys(cleaned).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    await pool.query("UPDATE Patient SET ? WHERE patient_id = ?", [cleaned, req.params.id]);

    const [[updatedPatient]] = await pool.query(
      "SELECT * FROM Patient WHERE patient_id = ?",
      [req.params.id]
    );

    res.status(200).json(updatedPatient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update patient", error: err.message });
  }
}

export async function deletePatient(req, res) {
  try {
    await pool.query("DELETE FROM Patient WHERE patient_id = ?", [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete patient", error: err.message });
  }
}
