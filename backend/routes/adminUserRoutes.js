import express from "express";
import {
  getAllUsers,
  getUserDetails,
  createUser,
  updateUser,
  deleteUser,
  getInstitutionStudents,
} from "../controllers/adminUserController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";
import { validateUser } from "../middleware/validationMiddleware.js";

const router = express.Router();

// All routes are protected with admin authentication
router.use(authenticate, authorizeAdmin());

// Get all users with filters and pagination
router.get("/", getAllUsers);

// Get single user details
router.get("/:id", getUserDetails);

// Create new user with validation
router.post("/", validateUser(false), createUser);

// Update user with validation
router.put("/:id", validateUser(true), updateUser);

// Delete user
router.delete("/:id", deleteUser);

// Add this route
router.get("/institution/:institutionId/students", getInstitutionStudents);

export default router;
