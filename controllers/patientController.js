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
    const { name, email, password, amputation_type, start_date, therapist_id } = req.body;
    await pool.query(
      "INSERT INTO Patient (name,email,password,amputation_type,start_date,therapist_id) VALUES (?,?,?,?,?,?)",
      [name, email, password, amputation_type, start_date, therapist_id]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create patient", error: err.message });
  }
}

export async function updatePatient(req, res) {
  try {
    await pool.query("UPDATE Patient SET ? WHERE patient_id=?", [req.body, req.params.id]);
    res.sendStatus(200);
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
