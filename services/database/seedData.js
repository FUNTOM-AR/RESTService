import fs from "node:fs/promises";
import { pool } from "./databaseService.js";

async function readSeedJson() {
  const raw = await fs.readFile("./seedData.json", "utf8");
  const json = JSON.parse(raw);

  if (!Array.isArray(json.seedTables) || !Array.isArray(json.seedData)) {
    throw new Error("Invalid seedData.json structure");
  }

  return json;
}


async function clearTables(conn, seedTables) {
  await conn.execute("SET FOREIGN_KEY_CHECKS = 0");
  try {
    for (const tableName of seedTables) {
      if (typeof tableName !== "string" || !tableName.trim()) continue;
      await conn.execute(`DELETE FROM \`${tableName}\``);
      await conn.execute(`ALTER TABLE \`${tableName}\` AUTO_INCREMENT = 1`);
    }
  } finally {
    await conn.execute("SET FOREIGN_KEY_CHECKS = 1");
  }
}

async function insertRecords(conn, tableName, records) {
  if (!Array.isArray(records) || records.length === 0) return;

  for (const record of records) {
    if (!record || typeof record !== "object") continue;

    const columns = Object.keys(record);
    if (columns.length === 0) continue;

    const placeholders = columns.map(() => "?").join(", ");
    const colSql = columns.map((c) => `\`${c}\``).join(", ");
    const values = columns.map((c) => record[c]);

    const sql = `INSERT INTO \`${tableName}\` (${colSql}) VALUES (${placeholders})`;
    await conn.execute(sql, values);
  }
}

async function seedAllData(conn, seedData) {
  for (const entry of seedData) {
    if (!entry || typeof entry !== "object") continue;

    const tableName = entry.tableName;
    const records = entry.records;

    if (typeof tableName !== "string" || !tableName.trim()) continue;
    await insertRecords(conn, tableName, records);
  }
}

export async function seedDatabase() {
  const conn = await pool.getConnection();
  try {
    const { seedTables, seedData } = await readSeedJson();

    await conn.beginTransaction();
    await clearTables(conn, seedTables);
    await seedAllData(conn, seedData);
    await conn.commit();
  } catch (err) {
    try {
      await conn.rollback();
    } catch {}
    throw err;
  } finally {
    conn.release();
  }
}