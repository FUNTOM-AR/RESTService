import { Router } from "express";
import { seedTables } from "../controllers/seedController.js";

const router = Router();

router.post("/seed", seedTables);

export default router;
