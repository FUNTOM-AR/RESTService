import express from "express";
import routes from "./routes/index.js";
import dotenv from "dotenv";

dotenv.config();

if (process.env.USE_SEED === "true") {
  await import("./services/database/seedSchema.js");
}

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
