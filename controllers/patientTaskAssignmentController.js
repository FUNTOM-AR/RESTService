import { pool } from "../services/database/databaseService.js";

export async function getAssignments(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM PatientTaskAssignment");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get assignments", error: err.message });
  }
}

export async function createAssignment(req, res) {
  try {
    const { order_index, status, assigned_date, completed_date, patient_id, task_id } = req.body;
    await pool.query(
      "INSERT INTO PatientTaskAssignment (order_index,status,assigned_date,completed_date,patient_id,task_id) VALUES (?,?,?,?,?,?)",
      [order_index, status, assigned_date, completed_date, patient_id, task_id]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create assignment", error: err.message });
  }
}

export async function updateAssignment(req, res) {
  try {
    await pool.query("UPDATE PatientTaskAssignment SET ? WHERE assignment_id=?", [
      req.body,
      req.params.id
    ]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update assignment", error: err.message });
  }
}

export async function deleteAssignment(req, res) {
  try {
    await pool.query("DELETE FROM PatientTaskAssignment WHERE assignment_id=?", [
      req.params.id
    ]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete assignment", error: err.message });
  }
}
