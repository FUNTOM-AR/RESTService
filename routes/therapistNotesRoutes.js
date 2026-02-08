import express from "express";
import * as therapistNotesController from "../controllers/therapistNotesController.js";

const router = express.Router();

router.get("/", therapistNotesController.getNotes);
router.post("/", therapistNotesController.createNote);
router.patch("/:id", therapistNotesController.updateNote);
router.delete("/:id", therapistNotesController.deleteNote);

export default router;
