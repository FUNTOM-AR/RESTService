import fs from "fs";
import { pool } from "./database_connector.js";

const data = JSON.parse(fs.readFileSync("./seed_data.json"));
const conn = await pool.getConnection();
const q = (sql, params=[]) => conn.execute(sql, params);

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
  await q("INSERT INTO Therapist (name,email,password) VALUES (?,?,?)",
    [t.name,t.email,t.password]);
}

/* Patient */
for (const p of data.patients) {
  const [[ther]] = await q("SELECT therapist_id FROM Therapist WHERE email=?", [p.therapist_email]);
  await q(
    "INSERT INTO Patient (name,email,password,amputation_type,start_date,therapist_id) VALUES (?,?,?,?,?,?)",
    [p.name,p.email,p.password,p.amputation_type,p.start_date,ther.therapist_id]
  );
}

/* Tasks */
for (const t of data.tasks) {
  await q(
    "INSERT INTO MasterTaskTable (task_name,description,difficulty_default,time_limit) VALUES (?,?,?,?)",
    [t.task_name,t.description,t.difficulty_default,t.time_limit]
  );
}

/* Assignments */
for (const a of data.assignments) {
  const [[p]] = await q("SELECT patient_id FROM Patient WHERE email=?", [a.patient_email]);
  const [[t]] = await q("SELECT task_id FROM MasterTaskTable WHERE task_name=?", [a.task_name]);
  await q(
    "INSERT INTO PatientTaskAssignment (patient_id,task_id,status,assigned_date) VALUES (?,?,?,CURDATE())",
    [p.patient_id,t.task_id,a.status]
  );
}

/* Sessions */
for (const s of data.sessions) {
  const [[p]] = await q("SELECT patient_id FROM Patient WHERE email=?", [s.patient_email]);
  const [[t]] = await q("SELECT task_id FROM MasterTaskTable WHERE task_name=?", [s.task_name]);
  await q(
    "INSERT INTO TaskSession (completion_percentage,patient_id,task_id,start_time) VALUES (?,?,?,NOW())",
    [s.completion_percentage,p.patient_id,t.task_id]
  );
}

/* Achievements */
for (const a of data.achievements) {
  const [[p]] = await q("SELECT patient_id FROM Patient WHERE email=?", [a.patient_email]);
  await q(
    "INSERT INTO Achievements (title,description,earned_date,patient_id) VALUES (?,?,NOW(),?)",
    [a.title,a.description,p.patient_id]
  );
}

/* 3D_ARM */
for (const arm of data.arms) {
  const [[p]] = await q("SELECT patient_id FROM Patient WHERE email=?", [arm.patient_email]);
  await q(
    "INSERT INTO `3D_ARM` (Curl,Spread,patient_id) VALUES (?,?,?)",
    [arm.Curl,arm.Spread,p.patient_id]
  );
}

/* Notes */
for (const n of data.notes) {
  const [[p]] = await q("SELECT patient_id FROM Patient WHERE email=?", [n.patient_email]);
  const [[t]] = await q("SELECT therapist_id FROM Therapist WHERE email=?", [n.therapist_email]);
  await q(
    "INSERT INTO TherapistNotes (note_text,timestamp,patient_id,therapist_id) VALUES (?,NOW(),?,?)",
    [n.note_text,p.patient_id,t.therapist_id]
  );
}

conn.release();
