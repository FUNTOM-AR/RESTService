import { pool } from "../services/database/databaseService.js";

export async function getTherapists(req,res){
  try{
    const [rows]=await pool.query("SELECT * FROM Therapist");
    res.json(rows);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}

export async function createTherapist(req, res) {
  try {
    const { name, user_id} = req.body;
    const [result] = await pool.query(
      "INSERT INTO Therapist (name , user_id) VALUES (?,?)",
      [name]
    );

    // Fetch the inserted record
    const [[therapist]] = await pool.query(
      "SELECT * FROM Therapist WHERE therapist_id = ?",
      [result.insertId]
    );

    res.status(201).json(therapist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateTherapist(req, res) {
  try {
    const {name,user_id} = req.body;

    const picked = { name,user_id};
    const cleaned = Object.fromEntries(
      Object.entries(picked).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(cleaned).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    await pool.query("UPDATE Therapist SET ? WHERE therapist_id = ?", [cleaned, req.params.id]);

    const [[updatedTherapist]] = await pool.query(
      "SELECT * FROM Therapist WHERE therapist_id = ?",
      [req.params.id]
    );

    res.status(200).json(updatedTherapist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update therapist", error: err.message });
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
