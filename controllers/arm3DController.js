import { pool } from "../services/database/databaseService.js";

export async function getArms(req,res){
  const [rows]=await pool.query("SELECT * FROM `3D_ARM`");
  res.json(rows);
}

export async function createArm(req,res){
  await pool.query("INSERT INTO `3D_ARM` SET ?",[req.body]);
  res.sendStatus(201);
}

export async function updateArm(req,res){
  await pool.query("UPDATE `3D_ARM` SET ? WHERE arm_id=?",[req.body,req.params.id]);
  res.sendStatus(200);
}

export async function deleteArm(req,res){
  await pool.query("DELETE FROM `3D_ARM` WHERE arm_id=?",[req.params.id]);
  res.sendStatus(200);
}
