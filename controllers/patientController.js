import { pool } from "../services/database/databaseService.js";

export async function getPatients(req,res){
  const [rows]=await pool.query("SELECT * FROM Patient");
  res.json(rows);
}

export async function createPatient(req,res){
  const {name,email,password,amputation_type,start_date,therapist_id}=req.body;
  await pool.query(
    "INSERT INTO Patient (name,email,password,amputation_type,start_date,therapist_id) VALUES (?,?,?,?,?,?)",
    [name,email,password,amputation_type,start_date,therapist_id]
  );
  res.sendStatus(201);
}

export async function updatePatient(req,res){
  await pool.query("UPDATE Patient SET ? WHERE patient_id=?",[req.body,req.params.id]);
  res.sendStatus(200);
}

export async function deletePatient(req,res){
  await pool.query("DELETE FROM Patient WHERE patient_id=?",[req.params.id]);
  res.sendStatus(200);
}
