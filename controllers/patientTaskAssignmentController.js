import { pool } from "../services/database/databaseService.js";

export async function getAssignments(req,res){
  const [rows]=await pool.query("SELECT * FROM PatientTaskAssignment");
  res.json(rows);
}

export async function createAssignment(req,res){
  const {order_index,status,assigned_date,completed_date,patient_id,task_id}=req.body;
  await pool.query(
    "INSERT INTO PatientTaskAssignment (order_index,status,assigned_date,completed_date,patient_id,task_id) VALUES (?,?,?,?,?,?)",
    [order_index,status,assigned_date,completed_date,patient_id,task_id]
  );
  res.sendStatus(201);
}

export async function updateAssignment(req,res){
  await pool.query("UPDATE PatientTaskAssignment SET ? WHERE assignment_id=?",[req.body,req.params.id]);
  res.sendStatus(200);
}

export async function deleteAssignment(req,res){
  await pool.query("DELETE FROM PatientTaskAssignment WHERE assignment_id=?",[req.params.id]);
  res.sendStatus(200);
}
