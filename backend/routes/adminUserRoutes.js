import express from "express";
import {
  getAllUsers,
  getUserDetails,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/adminUserController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected with admin authentication
router.use(authenticate, authorizeAdmin());

// Get all users with filters and pagination
router.get("/", getAllUsers);

// Get single user details
router.get("/:id", getUserDetails);

// Create new user
router.post("/", createUser);

// Update user
router.put("/:id", updateUser);

// Delete user
router.delete("/:id", deleteUser);

export default router;
