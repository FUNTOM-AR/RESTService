import { seedDatabase } from "../services/database/seedData.js";

export const seedTables = async (req, res) => {
  try {
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
