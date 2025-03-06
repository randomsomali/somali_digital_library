import express from "express";
import {
  getAllAdmins,
  getAdminDetails,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../controllers/adminManagementController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected with admin authentication
router.use(authenticate, authorizeAdmin("admin")); // Only super admins can manage other admins

// Get all admins with filters and pagination
router.get("/", getAllAdmins);

// Get single admin details
router.get("/:id", getAdminDetails);

// Create new admin
router.post("/", createAdmin);

// Update admin
router.put("/:id", updateAdmin);

// Delete admin
router.delete("/:id", deleteAdmin);

export default router;
