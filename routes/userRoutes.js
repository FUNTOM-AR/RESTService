import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.get("/", userController.getUsers);             // Get all users
 
router.post("/", userController.createUser);         // Create a new user
router.patch("/:id", userController.updateUser);    // Update user info
router.delete("/:id", userController.deleteUser);   // Delete a user

export default router;
