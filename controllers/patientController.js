import { pool } from "../services/database/databaseService.js";

export async function getPatients(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM Patient");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get patients", error: err.message });
  }
}

export async function createPatient(req, res) {
  try {
    const { name,  amputation_type, start_date, therapist_id } = req.body;

    const [result] = await pool.query(
      "INSERT INTO Patient (name, amputation_type,start_date,therapist_id) VALUES (?,?,?,?,?,?)",
      [name,  amputation_type, start_date, therapist_id]
    );

    // Fetch the inserted patient
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
    const { name, amputation_type, start_date, therapist_id } = req.body;

    const picked = { name, amputation_type, start_date, therapist_id };
    const cleaned = Object.fromEntries(
      Object.entries(picked).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(cleaned).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    await pool.query("UPDATE Patient SET ? WHERE patient_id = ?", [
      cleaned,
      req.params.id
    ]);

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
    await pool.query("DELETE FROM Patient WHERE patient_id=?", [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete patient", error: err.message });
  }
}
