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

    const [result] = await pool.query(
      "INSERT INTO PatientTaskAssignment (order_index,status,assigned_date,completed_date,patient_id,task_id) VALUES (?,?,?,?,?,?)",
      [order_index, status, assigned_date, completed_date, patient_id, task_id]
    );

    // Fetch the inserted record
    const [[assignment]] = await pool.query(
      "SELECT * FROM PatientTaskAssignment WHERE assignment_id = ?",
      [result.insertId]
    );

    res.status(201).json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create assignment", error: err.message });
  }
}


export async function updateAssignment(req, res) {
  try {
    const { order_index, status, assigned_date, completed_date, patient_id, task_id } = req.body;

    const picked = { order_index, status, assigned_date, completed_date, patient_id, task_id };
    const cleaned = Object.fromEntries(
      Object.entries(picked).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(cleaned).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    await pool.query("UPDATE PatientTaskAssignment SET ? WHERE assignment_id = ?", [
      cleaned,
      req.params.id
    ]);

    const [[updatedAssignment]] = await pool.query(
      "SELECT * FROM PatientTaskAssignment WHERE assignment_id = ?",
      [req.params.id]
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json(updatedAssignment);
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
