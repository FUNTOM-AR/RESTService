import { pool } from "../services/database/databaseService.js";

export async function getMasterTasks(req,res){
  const [rows]=await pool.query("SELECT * FROM MasterTaskTable");
  res.json(rows);
}

export async function createMasterTask(req,res){
  const {task_name,description,difficulty_default,time_limit}=req.body;
  await pool.query(
    "INSERT INTO MasterTaskTable (task_name,description,difficulty_default,time_limit) VALUES (?,?,?,?)",
    [task_name,description,difficulty_default,time_limit]
  );
  res.sendStatus(201);
}

export async function updateMasterTask(req,res){
  await pool.query("UPDATE MasterTaskTable SET ? WHERE task_id=?",[req.body,req.params.id]);
  res.sendStatus(200);
}

export async function deleteMasterTask(req,res){
  await pool.query("DELETE FROM MasterTaskTable WHERE task_id=?",[req.params.id]);
  res.sendStatus(200);
}
