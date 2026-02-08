import { pool } from "../services/database/databaseService.js";

export async function getAchievements(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM Achievements");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get achievements", error: err.message });
  }
}

export async function createAchievement(req, res) {
  try {
    const { title, description, earned_date, patient_id } = req.body;
    const [result] = await pool.query(
      "INSERT INTO Achievements (title,description,earned_date,patient_id) VALUES (?,?,?,?)",
      [title, description, earned_date, patient_id]
    );

    // Fetch the inserted achievement
    const [[achievement]] = await pool.query(
      "SELECT * FROM Achievements WHERE achievement_id = ?",
      [result.insertId]
    );

    res.status(201).json(achievement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create achievement", error: err.message });
  }
}

export async function updateAchievement(req, res) {
  try {
    const { title, description, earned_date, patient_id } = req.body;

    const picked = { title, description, earned_date, patient_id };

    const cleaned = Object.fromEntries(
      Object.entries(picked).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(cleaned).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    await pool.query(
      "UPDATE Achievements SET ? WHERE achievement_id = ?",
      [cleaned, req.params.id]
    );

    const [[updatedAchievement]] = await pool.query(
      "SELECT * FROM Achievements WHERE achievement_id = ?",
      [req.params.id]
    );

    res.status(200).json(updatedAchievement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update achievement", error: err.message });
  }
}


export async function deleteAchievement(req, res) {
  try {
    await pool.query("DELETE FROM Achievements WHERE achievement_id=?", [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete achievement", error: err.message });
  }
}
