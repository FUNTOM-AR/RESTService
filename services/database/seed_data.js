import fs from "fs";
import { pool } from "./database_connector.js";

export async function seedDatabase() {
  const data = JSON.parse(fs.readFileSync("./seed_data.json"));
  const conn = await pool.getConnection();
  const q = (sql, params = []) => conn.execute(sql, params);

  const inserted = {
    therapists: [],
    patients: [],
    tasks: [],
    assignments: [],
    sessions: [],
    achievements: [],
    arms: [],
    notes: []
  };

  await q("SET FOREIGN_KEY_CHECKS=0");
  await q("DELETE FROM VideoRecording");
  await q("DELETE FROM TaskSession");
  await q("DELETE FROM PatientTaskAssignment");
  await q("DELETE FROM Achievements");
  await q("DELETE FROM `3D_ARM`");
  await q("DELETE FROM TherapistNotes");
  await q("DELETE FROM MasterTaskTable");
  await q("DELETE FROM Patient");
  await q("DELETE FROM Therapist");
  await q("SET FOREIGN_KEY_CHECKS=1");

  /* Therapist */
  for (const t of data.therapists) {
    const [res] = await q(
      "INSERT INTO Therapist (name,email,password) VALUES (?,?,?)",
      [t.name, t.email, t.password]
    );
    inserted.therapists.push({ id: res.insertId, ...t });
  }

  /* Patient */
  for (const p of data.patients) {
    const [[ther]] = await q("SELECT therapist_id FROM Therapist WHERE email=?", [
      p.therapist_email,
    ]);
    const [res] = await q(
      "INSERT INTO Patient (name,email,password,amputation_type,start_date,therapist_id) VALUES (?,?,?,?,?,?)",
      [p.name, p.email, p.password, p.amputation_type, p.start_date, ther.therapist_id]
    );
    inserted.patients.push({ id: res.insertId, ...p });
  }

  /* Tasks */
  for (const t of data.tasks) {
    const [res] = await q(
      "INSERT INTO MasterTaskTable (task_name,description,difficulty_default,time_limit) VALUES (?,?,?,?)",
      [t.task_name, t.description, t.difficulty_default, t.time_limit]
    );
    inserted.tasks.push({ id: res.insertId, ...t });
  }

  /* Assignments */
  for (const a of data.assignments) {
    const [[p]] = await q("SELECT patient_id FROM Patient WHERE email=?", [a.patient_email]);
    const [[t]] = await q("SELECT task_id FROM MasterTaskTable WHERE task_name=?", [a.task_name]);
    const [res] = await q(
      "INSERT INTO PatientTaskAssignment (patient_id,task_id,status,assigned_date) VALUES (?,?,?,CURDATE())",
      [p.patient_id, t.task_id, a.status]
    );
    inserted.assignments.push({ id: res.insertId, ...a });
  }

  /* Sessions */
  for (const s of data.sessions) {
    const [[p]] = await q("SELECT patient_id FROM Patient WHERE email=?", [s.patient_email]);
    const [[t]] = await q("SELECT task_id FROM MasterTaskTable WHERE task_name=?", [s.task_name]);
    const [res] = await q(
      "INSERT INTO TaskSession (completion_percentage,patient_id,task_id,start_time) VALUES (?,?,?,NOW())",
      [s.completion_percentage, p.patient_id, t.task_id]
    );
    inserted.sessions.push({ id: res.insertId, ...s });
  }

  /* Achievements */
  for (const a of data.achievements) {
    const [[p]] = await q("SELECT patient_id FROM Patient WHERE email=?", [a.patient_email]);
    const [res] = await q(
      "INSERT INTO Achievements (title,description,earned_date,patient_id) VALUES (?,?,NOW(),?)",
      [a.title, a.description, p.patient_id]
    );
    inserted.achievements.push({ id: res.insertId, ...a });
  }

  /* 3D_ARM */
  for (const arm of data.arms) {
    const [[p]] = await q("SELECT patient_id FROM Patient WHERE email=?", [arm.patient_email]);
    const [res] = await q(
      "INSERT INTO `3D_ARM` (Curl,Spread,patient_id) VALUES (?,?,?)",
      [arm.Curl, arm.Spread, p.patient_id]
    );
    inserted.arms.push({ id: res.insertId, ...arm });
  }

  /* Notes */
  for (const n of data.notes) {
    const [[p]] = await q("SELECT patient_id FROM Patient WHERE email=?", [n.patient_email]);
    const [[t]] = await q("SELECT therapist_id FROM Therapist WHERE email=?", [n.therapist_email]);
    const [res] = await q(
      "INSERT INTO TherapistNotes (note_text,timestamp,patient_id,therapist_id) VALUES (?,NOW(),?,?)",
      [n.note_text, p.patient_id, t.therapist_id]
    );
    inserted.notes.push({ id: res.insertId, ...n });
  }

  conn.release();
  return inserted;
}
