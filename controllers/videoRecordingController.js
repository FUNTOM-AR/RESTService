import { pool } from "../services/database/databaseService.js";

export async function getRecordings(req,res){
  try{
    const [rows]=await pool.query("SELECT * FROM VideoRecording");
    res.json(rows);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}

export async function createRecording(req,res){
  try{
    const {video_path,recorded_at,session_id}=req.body;
    await pool.query(
      "INSERT INTO VideoRecording (video_path,recorded_at,session_id) VALUES (?,?,?)",
      [video_path,recorded_at,session_id]
    );
    res.sendStatus(201);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}

export async function updateRecording(req,res){
  try{
    await pool.query("UPDATE VideoRecording SET ? WHERE recording_id=?",[req.body,req.params.id]);
    res.sendStatus(200);
  }catch(err){
    res.status(500).json({ error: err.message });
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
