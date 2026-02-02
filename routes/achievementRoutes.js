import express from "express";
import * as achievementsController from "../controllers/achievementsController.js";

const router = express.Router();

router.get("/", achievementsController.getAchievements);
router.post("/", achievementsController.createAchievement);
router.patch("/:id", achievementsController.updateAchievement);
router.delete("/:id", achievementsController.deleteAchievement);

export default router;
