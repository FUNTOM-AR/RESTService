import "../seed_data.js";

export async function seedTables(req, res) {
  await import("../seed_data.js");
  res.json({ message: "Database seeded" });
}
