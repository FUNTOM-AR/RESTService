import { pool } from "../services/databaseService.js";

export async function getNotes(req,res){
  const [rows]=await pool.query("SELECT * FROM TherapistNotes");
  res.json(rows);
}

export async function createNote(req,res){
  const {note_text,timestamp,patient_id,therapist_id}=req.body;
  await pool.query(
    "INSERT INTO TherapistNotes (note_text,timestamp,patient_id,therapist_id) VALUES (?,?,?,?)",
    [note_text,timestamp,patient_id,therapist_id]
  );
  res.sendStatus(201);
}

export async function updateNote(req,res){
  await pool.query("UPDATE TherapistNotes SET ? WHERE note_id=?",[req.body,req.params.id]);
  res.sendStatus(200);
}

export async function deleteNote(req,res){
  await pool.query("DELETE FROM TherapistNotes WHERE note_id=?",[req.params.id]);
  res.sendStatus(200);
}
