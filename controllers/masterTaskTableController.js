import { pool } from "../services/database/databaseService.js";

export async function getMasterTasks(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM MasterTaskTable");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get master tasks", error: err.message });
  }
}

export async function createMasterTask(req, res) {
  try {
    const { task_name, description, difficulty_default, time_limit } = req.body;
    await pool.query(
      "INSERT INTO MasterTaskTable (task_name,description,difficulty_default,time_limit) VALUES (?,?,?,?)",
      [task_name, description, difficulty_default, time_limit]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create master task", error: err.message });
  }
}

export async function updateMasterTask(req, res) {
  try {
    await pool.query("UPDATE MasterTaskTable SET ? WHERE task_id=?", [req.body, req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update master task", error: err.message });
  }
}

export async function deleteMasterTask(req, res) {
  try {
    await pool.query("DELETE FROM MasterTaskTable WHERE task_id=?", [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete master task", error: err.message });
  }
}
