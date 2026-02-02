import express from "express";
import * as patientController from "../controllers/patientController.js";

const router = express.Router();

router.get("/", patientController.getPatients);
router.post("/", patientController.createPatient);
router.patch("/:id", patientController.updatePatient);
router.delete("/:id", patientController.deletePatient);

export default router;
