import express from "express";
import * as patientTaskAssignmentController from "../controllers/patientTaskAssignmentController.js";

const router = express.Router();

router.get("/", patientTaskAssignmentController.getAssignments);
router.post("/", patientTaskAssignmentController.createAssignment);
router.patch("/:id", patientTaskAssignmentController.updateAssignment);
router.delete("/:id", patientTaskAssignmentController.deleteAssignment);

export default router;
