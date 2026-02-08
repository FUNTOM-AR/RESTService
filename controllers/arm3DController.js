import { pool } from "../services/database/databaseService.js";

export async function getArms(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM `3D_ARM`");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get arms", error: err.message });
  }
}

export async function createArm(req, res) {
  try {
    await pool.query("INSERT INTO `3D_ARM` SET ?", [req.body]);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create arm", error: err.message });
  }
}

export async function updateArm(req, res) {
  try {
    await pool.query("UPDATE `3D_ARM` SET ? WHERE arm_id=?", [req.body, req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update arm", error: err.message });
  }
}

export async function deleteArm(req, res) {
  try {
    await pool.query("DELETE FROM `3D_ARM` WHERE arm_id=?", [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete arm", error: err.message });
  }
}
