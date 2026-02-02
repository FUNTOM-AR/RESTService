import express from "express";
import * as arm3DController from "../controllers/arm3DController.js";

const router = express.Router();

router.get("/", arm3DController.getArms);
router.post("/", arm3DController.createArm);
router.patch("/:id", arm3DController.updateArm);
router.delete("/:id", arm3DController.deleteArm);

export default router;
