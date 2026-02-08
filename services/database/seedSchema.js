import { pool } from "./databaseConnector.js";

const conn = await pool.getConnection();

async function seedSchema() {
  const q = async (sql) => conn.execute(sql);

  await q(`SET FOREIGN_KEY_CHECKS = 0`);

  // Drop in safe order (quoted because of special chars)
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

  // MasterTaskTable
  await q(`
    CREATE TABLE \`MasterTaskTable\` (
      \`task_id\` INT NOT NULL AUTO_INCREMENT,
      \`task_name\` VARCHAR(255) NOT NULL,
      \`description\` TEXT NULL,
      \`difficulty_default\` VARCHAR(255) NULL,
      \`time_limit\` INT NULL,
      PRIMARY KEY (\`task_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // PatientTaskAssignment
  await q(`
    CREATE TABLE \`PatientTaskAssignment\` (
      \`assignment_id\` INT NOT NULL AUTO_INCREMENT,
      \`order_index\` INT NULL,
      \`status\` ENUM('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
      \`assigned_date\` DATE NULL,
      \`completed_date\` DATE NULL,
      \`patient_id\` INT NOT NULL,
      \`task_id\` INT NOT NULL,
      PRIMARY KEY (\`assignment_id\`),
      KEY \`idx_pta_patient\` (\`patient_id\`),
      KEY \`idx_pta_task\` (\`task_id\`),
      KEY \`idx_pta_status\` (\`status\`),
      CONSTRAINT \`fk_pta_patient\`
        FOREIGN KEY (\`patient_id\`) REFERENCES \`Patient\`(\`patient_id\`)
        ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT \`fk_pta_task\`
        FOREIGN KEY (\`task_id\`) REFERENCES \`MasterTaskTable\`(\`task_id\`)
        ON DELETE RESTRICT ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // TaskSession
  await q(`
    CREATE TABLE \`TaskSession\` (
      \`session_id\` INT NOT NULL AUTO_INCREMENT,
      \`completion_percentage\` INT NULL,
      \`start_time\` TIMESTAMP NULL,
      \`end_time\` TIMESTAMP NULL,
      \`pain_before\` INT NULL,
      \`pain_after\` INT NULL,
      \`patient_id\` INT NOT NULL,
      \`task_id\` INT NOT NULL,
      PRIMARY KEY (\`session_id\`),
      KEY \`idx_ts_patient\` (\`patient_id\`),
      KEY \`idx_ts_task\` (\`task_id\`),
      CONSTRAINT \`fk_ts_patient\`
        FOREIGN KEY (\`patient_id\`) REFERENCES \`Patient\`(\`patient_id\`)
        ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT \`fk_ts_task\`
        FOREIGN KEY (\`task_id\`) REFERENCES \`MasterTaskTable\`(\`task_id\`)
        ON DELETE RESTRICT ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // VideoRecording
  await q(`
    CREATE TABLE \`VideoRecording\` (
      \`recording_id\` INT NOT NULL AUTO_INCREMENT,
      \`video_path\` TEXT NOT NULL,
      \`recorded_at\` TIMESTAMP NULL,
      \`session_id\` INT NOT NULL,
      PRIMARY KEY (\`recording_id\`),
      KEY \`idx_vr_session\` (\`session_id\`),
      CONSTRAINT \`fk_vr_session\`
        FOREIGN KEY (\`session_id\`) REFERENCES \`TaskSession\`(\`session_id\`)
        ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Achievements
  await q(`
    CREATE TABLE \`Achievements\` (
      \`achievement_id\` INT NOT NULL AUTO_INCREMENT,
      \`title\` VARCHAR(255) NOT NULL,
      \`description\` TEXT NULL,
      \`earned_date\` TIMESTAMP NULL,
      \`patient_id\` INT NOT NULL,
      PRIMARY KEY (\`achievement_id\`),
      KEY \`idx_ach_patient\` (\`patient_id\`),
      CONSTRAINT \`fk_ach_patient\`
        FOREIGN KEY (\`patient_id\`) REFERENCES \`Patient\`(\`patient_id\`)
        ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // 3D_ARM (table name starts with digit, so must be quoted)
  await q(`
    CREATE TABLE \`3D_ARM\` (
      \`arm_id\` INT NOT NULL AUTO_INCREMENT,
      \`Female_arm\` INT NULL,
      \`Mascul_ar\` INT NULL,
      \`Curl\` INT NULL,
      \`Spread\` INT NULL,
      \`Male_skin\` INT NULL,
      \`Female_skin\` INT NULL,
      \`Dark_skin\` INT NULL,
      \`Old_skin\` INT NULL,
      \`Arm_Hairs\` INT NULL,
      \`Corrective\` INT NULL,
      \`patient_id\` INT NOT NULL,
      PRIMARY KEY (\`arm_id\`),
      KEY \`idx_arm_patient\` (\`patient_id\`),
      CONSTRAINT \`fk_arm_patient\`
        FOREIGN KEY (\`patient_id\`) REFERENCES \`Patient\`(\`patient_id\`)
        ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // TherapistNotes
  await q(`
    CREATE TABLE \`TherapistNotes\` (
      \`note_id\` INT NOT NULL AUTO_INCREMENT,
      \`note_text\` TEXT NOT NULL,
      \`timestamp\` TIMESTAMP NULL,
      \`patient_id\` INT NOT NULL,
      \`therapist_id\` INT NOT NULL,
      PRIMARY KEY (\`note_id\`),
      KEY \`idx_notes_patient\` (\`patient_id\`),
      KEY \`idx_notes_therapist\` (\`therapist_id\`),
      CONSTRAINT \`fk_notes_patient\`
        FOREIGN KEY (\`patient_id\`) REFERENCES \`Patient\`(\`patient_id\`)
        ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT \`fk_notes_therapist\`
        FOREIGN KEY (\`therapist_id\`) REFERENCES \`Therapist\`(\`therapist_id\`)
        ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

await seedSchema();