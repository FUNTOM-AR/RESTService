import { pool } from "../services/database/databaseService.js";

export async function getTherapists(req,res){
  const [rows]=await pool.query("SELECT * FROM Therapist");
  res.json(rows);
}

export async function createTherapist(req,res){
  const {name,email,password}=req.body;
  await pool.query("INSERT INTO Therapist (name,email,password) VALUES (?,?,?)",[name,email,password]);
  res.sendStatus(201);
}

export async function updateTherapist(req,res){
  await pool.query("UPDATE Therapist SET ? WHERE therapist_id=?",[req.body,req.params.id]);
  res.sendStatus(200);
}

export async function deleteTherapist(req,res){
  await pool.query("DELETE FROM Therapist WHERE therapist_id=?",[req.params.id]);
  res.sendStatus(200);
}
