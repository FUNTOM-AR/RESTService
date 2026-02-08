import { pool } from "../services/database/databaseService.js";

export async function getRecordings(req,res){
  try{
    const [rows]=await pool.query("SELECT * FROM VideoRecording");
    res.json(rows);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}
export async function createRecording(req, res) {
  try {
    const { video_path, recorded_at, session_id } = req.body;

    const [result] = await pool.query(
      "INSERT INTO VideoRecording (video_path, recorded_at, session_id) VALUES (?,?,?)",
      [video_path, recorded_at, session_id]
    );

    // Fetch the inserted record
    const [[recording]] = await pool.query(
      "SELECT * FROM VideoRecording WHERE recording_id = ?",
      [result.insertId]
    );

    res.status(201).json(recording);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateRecording(req, res) {
  try {
    const { video_path, recorded_at, session_id } = req.body;

    const picked = { video_path, recorded_at, session_id };
    const cleaned = Object.fromEntries(
      Object.entries(picked).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(cleaned).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    await pool.query("UPDATE VideoRecording SET ? WHERE recording_id = ?", [cleaned, req.params.id]);

    const [[updatedRecording]] = await pool.query(
      "SELECT * FROM VideoRecording WHERE recording_id = ?",
      [req.params.id]
    );

    res.status(200).json(updatedRecording);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update recording", error: err.message });
  }
}

export async function deleteRecording(req,res){
  try{
    await pool.query("DELETE FROM VideoRecording WHERE recording_id=?",[req.params.id]);
    res.sendStatus(200);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}
