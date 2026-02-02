import { pool } from "../services/databaseService.js";

export async function getAchievements(req,res){
  const [rows]=await pool.query("SELECT * FROM Achievements");
  res.json(rows);
}

export async function createAchievement(req,res){
  const {title,description,earned_date,patient_id}=req.body;
  await pool.query(
    "INSERT INTO Achievements (title,description,earned_date,patient_id) VALUES (?,?,?,?)",
    [title,description,earned_date,patient_id]
  );
  res.sendStatus(201);
}

export async function updateAchievement(req,res){
  await pool.query("UPDATE Achievements SET ? WHERE achievement_id=?",[req.body,req.params.id]);
  res.sendStatus(200);
}

export async function deleteAchievement(req,res){
  await pool.query("DELETE FROM Achievements WHERE achievement_id=?",[req.params.id]);
  res.sendStatus(200);
}
