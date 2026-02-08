import { pool } from "../services/database/databaseService.js";

export async function getSessions(req,res){
  const [rows]=await pool.query("SELECT * FROM TaskSession");
  res.json(rows);
}

export async function createSession(req,res){
  const {completion_percentage,start_time,end_time,pain_before,pain_after,patient_id,task_id}=req.body;
  await pool.query(
    "INSERT INTO TaskSession (completion_percentage,start_time,end_time,pain_before,pain_after,patient_id,task_id) VALUES (?,?,?,?,?,?,?)",
    [completion_percentage,start_time,end_time,pain_before,pain_after,patient_id,task_id]
  );
  res.sendStatus(201);
}

export async function updateSession(req,res){
  await pool.query("UPDATE TaskSession SET ? WHERE session_id=?",[req.body,req.params.id]);
  res.sendStatus(200);
}

export async function deleteSession(req,res){
  await pool.query("DELETE FROM TaskSession WHERE session_id=?",[req.params.id]);
  res.sendStatus(200);
}
