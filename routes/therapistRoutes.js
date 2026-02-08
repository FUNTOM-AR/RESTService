import express from "express";
import * as therapistController from "../controllers/therapistController.js";

const router = express.Router();

router.get("/", therapistController.getTherapists);
router.post("/", therapistController.createTherapist);
router.patch("/:id", therapistController.updateTherapist);
router.delete("/:id", therapistController.deleteTherapist);

export default router;
