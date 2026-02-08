import express from "express";
import routes from "./routes/index.js";
import dotenv from "dotenv";
import { seedSchema } from "./services/database/seedSchema.js";

dotenv.config();

// Only seed if allowed
if (process.env.ALLOW_SEED_SCHEMA === "true") {
  await seedSchema();
}

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
