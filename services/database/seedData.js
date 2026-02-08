import fs from "node:fs/promises";
import { pool } from "./databaseService.js";

async function readSeedJson() {
  const raw = await fs.readFile("./services/database/seedData.json", "utf8");
  const json = JSON.parse(raw);

  if (!Array.isArray(json.seedTables) || !Array.isArray(json.seedData)) {
    throw new Error("seedData.json must contain seedTables[] and seedData[]");
  }

  return json;
}

async function clearTables(conn, seedTables) {
  await conn.execute("SET FOREIGN_KEY_CHECKS = 0");
  try {
    for (const tableName of seedTables) {
      await conn.execute(`DELETE FROM \`${tableName}\``);
      await conn.execute(`ALTER TABLE \`${tableName}\` AUTO_INCREMENT = 1`);
    }
  } finally {
    await conn.execute("SET FOREIGN_KEY_CHECKS = 1");
  }
}

async function insertRecords(conn, tableName, records) {
  let inserted = 0;

  if (!Array.isArray(records) || records.length === 0) {
    return inserted;
  }

  for (const record of records) {
    const columns = Object.keys(record);
    if (columns.length === 0) continue;

    const placeholders = columns.map(() => "?").join(", ");
    const colSql = columns.map((c) => `\`${c}\``).join(", ");
    const values = columns.map((c) => record[c]);

    const sql = `INSERT INTO \`${tableName}\` (${colSql}) VALUES (${placeholders})`;
    await conn.execute(sql, values);
    inserted++;
  }

  return inserted;
}

export async function seedDatabase() {
  const conn = await pool.getConnection();
  const result = [];

  try {
    const { seedTables, seedData } = await readSeedJson();

    await conn.beginTransaction();

    await clearTables(conn, seedTables);

    for (const { tableName, records } of seedData) {
      const count = await insertRecords(conn, tableName, records);
      result.push({ tableName, recordCount: count });
    }

    await conn.commit();
    return result;
  } catch (err) {
    try {
      await conn.rollback();
    } catch {}
    throw err;
  } finally {
    conn.release();
  }
}