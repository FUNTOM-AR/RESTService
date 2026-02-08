import { pool } from "../services/database/databaseService.js";

export async function getNotes(req,res){
  try{
    const [rows]=await pool.query("SELECT * FROM TherapistNotes");
    res.json(rows);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}

export async function createNote(req, res) {
  try {
    const { note_text, timestamp, patient_id, therapist_id } = req.body;

    const [result] = await pool.query(
      "INSERT INTO TherapistNotes (note_text, timestamp, patient_id, therapist_id) VALUES (?,?,?,?)",
      [note_text, timestamp, patient_id, therapist_id]
    );

    // Fetch the inserted record
    const [[note]] = await pool.query(
      "SELECT * FROM TherapistNotes WHERE note_id = ?",
      [result.insertId]
    );

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function updateNote(req, res) {
  try {
    const { note_text, timestamp, patient_id, therapist_id } = req.body;

    const picked = { note_text, timestamp, patient_id, therapist_id };
    const cleaned = Object.fromEntries(
      Object.entries(picked).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(cleaned).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    await pool.query("UPDATE TherapistNotes SET ? WHERE note_id = ?", [cleaned, req.params.id]);

    const [[updatedNote]] = await pool.query(
      "SELECT * FROM TherapistNotes WHERE note_id = ?",
      [req.params.id]
    );

    res.status(200).json(updatedNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update note", error: err.message });
  }
}

export async function deleteNote(req,res){
  try{
    await pool.query("DELETE FROM TherapistNotes WHERE note_id=?",[req.params.id]);
    res.sendStatus(200);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}
