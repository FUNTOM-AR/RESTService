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

    const [result] = await pool.query(
      "INSERT INTO MasterTaskTable (task_name,description,difficulty_default,time_limit) VALUES (?,?,?,?)",
      [task_name, description, difficulty_default, time_limit]
    );

    // Fetch the inserted task
    const [[task]] = await pool.query(
      "SELECT * FROM MasterTaskTable WHERE task_id = ?",
      [result.insertId]
    );

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create master task", error: err.message });
  }
}

export async function updateMasterTask(req, res) {
  try {
    const { task_name, description, difficulty_default, time_limit } = req.body;

    const picked = { task_name, description, difficulty_default, time_limit };
    const cleaned = Object.fromEntries(
      Object.entries(picked).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(cleaned).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    await pool.query("UPDATE MasterTaskTable SET ? WHERE task_id = ?", [
      cleaned,
      req.params.id
    ]);

    const [[updatedTask]] = await pool.query(
      "SELECT * FROM MasterTaskTable WHERE task_id = ?",
      [req.params.id]
    );

    res.status(200).json(updatedTask);
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
