import { pool } from "../services/database/databaseService.js";

export async function getTherapists(req,res){
  try{
    const [rows]=await pool.query("SELECT * FROM Therapist");
    res.json(rows);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}

export async function createTherapist(req,res){
  try{
    const {name,email,password}=req.body;
    await pool.query("INSERT INTO Therapist (name,email,password) VALUES (?,?,?)",[name,email,password]);
    res.sendStatus(201);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}

export async function updateTherapist(req,res){
  try{
    await pool.query("UPDATE Therapist SET ? WHERE therapist_id=?",[req.body,req.params.id]);
    res.sendStatus(200);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}

export async function deleteTherapist(req,res){
  try{
    await pool.query("DELETE FROM Therapist WHERE therapist_id=?",[req.params.id]);
    res.sendStatus(200);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}
