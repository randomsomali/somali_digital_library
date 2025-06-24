import express from "express";
import {
  getAllUserSubscriptions,
  getUserSubscriptionById,
  createUserSubscription,
  updateUserSubscription,
  deleteUserSubscription,
  getDropdownData,
  checkActiveSubscription,
  checkUserActiveSubscription,
  checkInstitutionActiveSubscription,
} from "../controllers/adminUserSubscriptionController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
// Check if a user has an active subscription
router.get("/user/:userId/active", checkUserActiveSubscription);

// Check if an institution has an active subscription
router.get(
  "/institution/:institutionId/active",
  checkInstitutionActiveSubscription
);
// Apply auth middleware to all routes
router.use(authenticate, authorizeAdmin());

// Get all user subscriptions with pagination and filters
router.get("/", getAllUserSubscriptions);

// Get dropdown data for forms
router.get("/dropdown-data", getDropdownData);

// Check if user/institution has active subscription
router.get("/check-active", checkActiveSubscription);

// Get user subscription by ID
router.get("/:id", getUserSubscriptionById);

// Create new user subscription
router.post("/", createUserSubscription);

// Update user subscription
router.put("/:id", updateUserSubscription);

// Delete user subscription
router.delete("/:id", deleteUserSubscription);

export default router;
