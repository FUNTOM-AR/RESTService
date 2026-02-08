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
    // Pick only the allowed fields
    const { Female_arm, Mascul_ar, Curl, Spread, Male_skin, Female_skin, Dark_skin, Old_skin, Arm_Hairs, Corrective, patient_id } = req.body;
    const picked = { Female_arm, Mascul_ar, Curl, Spread, Male_skin, Female_skin, Dark_skin, Old_skin, Arm_Hairs, Corrective, patient_id };

    // Insert
    const [result] = await pool.query("INSERT INTO `3D_ARM` SET ?", [picked]);

    // Fetch inserted
    const [[arm]] = await pool.query(
      "SELECT * FROM `3D_ARM` WHERE arm_id = ?",
      [result.insertId]
    );

    res.status(201).json(arm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create arm", error: err.message });
  }
}

export async function updateArm(req, res) {
  try {
    // Pick only the allowed fields and clean undefined/null
    const { Female_arm, Mascul_ar, Curl, Spread, Male_skin, Female_skin, Dark_skin, Old_skin, Arm_Hairs, Corrective, patient_id } = req.body;
    const picked = { Female_arm, Mascul_ar, Curl, Spread, Male_skin, Female_skin, Dark_skin, Old_skin, Arm_Hairs, Corrective, patient_id };
    const cleaned = Object.fromEntries(Object.entries(picked).filter(([, v]) => v != null));

    if (Object.keys(cleaned).length === 0) {
      return res.status(400).json({ message: "No valid fields provided to update" });
    }

    // Update
    await pool.query("UPDATE `3D_ARM` SET ? WHERE arm_id = ?", [cleaned, req.params.id]);

    // Fetch updated
    const [[arm]] = await pool.query(
      "SELECT * FROM `3D_ARM` WHERE arm_id = ?",
      [req.params.id]
    );

    res.status(200).json(arm);
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
