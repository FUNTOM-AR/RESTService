import { seedTables } from "../services/database/seed_data.js";

export const runSeed = async (req, res) => {
  try {
    const result = await seedTables();
    res.status(200).json({
      message: "Database seeded successfully",
      inserted: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Seeding failed", error: err.message });
  }
};
