import express from "express";
import * as masterTaskTableController from "../controllers/masterTaskTableController.js";

const router = express.Router();

router.get("/", masterTaskTableController.getMasterTasks);
router.post("/", masterTaskTableController.createMasterTask);
router.patch("/:id", masterTaskTableController.updateMasterTask);
router.delete("/:id", masterTaskTableController.deleteMasterTask);

export default router;
