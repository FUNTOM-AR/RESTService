import express from "express";
import * as taskSessionController from "../controllers/taskSessionController.js";

const router = express.Router();

router.get("/", taskSessionController.getSessions);
router.post("/", taskSessionController.createSession);
router.patch("/:id", taskSessionController.updateSession);
router.delete("/:id", taskSessionController.deleteSession);

export default router;
