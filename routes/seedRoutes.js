import { Router } from "express";
import { runSeed } from "../controllers/seedController.js";

const router = Router();

router.post("/seed", runSeed);

export default router;
