import express from "express";
import {
  loginUser,
  loginInstitution,
  loginAdmin,
  logout,
  getCurrentUser,
  getCurrentInstitution,
  getCurrentAdmin,
  updateAdminProfile,
} from "../controllers/authController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login/user", loginUser);
router.post("/login/institution", loginInstitution);
router.post("/login/admin", loginAdmin);
router.post("/logout", logout);

// Protected routes for getting current user info
router.get("/me/user", authenticate, authorize("user"), getCurrentUser);
router.get(
  "/me/institution",
  authenticate,
  authorize("institution"),
  getCurrentInstitution
);
router.get("/me/admin", authenticate, authorize("admin"), getCurrentAdmin);

// Admin profile update
router.put(
  "/admin/profile",
  authenticate,
  authorize("admin"),
  updateAdminProfile
);

export default router;
