import { pool } from "../services/database/databaseService.js";

export async function getSessions(req,res){
  try{
    const [rows]=await pool.query("SELECT * FROM TaskSession");
    res.json(rows);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}

export async function createSession(req, res) {
  try {
    const { completion_percentage, start_time, end_time, pain_before, pain_after, patient_id, task_id } = req.body;

    const [result] = await pool.query(
      "INSERT INTO TaskSession (completion_percentage, start_time, end_time, pain_before, pain_after, patient_id, task_id) VALUES (?,?,?,?,?,?,?)",
      [completion_percentage, start_time, end_time, pain_before, pain_after, patient_id, task_id]
    );

    // Fetch the inserted record
    const [[session]] = await pool.query(
      "SELECT * FROM TaskSession WHERE session_id = ?",
      [result.insertId]
    );

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function updateSession(req, res) {
  try {
    const { completion_percentage, start_time, end_time, pain_before, pain_after, patient_id, task_id } = req.body;

    const picked = { completion_percentage, start_time, end_time, pain_before, pain_after, patient_id, task_id };
    const cleaned = Object.fromEntries(
      Object.entries(picked).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(cleaned).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    await pool.query("UPDATE TaskSession SET ? WHERE session_id = ?", [cleaned, req.params.id]);

    const [[updatedSession]] = await pool.query(
      "SELECT * FROM TaskSession WHERE session_id = ?",
      [req.params.id]
    );

    res.status(200).json(updatedSession);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update session", error: err.message });
  }
}

export async function deleteSession(req,res){
  try{
    await pool.query("DELETE FROM TaskSession WHERE session_id=?",[req.params.id]);
    res.sendStatus(200);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}
