import express from "express";
import * as videoRecordingController from "../controllers/videoRecordingController.js";

const router = express.Router();

router.get("/", videoRecordingController.getRecordings);
router.post("/", videoRecordingController.createRecording);
router.patch("/:id", videoRecordingController.updateRecording);
router.delete("/:id", videoRecordingController.deleteRecording);

export default router;
