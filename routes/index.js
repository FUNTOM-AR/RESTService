import express from "express";

import therapistRoutes from "./therapistRoutes.js";
import patientRoutes from "./patientRoutes.js";
import masterTaskTableRoutes from "./masterTaskTableRoutes.js";
import patientTaskAssignmentRoutes from "./patientTaskAssignmentRoutes.js";
import taskSessionRoutes from "./taskSessionRoutes.js";
import videoRecordingRoutes from "./videoRecordingRoutes.js";
import achievementsRoutes from "./achievementsRoutes.js";
import arm3DRoutes from "./arm3DRoutes.js";
import therapistNotesRoutes from "./therapistNotesRoutes.js";

const router = express.Router();

router.use("/therapists", therapistRoutes);
router.use("/patients", patientRoutes);
router.use("/masterTaskTable", masterTaskTableRoutes);
router.use("/patientTaskAssignment", patientTaskAssignmentRoutes);
router.use("/taskSession", taskSessionRoutes);
router.use("/videoRecording", videoRecordingRoutes);
router.use("/achievements", achievementsRoutes);
router.use("/arm3D", arm3DRoutes);
router.use("/therapistNotes", therapistNotesRoutes);

export default router;
