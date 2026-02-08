import { seedDatabase } from "../services/database/seedData.js";

export const seedTables = async (req, res) => {
  try {
    if (process.env.ALLOW_SEED_DATA !== "true") {
      return res.status(403).json({
        message: "Seeding not allowed by environment configuration"
      });
    }

    const result = await seedDatabase();
    res.status(200).json({
      message: "Database seeded successfully",
      inserted: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Seeding failed", error: err.message });
  }
};
