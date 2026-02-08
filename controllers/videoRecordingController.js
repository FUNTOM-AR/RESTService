import { pool } from "../services/database/databaseService.js";

export async function getRecordings(req,res){
  const [rows]=await pool.query("SELECT * FROM VideoRecording");
  res.json(rows);
}

export async function createRecording(req,res){
  const {video_path,recorded_at,session_id}=req.body;
  await pool.query(
    "INSERT INTO VideoRecording (video_path,recorded_at,session_id) VALUES (?,?,?)",
    [video_path,recorded_at,session_id]
  );
  res.sendStatus(201);
}

export async function updateRecording(req,res){
  await pool.query("UPDATE VideoRecording SET ? WHERE recording_id=?",[req.body,req.params.id]);
  res.sendStatus(200);
}

export async function deleteRecording(req,res){
  await pool.query("DELETE FROM VideoRecording WHERE recording_id=?",[req.params.id]);
  res.sendStatus(200);
}
