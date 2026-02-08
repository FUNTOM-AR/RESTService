import { pool } from "./databaseService.js";

const conn = await pool.getConnection();

const expectedTables = [
  "VideoRecording",
  "TaskSession",
  "PatientTaskAssignment",
  "Achievements",
  "3D_ARM",
  "TherapistNotes",
  "MasterTaskTable",
  "Patient",
  "Therapist"
];

// Function to check if any expected table is missing
async function checkMissingTables() {
  const missingTables = [];

  for (const table of expectedTables) {
    const [rows] = await conn.execute(`SHOW TABLES LIKE ?`, [table]);
    if (rows.length === 0) {
      missingTables.push(table);
    }
  }

  return missingTables;
}

async function seedSchema() {
  const q = async (sql) => conn.execute(sql);

  // Check for missing tables first
  const missing = await checkMissingTables();

  if (missing.length === 0) {
    console.log("All tables exist. No need to drop or recreate.");
    return;
  } else {
    console.log("Missing tables detected:", missing);
    console.log("Dropping and recreating all tables...");
  }

  await q(`SET FOREIGN_KEY_CHECKS = 0`);

  // Drop tables safely
  await q(`DROP TABLE IF EXISTS \`VideoRecording\``);
  await q(`DROP TABLE IF EXISTS \`TaskSession\``);
  await q(`DROP TABLE IF EXISTS \`PatientTaskAssignment\``);
  await q(`DROP TABLE IF EXISTS \`Achievements\``);
  await q(`DROP TABLE IF EXISTS \`3D_ARM\``);
  await q(`DROP TABLE IF EXISTS \`TherapistNotes\``);
  await q(`DROP TABLE IF EXISTS \`MasterTaskTable\``);
  await q(`DROP TABLE IF EXISTS \`Patient\``);
  await q(`DROP TABLE IF EXISTS \`Therapist\``);

  await q(`SET FOREIGN_KEY_CHECKS = 1`);

  // Then create all tables exactly as in your original script
  // Therapist
  await q(`
    CREATE TABLE \`Therapist\` (
      \`therapist_id\` INT NOT NULL AUTO_INCREMENT,
      \`name\` VARCHAR(255) NOT NULL,
      \`email\` VARCHAR(255) NOT NULL,
      \`password\` VARCHAR(255) NOT NULL,
      PRIMARY KEY (\`therapist_id\`),
      UNIQUE KEY \`uq_therapist_email\` (\`email\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Patient
  await q(`
    CREATE TABLE \`Patient\` (
      \`patient_id\` INT NOT NULL AUTO_INCREMENT,
      \`name\` VARCHAR(255) NOT NULL,
      \`email\` VARCHAR(255) NOT NULL,
      \`password\` VARCHAR(255) NOT NULL,
      \`amputation_type\` ENUM('below_elbow','above_elbow','shoulder') NOT NULL,
      \`start_date\` DATE NULL,
      \`therapist_id\` INT NULL,
      PRIMARY KEY (\`patient_id\`),
      KEY \`idx_patient_therapist\` (\`therapist_id\`),
      CONSTRAINT \`fk_patient_therapist\`
        FOREIGN KEY (\`therapist_id\`) REFERENCES \`Therapist\`(\`therapist_id\`)
        ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // ... continue with the rest of your CREATE TABLE statements
  // MasterTaskTable, PatientTaskAssignment, TaskSession, VideoRecording,
  // Achievements, 3D_ARM, TherapistNotes
}

await seedSchema();
conn.release();
